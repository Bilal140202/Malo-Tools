'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateQR = () => {
    if (text.trim()) {
      // Using a QR code API service
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
      setQrCodeUrl(url);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qrcode.png';
      link.click();
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
                <h1 className="text-xl font-bold text-slate-900">QR Code Generator</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-800">
                    generator
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tool Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">QR Code Generator</CardTitle>
                <CardDescription className="text-base">
                  Generate QR codes for URLs, text, contact information, and more. Perfect for marketing, payments, and sharing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Enter text or URL
                        </label>
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="https://example.com or any text"
                          className="w-full"
                        />
                      </div>
                      <Button onClick={generateQR} className="w-full">
                        Generate QR Code
                      </Button>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      {qrCodeUrl ? (
                        <div className="text-center">
                          <img src={qrCodeUrl} alt="Generated QR Code" className="border rounded-lg mb-4" />
                          <Button onClick={downloadQR} variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400">
                          <div className="w-48 h-48 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-4">
                            <span>QR Code will appear here</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About This Tool</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-slate-900">Category</h4>
                    <p className="text-sm text-slate-600">Generator</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Description</h4>
                    <p className="text-sm text-slate-600">Generate QR codes for URLs, text, and more</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Features</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Easy to use</li>
                      <li>• Instant results</li>
                      <li>• Free forever</li>
                      <li>• No registration required</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/tools/qr-code-generator">
                    <Button variant="ghost" className="w-full justify-start">
                      QR Code Generator
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start">
                      More Tools
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}