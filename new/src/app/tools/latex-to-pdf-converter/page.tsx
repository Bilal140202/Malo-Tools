'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Code, BookOpen, Settings, Plus, Trash2 } from 'lucide-react';

interface LaTeXTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
}

interface DocumentSettings {
  fontSize: string;
  paperSize: string;
  documentClass: string;
  margin: string;
  encoding: string;
}

const latexTemplates: LaTeXTemplate[] = [
  {
    id: 'article',
    name: 'Article',
    description: 'Standard article format',
    content: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\title{Your Article Title}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
This is an abstract of your article.
\\end{abstract}

\\section{Introduction}
This is the introduction section.

\\section{Methodology}
Describe your methodology here.

\\section{Results}
Present your results here.

\\section{Conclusion}
Conclude your findings.

\\end{document}`,
    category: 'academic'
  },
  {
    id: 'report',
    name: 'Report',
    description: 'Professional report format',
    content: `\\documentclass{report}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{graphicx}
\\usepackage{hyperref}

\\geometry{a4paper, margin=1in}

\\title{Report Title}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\begin{titlepage}
\\centering
\\vspace*{2cm}
{\\Huge \\bfseries Report Title}\\vspace{1cm}
{\\Large Author Name}\\vspace{1cm}
{\\large \\today}\\vspace{2cm}
\\end{titlepage}

\\tableofcontents
\\newpage

\\chapter{Introduction}
This is the introduction chapter.

\\chapter{Background}
Provide background information here.

\\chapter{Methodology}
Describe your methodology.

\\chapter{Results}
Present your results.

\\chapter{Conclusion}
Summarize your findings.

\\end{document}`,
    category: 'business'
  },
  {
    id: 'letter',
    name: 'Letter',
    description: 'Business letter format',
    content: `\\documentclass{letter}
\\usepackage[utf8]{inputenc}

\\signature{Your Name}
\\address{Your Address\\line Your City, State ZIP\\line Your Email\\line Your Phone}
\\date{\\today}

\\begin{document}

\\begin{letter}{Recipient Name\\line Recipient Address\\line City, State ZIP}

\\opening{Dear Sir or Madam,}

This is the body of your letter. You can write your message here.

\\closing{Yours faithfully,}

\\end{letter}

\\end{document}`,
    category: 'business'
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Beamer presentation template',
    content: `\\documentclass{beamer}
\\usepackage[utf8]{inputenc}
\\usetheme{Madrid}
\\usecolortheme{default}

\\title{Presentation Title}
\\author{Presenter Name}
\\institute{Institution Name}
\\date{\\today}

\\begin{document}

\\begin{frame}
\\titlepage
\\end{frame}

\\begin{frame}{Outline}
\\tableofcontents
\\end{frame}

\\section{Introduction}
\\begin{frame}{Introduction}
\\begin{itemize}
\\item First point
\\item Second point
\\item Third point
\\end{itemize}
\\end{frame}

\\section{Methodology}
\\begin{frame}{Methodology}
\\begin{enumerate}
\\item Step one
\\item Step two
\\item Step three
\\end{enumerate}
\\end{frame}

\\section{Results}
\\begin{frame}{Results}
\\begin{block}{Key Finding}
This is a key finding from your research.
\\end{block}
\\end{frame}

\\begin{frame}
\\begin{center}
\\Huge Thank You!\\vspace{1cm}

\\large Questions?
\\end{center}
\\end{frame}

\\end{document}`,
    category: 'academic'
  }
];

export default function LaTeXtoPDFConverter() {
  const [selectedTemplate, setSelectedTemplate] = useState<LaTeXTemplate | null>(null);
  const [latexContent, setLatexContent] = useState('');
  const [documentSettings, setDocumentSettings] = useState<DocumentSettings>({
    fontSize: '12pt',
    paperSize: 'a4paper',
    documentClass: 'article',
    margin: '1in',
    encoding: 'utf8'
  });
  const [generatedDocuments, setGeneratedDocuments] = useState<any[]>([]);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTemplateSelect = (template: LaTeXTemplate) => {
    setSelectedTemplate(template);
    setLatexContent(template.content);
    setDocumentSettings(prev => ({
      ...prev,
      documentClass: template.id
    }));
  };

  const updateDocumentSettings = (field: keyof DocumentSettings, value: string) => {
    setDocumentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateLaTeXDocument = () => {
    if (!latexContent.trim()) {
      alert('Please enter LaTeX content or select a template');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const document = {
        id: Date.now(),
        title: extractTitle(latexContent) || 'Untitled Document',
        content: latexContent,
        settings: documentSettings,
        generatedAt: new Date().toLocaleString(),
        wordCount: latexContent.split(/\\s+/).length
      };

      setCurrentDocument(document);
      setGeneratedDocuments([document, ...generatedDocuments]);
      setIsProcessing(false);
    }, 2000);
  };

  const extractTitle = (content: string): string | null => {
    const titleMatch = content.match(/\\\\title\{([^}]+)\}/);
    return titleMatch ? titleMatch[1] : null;
  };

  const downloadDocument = (document: any) => {
    alert(`Downloading LaTeX document: ${document.title}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('LaTeX code copied to clipboard!');
  };

  const validateLaTeX = () => {
    // Basic LaTeX validation
    const errors = [];
    
    if (!latexContent.includes('\\documentclass')) {
      errors.push('Missing \\documentclass command');
    }
    
    if (!latexContent.includes('\\begin{document}')) {
      errors.push('Missing \\begin{document} command');
    }
    
    if (!latexContent.includes('\\end{document}')) {
      errors.push('Missing \\end{document} command');
    }

    if (errors.length > 0) {
      alert(`LaTeX validation errors:\\n${errors.join('\\n')}`);
    } else {
      alert('LaTeX code appears valid!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">LaTeX to PDF Converter</h1>
          <p className="text-purple-600">Create professional documents from LaTeX code</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LaTeX Editor and Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-600" />
                LaTeX Editor
              </CardTitle>
              <CardDescription>
                Write and edit LaTeX code with real-time preview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div>
                <Label htmlFor="template">Choose Template</Label>
                <Select onValueChange={(value) => {
                  const template = latexTemplates.find(t => t.id === value);
                  if (template) handleTemplateSelect(template);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a LaTeX template" />
                  </SelectTrigger>
                  <SelectContent>
                    {latexTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Settings */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Document Settings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="documentClass">Document Class</Label>
                    <Select value={documentSettings.documentClass} onValueChange={(value) => updateDocumentSettings('documentClass', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="beamer">Presentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select value={documentSettings.fontSize} onValueChange={(value) => updateDocumentSettings('fontSize', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10pt">10pt</SelectItem>
                        <SelectItem value="11pt">11pt</SelectItem>
                        <SelectItem value="12pt">12pt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paperSize">Paper Size</Label>
                    <Select value={documentSettings.paperSize} onValueChange={(value) => updateDocumentSettings('paperSize', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4paper">A4</SelectItem>
                        <SelectItem value="letterpaper">Letter</SelectItem>
                        <SelectItem value="legalpaper">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="margin">Margin</Label>
                    <Input
                      id="margin"
                      value={documentSettings.margin}
                      onChange={(e) => updateDocumentSettings('margin', e.target.value)}
                      placeholder="1in"
                    />
                  </div>
                </div>
              </div>

              {/* LaTeX Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="latexContent">LaTeX Code</Label>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={validateLaTeX}>
                      Validate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(latexContent)}>
                      Copy
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="latexContent"
                  value={latexContent}
                  onChange={(e) => setLatexContent(e.target.value)}
                  className="font-mono text-sm min-h-[300px]"
                  placeholder="Enter your LaTeX code here..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={generateLaTeXDocument} className="flex-1" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Documents */}
          <div className="space-y-6">
            {/* Current Document */}
            {currentDocument && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    Generated Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Document Info */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">{currentDocument.title}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Class:</span>
                          <span className="ml-2">{currentDocument.settings.documentClass}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Font:</span>
                          <span className="ml-2">{currentDocument.settings.fontSize}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Paper:</span>
                          <span className="ml-2">{currentDocument.settings.paperSize}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Words:</span>
                          <span className="ml-2">{currentDocument.wordCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <h4 className="font-semibold mb-2">Preview</h4>
                      <div className="bg-gray-100 border rounded-lg p-4 max-h-48 overflow-y-auto">
                        <pre className="text-xs text-gray-800 font-mono">
                          {latexContent.substring(0, 500)}...
                        </pre>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button onClick={() => downloadDocument(currentDocument)} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Advanced Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Documents List */}
            {generatedDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Generated Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-sm text-purple-600">
                            {doc.settings.documentClass} • {doc.wordCount} words
                          </div>
                          <div className="text-xs text-gray-500">{doc.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{doc.settings.documentClass}</Badge>
                          <Button size="sm" onClick={() => downloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* LaTeX Help */}
            {!currentDocument && generatedDocuments.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    LaTeX Quick Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Basic Commands:</h4>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                        <div>\\\\section{Title} - Section header</div>
                        <div>\\\\textbf{Bold} - Bold text</div>
                        <div>\\\\textit{Italic} - Italic text</div>
                        <div>\\\\underline{Underline} - Underlined text</div>
                        <div>\\\\item - List item</div>
                        <div>\\\\begin{document} ... \\\\end{document} - Document content</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Math Mode:</h4>
                      <div className="bg-gray-50 p-3 rounded font-mono text-xs">
                        <div>$x^2 + y^2 = z^2$ - Inline math</div>
                        <div>$$\\frac{a}{b}$$ - Display math</div>
                        <div>\\\\alpha, \\\\beta, \\\\gamma - Greek letters</div>
                        <div>\\\\sum, \\\\int, \\\\sqrt - Symbols</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}