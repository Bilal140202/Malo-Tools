'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, BarChart3, FileText, Upload, Download } from 'lucide-react';

interface CorrelationResult {
  pearson: number;
  spearman: number;
  kendall: number;
  pearsonPValue: number;
  sampleSize: number;
  interpretation: string;
  strength: string;
  direction: string;
  confidenceInterval: { lower: number; upper: number };
  generatedAt: string;
}

interface DataPoint {
  x: number;
  y: number;
}

export default function CorrelationCoefficient() {
  const [inputData, setInputData] = useState('');
  const [method, setMethod] = useState<'pearson' | 'spearman' | 'kendall'>('pearson');
  const [currentResult, setCurrentResult] = useState<CorrelationResult | null>(null);
  const [generatedResults, setGeneratedResults] = useState<CorrelationResult[]>([]);

  const parseInputData = (data: string): DataPoint[] => {
    const lines = data.split('\\n').filter(line => line.trim());
    const points: DataPoint[] = [];
    
    lines.forEach(line => {
      const parts = line.split(/[\\s,;]+/).filter(p => p.trim());
      if (parts.length >= 2) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);
        if (!isNaN(x) && !isNaN(y)) {
          points.push({ x, y });
        }
      }
    });
    
    return points;
  };

  const calculatePearsonCorrelation = (data: DataPoint[]): { correlation: number; pValue: number } => {
    if (data.length < 3) {
      throw new Error('At least 3 data points are required for Pearson correlation');
    }

    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumY2 = data.reduce((sum, point) => sum + point.y * point.y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) {
      return { correlation: 0, pValue: 1 };
    }

    const correlation = numerator / denominator;
    
    // Calculate p-value using t-distribution approximation
    const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
    const pValue = 2 * (1 - tDistribution(Math.abs(tStat), n - 2));
    
    return { correlation, pValue };
  };

  const calculateSpearmanCorrelation = (data: DataPoint[]): number => {
    if (data.length < 3) {
      throw new Error('At least 3 data points are required for Spearman correlation');
    }

    // Rank the data
    const xRanks = getRanks(data.map(p => p.x));
    const yRanks = getRanks(data.map(p => p.y));

    // Calculate Pearson correlation on ranks
    const n = data.length;
    const sumX = xRanks.reduce((sum, rank) => sum + rank, 0);
    const sumY = yRanks.reduce((sum, rank) => sum + rank, 0);
    const sumXY = xRanks.reduce((sum, rank, i) => sum + rank * yRanks[i], 0);
    const sumX2 = xRanks.reduce((sum, rank) => sum + rank * rank, 0);
    const sumY2 = yRanks.reduce((sum, rank) => sum + rank * rank, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) {
      return 0;
    }

    return numerator / denominator;
  };

  const calculateKendallCorrelation = (data: DataPoint[]): number => {
    if (data.length < 3) {
      throw new Error('At least 3 data points are required for Kendall correlation');
    }

    let concordant = 0;
    let discordant = 0;

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const xDiff = data[i].x - data[j].x;
        const yDiff = data[i].y - data[j].y;

        if ((xDiff > 0 && yDiff > 0) || (xDiff < 0 && yDiff < 0)) {
          concordant++;
        } else if (xDiff !== 0 && yDiff !== 0) {
          discordant++;
        }
      }
    }

    const total = concordant + discordant;
    return (concordant - discordant) / total;
  };

  const getRanks = (values: number[]): number[] => {
    const sorted = values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value);

    const ranks = new Array(values.length);
    let i = 0;

    while (i < sorted.length) {
      const start = i;
      while (i < sorted.length - 1 && sorted[i].value === sorted[i + 1].value) {
        i++;
      }
      const rank = (start + i + 2) / 2;
      for (let j = start; j <= i; j++) {
        ranks[sorted[j].index] = rank;
      }
      i++;
    }

    return ranks;
  };

  const tDistribution = (t: number, df: number): number => {
    // Simplified t-distribution CDF approximation
    if (df <= 0) return 0;
    
    // Using approximation for t-distribution
    const x = df / (df + t * t);
    const a = Math.log(1 - x);
    const b = Math.log(x);
    const c = Math.log(df / 2);
    const d = Math.log(Math.PI / 2);
    
    return 0.5 + 0.5 * Math.sign(t) * Math.sqrt(1 - Math.exp(2 * (a + b + c - d)));
  };

  const interpretCorrelation = (correlation: number): { strength: string; direction: string; interpretation: string } => {
    const absCorr = Math.abs(correlation);
    
    let strength, direction, interpretation;
    
    if (absCorr >= 0.9) {
      strength = 'Very Strong';
    } else if (absCorr >= 0.7) {
      strength = 'Strong';
    } else if (absCorr >= 0.5) {
      strength = 'Moderate';
    } else if (absCorr >= 0.3) {
      strength = 'Weak';
    } else {
      strength = 'Very Weak';
    }
    
    direction = correlation > 0 ? 'Positive' : 'Negative';
    
    interpretation = `${strength} ${direction} correlation`;
    if (absCorr >= 0.7) {
      interpretation += ' - strong relationship';
    } else if (absCorr >= 0.5) {
      interpretation += ' - moderate relationship';
    } else if (absCorr >= 0.3) {
      interpretation += ' - weak relationship';
    } else {
      interpretation += ' - very weak relationship';
    }
    
    return { strength, direction, interpretation };
  };

  const calculateConfidenceInterval = (correlation: number, n: number): { lower: number; upper: number } => {
    // Fisher z-transformation for confidence interval
    if (n <= 3) return { lower: correlation, upper: correlation };
    
    const z = 0.5 * Math.log((1 + correlation) / (1 - correlation));
    const se = 1 / Math.sqrt(n - 3);
    const zLower = z - 1.96 * se;
    const zUpper = z + 1.96 * se;
    
    return {
      lower: (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1),
      upper: (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1)
    };
  };

  const calculateCorrelation = () => {
    try {
      const data = parseInputData(inputData);
      
      if (data.length < 3) {
        alert('Please enter at least 3 valid data points');
        return;
      }

      const pearsonResult = calculatePearsonCorrelation(data);
      const spearmanResult = calculateSpearmanCorrelation(data);
      const kendallResult = calculateKendallCorrelation(data);

      const interpretation = interpretCorrelation(pearsonResult.correlation);
      const confidenceInterval = calculateConfidenceInterval(pearsonResult.correlation, data.length);

      const result: CorrelationResult = {
        pearson: pearsonResult.correlation,
        spearman: spearmanResult,
        kendall: kendallResult,
        pearsonPValue: pearsonResult.pValue,
        sampleSize: data.length,
        interpretation: interpretation.interpretation,
        strength: interpretation.strength,
        direction: interpretation.direction,
        confidenceInterval,
        generatedAt: new Date().toLocaleString()
      };

      setCurrentResult(result);
      setGeneratedResults([result, ...generatedResults]);
    } catch (error) {
      alert('Error calculating correlation: ' + error);
    }
  };

  const loadSampleData = () => {
    const sampleData = [
      [1, 2], [2, 4], [3, 6], [4, 8], [5, 10],
      [6, 12], [7, 14], [8, 16], [9, 18], [10, 20]
    ];
    setInputData(sampleData.map(point => `${point[0]}, ${point[1]}`).join('\\n'));
  };

  const exportResult = (result: CorrelationResult) => {
    alert(`Exporting correlation result`);
  };

  const formatNumber = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
  };

  const getCorrelationColor = (correlation: number): string => {
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.7) return 'text-red-600';
    if (absCorr >= 0.5) return 'text-orange-600';
    if (absCorr >= 0.3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Correlation Coefficient</h1>
          <p className="text-green-600">Calculate correlation between two variables</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Calculate Correlation
              </CardTitle>
              <CardDescription>
                Enter paired data points to calculate correlation coefficients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Method Selection */}
              <div>
                <Label htmlFor="method">Correlation Method</Label>
                <Select value={method} onValueChange={(value: any) => setMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pearson">Pearson Correlation</SelectItem>
                    <SelectItem value="spearman">Spearman Rank Correlation</SelectItem>
                    <SelectItem value="kendall">Kendall's Tau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-green-50 p-3 rounded text-sm">
                {method === 'pearson' && (
                  <div>
                    <strong>Pearson Correlation:</strong> Measures linear relationship between continuous variables. Assumes normal distribution.
                  </div>
                )}
                {method === 'spearman' && (
                  <div>
                    <strong>Spearman Rank Correlation:</strong> Non-parametric measure of monotonic relationship. Uses rank orders.
                  </div>
                )}
                {method === 'kendall' && (
                  <div>
                    <strong>Kendall's Tau:</strong> Non-parametric measure based on concordant/discordant pairs. Robust to outliers.
                  </div>
                )}
              </div>

              {/* Data Input */}
              <div>
                <Label htmlFor="inputData">Data Input</Label>
                <Textarea
                  id="inputData"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder="Enter paired data points (X Y):\\n1 2\\n2 4\\n3 6\\n4 8\\n5 10"
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

              <div className="text-sm text-gray-600">
                <p><strong>Format:</strong> X Y (one pair per line)</p>
                <p><strong>Requirements:</strong> At least 3 paired data points</p>
                <p><strong>Example:</strong></p>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
1 2
2 4
3 6
4 8
5 10
                </pre>
              </div>

              <Button onClick={calculateCorrelation} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Calculate Correlation
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Current Result */}
            {currentResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Correlation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Main Correlation Values */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded text-center">
                        <div className="text-blue-600 text-sm">Pearson's r</div>
                        <div className={`text-2xl font-bold ${getCorrelationColor(currentResult.pearson)}`}>
                          {formatNumber(currentResult.pearson)}
                        </div>
                        <div className="text-xs text-gray-500">p = {formatNumber(currentResult.pearsonPValue)}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded text-center">
                        <div className="text-green-600 text-sm">Spearman's ρ</div>
                        <div className={`text-2xl font-bold ${getCorrelationColor(currentResult.spearman)}`}>
                          {formatNumber(currentResult.spearman)}
                        </div>
                        <div className="text-xs text-gray-500">Rank-based</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded text-center">
                        <div className="text-purple-600 text-sm">Kendall's τ</div>
                        <div className={`text-2xl font-bold ${getCorrelationColor(currentResult.kendall)}`}>
                          {formatNumber(currentResult.kendall)}
                        </div>
                        <div className="text-xs text-gray-500">Concordance</div>
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className={`p-4 rounded-lg ${currentResult.pearson >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${currentResult.pearson >= 0 ? 'bg-green-600' : 'bg-orange-600'}`}></div>
                        <span className="font-semibold">{currentResult.interpretation}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Strength:</span> {currentResult.strength}
                        </div>
                        <div>
                          <span className="text-gray-600">Direction:</span> {currentResult.direction}
                        </div>
                      </div>
                    </div>

                    {/* Additional Statistics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-100 p-3 rounded">
                        <div className="text-gray-600">Sample Size</div>
                        <div className="font-bold text-lg">{currentResult.sampleSize}</div>
                      </div>
                      <div className="bg-gray-100 p-3 rounded">
                        <div className="text-gray-600">95% Confidence Interval</div>
                        <div className="font-mono text-sm">
                          [{formatNumber(currentResult.confidenceInterval.lower)}, {formatNumber(currentResult.confidenceInterval.upper)}]
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => exportResult(currentResult)} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Results */}
            {generatedResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Correlation History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedResults.map((result, index) => (
                      <div key={result.generatedAt} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">Analysis #{generatedResults.length - index}</div>
                          <div className="text-sm text-green-600">
                            r = {formatNumber(result.pearson)} • {result.sampleSize} points
                          </div>
                          <div className="text-xs text-gray-500">{result.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{result.strength}</Badge>
                          <Button size="sm" onClick={() => exportResult(result)}>
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
            {!currentResult && generatedResults.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    About Correlation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">What is Correlation?</h4>
                      <p className="text-gray-600">Correlation measures the strength and direction of the linear relationship between two variables.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Correlation Coefficients:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• <strong>Pearson r:</strong> -1 to +1, measures linear relationship</li>
                        <li>• <strong>Spearman ρ:</strong> -1 to +1, measures monotonic relationship</li>
                        <li>• <strong>Kendall τ:</strong> -1 to +1, based on concordant pairs</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Interpretation:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• 0.7-1.0: Strong correlation</li>
                        <li>• 0.5-0.7: Moderate correlation</li>
                        <li>• 0.3-0.5: Weak correlation</li>
                        <li>• 0.0-0.3: Very weak/no correlation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Important:</h4>
                      <p className="text-gray-600">Correlation does not imply causation. Always consider the context and potential confounding variables.</p>
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