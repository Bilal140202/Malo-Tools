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

interface HistogramBin {
  start: number;
  end: number;
  frequency: number;
  percentage: number;
  height: number;
}

interface HistogramData {
  id: string;
  title: string;
  bins: HistogramBin[];
  data: number[];
  statistics: {
    mean: number;
    median: number;
    mode: number[];
    standardDeviation: number;
    skewness: number;
  };
  settings: {
    binCount: number;
    binMethod: string;
    showGrid: boolean;
    showLabels: boolean;
    color: string;
  };
  generatedAt: string;
}

export default function HistogramGenerator() {
  const [inputData, setInputData] = useState('');
  const [histogramTitle, setHistogramTitle] = useState('Data Distribution');
  const [binCount, setBinCount] = useState(10);
  const [binMethod, setBinMethod] = useState('sturges');
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [barColor, setBarColor] = useState('#3b82f6');
  const [generatedHistograms, setGeneratedHistograms] = useState<HistogramData[]>([]);
  const [currentHistogram, setCurrentHistogram] = useState<HistogramData | null>(null);

  const parseInputData = (data: string): number[] => {
    const lines = data.split('\\n').filter(line => line.trim());
    const numbers: number[] = [];
    
    lines.forEach(line => {
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

  const calculateBins = (data: number[], method: string, count: number): HistogramBin[] => {
    if (data.length === 0) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    let binEdges: number[];
    switch (method) {
      case 'sturges':
        const sturgesBins = Math.ceil(Math.log2(data.length)) + 1;
        binEdges = createBinEdges(min, max, sturgesBins);
        break;
      case 'square-root':
        const sqrtBins = Math.ceil(Math.sqrt(data.length));
        binEdges = createBinEdges(min, max, sqrtBins);
        break;
      case 'rice':
        const riceBins = Math.ceil(2 * Math.pow(data.length, 1/3));
        binEdges = createBinEdges(min, max, riceBins);
        break;
      case 'equal-width':
      default:
        binEdges = createBinEdges(min, max, count);
        break;
    }
    
    const bins: HistogramBin[] = [];
    const total = data.length;
    let maxFrequency = 0;
    
    // Calculate frequencies
    for (let i = 0; i < binEdges.length - 1; i++) {
      const start = binEdges[i];
      const end = binEdges[i + 1];
      const frequency = data.filter(value => value >= start && value < end).length;
      const percentage = total > 0 ? (frequency / total) * 100 : 0;
      
      bins.push({ start, end, frequency, percentage, height: 0 });
      maxFrequency = Math.max(maxFrequency, frequency);
    }
    
    // Calculate heights (normalized)
    bins.forEach(bin => {
      bin.height = maxFrequency > 0 ? bin.frequency / maxFrequency : 0;
    });
    
    return bins;
  };

  const createBinEdges = (min: number, max: number, count: number): number[] => {
    const width = (max - min) / count;
    const edges = [];
    
    for (let i = 0; i <= count; i++) {
      edges.push(min + i * width);
    }
    
    return edges;
  };

  const calculateStatistics = (data: number[]): { mean: number; median: number; mode: number[]; standardDeviation: number; skewness: number } => {
    if (data.length === 0) {
      return { mean: 0, median: 0, mode: [], standardDeviation: 0, skewness: 0 };
    }
    
    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;
    
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
    
    // Standard deviation
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const standardDeviation = Math.sqrt(variance);
    
    // Skewness
    const skewness = data.reduce((sum, val) => sum + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    
    return { mean, median, mode, standardDeviation, skewness };
  };

  const generateHistogram = () => {
    const data = parseInputData(inputData);
    
    if (data.length === 0) {
      alert('Please enter valid numerical data');
      return;
    }
    
    const bins = calculateBins(data, binMethod, binCount);
    const statistics = calculateStatistics(data);
    
    const histogram: HistogramData = {
      id: Date.now().toString(),
      title: histogramTitle,
      bins,
      data,
      statistics,
      settings: {
        binCount,
        binMethod,
        showGrid,
        showLabels,
        color: barColor
      },
      generatedAt: new Date().toLocaleString()
    };
    
    setCurrentHistogram(histogram);
    setGeneratedHistograms([histogram, ...generatedHistograms]);
  };

  const loadSampleData = () => {
    // Generate normal distribution sample data
    const sampleData = Array.from({length: 200}, () => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return Math.round((z0 * 15 + 50) * 100) / 100; // Mean=50, Std=15
    });
    setInputData(sampleData.join('\\n'));
  };

  const renderHistogram = (histogram: HistogramData) => {
    const maxBarHeight = 200; // Maximum height for bars in pixels
    const barWidth = Math.min(60, 400 / histogram.bins.length);
    
    return (
      <div className="bg-white p-4 rounded-lg">
        <h4 className="text-center font-semibold mb-4">{histogram.title}</h4>
        
        {/* Statistics */}
        <div className="grid grid-cols-5 gap-2 text-xs mb-4 text-center">
          <div>
            <div className="text-gray-600">Mean</div>
            <div className="font-bold">{histogram.statistics.mean.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Median</div>
            <div className="font-bold">{histogram.statistics.median.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Std Dev</div>
            <div className="font-bold">{histogram.statistics.standardDeviation.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Skewness</div>
            <div className="font-bold">{histogram.statistics.skewness.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-600">Bins</div>
            <div className="font-bold">{histogram.bins.length}</div>
          </div>
        </div>
        
        {/* Histogram bars */}
        <div className="flex items-end justify-center gap-1 h-52 border-b border-l">
          {histogram.bins.map((bin, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-full border border-gray-300 rounded-t"
                style={{
                  height: `${bin.height * maxBarHeight}px`,
                  backgroundColor: histogram.settings.color,
                  minWidth: `${barWidth}px`,
                  maxWidth: `${barWidth}px`
                }}
              />
              {histogram.settings.showLabels && (
                <div className="text-xs mt-1 text-center w-full truncate" style={{ minWidth: `${barWidth}px` }}>
                  {bin.frequency}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        {histogram.settings.showLabels && (
          <div className="flex justify-center gap-1 mt-2 text-xs">
            {histogram.bins.map((bin, index) => (
              <div 
                key={index} 
                className="text-center"
                style={{ minWidth: `${barWidth}px` }}
              >
                {bin.start.toFixed(1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Histogram Generator</h1>
          <p className="text-green-600">Create histograms to visualize data distributions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Create Histogram
              </CardTitle>
              <CardDescription>
                Enter your data and configure histogram settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="histogramTitle">Histogram Title</Label>
                <Input
                  id="histogramTitle"
                  value={histogramTitle}
                  onChange={(e) => setHistogramTitle(e.target.value)}
                  placeholder="Data Distribution"
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
                  className="min-h-[150px] font-mono text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={loadSampleData} variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Load Sample Data
                  </Button>
                  <Button variant="outline" size="sm">
                    Clear Data
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
                        <SelectItem value="equal-width">Equal Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="binCount">Number of Bins</Label>
                    <Input
                      id="binCount"
                      type="number"
                      min="3"
                      max="50"
                      value={binCount}
                      onChange={(e) => setBinCount(parseInt(e.target.value) || 10)}
                      disabled={binMethod !== 'equal-width'}
                    />
                  </div>
                </div>
              </div>

              {/* Display Settings */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Display Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barColor">Bar Color</Label>
                    <Input
                      id="barColor"
                      type="color"
                      value={barColor}
                      onChange={(e) => setBarColor(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="showGrid">Options</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showGrid}
                          onChange={(e) => setShowGrid(e.target.checked)}
                          className="rounded"
                        />
                        <span>Show Grid</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={showLabels}
                          onChange={(e) => setShowLabels(e.target.checked)}
                          className="rounded"
                        />
                        <span>Show Labels</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={generateHistogram} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Histogram
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Current Histogram */}
            {currentHistogram && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    {currentHistogram.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {renderHistogram(currentHistogram)}
                  </div>
                  
                  {/* Frequency Table */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Frequency Distribution</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Bin Range</th>
                            <th className="border p-2 text-right">Frequency</th>
                            <th className="border p-2 text-right">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentHistogram.bins.map((bin, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="border p-2 font-mono text-xs">
                                {bin.start.toFixed(2)} - {bin.end.toFixed(2)}
                              </td>
                              <td className="border p-2 text-right">{bin.frequency}</td>
                              <td className="border p-2 text-right">
                                {bin.percentage.toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100 font-bold">
                            <td className="border p-2">Total</td>
                            <td className="border p-2 text-right">{currentHistogram.data.length}</td>
                            <td className="border p-2 text-right">100.0%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => alert('Downloading histogram...')} className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download Chart
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Histograms */}
            {generatedHistograms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Generated Histograms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedHistograms.map((histogram) => (
                      <div key={histogram.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">{histogram.title}</div>
                          <div className="text-sm text-green-600">
                            {histogram.bins.length} bins • {histogram.data.length} data points
                          </div>
                          <div className="text-xs text-gray-500">{histogram.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{histogram.settings.binMethod}</Badge>
                          <Button size="sm" onClick={() => alert('Downloading histogram...')}>
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
            {!currentHistogram && generatedHistograms.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    About Histograms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">What is a Histogram?</h4>
                      <p className="text-gray-600">A histogram is a graphical representation of the distribution of numerical data, showing the frequency of data points in specified ranges (bins).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Binning Methods:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Sturges' Rule:</strong> Good for normally distributed data</li>
                        <li>• <strong>Square Root:</strong> Simple and commonly used</li>
                        <li>• <strong>Rice Rule:</strong> Works well for larger datasets</li>
                        <li>• <strong>Equal Width:</strong> Specify exact number of bins</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Interpretation:</h4>
                      <p className="text-gray-600">The shape of the histogram reveals the distribution pattern: normal, skewed, bimodal, or uniform.</p>
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