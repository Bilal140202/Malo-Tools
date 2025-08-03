'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Download, AlertCircle, CheckCircle, Activity } from 'lucide-react';

export default function ScreenRecorder() {
  const [hasDisplay, setHasDisplay] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkDisplayAvailability();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const checkDisplayAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasDisplay = devices.some(device => device.kind === 'videoinput');
      setHasDisplay(hasDisplay);
    } catch (err) {
      setError('Failed to check display availability');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: true
      });

      setMediaStream(stream);
      videoChunksRef.current = [];

      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      setError('Failed to start screen recording. User cancelled or permission denied.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const downloadRecording = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-6 w-6" />
              Screen Recorder
            </CardTitle>
            <CardDescription>
              Record your screen with audio and download the recording
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Display */}
            <div className="flex items-center gap-4">
              <Badge variant={hasDisplay ? "default" : "destructive"}>
                {hasDisplay ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {hasDisplay ? "Screen Recording Available" : "Screen Recording Not Supported"}
              </Badge>
              <Badge variant={isRecording ? "default" : "secondary"}>
                {isRecording ? (
                  <Activity className="h-4 w-4 mr-1" />
                ) : (
                  <Video className="h-4 w-4 mr-1" />
                )}
                {isRecording ? "Recording" : "Stopped"}
              </Badge>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              </div>
            )}

            {/* Recording Controls */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={startRecording}
                  disabled={!hasDisplay || isRecording}
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  disabled={!isRecording}
                >
                  <VideoOff className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>

              {/* Recording Timer */}
              {isRecording && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-lg font-mono text-blue-800">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-sm text-blue-600">Recording in progress...</div>
                </div>
              )}
            </div>

            {/* Preview */}
            {mediaStream && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Live Preview:</label>
                <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    srcObject={mediaStream}
                  />
                </div>
              </div>
            )}

            {/* Recording Result */}
            {videoUrl && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Recording Complete</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preview:</label>
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      controls
                      className="w-full h-full object-contain"
                      src={videoUrl}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={downloadRecording}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Recording
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setVideoUrl(null)}
                  >
                    Clear Recording
                  </Button>
                </div>

                {/* Recording Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> {formatTime(recordingTime)}
                    </div>
                    <div>
                      <span className="font-medium">Format:</span> WebM
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">File Size:</span> {
                        videoChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 1024 / 1024 > 1 ? 
                        (videoChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 1024 / 1024).toFixed(2) + ' MB' : 
                        (videoChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 1024).toFixed(0) + ' KB'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Start Recording" to begin screen recording</li>
                <li>2. Your browser will ask you to select which screen/tab to record</li>
                <li>3. Choose the content you want to record and click "Share"</li>
                <li>4. Recording will start automatically - a red dot will appear in the tab</li>
                <li>5. Click "Stop Recording" when finished</li>
                <li>6. Preview and download your recording</li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Important Notes:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Screen recording requires user permission and may not work in all browsers</li>
                <li>• Some websites may block screen recording for security reasons</li>
                <li>• Audio recording is optional and depends on browser support</li>
                <li>• Large recordings may take time to process and download</li>
                <li>• Recordings are saved in WebM format for maximum compatibility</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}