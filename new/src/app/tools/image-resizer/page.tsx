'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, X, Image, AlertCircle } from 'lucide-react';

export default function ImageResizer() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [quality, setQuality] = useState<number>(90);
  const [format, setFormat] = useState<string>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setImage(file);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setError(null);
  };

  const resizeImage = async () => {
    if (!image || !previewUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob and download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `resized-${width}x${height}.${format}`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
            setIsProcessing(false);
          },
          `image/${format}`,
          quality / 100
        );
      };
      img.src = previewUrl;
    } catch (err) {
      setError('Failed to resize image');
      setIsProcessing(false);
    }
  };

  const maintainAspectRatio = () => {
    if (!image) return;
    
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      if (width !== height) {
        setHeight(Math.round(width / aspectRatio));
      }
    };
    img.src = previewUrl || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-6 w-6" alt="Image icon" />
              Image Resizer
            </CardTitle>
            <CardDescription>
              Resize images with custom dimensions and quality settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Section */}
            {!image ? (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-slate-900 mb-2">
                  Upload an Image
                </div>
                <div className="text-sm text-slate-500 mb-4">
                  Drag and drop or click to browse
                </div>
                <Label htmlFor="image-upload">
                  <Button asChild>
                    <span>Choose Image</span>
                  </Button>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Original</Label>
                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={previewUrl || ''}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {image.name} • {(image.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Preview ({width}x{height})</Label>
                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                      <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-full"
                        style={{ width: `${width}px`, height: `${height}px` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="outline"
                  onClick={removeImage}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            )}

            {/* Settings */}
            {image && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Resize Settings</h3>
                
                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min="1"
                      max="5000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min="1"
                      max="5000"
                    />
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={maintainAspectRatio}
                  >
                    Maintain Aspect Ratio
                  </Button>
                  <Badge variant="secondary">
                    Original: {width}x{height}
                  </Badge>
                </div>

                {/* Format and Quality */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="format">Output Format</Label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="quality">Quality ({quality}%)</Label>
                    <Input
                      id="quality"
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Resize Button */}
                <Button
                  onClick={resizeImage}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Resize & Download
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Upload an image file (JPG, PNG, WebP, etc.)</li>
                <li>2. Set your desired width and height in pixels</li>
                <li>3. Choose output format and quality</li>
                <li>4. Click "Resize & Download" to save the resized image</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}