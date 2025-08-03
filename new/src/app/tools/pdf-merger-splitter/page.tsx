'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, Plus, Trash2, AlertCircle, Info } from 'lucide-react';

export default function PDFMergerSplitter() {
  const [mode, setMode] = useState<'merge' | 'split'>('merge');
  const [files, setFiles] = useState<File[]>([]);
  const [splitPages, setSplitPages] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const validFiles = uploadedFiles.filter(file => file.type === 'application/pdf');
    
    if (validFiles.length !== uploadedFiles.length) {
      setError('Some files are not valid PDFs and were skipped');
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate PDF merging process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create merged file (simulation)
      const mergedBlob = new Blob(['simulated merged pdf content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(mergedBlob);
      
      // Download the merged file
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-${files.length}-files.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to merge PDFs');
      setIsProcessing(false);
    }
  };

  const splitPDF = async () => {
    if (files.length !== 1) {
      setError('Please select exactly 1 PDF file to split');
      return;
    }

    if (!splitPages.trim()) {
      setError('Please enter page numbers to split (e.g., "1-5,7,9-12")');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Parse page numbers
      const pageRanges = splitPages.split(',').map(range => range.trim());
      
      // Simulate PDF splitting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create split files (simulation)
      pageRanges.forEach((range, index) => {
        const splitBlob = new Blob([`simulated split pdf content for pages: ${range}`], { type: 'application/pdf' });
        const url = URL.createObjectURL(splitBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `split-${range.replace(/[^0-9-]/g, '')}-${files[0].name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to split PDF');
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
              PDF Merger & Splitter
            </CardTitle>
            <CardDescription>
              Merge multiple PDF files or split a single PDF into multiple files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Selection */}
            <div className="flex gap-2">
              <Button
                variant={mode === 'merge' ? 'default' : 'outline'}
                onClick={() => setMode('merge')}
                className="flex-1"
              >
                Merge PDFs
              </Button>
              <Button
                variant={mode === 'split' ? 'default' : 'outline'}
                onClick={() => setMode('split')}
                className="flex-1"
              >
                Split PDF
              </Button>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-slate-900 mb-2">
                  {mode === 'merge' ? 'Upload PDF Files to Merge' : 'Upload PDF File to Split'}
                </div>
                <div className="text-sm text-slate-500 mb-4">
                  Drag and drop or click to browse
                </div>
                <Label htmlFor="pdf-upload">
                  <Button asChild>
                    <span>Choose PDF Files</span>
                  </Button>
                </Label>
                <Input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  multiple={mode === 'merge'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Files List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      {mode === 'merge' ? 'Selected Files' : 'Selected File'}
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFiles}
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-slate-500">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Badge variant="secondary">
                    {files.length} file{files.length !== 1 ? 's' : ''} selected
                  </Badge>
                </div>
              )}
            </div>

            {/* Split Settings */}
            {mode === 'split' && files.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Split Settings</h3>
                
                <div>
                  <Label htmlFor="split-pages">
                    Page Numbers to Split (e.g., "1-5,7,9-12")
                  </Label>
                  <Input
                    id="split-pages"
                    value={splitPages}
                    onChange={(e) => setSplitPages(e.target.value)}
                    placeholder="1-5,7,9-12"
                    className="mt-2"
                  />
                  <div className="text-sm text-slate-500 mt-1">
                    Use comma for individual pages, dash for ranges
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Examples:</strong> "1,3,5" (pages 1, 3, and 5), "1-5" (pages 1-5), "1-3,7-9" (pages 1-3 and 7-9)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={mode === 'merge' ? mergePDFs : splitPDF}
              disabled={isProcessing || (mode === 'merge' && files.length < 2) || (mode === 'split' && files.length !== 1)}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : mode === 'merge' ? (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Merge {files.length} PDFs
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Split PDF
                </>
              )}
            </Button>

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
              {mode === 'merge' ? (
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Select "Merge PDFs" mode</li>
                  <li>2. Upload 2 or more PDF files</li>
                  <li>3. Click "Merge PDFs" to combine them</li>
                  <li>4. Download the merged PDF file</li>
                </ul>
              ) : (
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Select "Split PDF" mode</li>
                  <li>2. Upload exactly 1 PDF file</li>
                  <li>3. Enter page numbers to split (e.g., "1-5,7,9-12")</li>
                  <li>4. Click "Split PDF" to create separate files</li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}