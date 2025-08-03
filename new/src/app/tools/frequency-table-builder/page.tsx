'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, BarChart3, FileText, Plus, Trash2, Upload, Download } from 'lucide-react';

interface FrequencyTableRow {
  value: string;
  frequency: number;
  percentage: number;
  cumulative: number;
}

interface FrequencyTable {
  id: string;
  title: string;
  data: FrequencyTableRow[];
  total: number;
  mean: number;
  median: number;
  mode: string[];
  range: number;
  min: number;
  max: number;
  generatedAt: string;
}

export default function FrequencyTableBuilder() {
  const [inputData, setInputData] = useState('');
  const [tableTitle, setTableTitle] = useState('Frequency Distribution');
  const [bins, setBins] = useState(5);
  const [binMethod, setBinMethod] = useState('sturges');
  const [includePercentages, setIncludePercentages] = useState(true);
  const [includeCumulative, setIncludeCumulative] = useState(true);
  const [generatedTables, setGeneratedTables] = useState<FrequencyTable[]>([]);
  const [currentTable, setCurrentTable] = useState<FrequencyTable | null>(null);

  const parseInputData = (data: string): number[] => {
    const lines = data.split('\\n').filter(line => line.trim());
    const numbers: number[] = [];
    
    lines.forEach(line => {
      // Handle comma-separated values
      const values = line.split(/[\\s,;]+/).filter(v => v.trim());
      values.forEach(value => {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      });
    });
    
    return numbers;
  };

  const calculateBins = (data: number[], method: string, binCount: number): number[] => {
    if (data.length === 0) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    switch (method) {
      case 'sturges':
        const sturgesBins = Math.ceil(Math.log2(data.length)) + 1;
        return createBinEdges(min, max, sturgesBins);
      case 'square-root':
        const sqrtBins = Math.ceil(Math.sqrt(data.length));
        return createBinEdges(min, max, sqrtBins);
      case 'rice':
        const riceBins = Math.ceil(2 * Math.pow(data.length, 1/3));
        return createBinEdges(min, max, riceBins);
      case 'fixed':
      default:
        return createBinEdges(min, max, binCount);
    }
  };

  const createBinEdges = (min: number, max: number, count: number): number[] => {
    const width = (max - min) / count;
    const edges = [];
    
    for (let i = 0; i <= count; i++) {
      edges.push(min + i * width);
    }
    
    return edges;
  };

  const createFrequencyTable = (data: number[], binEdges: number[]): FrequencyTableRow[] => {
    const frequencies = new Array(binEdges.length - 1).fill(0);
    const tableData: FrequencyTableRow[] = [];
    
    // Count frequencies
    data.forEach(value => {
      for (let i = 0; i < binEdges.length - 1; i++) {
        if (value >= binEdges[i] && value < binEdges[i + 1]) {
          frequencies[i]++;
          break;
        }
      }
    });
    
    // Create table rows
    const total = data.length;
    let cumulative = 0;
    
    for (let i = 0; i < frequencies.length; i++) {
      const frequency = frequencies[i];
      const percentage = total > 0 ? (frequency / total) * 100 : 0;
      cumulative += frequency;
      
      tableData.push({
        value: `${binEdges[i].toFixed(2)} - ${binEdges[i + 1].toFixed(2)}`,
        frequency,
        percentage,
        cumulative
      });
    }
    
    return tableData;
  };

  const calculateStatistics = (data: number[]): { mean: number; median: number; mode: string[]; range: number; min: number; max: number } => {
    if (data.length === 0) {
      return { mean: 0, median: 0, mode: [], range: 0, min: 0, max: 0 };
    }
    
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    // Mean
    const mean = data.reduce((sum, val) => sum + val, 0) / n;
    
    // Median
    const median = n % 2 === 0 
      ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
      : sorted[Math.floor(n/2)];
    
    // Mode
    const frequency: { [key: number]: number } = {};
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
    
    // Range, Min, Max
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    return { mean, median, mode: mode.map(m => m.toString()), range, min, max };
  };

  const generateFrequencyTable = () => {
    const data = parseInputData(inputData);
    
    if (data.length === 0) {
      alert('Please enter valid numerical data');
      return;
    }
    
    const binEdges = calculateBins(data, binMethod, bins);
    const tableData = createFrequencyTable(data, binEdges);
    const stats = calculateStatistics(data);
    
    const table: FrequencyTable = {
      id: Date.now().toString(),
      title: tableTitle,
      data: tableData,
      total: data.length,
      ...stats,
      generatedAt: new Date().toLocaleString()
    };
    
    setCurrentTable(table);
    setGeneratedTables([table, ...generatedTables]);
  };

  const loadSampleData = () => {
    const sampleData = Array.from({length: 100}, () => Math.floor(Math.random() * 100) + 1);
    setInputData(sampleData.join('\\n'));
  };

  const exportTable = (table: FrequencyTable) => {
    alert(`Exporting frequency table: ${table.title}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Data copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Frequency Table Builder</h1>
          <p className="text-green-600">Create frequency distributions and statistical summaries</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Build Frequency Table
              </CardTitle>
              <CardDescription>
                Enter your data and configure table settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Table Title */}
              <div>
                <Label htmlFor="tableTitle">Table Title</Label>
                <Input
                  id="tableTitle"
                  value={tableTitle}
                  onChange={(e) => setTableTitle(e.target.value)}
                  placeholder="Frequency Distribution"
                />
              </div>

              {/* Data Input */}
              <div>
                <Label htmlFor="inputData">Data Input</Label>
                <Textarea
                  id="inputData"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Enter numerical data, one per line or comma separated..."
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={loadSampleData} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Load Sample Data
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(inputData)} 
                    variant="outline" 
                    size="sm"
                  >
                    Copy Data
                  </Button>
                </div>
              </div>

              {/* Binning Settings */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Binning Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="binMethod">Binning Method</Label>
                    <Select value={binMethod} onValueChange={(value) => setBinMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sturges">Sturges' Rule</SelectItem>
                        <SelectItem value="square-root">Square Root</SelectItem>
                        <SelectItem value="rice">Rice Rule</SelectItem>
                        <SelectItem value="fixed">Fixed Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bins">Number of Bins</Label>
                    <Input
                      id="bins"
                      type="number"
                      min="1"
                      max="20"
                      value={bins}
                      onChange={(e) => setBins(parseInt(e.target.value) || 5)}
                      disabled={binMethod !== 'fixed'}
                    />
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div>
                <Label>Display Options</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includePercentages}
                      onChange={(e) => setIncludePercentages(e.target.checked)}
                      className="rounded"
                    />
                    <span>Show Percentages</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={includeCumulative}
                      onChange={(e) => setIncludeCumulative(e.target.checked)}
                      className="rounded"
                    />
                    <span>Show Cumulative Frequency</span>
                  </label>
                </div>
              </div>

              <Button onClick={generateFrequencyTable} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Frequency Table
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Current Table */}
            {currentTable && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    {currentTable.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Statistics Summary */}
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <div className="text-blue-600">Mean</div>
                        <div className="font-bold">{currentTable.mean.toFixed(3)}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded text-center">
                        <div className="text-green-600">Median</div>
                        <div className="font-bold">{currentTable.median.toFixed(3)}</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded text-center">
                        <div className="text-purple-600">Range</div>
                        <div className="font-bold">{currentTable.range.toFixed(3)}</div>
                      </div>
                    </div>

                    {/* Frequency Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Bin</th>
                            <th className="border p-2 text-right">Frequency</th>
                            {includePercentages && (
                              <th className="border p-2 text-right">Percentage</th>
                            )}
                            {includeCumulative && (
                              <th className="border p-2 text-right">Cumulative</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {currentTable.data.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="border p-2 font-mono text-sm">{row.value}</td>
                              <td className="border p-2 text-right">{row.frequency}</td>
                              {includePercentages && (
                                <td className="border p-2 text-right">
                                  {row.percentage.toFixed(1)}%
                                </td>
                              )}
                              {includeCumulative && (
                                <td className="border p-2 text-right">{row.cumulative}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100 font-bold">
                            <td className="border p-2">Total</td>
                            <td className="border p-2 text-right">{currentTable.total}</td>
                            {includePercentages && (
                              <td className="border p-2 text-right">100.0%</td>
                            )}
                            {includeCumulative && (
                              <td className="border p-2 text-right">{currentTable.total}</td>
                            )}
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Additional Statistics */}
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-600">Minimum:</span> {currentTable.min.toFixed(3)}
                        </div>
                        <div>
                          <span className="text-gray-600">Maximum:</span> {currentTable.max.toFixed(3)}
                        </div>
                        <div>
                          <span className="text-gray-600">Mode(s):</span> {currentTable.mode.join(', ')}
                        </div>
                        <div>
                          <span className="text-gray-600">Data Points:</span> {currentTable.total}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => exportTable(currentTable)} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export Table
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Tables */}
            {generatedTables.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Generated Tables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedTables.map((table) => (
                      <div key={table.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">{table.title}</div>
                          <div className="text-sm text-green-600">
                            {table.data.length} bins • {table.total} data points
                          </div>
                          <div className="text-xs text-gray-500">{table.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{table.binMethod}</Badge>
                          <Button size="sm" onClick={() => exportTable(table)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {!currentTable && generatedTables.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    How to Use Frequency Table Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">What is a Frequency Table?</h4>
                      <p className="text-gray-600">A frequency table displays the distribution of values in a dataset, showing how many times each value or range of values occurs.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Binning Methods:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Sturges' Rule:</strong> Good for normally distributed data</li>
                        <li>• <strong>Square Root:</strong> Simple and commonly used</li>
                        <li>• <strong>Rice Rule:</strong> Works well for larger datasets</li>
                        <li>• <strong>Fixed Number:</strong> Specify exact number of bins</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Data Format:</h4>
                      <p className="text-gray-600">Enter numerical data, one value per line or comma-separated. Example: 23, 45, 67, 89, 12, 34, 56, 78, 90, 1</p>
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
