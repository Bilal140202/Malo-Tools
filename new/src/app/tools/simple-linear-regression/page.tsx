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

interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  adjustedRSquared: number;
  standardError: number;
  fStatistic: number;
  pValue: number;
  sampleSize: number;
  equation: string;
  predictions: { x: number; predictedY: number; residual: number }[];
  confidenceInterval: { slope: { lower: number; upper: number }; intercept: { lower: number; upper: number } };
  generatedAt: string;
}

interface DataPoint {
  x: number;
  y: number;
}

export default function SimpleLinearRegression() {
  const [inputData, setInputData] = useState('');
  const [xValue, setXValue] = useState('');
  const [predictionMode, setPredictionMode] = useState<'none' | 'single' | 'multiple'>('none');
  const [currentResult, setCurrentResult] = useState<RegressionResult | null>(null);
  const [generatedResults, setGeneratedResults] = useState<RegressionResult[]>([]);

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

  const performLinearRegression = (data: DataPoint[]): RegressionResult => {
    if (data.length < 3) {
      throw new Error('At least 3 data points are required for linear regression');
    }

    const n = data.length;
    
    // Calculate sums
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumY2 = data.reduce((sum, point) => sum + point.y * point.y, 0);

    // Calculate slope and intercept
    const numerator = n * sumXY - sumX * sumY;
    const denominator = n * sumX2 - sumX * sumX;
    
    if (denominator === 0) {
      throw new Error('Cannot perform regression: X values have no variation');
    }

    const slope = numerator / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Calculate predictions and residuals
    const predictions = data.map(point => {
      const predictedY = slope * point.x + intercept;
      const residual = point.y - predictedY;
      return { x: point.x, predictedY, residual };
    });

    // Calculate R-squared
    const totalSumSquares = sumY2 - (sumY * sumY) / n;
    const residualSumSquares = predictions.reduce((sum, pred) => sum + pred.residual * pred.residual, 0);
    const regressionSumSquares = totalSumSquares - residualSumSquares;
    
    const rSquared = totalSumSquares !== 0 ? regressionSumSquares / totalSumSquares : 0;
    const adjustedRSquared = 1 - ((1 - rSquared) * (n - 1)) / (n - 2);

    // Calculate standard error
    const meanSquaredError = residualSumSquares / (n - 2);
    const standardError = Math.sqrt(meanSquaredError);

    // Calculate F-statistic and p-value
    const fStatistic = (regressionSumSquares / 1) / (residualSumSquares / (n - 2));
    const pValue = fDistribution(fStatistic, 1, n - 2);

    // Calculate confidence intervals
    const xMean = sumX / n;
    const ssX = sumX2 - (sumX * sumX) / n;
    
    const slopeStandardError = standardError / Math.sqrt(ssX);
    const interceptStandardError = standardError * Math.sqrt(1/n + xMean * xMean / ssX);
    
    const tCritical = 2.0; // Approximate t-value for 95% CI with df > 30
    
    const confidenceInterval = {
      slope: {
        lower: slope - tCritical * slopeStandardError,
        upper: slope + tCritical * slopeStandardError
      },
      intercept: {
        lower: intercept - tCritical * interceptStandardError,
        upper: intercept + tCritical * interceptStandardError
      }
    };

    return {
      slope,
      intercept,
      rSquared,
      adjustedRSquared,
      standardError,
      fStatistic,
      pValue,
      sampleSize: n,
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
      predictions,
      confidenceInterval,
      generatedAt: new Date().toLocaleString()
    };
  };

  const fDistribution = (f: number, df1: number, df2: number): number => {
    // Simplified F-distribution p-value calculation
    if (f <= 0) return 1;
    if (df1 <= 0 || df2 <= 0) return 1;
    
    // Using approximation for F-distribution
    const logP = -0.5 * df1 * Math.log(1 + (f * df2) / df1);
    return Math.max(0.0001, Math.min(0.9999, Math.exp(logP)));
  };

  const predictY = (x: number, slope: number, intercept: number): number => {
    return slope * x + intercept;
  };

  const performRegression = () => {
    try {
      const data = parseInputData(inputData);
      
      if (data.length < 3) {
        alert('Please enter at least 3 valid data points');
        return;
      }

      const result = performLinearRegression(data);
      setCurrentResult(result);
      setGeneratedResults([result, ...generatedResults]);
    } catch (error) {
      alert('Error performing linear regression: ' + error);
    }
  };

  const makePrediction = () => {
    if (!currentResult || !xValue) {
      alert('Please perform regression and enter a value to predict');
      return;
    }

    const x = parseFloat(xValue);
    if (isNaN(x)) {
      alert('Please enter a valid numerical value');
      return;
    }

    const predictedY = predictY(x, currentResult.slope, currentResult.intercept);
    alert(`For x = ${x}, predicted y = ${predictedY.toFixed(4)}`);
  };

  const loadSampleData = () => {
    const sampleData = [
      [1, 2.1], [2, 3.9], [3, 6.2], [4, 7.8], [5, 10.1],
      [6, 12.3], [7, 13.9], [8, 16.2], [9, 17.8], [10, 20.1]
    ];
    setInputData(sampleData.map(point => `${point[0]}, ${point[1]}`).join('\\n'));
  };

  const exportResult = (result: RegressionResult) => {
    alert(`Exporting regression result`);
  };

  const formatNumber = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
  };

  const getRSquaredColor = (rSquared: number): string => {
    if (rSquared >= 0.8) return 'text-green-600';
    if (rSquared >= 0.6) return 'text-yellow-600';
    if (rSquared >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSignificanceBadge = (pValue: number): string => {
    if (pValue < 0.001) return 'Highly Significant';
    if (pValue < 0.01) return 'Very Significant';
    if (pValue < 0.05) return 'Significant';
    if (pValue < 0.1) return 'Marginally Significant';
    return 'Not Significant';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Simple Linear Regression</h1>
          <p className="text-purple-600">Perform linear regression analysis and make predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Linear Regression Analysis
              </CardTitle>
              <CardDescription>
                Enter paired data to perform linear regression analysis
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
                  placeholder="Enter paired data points (X Y):\\n1 2.1\\n2 3.9\\n3 6.2\\n4 7.8\\n5 10.1"
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

              {/* Prediction Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label>Prediction</Label>
                  <div className="flex gap-1">
                    <Button
                      variant={predictionMode === 'none' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => setPredictionMode('none')}
                    >
                      None
                    </Button>
                    <Button
                      variant={predictionMode === 'single' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPredictionMode('single')}
                    >
                      Single
                    </Button>
                  </div>
                </div>

                {predictionMode === 'single' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="xValue">X Value to Predict</Label>
                      <Input
                        id="xValue"
                        type="number"
                        value={xValue}
                        onChange={(e) => setXValue(e.target.value)}
                        placeholder="Enter X value"
                      />
                    </div>
                    <Button onClick={makePrediction} className="w-full">
                      Predict Y
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <p><strong>Format:</strong> X Y (one pair per line)</p>
                <p><strong>Requirements:</strong> At least 3 paired data points</p>
                <p><strong>Example:</strong></p>
                <pre className="bg-gray-100 p-2 rounded mt-1 text-xs">
1 2.1
2 3.9
3 6.2
4 7.8
5 10.1
                </pre>
              </div>

              <Button onClick={performRegression} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Perform Regression Analysis
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
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Regression Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Regression Equation */}
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-purple-600 text-sm mb-1">Regression Equation</div>
                      <div className="text-xl font-bold font-mono">{currentResult.equation}</div>
                    </div>

                    {/* Key Statistics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <div className="text-blue-600 text-sm">R²</div>
                        <div className={`text-xl font-bold ${getRSquaredColor(currentResult.rSquared)}`}>
                          {formatNumber(currentResult.rSquared)}
                        </div>
                        <div className="text-xs text-gray-500">R² = {formatNumber(currentResult.adjustedRSquared)} (adj)</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded text-center">
                        <div className="text-green-600 text-sm">Standard Error</div>
                        <div className="text-xl font-bold">{formatNumber(currentResult.standardError)}</div>
                        <div className="text-xs text-gray-500">n = {currentResult.sampleSize}</div>
                      </div>
                    </div>

                    {/* Significance Tests */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-3 rounded">
                        <div className="text-orange-600 text-sm">F-statistic</div>
                        <div className="font-bold text-lg">{formatNumber(currentResult.fStatistic)}</div>
                        <div className="text-xs text-gray-500">df = (1, {currentResult.sampleSize - 2})</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-red-600 text-sm">p-value</div>
                        <div className="font-bold text-lg">{formatNumber(currentResult.pValue)}</div>
                        <Badge variant="destructive" className="text-xs">
                          {getSignificanceBadge(currentResult.pValue)}
                        </Badge>
                      </div>
                    </div>

                    {/* Coefficients */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Coefficients</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-gray-600">Slope (β₁)</div>
                          <div className="font-bold">{formatNumber(currentResult.slope)}</div>
                          <div className="text-xs text-gray-500">
                            95% CI: [{formatNumber(currentResult.confidenceInterval.slope.lower)}, {formatNumber(currentResult.confidenceInterval.slope.upper)}]
                          </div>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <div className="text-gray-600">Intercept (β₀)</div>
                          <div className="font-bold">{formatNumber(currentResult.intercept)}</div>
                          <div className="text-xs text-gray-500">
                            95% CI: [{formatNumber(currentResult.confidenceInterval.intercept.lower)}, {formatNumber(currentResult.confidenceInterval.intercept.upper)}]
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Model Summary */}
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-semibold mb-2">Model Summary</h4>
                      <div className="text-sm space-y-1">
                        <div>Dependent variable: Y</div>
                        <div>Independent variable: X</div>
                        <div>Sample size: {currentResult.sampleSize}</div>
                        <div>Model explains {(currentResult.rSquared * 100).toFixed(1)}% of variance</div>
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
                    <FileText className="h-5 w-5 text-purple-600" />
                    Regression History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedResults.map((result, index) => (
                      <div key={result.generatedAt} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">Analysis #{generatedResults.length - index}</div>
                          <div className="text-sm text-purple-600">
                            R² = {formatNumber(result.rSquared)} • n = {result.sampleSize}
                          </div>
                          <div className="text-xs text-gray-500">{result.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{getSignificanceBadge(result.pValue)}</Badge>
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
                    <Calculator className="h-5 w-5 text-purple-600" />
                    About Linear Regression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">What is Simple Linear Regression?</h4>
                      <p className="text-gray-600">Simple linear regression models the relationship between two variables by fitting a linear equation to observed data.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Regression Equation:</h4>
                      <p className="text-gray-600">y = β₀ + β₁x + ε</p>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• y = dependent variable</li>
                        <li>• x = independent variable</li>
                        <li>• β₀ = intercept (y when x=0)</li>
                        <li>• β₁ = slope (change in y per unit x)</li>
                        <li>• ε = error term</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Key Statistics:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• <strong>R²:</strong> Proportion of variance explained</li>
                        <li>• <strong>F-statistic:</strong> Overall model significance</li>
                        <li>• <strong>p-value:</strong> Probability of observing results by chance</li>
                        <li>• <strong>Standard Error:</strong> Measure of prediction accuracy</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Assumptions:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• Linear relationship between variables</li>
                        <li>• Independence of observations</li>
                        <li>• Homoscedasticity (constant variance)</li>
                        <li>• Normality of residuals</li>
                      </ul>
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