'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Type, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function WordCounter() {
  const [text, setText] = useState('');

  const calculateStats = () => {
    if (!text.trim()) return null;

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const averageWordsPerSentence = sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : 0;
    const averageCharsPerWord = words.length > 0 ? (charactersNoSpaces / words.length).toFixed(1) : 0;

    return {
      wordCount: words.length,
      characterCount: characters,
      characterCountNoSpaces: charactersNoSpaces,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      lineCount: lines.length,
      averageWordsPerSentence: parseFloat(averageWordsPerSentence),
      averageCharsPerWord: parseFloat(averageCharsPerWord)
    };
  };

  const stats = calculateStats();

  const clearText = () => {
    setText('');
  };

  const copyStats = () => {
    if (stats) {
      const statsText = `
Word Count: ${stats.wordCount}
Character Count: ${stats.characterCount}
Character Count (no spaces): ${stats.characterCountNoSpaces}
Sentence Count: ${stats.sentenceCount}
Paragraph Count: ${stats.paragraphCount}
Line Count: ${stats.lineCount}
Average Words per Sentence: ${stats.averageWordsPerSentence}
Average Characters per Word: ${stats.averageCharsPerWord}
      `.trim();
      
      navigator.clipboard.writeText(statsText);
      alert('Stats copied to clipboard!');
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
                <h1 className="text-xl font-bold text-slate-900">Word Counter</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enter Your Text
                </CardTitle>
                <CardDescription>
                  Paste or type your text below to get detailed statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing or paste your text here..."
                    className="min-h-[300px] resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-500">
                      {text.length} characters
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={clearText} variant="outline">
                        Clear Text
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Text Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{stats.wordCount}</div>
                          <div className="text-sm text-slate-600">Words</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{stats.characterCount}</div>
                          <div className="text-sm text-slate-600">Characters</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{stats.sentenceCount}</div>
                          <div className="text-sm text-slate-600">Sentences</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{stats.paragraphCount}</div>
                          <div className="text-sm text-slate-600">Paragraphs</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Characters (no spaces):</span>
                          <span className="font-medium">{stats.characterCountNoSpaces}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Lines:</span>
                          <span className="font-medium">{stats.lineCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Avg words per sentence:</span>
                          <span className="font-medium">{stats.averageWordsPerSentence}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Avg chars per word:</span>
                          <span className="font-medium">{stats.averageCharsPerWord}</span>
                        </div>
                      </div>

                      <Button onClick={copyStats} variant="outline" className="w-full">
                        Copy Stats
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Type className="h-12 w-12 mx-auto mb-4" />
                      <p>Start typing to see statistics</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reading Time Estimate */}
              {stats && stats.wordCount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reading Time Estimate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-indigo-600">
                        {Math.ceil(stats.wordCount / 200)}
                      </div>
                      <div className="text-sm text-slate-600">minutes to read</div>
                      <div className="text-xs text-slate-500">
                        (assuming 200 words per minute)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}