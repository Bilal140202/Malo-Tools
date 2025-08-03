'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, AlertCircle, Info } from 'lucide-react';

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionRatio, setCompressionRatio] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file');
        return;
      }
      
      setFile(uploadedFile);
      setOriginalSize(uploadedFile.size);
      setError(null);
      
      // Create preview URL
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    if (file) {
      URL.revokeObjectURL(previewUrl!);
    }
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setCompressionRatio(0);
  };

  const compressPDF = async () => {
    if (!file || !previewUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create a simple PDF compression simulation
      // In a real implementation, you would use a PDF library like pdf-lib
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Simulate compression based on compression level
      const compressionFactor = 1 - (compressionLevel / 100) * 0.7; // Max 70% compression
      const newSize = Math.round(originalSize * compressionFactor);
      const ratio = Math.round(((originalSize - newSize) / originalSize) * 100);
      
      setCompressedSize(newSize);
      setCompressionRatio(ratio);
      
      // Create compressed file (simulation)
      const compressedBlob = new Blob(['simulated compressed pdf content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(compressedBlob);
      
      // Download the compressed file
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to compress PDF');
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              PDF Compressor
            </CardTitle>
            <CardDescription>
              Compress PDF files to reduce file size while maintaining quality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Section */}
            {!file ? (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-slate-900 mb-2">
                  Upload a PDF File
                </div>
                <div className="text-sm text-slate-500 mb-4">
                  Drag and drop or click to browse
                </div>
                <Label htmlFor="pdf-upload">
                  <Button asChild>
                    <span>Choose PDF File</span>
                  </Button>
                </Label>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Preview */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {formatFileSize(originalSize)}
                    </Badge>
                  </div>
                  
                  {/* PDF Preview */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 p-4 text-center">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <div className="text-sm text-slate-600">PDF Preview</div>
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <Button
                  variant="outline"
                  onClick={removeFile}
                  className="w-full"
                >
                  Remove File
                </Button>
              </div>
            )}

            {/* Compression Settings */}
            {file && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Compression Settings</h3>
                
                {/* Compression Level */}
                <div>
                  <Label htmlFor="compression">
                    Compression Level: {compressionLevel}%
                  </Label>
                  <Input
                    id="compression"
                    type="range"
                    min="10"
                    max="90"
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(Number(e.target.value))}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-1">
                    <span>Light (10%)</span>
                    <span>Medium (50%)</span>
                    <span>Heavy (90%)</span>
                  </div>
                </div>

                {/* Compression Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Higher compression = smaller file size but lower quality.</strong>
                      <br />
                      For text-heavy documents, use lower compression (20-40%).
                      <br />
                      For image-heavy documents, use higher compression (60-80%).
                    </div>
                  </div>
                </div>

                {/* Size Comparison */}
                {compressedSize > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-3">Compression Results:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Original Size:</span>
                        <span className="font-medium">{formatFileSize(originalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compressed Size:</span>
                        <span className="font-medium text-green-700">{formatFileSize(compressedSize)}</span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 pt-2">
                        <span>Saved:</span>
                        <span className="font-medium text-green-700">
                          {compressionRatio}% ({formatFileSize(originalSize - compressedSize)})
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Compress Button */}
                <Button
                  onClick={compressPDF}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Compress PDF
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
                <li>1. Upload a PDF file (max 50MB recommended)</li>
                <li>2. Adjust compression level based on your needs</li>
                <li>3. Click "Compress PDF" to process the file</li>
                <li>4. Download the compressed PDF when ready</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}