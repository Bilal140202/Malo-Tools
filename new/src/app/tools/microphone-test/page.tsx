'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, CheckCircle, Activity } from 'lucide-react';

export default function MicrophoneTest() {
  const [hasMicrophone, setHasMicrophone] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceList.filter(device => device.kind === 'audioinput');
        setDevices(audioDevices);
        if (audioDevices.length > 0) {
          setSelectedDevice(audioDevices[0].deviceId);
          setHasMicrophone(true);
        }
      } catch (err) {
        setError('Failed to access microphone devices');
      }
    };

    getDevices();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (!hasMicrophone) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { 
          deviceId: selectedDevice,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Setup audio analysis
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Setup media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start audio level monitoring
      updateAudioLevel();

    } catch (err) {
      setError('Failed to access microphone. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      setAudioLevel(0);
    }
  };

  const playRecording = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;
    setAudioLevel(average);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-6 w-6" />
              Microphone Test
            </CardTitle>
            <CardDescription>
              Test your microphone functionality and audio quality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Microphone Status */}
            <div className="flex items-center gap-4">
              <Badge variant={hasMicrophone ? "default" : "destructive"}>
                {hasMicrophone ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {hasMicrophone ? "Microphone Detected" : "No Microphone Detected"}
              </Badge>
              <Badge variant={isRecording ? "default" : "secondary"}>
                {isRecording ? (
                  <Activity className="h-4 w-4 mr-1" />
                ) : (
                  <Mic className="h-4 w-4 mr-1" />
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

            {/* Device Selection */}
            {devices.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Microphone:</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Audio Level Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Audio Level:</label>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{audioLevel.toFixed(0)}</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-100"
                  style={{ width: `${Math.min((audioLevel / 100) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Quiet</span>
                <span>Normal</span>
                <span>Loud</span>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={startRecording}
                  disabled={!hasMicrophone || isRecording}
                  className="flex-1"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  disabled={!isRecording}
                >
                  <MicOff className="h-4 w-4 mr-2" />
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

            {/* Playback Controls */}
            {audioChunksRef.current.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Recording Playback</h3>
                
                <audio ref={audioRef} className="w-full" />
                
                <div className="flex gap-3">
                  <Button
                    onClick={playRecording}
                    disabled={isPlaying}
                    className="flex-1"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Play Recording
                  </Button>
                  <Button
                    onClick={stopPlayback}
                    variant="outline"
                    disabled={!isPlaying}
                  >
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop Playback
                  </Button>
                </div>

                {/* Recording Info */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> {formatTime(recordingTime)}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 1024 / 1024 > 1 ? 
                        (audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 1024 / 1024).toFixed(2) + ' MB' : 
                        (audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0) / 1024).toFixed(0) + ' KB'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Microphone Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-slate-900">Microphone Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Total Microphones:</span> {devices.length}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {hasMicrophone ? 'Available' : 'Not Available'}
                </div>
                {devices.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Available Microphones:</span>
                    <ul className="mt-1 space-y-1">
                      {devices.map((device, index) => (
                        <li key={device.deviceId} className="text-xs">
                          • {device.label || `Microphone ${index + 1}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Click "Start Recording" to begin testing your microphone</li>
                <li>2. Allow microphone permissions when prompted</li>
                <li>3. Speak normally to test audio levels and quality</li>
                <li>4. Click "Stop Recording" when finished</li>
                <li>5. Use "Play Recording" to hear your test audio</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}