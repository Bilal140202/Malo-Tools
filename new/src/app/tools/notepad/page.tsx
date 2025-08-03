'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Download, Upload, Save, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function Notepad() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved content from localStorage on mount
  useEffect(() => {
    const savedContent = localStorage.getItem('notepad-content');
    const savedFileName = localStorage.getItem('notepad-filename');
    const savedLastSaved = localStorage.getItem('notepad-last-saved');
    
    if (savedContent) {
      setContent(savedContent);
      updateWordCount(savedContent);
    }
    if (savedFileName) {
      setFileName(savedFileName);
    }
    if (savedLastSaved) {
      setLastSaved(savedLastSaved);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const timer = setInterval(() => {
      saveToLocalStorage();
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(timer);
  }, [content, fileName, autoSave]);

  // Update word count when content changes
  const updateWordCount = (text: string) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const lines = text ? text.split('\n').length : 0;
    
    setWordCount(words);
    setCharCount(chars);
    setLineCount(lines);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateWordCount(newContent);
    
    if (autoSave) {
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('notepad-content', content);
    localStorage.setItem('notepad-filename', fileName);
    localStorage.setItem('notepad-last-saved', new Date().toLocaleString());
    setLastSaved(new Date().toLocaleString());
  };

  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setContent(content);
        setFileName(file.name.replace(/\.[^/.]+$/, '') || 'uploaded');
        updateWordCount(content);
        saveToLocalStorage();
      };
      reader.readAsText(file);
    }
  };

  const clearContent = () => {
    if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      setContent('');
      setFileName('untitled.txt');
      setWordCount(0);
      setCharCount(0);
      setLineCount(0);
      localStorage.removeItem('notepad-content');
      localStorage.removeItem('notepad-filename');
      setLastSaved(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Content copied to clipboard!');
  };

  const newFile = () => {
    if (content && !confirm('Are you sure you want to start a new file? Unsaved changes will be lost.')) {
      return;
    }
    setContent('');
    setFileName('untitled.txt');
    setWordCount(0);
    setCharCount(0);
    setLineCount(0);
    localStorage.removeItem('notepad-content');
    localStorage.removeItem('notepad-filename');
    setLastSaved(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                <h1 className="text-xl font-bold text-slate-900">Notepad</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    productivity
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
              Online Notepad
            </CardTitle>
            <CardDescription className="text-base text-center">
              Simple text editor with auto-save and cloud storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* File Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-48"
                  placeholder="File name"
                />
                <Button onClick={newFile} variant="outline" size="sm">
                  New
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.log"
                  onChange={uploadFile}
                  className="hidden"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Button onClick={downloadFile} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button onClick={clearContent} variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  variant={isPreviewMode ? "default" : "outline"}
                  size="sm"
                >
                  {isPreviewMode ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                  {isPreviewMode ? 'Edit' : 'Preview'}
                </Button>
              </div>
            </div>

            {/* Auto-save Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Auto-save</span>
                </label>
                {lastSaved && (
                  <span className="text-xs text-green-600">
                    Last saved: {lastSaved}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
                <span>{lineCount} lines</span>
                <span>{formatFileSize(content.length * 2)} size</span>
              </div>
            </div>

            {/* Text Editor */}
            <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
              {isPreviewMode ? (
                <div className="min-h-[400px] max-h-96 overflow-y-auto p-6 bg-white">
                  <pre className="whitespace-pre-wrap font-sans text-slate-900">
                    {content || 'No content to preview...'}
                  </pre>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Start typing here..."
                  className="w-full min-h-[400px] max-h-96 p-6 border-0 resize-none focus:outline-none font-mono text-sm"
                  style={{ minHeight: '400px' }}
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" size="sm" className="h-12">
                <FileText className="mr-2 h-4 w-4" />
                Format Text
              </Button>
              <Button variant="outline" size="sm" className="h-12">
                <Save className="mr-2 h-4 w-4" />
                Save Now
              </Button>
              <Button variant="outline" size="sm" className="h-12">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm" className="h-12">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Save className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-blue-900">Auto-Save</h3>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your work is automatically saved every 30 seconds to prevent data loss.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Download className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium text-green-900">Export Options</h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Download your text as a file or copy it to the clipboard instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-purple-900">Preview Mode</h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    Switch between edit and preview modes to see how your text will look.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}