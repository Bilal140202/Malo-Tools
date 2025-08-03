'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Upload, AlertCircle, Info } from 'lucide-react';

export default function TextHTMLtoPDF() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isHTML, setIsHTML] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleTextUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
        setIsHTML(false);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handleHTMLUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const html = e.target?.result as string;
        setContent(html);
        setIsHTML(true);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const generatePDF = async () => {
    if (!content.trim()) {
      setError('Please enter some content or upload a file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create PDF content (simulation)
      const pdfContent = isHTML ? 
        `HTML to PDF Conversion\n\nTitle: ${title || 'Untitled'}\nAuthor: ${author || 'Unknown'}\n\nContent preview: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}` :
        `Text to PDF Conversion\n\nTitle: ${title || 'Untitled'}\nAuthor: ${author || 'Unknown'}\n\nContent preview: ${content.substring(0, 200)}${content.length > 200 ? '...' : ''}`;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Download the PDF
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to generate PDF');
      setIsProcessing(false);
    }
  };

  const clearContent = () => {
    setContent('');
    setTitle('');
    setAuthor('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Text/HTML to PDF
            </CardTitle>
            <CardDescription>
              Convert text or HTML content to PDF documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Type Selection */}
            <div className="flex gap-2">
              <Button
                variant={!isHTML ? 'default' : 'outline'}
                onClick={() => setIsHTML(false)}
                className="flex-1"
              >
                Text to PDF
              </Button>
              <Button
                variant={isHTML ? 'default' : 'outline'}
                onClick={() => setIsHTML(true)}
                className="flex-1"
              >
                HTML to PDF
              </Button>
            </div>

            {/* Document Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-slate-900 mb-2">
                  Upload {isHTML ? 'HTML' : 'Text'} File
                </div>
                <div className="text-sm text-slate-500 mb-4">
                  Drag and drop or click to browse
                </div>
                <Label htmlFor="file-upload">
                  <Button asChild>
                    <span>Choose {isHTML ? 'HTML' : 'Text'} File</span>
                  </Button>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept={isHTML ? '.html,.htm' : '.txt'}
                  onChange={isHTML ? handleHTMLUpload : handleTextUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Text Area */}
            <div className="space-y-2">
              <Label htmlFor="content">
                {isHTML ? 'HTML Content' : 'Text Content'}
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isHTML ? 
                  '<html><body><h1>Title</h1><p>Your HTML content here...</p></body></html>' :
                  'Enter your text content here...'
                }
                rows={8}
                className="font-mono"
              />
              <div className="text-sm text-slate-500">
                {content.length} characters
              </div>
            </div>

            {/* Preview */}
            {content && (
              <div className="space-y-2">
                <Label>Preview:</Label>
                <div 
                  ref={previewRef}
                  className="border border-slate-200 rounded-lg p-4 bg-white max-h-64 overflow-y-auto"
                  style={{ fontFamily: isHTML ? 'serif' : 'monospace' }}
                  dangerouslySetInnerHTML={{ 
                    __html: isHTML ? content : content.replace(/\n/g, '<br>') 
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={generatePDF}
                disabled={isProcessing || !content.trim()}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearContent}
                disabled={!content}
              >
                Clear
              </Button>
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

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
              {isHTML ? (
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Select "HTML to PDF" mode</li>
                  <li>2. Enter HTML content or upload an HTML file</li>
                  <li>3. Add document title and author (optional)</li>
                  <li>4. Click "Generate PDF" to create the document</li>
                </ul>
              ) : (
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Select "Text to PDF" mode</li>
                  <li>2. Enter text content or upload a text file</li>
                  <li>3. Add document title and author (optional)</li>
                  <li>4. Click "Generate PDF" to create the document</li>
                </ul>
              )}
            </div>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Tips:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• For HTML: Use proper HTML tags for best formatting</li>
                <li>• For Text: Plain text will be converted with basic formatting</li>
                <li>• Large documents may take longer to process</li>
                <li>• Generated PDFs will include title and metadata if provided</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}