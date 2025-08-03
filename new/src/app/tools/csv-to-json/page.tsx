'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, Download, FileText, Code } from 'lucide-react';
import Link from 'next/link';

interface CSVData {
  headers: string[];
  rows: any[][];
}

export default function CsvToJson() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [jsonData, setJsonData] = useState<string>('');
  const [fileName, setFileName] = useState('data.json');
  const [delimiter, setDelimiter] = useState(',');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        parseCSV(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (content: string, originalFileName: string = '') => {
    setIsProcessing(true);
    
    try {
      const lines = content.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) {
        alert('CSV file must contain at least a header and one data row');
        setIsProcessing(false);
        return;
      }

      // Parse headers
      const headers = parseCSVLine(lines[0], delimiter);
      
      // Parse data rows
      const rows = lines.slice(1).map(line => parseCSVLine(line, delimiter));
      
      // Filter out empty rows
      const validRows = rows.filter(row => row.length > 0 && row.some(cell => cell.trim() !== ''));
      
      setCsvData({
        headers,
        rows: validRows
      });
      
      // Convert to JSON
      convertToJson(headers, validRows, originalFileName);
      
    } catch (error) {
      console.error('CSV parsing error:', error);
      alert('Failed to parse CSV file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const convertToJson = (headers: string[], rows: any[][], originalFileName: string = '') => {
    try {
      const jsonArray = rows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          let value = row[index] || '';
          
          // Try to parse as number
          if (!isNaN(Number(value)) && value.trim() !== '') {
            value = Number(value);
          }
          // Try to parse as boolean
          else if (value.toLowerCase() === 'true') {
            value = true;
          } else if (value.toLowerCase() === 'false') {
            value = false;
          }
          // Try to parse as null
          else if (value.toLowerCase() === 'null') {
            value = null;
          }
          
          obj[header] = value;
        });
        return obj;
      });

      const jsonString = JSON.stringify(jsonArray, null, 2);
      setJsonData(jsonString);
      
      // Generate filename based on original file
      if (originalFileName) {
        const baseName = originalFileName.replace('.csv', '');
        setFileName(`${baseName}.json`);
      }
      
    } catch (error) {
      console.error('JSON conversion error:', error);
      alert('Failed to convert to JSON.');
    }
  };

  const downloadJson = () => {
    if (!jsonData) return;
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    if (!jsonData) return;
    
    navigator.clipboard.writeText(jsonData).then(() => {
      alert('JSON copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const clearAll = () => {
    setCsvData(null);
    setJsonData('');
    setFileName('data.json');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextUpload = () => {
    const text = prompt('Paste your CSV data:');
    if (text) {
      parseCSV(text);
    }
  };

  const getSampleCSV = () => {
    const sample = `name,age,email,active
John Doe,25,john@example.com,true
Jane Smith,30,jane@example.com,false
Bob Johnson,35,bob@example.com,true`;
    parseCSV(sample);
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
                <h1 className="text-xl font-bold text-slate-900">CSV to JSON</h1>
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
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Code className="h-6 w-6" />
              CSV to JSON Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert CSV files to JSON format with automatic type detection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Input */}
              <div className="space-y-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload CSV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-600 mb-2">
                          Click to upload CSV file
                        </p>
                        <p className="text-sm text-slate-500">
                          or drag and drop your file here
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      <div className="flex space-x-2">
                        <Button onClick={handleTextUpload} variant="outline" size="sm" className="flex-1">
                          <FileText className="mr-2 h-4 w-4" />
                          Paste Text
                        </Button>
                        <Button onClick={getSampleCSV} variant="outline" size="sm" className="flex-1">
                          Use Sample
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CSV Preview */}
                {csvData && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">CSV Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Delimiter
                          </label>
                          <Input
                            value={delimiter}
                            onChange={(e) => setDelimiter(e.target.value)}
                            placeholder=","
                            maxLength={1}
                          />
                        </div>
                        
                        <div className="text-sm">
                          <div className="text-slate-600 mb-2">
                            {csvData.headers.length} columns, {csvData.rows.length} rows
                          </div>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-slate-50">
                                <tr>
                                  {csvData.headers.map((header, index) => (
                                    <th key={index} className="p-2 text-left border-b border-slate-200">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                      <td key={cellIndex} className="p-2 border-b border-slate-100">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                                {csvData.rows.length > 5 && (
                                  <tr>
                                    <td colSpan={csvData.headers.length} className="p-2 text-center text-slate-400 bg-slate-50">
                                      +{csvData.rows.length - 5} more rows
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Output Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Output Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        JSON Filename
                      </label>
                      <Input
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="data.json"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={downloadJson}
                        disabled={!jsonData}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download JSON
                      </Button>
                      <Button
                        onClick={copyToClipboard}
                        disabled={!jsonData}
                        variant="outline"
                        className="w-full"
                      >
                        Copy to Clipboard
                      </Button>
                      <Button
                        onClick={clearAll}
                        variant="outline"
                        className="w-full"
                      >
                        Clear All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - JSON Output */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">JSON Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jsonData ? (
                        <div className="relative">
                          <textarea
                            ref={textareaRef}
                            value={jsonData}
                            readOnly
                            className="w-full h-96 p-3 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 resize-none"
                          />
                          <div className="absolute top-2 right-2 text-xs text-slate-400">
                            JSON
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16 text-slate-400">
                          <Code className="h-12 w-12 mx-auto mb-4" />
                          <p>Upload CSV to see JSON output</p>
                          <p className="text-sm mt-2">JSON will appear here after conversion</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900">Features</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-800 space-y-2">
                    <div>• Automatic type detection (numbers, booleans, null)</div>
                    <div>• Handles quoted fields and commas</div>
                    <div>• Customizable delimiter support</div>
                    <div>• Clean, formatted JSON output</div>
                    <div>• Download or copy results</div>
                  </CardContent>
                </Card>

                {/* Usage Tips */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900">Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-blue-800 space-y-2">
                    <div>• Use comma as delimiter for standard CSV files</div>
                    <div>• Use semicolon for European CSV files</div>
                    <div>• Fields with commas should be quoted</div>
                    <div>• Empty values will be converted to null</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {!csvData && (
              <div className="text-center py-12 text-slate-400">
                <FileText className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">No CSV data loaded</p>
                <p className="text-sm">Upload a CSV file or paste CSV text to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}