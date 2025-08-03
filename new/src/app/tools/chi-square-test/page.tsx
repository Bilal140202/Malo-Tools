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

interface ChiSquareResult {
  chiSquare: number;
  degreesOfFreedom: number;
  pValue: number;
  criticalValue: number;
  significance: number;
  isSignificant: boolean;
  expectedFrequencies: number[][];
  residuals: number[][];
  testType: 'goodness-of-fit' | 'independence' | 'homogeneity';
}

interface ContingencyTable {
  rows: string[];
  columns: string[];
  observed: number[][];
  expected: number[][];
}

export default function ChiSquareTest() {
  const [testType, setTestType] = useState<'goodness-of-fit' | 'independence' | 'homogeneity'>('goodness-of-fit');
  const [inputData, setInputData] = useState('');
  const [alpha, setAlpha] = useState(0.05);
  const [categories, setCategories] = useState<string[]>([]);
  const [observedFrequencies, setObservedFrequencies] = useState<number[]>([]);
  const [result, setResult] = useState<ChiSquareResult | null>(null);
  const [generatedTests, setGeneratedTests] = useState<ChiSquareResult[]>([]);

  const parseGoodnessOfFitData = (data: string): { categories: string[]; frequencies: number[] } => {
    const lines = data.split('\\n').filter(line => line.trim());
    const categories: string[] = [];
    const frequencies: number[] = [];

    lines.forEach(line => {
      const parts = line.split(/[\\s,;]+/).filter(p => p.trim());
      if (parts.length >= 2) {
        categories.push(parts[0]);
        const freq = parseFloat(parts[1]);
        if (!isNaN(freq)) {
          frequencies.push(freq);
        }
      }
    });

    return { categories, frequencies };
  };

  const parseContingencyTable = (data: string): { rows: string[]; columns: string[]; table: number[][] } => {
    const lines = data.split('\\n').filter(line => line.trim());
    const table: number[][] = [];
    const rows: string[] = [];
    const columns: string[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(/[\\s,;]+/).filter(p => p.trim());
      
      if (index === 0) {
        // First row contains column headers
        columns.push(...parts.slice(1));
      } else {
        // Subsequent rows contain row label and data
        rows.push(parts[0]);
        const rowValues = parts.slice(1).map(val => parseFloat(val)).filter(val => !isNaN(val));
        table.push(rowValues);
      }
    });

    return { rows, columns, table };
  };

  const calculateGoodnessOfFit = (observed: number[], expected: number[]): ChiSquareResult => {
    const chiSquare = observed.reduce((sum, obs, i) => {
      const exp = expected[i] || 0;
      return sum + Math.pow(obs - exp, 2) / exp;
    }, 0);

    const degreesOfFreedom = observed.length - 1;
    const pValue = calculatePValue(chiSquare, degreesOfFreedom);
    const criticalValue = getCriticalValue(degreesOfFreedom, alpha);
    const isSignificant = chiSquare > criticalValue;

    return {
      chiSquare,
      degreesOfFreedom,
      pValue,
      criticalValue,
      significance: alpha,
      isSignificant,
      expectedFrequencies: [expected],
      residuals: observed.map((obs, i) => [(obs - expected[i]) / Math.sqrt(expected[i])]),
      testType: 'goodness-of-fit'
    };
  };

  const calculateIndependenceTest = (observed: number[][]): ChiSquareResult => {
    const rows = observed.length;
    const cols = observed[0]?.length || 0;
    
    // Calculate row and column totals
    const rowTotals = observed.map(row => row.reduce((sum, val) => sum + val, 0));
    const colTotals = Array(cols).fill(0);
    observed.forEach(row => {
      row.forEach((val, i) => {
        colTotals[i] += val;
      });
    });
    
    const total = rowTotals.reduce((sum, val) => sum + val, 0);
    
    // Calculate expected frequencies
    const expected: number[][] = [];
    const residuals: number[][] = [];
    
    for (let i = 0; i < rows; i++) {
      expected[i] = [];
      residuals[i] = [];
      for (let j = 0; j < cols; j++) {
        const expectedVal = (rowTotals[i] * colTotals[j]) / total;
        expected[i][j] = expectedVal;
        residuals[i][j] = (observed[i][j] - expectedVal) / Math.sqrt(expectedVal);
      }
    }
    
    // Calculate chi-square
    let chiSquare = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const expectedVal = expected[i][j];
        if (expectedVal > 0) {
          chiSquare += Math.pow(observed[i][j] - expectedVal, 2) / expectedVal;
        }
      }
    }
    
    const degreesOfFreedom = (rows - 1) * (cols - 1);
    const pValue = calculatePValue(chiSquare, degreesOfFreedom);
    const criticalValue = getCriticalValue(degreesOfFreedom, alpha);
    const isSignificant = chiSquare > criticalValue;
    
    return {
      chiSquare,
      degreesOfFreedom,
      pValue,
      criticalValue,
      significance: alpha,
      isSignificant,
      expectedFrequencies: expected,
      residuals,
      testType: 'independence'
    };
  };

  const calculatePValue = (chiSquare: number, df: number): number => {
    // Simplified p-value calculation using approximation
    if (chiSquare <= 0) return 1;
    if (df <= 0) return 1;
    
    // Using Wilson-Hilferty approximation for chi-square
    const z = Math.pow(chiSquare / df, 1/3) * (1 - 2/(9*df)) - 1;
    const pValue = 0.5 * (1 - erf(z / Math.sqrt(2)));
    
    return Math.max(0.0001, Math.min(0.9999, pValue));
  };

  const erf = (x: number): number => {
    // Approximation of error function
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  };

  const getCriticalValue = (df: number, alpha: number): number => {
    // Approximate critical values for common alpha levels
    const criticalValues: { [key: string]: number } = {
      '1': 6.635,
      '2': 9.210,
      '3': 11.345,
      '4': 13.277,
      '5': 15.086,
      '6': 16.812,
      '7': 18.475,
      '8': 20.090,
      '9': 21.666,
      '10': 23.209,
      '11': 24.725,
      '12': 26.217,
      '13': 27.688,
      '14': 29.141,
      '15': 30.578,
      '20': 28.412,
      '25': 34.382,
      '30': 40.256,
      '40': 51.805,
      '50': 67.505
    };
    
    return criticalValues[df.toString()] || df; // Fallback to df for large df
  };

  const performChiSquareTest = () => {
    try {
      if (testType === 'goodness-of-fit') {
        const { categories, frequencies } = parseGoodnessOfFitData(inputData);
        
        if (categories.length === 0 || frequencies.length === 0) {
          alert('Please enter valid goodness-of-fit data');
          return;
        }
        
        // For goodness-of-fit, we assume equal expected frequencies
        const expected = frequencies.map(() => frequencies.reduce((a, b) => a + b, 0) / frequencies.length);
        
        const result = calculateGoodnessOfFit(frequencies, expected);
        setResult(result);
        setGeneratedTests([result, ...generatedTests]);
        
      } else if (testType === 'independence' || testType === 'homogeneity') {
        const { table } = parseContingencyTable(inputData);
        
        if (table.length === 0 || table[0]?.length === 0) {
          alert('Please enter valid contingency table data');
          return;
        }
        
        const result = calculateIndependenceTest(table);
        setResult(result);
        setGeneratedTests([result, ...generatedTests]);
      }
    } catch (error) {
      alert('Error performing chi-square test: ' + error);
    }
  };

  const loadSampleData = () => {
    if (testType === 'goodness-of-fit') {
      setInputData('Red 45\\nBlue 30\\nGreen 25\\nYellow 50\\nPurple 30');
    } else {
      setInputData('Male Female\\nSmoker 20 15\\nNon-smoker 30 35');
    }
  };

  const exportResult = (testResult: ChiSquareResult) => {
    alert(`Exporting chi-square test result`);
  };

  const formatNumber = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Chi-Square Test</h1>
          <p className="text-purple-600">Perform chi-square tests for goodness-of-fit and independence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Chi-Square Test
              </CardTitle>
              <CardDescription>
                Perform chi-square statistical tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Test Type Selection */}
              <div>
                <Label htmlFor="testType">Test Type</Label>
                <Select value={testType} onValueChange={(value: any) => setTestType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goodness-of-fit">Goodness-of-Fit Test</SelectItem>
                    <SelectItem value="independence">Test of Independence</SelectItem>
                    <SelectItem value="homogeneity">Test of Homogeneity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Significance Level */}
              <div>
                <Label htmlFor="alpha">Significance Level (α)</Label>
                <Select value={alpha.toString()} onValueChange={(value) => setAlpha(parseFloat(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.01">0.01 (1%)</SelectItem>
                    <SelectItem value="0.05">0.05 (5%)</SelectItem>
                    <SelectItem value="0.10">0.10 (10%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Input */}
              <div>
                <Label htmlFor="inputData">
                  {testType === 'goodness-of-fit' ? 'Category and Frequency Data' : 'Contingency Table Data'}
                </Label>
                <Textarea
                  id="inputData"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  placeholder={
                    testType === 'goodness-of-fit' 
                      ? 'Enter category and frequency data:\\nRed 45\\nBlue 30\\nGreen 25'
                      : 'Enter contingency table data:\\nMale Female\\nSmoker 20 15\\nNon-smoker 30 35'
                  }
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

              {/* Input Format Instructions */}
              <div className="bg-purple-50 p-3 rounded text-sm">
                {testType === 'goodness-of-fit' ? (
                  <div>
                    <p><strong>Format:</strong> Category Frequency</p>
                    <p><strong>Example:</strong></p>
                    <pre className="text-xs bg-white p-2 rounded mt-1">
Red 45
Blue 30
Green 25
Yellow 50
Purple 30
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p><strong>Format:</strong> RowLabel Col1 Col2 Col3...</p>
                    <p><strong>Example:</strong></p>
                    <pre className="text-xs bg-white p-2 rounded mt-1">
Male Female
Smoker 20 15
Non-smoker 30 35
                    </pre>
                  </div>
                )}
              </div>

              <Button onClick={performChiSquareTest} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Perform Chi-Square Test
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {/* Current Result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Chi-Square Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Test Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 p-3 rounded text-center">
                        <div className="text-purple-600 text-sm">Chi-Square Statistic</div>
                        <div className="text-xl font-bold">{formatNumber(result.chiSquare)}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <div className="text-blue-600 text-sm">Degrees of Freedom</div>
                        <div className="text-xl font-bold">{result.degreesOfFreedom}</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded text-center">
                        <div className="text-green-600 text-sm">p-value</div>
                        <div className="text-xl font-bold">{formatNumber(result.pValue)}</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded text-center">
                        <div className="text-orange-600 text-sm">Critical Value</div>
                        <div className="text-xl font-bold">{formatNumber(result.criticalValue)}</div>
                      </div>
                    </div>

                    {/* Result Interpretation */}
                    <div className={`p-4 rounded-lg ${result.isSignificant ? 'bg-red-50' : 'bg-green-50'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full ${result.isSignificant ? 'bg-red-600' : 'bg-green-600'}`}></div>
                        <span className="font-semibold">
                          {result.isSignificant ? 'Statistically Significant' : 'Not Statistically Significant'}
                        </span>
                      </div>
                      <p className="text-sm">
                        {result.isSignificant 
                          ? `Chi-square = ${formatNumber(result.chiSquare)}, df = ${result.degreesOfFreedom}, p = ${formatNumber(result.pValue)} < ${result.significance}. Reject the null hypothesis.`
                          : `Chi-square = ${formatNumber(result.chiSquare)}, df = ${result.degreesOfFreedom}, p = ${formatNumber(result.pValue)} ≥ ${result.significance}. Fail to reject the null hypothesis.`
                        }
                      </p>
                    </div>

                    {/* Expected Frequencies Table */}
                    <div>
                      <h4 className="font-semibold mb-2">Expected Frequencies</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border p-2 text-left">Category</th>
                              {result.testType === 'goodness-of-fit' ? (
                                <th className="border p-2 text-right">Expected</th>
                              ) : (
                                result.expectedFrequencies[0]?.map((_, colIndex) => (
                                  <th key={colIndex} className="border p-2 text-center">Col {colIndex + 1}</th>
                                ))
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {result.testType === 'goodness-of-fit' ? (
                              <tr>
                                <td className="border p-2">Total</td>
                                <td className="border p-2 text-right">{formatNumber(result.expectedFrequencies[0]?.[0] || 0)}</td>
                              </tr>
                            ) : (
                              result.expectedFrequencies.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  <td className="border p-2 font-medium">Row {rowIndex + 1}</td>
                                  {row.map((expected, colIndex) => (
                                    <td key={colIndex} className="border p-2 text-center">
                                      {formatNumber(expected)}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => exportResult(result)} className="flex-1">
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

            {/* Generated Tests */}
            {generatedTests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Test History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedTests.map((test, index) => (
                      <div key={test.generatedAt || index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">{test.testType.replace('-', ' ').toUpperCase()}</div>
                          <div className="text-sm text-purple-600">
                            χ² = {formatNumber(test.chiSquare)}, df = {test.degreesOfFreedom}
                          </div>
                          <div className="text-xs text-gray-500">
                            p = {formatNumber(test.pValue)} • {test.isSignificant ? 'Significant' : 'Not significant'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={test.isSignificant ? "destructive" : "secondary"}>
                            {test.isSignificant ? 'Significant' : 'Not Significant'}
                          </Badge>
                          <Button size="sm" onClick={() => exportResult(test)}>
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
            {!result && generatedTests.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    About Chi-Square Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">Goodness-of-Fit Test</h4>
                      <p className="text-gray-600">Tests whether observed frequencies match expected frequencies for categorical data.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Test of Independence</h4>
                      <p className="text-gray-600">Tests whether two categorical variables are independent of each other.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Assumptions:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• Random sampling</li>
                        <li>• Expected frequencies ≥ 5</li>
                        <li>• Independent observations</li>
                        <li>• Categorical variables</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Interpretation:</h4>
                      <p className="text-gray-600">A significant p-value (p &lt; α) suggests that the observed differences are unlikely due to chance.</p>
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