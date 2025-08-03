'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, AlertCircle, CheckCircle } from 'lucide-react';

export default function CameraTester() {
  const [hasCamera, setHasCamera] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
          setHasCamera(true);
        }
      } catch (err) {
        setError('Failed to access camera devices');
      }
    };

    getDevices();
  }, []);

  const startCamera = async () => {
    if (!hasCamera) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && isStreaming) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'camera-test-snapshot.png';
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Camera Tester
            </CardTitle>
            <CardDescription>
              Test your camera functionality and take snapshots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Camera Status */}
            <div className="flex items-center gap-4">
              <Badge variant={hasCamera ? "default" : "destructive"}>
                {hasCamera ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-1" />
                )}
                {hasCamera ? "Camera Detected" : "No Camera Detected"}
              </Badge>
              <Badge variant={isStreaming ? "default" : "secondary"}>
                {isStreaming ? (
                  <Video className="h-4 w-4 mr-1" />
                ) : (
                  <Camera className="h-4 w-4 mr-1" />
                )}
                {isStreaming ? "Streaming" : "Stopped"}
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
                <label className="text-sm font-medium">Select Camera:</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Video Preview */}
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-dashed border-slate-300">
                {isStreaming ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <Camera className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <Button
                  onClick={startCamera}
                  disabled={!hasCamera || isStreaming}
                  className="flex-1"
                >
                  Start Camera
                </Button>
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  disabled={!isStreaming}
                >
                  Stop Camera
                </Button>
                <Button
                  onClick={takeSnapshot}
                  disabled={!isStreaming}
                  variant="secondary"
                >
                  Take Snapshot
                </Button>
              </div>
            </div>

            {/* Camera Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-slate-900">Camera Information:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Total Cameras:</span> {devices.length}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {hasCamera ? 'Available' : 'Not Available'}
                </div>
                {devices.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Available Cameras:</span>
                    <ul className="mt-1 space-y-1">
                      {devices.map((device, index) => (
                        <li key={device.deviceId} className="text-xs">
                          • {device.label || `Camera ${index + 1}`}
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
                <li>1. Click "Start Camera" to begin testing</li>
                <li>2. Allow camera permissions when prompted</li>
                <li>3. Use "Take Snapshot" to capture a test image</li>
                <li>4. Click "Stop Camera" when finished</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}