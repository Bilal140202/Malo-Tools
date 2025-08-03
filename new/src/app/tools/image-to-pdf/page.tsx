'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Download, FileImage, FileText } from 'lucide-react';
import Link from 'next/link';

interface ImageFile {
  file: File;
  url: string;
  name: string;
  size: number;
}

export default function ImageToPdf() {
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfSize, setPdfSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('Please select image files only');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageFile: ImageFile = {
          file,
          url: e.target?.result as string,
          name: file.name,
          size: file.size
        };
        
        setSelectedImages(prev => [...prev, imageFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setIsProcessing(true);
    setPdfUrl('');
    setPdfSize(0);

    try {
      // Create a new PDF document
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      let pdfWidth = pdf.internal.pageSize.getWidth();
      let pdfHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 0;

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        
        // Create image element to get natural dimensions
        const img = new Image();
        img.src = image.url;
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Calculate scaling to fit page
            const imgAspectRatio = img.width / img.height;
            const pdfAspectRatio = pdfWidth / pdfHeight;
            
            let scaledWidth, scaledHeight;
            
            if (imgAspectRatio > pdfAspectRatio) {
              // Image is wider than page
              scaledWidth = pdfWidth - 20; // 10px margin on each side
              scaledHeight = (scaledWidth / img.width) * img.height;
            } else {
              // Image is taller than page
              scaledHeight = pdfHeight - 20; // 10px margin on top/bottom
              scaledWidth = (scaledHeight / img.height) * img.width;
            }
            
            const xPosition = (pdfWidth - scaledWidth) / 2;
            
            // Add image to PDF
            pdf.addImage(image.url, 'JPEG', xPosition, yPosition, scaledWidth, scaledHeight);
            
            // Add filename if it fits
            if (yPosition + scaledHeight < pdfHeight - 20) {
              pdf.setFontSize(8);
              pdf.text(image.name, 10, pdfHeight - 10);
            }
            
            // Add new page if not the last image
            if (i < selectedImages.length - 1) {
              pdf.addPage();
              yPosition = 0;
            } else {
              yPosition += scaledHeight;
            }
            
            resolve();
          };
        });
      }

      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      const pdfUrlObj = URL.createObjectURL(pdfBlob);
      
      setPdfUrl(pdfUrlObj);
      setPdfSize(pdfBlob.size);
      
      setIsProcessing(false);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsProcessing(false);
    }
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'images-to-pdf.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetConverter = () => {
    setSelectedImages([]);
    setPdfUrl('');
    setPdfSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addMoreImages = () => {
    fileInputRef.current?.click();
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
                <h1 className="text-xl font-bold text-slate-900">Image to PDF</h1>
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
              <FileText className="h-6 w-6" />
              Image to PDF Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert multiple images into a single PDF document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload and Settings */}
              <div className="space-y-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Images</CardTitle>
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
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Image List */}
                {selectedImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Selected Images ({selectedImages.length})</span>
                        <Button onClick={addMoreImages} variant="outline" size="sm">
                          Add More
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-12 h-12 object-cover rounded border"
                              />
                              <div>
                                <div className="font-medium text-sm text-slate-900 truncate max-w-[150px]">
                                  {image.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {formatFileSize(image.size)}
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeImage(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button
                        onClick={generatePDF}
                        disabled={selectedImages.length === 0 || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? 'Generating PDF...' : 'Generate PDF'}
                      </Button>
                      <Button
                        onClick={resetConverter}
                        variant="outline"
                        className="w-full"
                        disabled={selectedImages.length === 0}
                      >
                        Reset All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview and Results */}
              <div className="space-y-6">
                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Image Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedImages.slice(0, 6).map((image, index) => (
                          <div key={index} className="text-center">
                            <img
                              src={image.url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                            <div className="text-xs text-slate-600 mt-1 truncate">
                              {image.name}
                            </div>
                          </div>
                        ))}
                        {selectedImages.length > 6 && (
                          <div className="text-center col-span-2 p-4 bg-slate-50 rounded-lg">
                            <div className="text-sm text-slate-600">
                              +{selectedImages.length - 6} more images
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* PDF Result */}
                {pdfUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Generated PDF</span>
                        <Badge className="bg-green-100 text-green-800">
                          Ready
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="w-32 h-40 mx-auto bg-gradient-to-br from-red-50 to-red-100 border-2 border-dashed border-red-300 rounded-lg flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-red-400" />
                        </div>
                        <div className="font-medium text-slate-900">
                          PDF Document
                        </div>
                        <div className="text-sm text-slate-600">
                          {selectedImages.length} images
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatFileSize(pdfSize)}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={downloadPDF}
                          className="w-full"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button
                          onClick={resetConverter}
                          variant="outline"
                          className="w-full"
                        >
                          Create New PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Instructions */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">How to Use</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-blue-800 space-y-2">
                    <div>1. Select one or more image files</div>
                    <div>2. Arrange them in desired order (first selected = first page)</div>
                    <div>3. Click "Generate PDF" to create your document</div>
                    <div>4. Download the PDF when ready</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {selectedImages.length === 0 && !pdfUrl && (
              <div className="text-center py-12 text-slate-400">
                <FileImage className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">No images selected</p>
                <p className="text-sm">Upload images to create a PDF document</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}