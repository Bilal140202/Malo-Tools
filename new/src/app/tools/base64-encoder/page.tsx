'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Download, RotateCcw, Copy } from 'lucide-react';
import Link from 'next/link';

export default function Base64Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const encodeBase64 = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
    } catch (err) {
      setError('Encoding failed. Please check your input.');
      setOutput('');
    }
  };

  const decodeBase64 = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
    } catch (err) {
      setError('Invalid Base64 input. Please check your input.');
      setOutput('');
    }
  };

  const processInput = () => {
    if (mode === 'encode') {
      encodeBase64();
    } else {
      decodeBase64();
    }
  };

  const swapMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setOutput(input);
    setError('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const downloadOutput = () => {
    if (!output.trim()) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'base64_encoded.txt' : 'decoded_output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                <h1 className="text-xl font-bold text-slate-900">Base64 Encoder/Decoder</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">
                    converter
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
            <CardTitle className="text-2xl text-center">Base64 Encoder/Decoder</CardTitle>
            <CardDescription className="text-base text-center">
              Encode and decode Base64 strings with ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mode Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-100 rounded-lg p-1 flex">
                <Button
                  variant={mode === 'encode' ? 'default' : 'ghost'}
                  onClick={() => setMode('encode')}
                  className="flex-1"
                >
                  Encode
                </Button>
                <Button
                  variant={mode === 'decode' ? 'default' : 'ghost'}
                  onClick={() => setMode('decode')}
                  className="flex-1"
                >
                  Decode
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">
                    {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
                  </label>
                  <div className="flex space-x-2">
                    <label className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md cursor-pointer hover:bg-slate-200">
                      <Upload className="h-4 w-4 inline mr-1" />
                      Upload File
                      <input
                        type="file"
                        accept="text/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                  className="min-h-[200px] resize-none font-mono text-sm"
                />
                <div className="text-sm text-slate-500">
                  {input.length} characters
                </div>
              </div>

              {/* Output */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                </label>
                <Textarea
                  value={output}
                  readOnly
                  placeholder={mode === 'encode' ? 'Base64 encoded string will appear here...' : 'Decoded text will appear here...'}
                  className="min-h-[200px] resize-none font-mono text-sm bg-slate-50"
                />
                <div className="text-sm text-slate-500">
                  {output.length} characters
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button
                onClick={processInput}
                disabled={!input.trim()}
                className="px-8"
              >
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              
              <Button
                onClick={swapMode}
                variant="outline"
                disabled={!input.trim() && !output.trim()}
                className="px-8"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Swap Mode
              </Button>
              
              <Button
                onClick={() => copyToClipboard(output)}
                variant="outline"
                disabled={!output.trim()}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Output
              </Button>
              
              <Button
                onClick={downloadOutput}
                variant="outline"
                disabled={!output.trim()}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              
              <Button
                onClick={clearAll}
                variant="outline"
              >
                Clear All
              </Button>
            </div>

            {/* Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900">About Base64</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-800">
                  <p className="mb-2">
                    Base64 is an encoding scheme that represents binary data in an ASCII string format.
                  </p>
                  <p>
                    It's commonly used for encoding data in email, HTML, and to embed binary data in text documents.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-900">Common Uses</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-green-800">
                  <ul className="space-y-1">
                    <li>• Embedding images in HTML/CSS</li>
                    <li>• Encoding data in URLs</li>
                    <li>• Email attachments</li>
                    <li>• Basic authentication</li>
                    <li>• Data obfuscation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}