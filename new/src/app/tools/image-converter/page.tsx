'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Download, Image as ImageIcon, FileImage } from 'lucide-react';
import Link from 'next/link';

interface ImageInfo {
  name: string;
  size: number;
  type: string;
  dimensions: { width: number; height: number };
  format: string;
}

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState('jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<{ format: string; url: string; size: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Get image info
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          dimensions: { width: img.width, height: img.height },
          format: file.type.split('/')[1].toUpperCase()
        });
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsConverting(true);
    setConvertedImages([]);

    try {
      // Create canvas and convert image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          alert('Failed to create canvas context');
          setIsConverting(false);
          return;
        }

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Convert to different format
        let mimeType = 'image/jpeg';
        if (targetFormat === 'png') mimeType = 'image/png';
        if (targetFormat === 'webp') mimeType = 'image/webp';

        // Get converted image as blob
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedImages([{
              format: targetFormat.toUpperCase(),
              url,
              size: blob.size
            }]);
          }
          setIsConverting(false);
        }, mimeType, 0.9);
      };
      img.src = previewUrl;
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Failed to convert image');
      setIsConverting(false);
    }
  };

  const downloadImage = (url: string, format: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-image.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setImageInfo(null);
    setPreviewUrl('');
    setConvertedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Image Converter</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-pink-100 text-pink-800">
                    media
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Image Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert images between different formats (JPEG, PNG, WebP)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload and Settings */}
              <div className="space-y-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500">
                          Supports JPG, PNG, WebP, GIF
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Image Information */}
                {imageInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Image Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Name:</span>
                          <p className="font-medium">{imageInfo.name}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Size:</span>
                          <p className="font-medium">{formatFileSize(imageInfo.size)}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Format:</span>
                          <p className="font-medium">{imageInfo.format}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Dimensions:</span>
                          <p className="font-medium">{imageInfo.dimensions.width} × {imageInfo.dimensions.height}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Conversion Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversion Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['jpeg', 'png', 'webp'].map((format) => (
                          <Button
                            key={format}
                            variant={targetFormat === format ? "default" : "outline"}
                            onClick={() => setTargetFormat(format)}
                            className="flex-1"
                          >
                            {format.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={convertImage}
                        disabled={!selectedFile || isConverting}
                        className="w-full"
                      >
                        {isConverting ? 'Converting...' : 'Convert Image'}
                      </Button>
                      <Button
                        onClick={resetConverter}
                        variant="outline"
                        className="w-full"
                      >
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview and Results */}
              <div className="space-y-6">
                {/* Original Image Preview */}
                {previewUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileImage className="h-5 w-5" />
                        Original Image
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <img
                          src={previewUrl}
                          alt="Original"
                          className="max-w-full h-auto rounded-lg border"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Converted Images */}
                {convertedImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Converted Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {convertedImages.map((image, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-slate-900">
                                {image.format} Format
                              </div>
                              <div className="text-sm text-slate-600">
                                {formatFileSize(image.size)}
                              </div>
                            </div>
                            <Button
                              onClick={() => downloadImage(image.url, image.format.toLowerCase())}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                          <div className="text-center">
                            <img
                              src={image.url}
                              alt={`Converted ${image.format}`}
                              className="max-w-full h-auto rounded border"
                              style={{ maxHeight: '200px' }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Format Information */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">Format Information</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-blue-800 space-y-3">
                    <div>
                      <strong>JPEG:</strong> Lossy compression, smaller file sizes, good for photos
                    </div>
                    <div>
                      <strong>PNG:</strong> Lossless compression, supports transparency, larger file sizes
                    </div>
                    <div>
                      <strong>WebP:</strong> Modern format, excellent compression, supports transparency
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {!selectedFile && (
              <div className="text-center py-12 text-slate-400">
                <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">No image selected</p>
                <p className="text-sm">Upload an image to start converting</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}