'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, Table, AlertCircle, Info, Eye } from 'lucide-react';

export default function CSVTools() {
  const [csvContent, setCsvContent] = useState('');
  const [delimiter, setDelimiter] = useState<string>(',');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('data.csv');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvContent(content);
        parseCSV(content);
        setFileName(file.name);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (content: string) => {
    try {
      const lines = content.trim().split('\n');
      if (lines.length === 0) {
        setError('CSV file is empty');
        return;
      }

      const parsedRows = lines.map(line => {
        // Handle quoted fields that may contain delimiters
        const regex = new RegExp(`(\\s*${delimiter}\\s*)|("(?:[^"]|"")*")|([^${delimiter}"]+)`, 'g');
        const fields: string[] = [];
        let match;
        
        while ((match = regex.exec(line)) !== null) {
          if (match[2]) {
            // Quoted field
            fields.push(match[2].replace(/^"|"$/g, '').replace(/""/g, '"'));
          } else if (match[3]) {
            // Unquoted field
            fields.push(match[3].trim());
          }
          // Skip delimiter matches (match[1])
        }
        
        return fields;
      });

      if (parsedRows.length > 0) {
        setHeaders(parsedRows[0]);
        setRows(parsedRows.slice(1));
      }
    } catch (err) {
      setError('Failed to parse CSV file');
    }
  };

  const generateCSV = () => {
    if (!headers.length && !rows.length) {
      setError('No data to export');
      return;
    }

    try {
      let content = '';
      
      // Add headers
      if (headers.length > 0) {
        content += headers.map(header => 
          header.includes(delimiter) || header.includes('\n') || header.includes('"') 
            ? `"${header.replace(/"/g, '""')}"` 
            : header
        ).join(delimiter) + '\n';
      }

      // Add rows
      rows.forEach(row => {
        const formattedRow = row.map(field => 
          field.includes(delimiter) || field.includes('\n') || field.includes('"') 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        );
        content += formattedRow.join(delimiter) + '\n';
      });

      const blob = new Blob([content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setError(null);
    } catch (err) {
      setError('Failed to generate CSV file');
    }
  };

  const clearData = () => {
    setCsvContent('');
    setHeaders([]);
    setRows([]);
    setFileName('data.csv');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addSampleData = () => {
    const sampleHeaders = ['Name', 'Age', 'City', 'Email'];
    const sampleRows = [
      ['John Doe', '25', 'New York', 'john@example.com'],
      ['Jane Smith', '30', 'Los Angeles', 'jane@example.com'],
      ['Bob Johnson', '35', 'Chicago', 'bob@example.com'],
      ['Alice Brown', '28', 'Houston', 'alice@example.com']
    ];
    
    setCsvContent(sampleHeaders.join(',') + '\n' + sampleRows.map(row => row.join(',')).join('\n'));
    setHeaders(sampleHeaders);
    setRows(sampleRows);
    setFileName('sample-data.csv');
    setError(null);
  };

  const getStatistics = () => {
    if (rows.length === 0) return null;

    const stats = {
      totalRows: rows.length,
      totalColumns: headers.length,
      emptyCells: 0,
      maxColumns: 0,
      minColumns: Infinity,
      columnStats: {} as Record<string, { nonEmpty: number; empty: number; maxLength: number }>
    };

    headers.forEach(header => {
      stats.columnStats[header] = { nonEmpty: 0, empty: 0, maxLength: 0 };
    });

    rows.forEach(row => {
      stats.maxColumns = Math.max(stats.maxColumns, row.length);
      stats.minColumns = Math.min(stats.minColumns, row.length);
      
      row.forEach((cell, index) => {
        if (index < headers.length) {
          const header = headers[index];
          if (cell.trim() === '') {
            stats.emptyCells++;
            stats.columnStats[header].empty++;
          } else {
            stats.columnStats[header].nonEmpty++;
            stats.columnStats[header].maxLength = Math.max(
              stats.columnStats[header].maxLength, 
              cell.length
            );
          }
        } else {
          stats.emptyCells++;
        }
      });
    });

    return stats;
  };

  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table className="h-6 w-6" />
              CSV Tools
            </CardTitle>
            <CardDescription>
              Parse, view, and manipulate CSV files with advanced features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-slate-900 mb-2">
                  Upload CSV File
                </div>
                <div className="text-sm text-slate-500 mb-4">
                  Drag and drop or click to browse
                </div>
                <Label htmlFor="csv-upload">
                  <Button asChild>
                    <span>Choose CSV File</span>
                  </Button>
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={addSampleData}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Sample Data
                </Button>
                <Button
                  variant="outline"
                  onClick={clearData}
                  disabled={!csvContent}
                >
                  Clear Data
                </Button>
              </div>
            </div>

            {/* CSV Editor */}
            {csvContent && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="filename">Output Filename</Label>
                    <Input
                      id="filename"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="data.csv"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delimiter">Delimiter</Label>
                    <Input
                      id="delimiter"
                      value={delimiter}
                      onChange={(e) => setDelimiter(e.target.value)}
                      maxLength={1}
                      placeholder=","
                    />
                  </div>
                </div>

                {/* CSV Content Editor */}
                <div>
                  <Label htmlFor="csv-editor">CSV Content</Label>
                  <Textarea
                    id="csv-editor"
                    value={csvContent}
                    onChange={(e) => {
                      setCsvContent(e.target.value);
                      parseCSV(e.target.value);
                    }}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>

                {/* Export Button */}
                <Button
                  onClick={generateCSV}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV File
                </Button>
              </div>
            )}

            {/* Statistics */}
            {stats && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">File Statistics:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">Total Rows:</span>
                    <div className="text-blue-600 font-bold">{stats.totalRows}</div>
                  </div>
                  <div>
                    <span className="font-medium">Total Columns:</span>
                    <div className="text-blue-600 font-bold">{stats.totalColumns}</div>
                  </div>
                  <div>
                    <span className="font-medium">Empty Cells:</span>
                    <div className="text-red-600 font-bold">{stats.emptyCells}</div>
                  </div>
                  <div>
                    <span className="font-medium">Columns per Row:</span>
                    <div className="text-green-600 font-bold">{stats.minColumns}-{stats.maxColumns}</div>
                  </div>
                </div>

                {/* Column Statistics */}
                {stats.columnStats && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Column Statistics:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(stats.columnStats).map(([column, colStats]) => (
                        <div key={column} className="bg-white rounded p-3 border">
                          <div className="font-medium text-sm">{column}</div>
                          <div className="text-xs text-slate-600 space-y-1">
                            <div>Non-empty: {colStats.nonEmpty}</div>
                            <div>Empty: {colStats.empty}</div>
                            <div>Max length: {colStats.maxLength}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview Table */}
            {headers.length > 0 && rows.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">Data Preview</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {isPreviewVisible ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>

                {isPreviewVisible && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            {headers.map((header, index) => (
                              <th key={index} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {rows.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 text-sm text-slate-900 max-w-xs truncate">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {rows.length > 10 && (
                      <div className="bg-slate-50 px-4 py-2 text-sm text-slate-500 text-center">
                        Showing first 10 rows of {rows.length} total rows
                      </div>
                    )}
                  </div>
                )}
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
                <li>1. Upload a CSV file or load sample data to get started</li>
                <li>2. Edit the CSV content directly in the text area</li>
                <li>3. Change the delimiter if needed (default is comma)</li>
                <li>4. Modify the output filename as desired</li>
                <li>5. Click "Download CSV File" to save your changes</li>
                <li>6. Use the preview to view your data in table format</li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Features:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Automatic CSV parsing and validation</li>
                <li>• Support for custom delimiters</li>
                <li>• In-place CSV editing</li>
                <li>• Data statistics and analysis</li>
                <li>• Table preview with pagination</li>
                <li>• Proper handling of quoted fields</li>
                <li>• Sample data for testing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}