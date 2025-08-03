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

interface StatisticalSummary {
  count: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  min: number;
  max: number;
  variance: number;
  standardDeviation: number;
  standardError: number;
  coefficientOfVariation: number;
  skewness: number;
  kurtosis: number;
  quartiles: { q1: number; q2: number; q3: number };
  interquartileRange: number;
  outliers: number[];
  generatedAt: string;
}

export default function SummaryStatsCalculator() {
  const [inputData, setInputData] = useState('');
  const [summary, setSummary] = useState<StatisticalSummary | null>(null);
  const [generatedSummaries, setGeneratedSummaries] = useState<StatisticalSummary[]>([]);
  const [includeOutliers, setIncludeOutliers] = useState(true);
  const [rounding, setRounding] = useState(4);

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

  const calculateStatistics = (data: number[]): StatisticalSummary => {
    if (data.length === 0) {
      throw new Error('No valid data provided');
    }

    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;

    // Basic descriptive statistics
    const count = n;
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    
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
    
    // Range and extrema
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    // Variance and standard deviation
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const standardDeviation = Math.sqrt(variance);
    const standardError = standardDeviation / Math.sqrt(n);
    
    // Coefficient of variation
    const coefficientOfVariation = standardDeviation / Math.abs(mean);
    
    // Skewness
    const skewness = data.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / n;
    
    // Kurtosis
    const kurtosis = data.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / n - 3;
    
    // Quartiles
    const q1 = sorted[Math.floor(n * 0.25)];
    const q2 = median;
    const q3 = sorted[Math.floor(n * 0.75)];
    const interquartileRange = q3 - q1;
    
    // Outliers using IQR method
    const lowerBound = q1 - 1.5 * interquartileRange;
    const upperBound = q3 + 1.5 * interquartileRange;
    const outliers = data.filter(val => val < lowerBound || val > upperBound);

    return {
      count,
      mean,
      median,
      mode,
      range,
      min,
      max,
      variance,
      standardDeviation,
      standardError,
      coefficientOfVariation,
      skewness,
      kurtosis,
      quartiles: { q1, q2, q3 },
      interquartileRange,
      outliers,
      generatedAt: new Date().toLocaleString()
    };
  };

  const generateSummary = () => {
    try {
      const data = parseInputData(inputData);
      
      if (data.length === 0) {
        alert('Please enter valid numerical data');
        return;
      }

      const stats = calculateStatistics(data);
      setSummary(stats);
      setGeneratedSummaries([stats, ...generatedSummaries]);
    } catch (error) {
      alert('Error calculating statistics: ' + error);
    }
  };

  const loadSampleData = () => {
    const normalData = Array.from({length: 50}, () => 
      Math.round((Math.random() * 100 + 50) * 100) / 100
    );
    setInputData(normalData.join('\\n'));
  };

  const exportSummary = (stats: StatisticalSummary) => {
    alert(`Exporting statistical summary`);
  };

  const roundValue = (value: number, decimals: number): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  const formatNumber = (value: number): string => {
    return roundValue(value, rounding).toString();
  };

  const getInterpretation = (value: number, type: string): string => {
    switch (type) {
      case 'skewness':
        if (Math.abs(value) < 0.5) return 'Approximately symmetric';
        if (value > 0) return 'Right-skewed (positive)';
        return 'Left-skewed (negative)';
      case 'kurtosis':
        if (Math.abs(value) < 0.5) return 'Normal kurtosis';
        if (value > 0) return 'Leptokurtic (heavy tails)';
        return 'Platykurtic (light tails)';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Summary Stats Calculator</h1>
          <p className="text-blue-600">Calculate comprehensive statistical summaries for your data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Calculate Statistics
              </CardTitle>
              <CardDescription>
                Enter your data to generate comprehensive statistical summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Button variant="outline" size="sm">
                    Clear Data
                  </Button>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rounding">Decimal Places</Label>
                    <Select value={rounding.toString()} onValueChange={(value) => setRounding(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="includeOutliers">Include Outliers</Label>
                    <Select value={includeOutliers.toString()} onValueChange={(value) => setIncludeOutliers(value === 'true')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={generateSummary} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Calculate Statistics
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Current Summary */}
            {summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Statistical Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Basic Statistics */}
                    <div>
                      <h3 className="font-semibold mb-3">Basic Statistics</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-50 p-3 rounded">
                          <div className="text-green-600 text-sm">Count</div>
                          <div className="font-bold text-lg">{summary.count}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="text-blue-600 text-sm">Mean</div>
                          <div className="font-bold text-lg">{formatNumber(summary.mean)}</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <div className="text-purple-600 text-sm">Median</div>
                          <div className="font-bold text-lg">{formatNumber(summary.median)}</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded">
                          <div className="text-orange-600 text-sm">Mode</div>
                          <div className="font-bold text-lg">
                            {summary.mode.length > 0 ? summary.mode.map(m => formatNumber(m)).join(', ') : 'None'}
                          </div>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                          <div className="text-red-600 text-sm">Range</div>
                          <div className="font-bold text-lg">{formatNumber(summary.range)}</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded">
                          <div className="text-yellow-600 text-sm">Min/Max</div>
                          <div className="font-bold text-sm">
                            {formatNumber(summary.min)} / {formatNumber(summary.max)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dispersion Measures */}
                    <div>
                      <h3 className="font-semibold mb-3">Dispersion Measures</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-gray-600 text-sm">Variance</div>
                          <div className="font-mono">{formatNumber(summary.variance)}</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-gray-600 text-sm">Std Deviation</div>
                          <div className="font-mono">{formatNumber(summary.standardDeviation)}</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-gray-600 text-sm">Std Error</div>
                          <div className="font-mono">{formatNumber(summary.standardError)}</div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-gray-600 text-sm">Coefficient of Variation</div>
                          <div className="font-mono">{formatNumber(summary.coefficientOfVariation)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Quartiles and IQR */}
                    <div>
                      <h3 className="font-semibold mb-3">Quartiles & IQR</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-indigo-50 p-3 rounded">
                          <div className="text-indigo-600 text-sm">Q1 (25th percentile)</div>
                          <div className="font-mono">{formatNumber(summary.quartiles.q1)}</div>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded">
                          <div className="text-indigo-600 text-sm">Q3 (75th percentile)</div>
                          <div className="font-mono">{formatNumber(summary.quartiles.q3)}</div>
                        </div>
                        <div className="col-span-2 bg-indigo-100 p-3 rounded">
                          <div className="text-indigo-600 text-sm">IQR (Interquartile Range)</div>
                          <div className="font-mono text-lg">{formatNumber(summary.interquartileRange)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Shape Measures */}
                    <div>
                      <h3 className="font-semibold mb-3">Shape Measures</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-teal-50 p-3 rounded">
                          <div className="text-teal-600 text-sm">Skewness</div>
                          <div className="font-mono">{formatNumber(summary.skewness)}</div>
                          <div className="text-xs text-teal-600 mt-1">
                            {getInterpretation(summary.skewness, 'skewness')}
                          </div>
                        </div>
                        <div className="bg-teal-50 p-3 rounded">
                          <div className="text-teal-600 text-sm">Kurtosis</div>
                          <div className="font-mono">{formatNumber(summary.kurtosis)}</div>
                          <div className="text-xs text-teal-600 mt-1">
                            {getInterpretation(summary.kurtosis, 'kurtosis')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Outliers */}
                    {includeOutliers && summary.outliers.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-red-600">Outliers ({summary.outliers.length})</h3>
                        <div className="bg-red-50 p-3 rounded">
                          <div className="font-mono text-sm text-red-800">
                            {summary.outliers.map(o => formatNumber(o)).join(', ')}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={() => exportSummary(summary)} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export Summary
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Summaries */}
            {generatedSummaries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Generated Summaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedSummaries.map((stats, index) => (
                      <div key={stats.generatedAt} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium">Summary #{generatedSummaries.length - index}</div>
                          <div className="text-sm text-blue-600">
                            {stats.count} data points • Mean: {formatNumber(stats.mean)}
                          </div>
                          <div className="text-xs text-gray-500">{stats.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{stats.count} points</Badge>
                          <Button size="sm" onClick={() => exportSummary(stats)}>
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
            {!summary && generatedSummaries.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    About Statistical Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">What is a Statistical Summary?</h4>
                      <p className="text-gray-600">A statistical summary provides a comprehensive overview of dataset characteristics including central tendency, dispersion, shape, and outliers.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Key Measures:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Central Tendency:</strong> Mean, median, mode</li>
                        <li>• <strong>Dispersion:</strong> Variance, standard deviation, range</li>
                        <li>• <strong>Shape:</strong> Skewness, kurtosis</li>
                        <li>• <strong>Position:</strong> Quartiles, percentiles</li>
                        <li>• <strong>Outliers:</strong> Extreme values using IQR method</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Data Format:</h4>
                      <p className="text-gray-600">Enter numerical values, one per line or comma-separated. Example: 23, 45, 67, 89, 12, 34, 56, 78, 90, 1</p>
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