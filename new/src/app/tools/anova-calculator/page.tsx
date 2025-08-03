'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, BarChart3, FileText, Plus, Trash2 } from 'lucide-react';

interface ANOVAResult {
  fValue: number;
  pValue: number;
  dfBetween: number;
  dfWithin: number;
  dfTotal: number;
  ssBetween: number;
  ssWithin: number;
  ssTotal: number;
  msBetween: number;
  msWithin: number;
  significant: boolean;
  alpha: number;
}

interface GroupData {
  name: string;
  values: number[];
  mean: number;
  variance: number;
  standardDeviation: number;
  n: number;
}

export default function ANOVAcalculator() {
  const [groups, setGroups] = useState<GroupData[]>([
    { name: 'Group 1', values: [5, 8, 7, 6, 9], mean: 0, variance: 0, standardDeviation: 0, n: 0 },
    { name: 'Group 2', values: [3, 5, 4, 6, 2], mean: 0, variance: 0, standardDeviation: 0, n: 0 },
    { name: 'Group 3', values: [8, 9, 7, 10, 8], mean: 0, variance: 0, standardDeviation: 0, n: 0 }
  ]);
  
  const [alpha, setAlpha] = useState<number>(0.05);
  const [result, setResult] = useState<ANOVAResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateGroupStats = (group: GroupData): GroupData => {
    const values = group.values.filter(v => !isNaN(v));
    const n = values.length;
    
    if (n === 0) {
      return { ...group, mean: 0, variance: 0, standardDeviation: 0, n: 0 };
    }

    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const standardDeviation = Math.sqrt(variance);

    return { ...group, mean, variance, standardDeviation, n };
  };

  const performANOVA = () => {
    const validGroups = groups.map(calculateGroupStats).filter(group => group.n > 0);
    
    if (validGroups.length < 2) {
      alert('Please provide data for at least 2 groups');
      return;
    }

    const totalN = validGroups.reduce((sum, group) => sum + group.n, 0);
    const grandMean = validGroups.reduce((sum, group) => sum + group.mean * group.n, 0) / totalN;

    // Calculate Sum of Squares
    const ssBetween = validGroups.reduce((sum, group) => 
      sum + group.n * Math.pow(group.mean - grandMean, 2), 0
    );
    
    const ssWithin = validGroups.reduce((sum, group) => 
      sum + (group.n - 1) * group.variance, 0
    );
    
    const ssTotal = ssBetween + ssWithin;

    // Calculate Degrees of Freedom
    const dfBetween = validGroups.length - 1;
    const dfWithin = totalN - validGroups.length;
    const dfTotal = totalN - 1;

    // Calculate Mean Squares
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;

    // Calculate F-statistic
    const fValue = msBetween / msWithin;

    // Calculate p-value (using approximation)
    const pValue = calculatePValue(fValue, dfBetween, dfWithin);

    const anovaResult: ANOVAResult = {
      fValue,
      pValue,
      dfBetween,
      dfWithin,
      dfTotal,
      ssBetween,
      ssWithin,
      ssTotal,
      msBetween,
      msWithin,
      significant: pValue < alpha,
      alpha
    };

    setResult(anovaResult);
    setShowResults(true);
  };

  const calculatePValue = (f: number, df1: number, df2: number): number => {
    // Simplified p-value calculation using F-distribution approximation
    // In a real implementation, you would use statistical libraries
    if (f <= 0) return 1;
    
    // Using approximation for demonstration
    const logP = -0.5 * df1 * Math.log(1 + (f * df2) / df1);
    return Math.max(0.0001, Math.min(0.9999, Math.exp(logP)));
  };

  const addGroup = () => {
    setGroups([...groups, { 
      name: `Group ${groups.length + 1}`, 
      values: [], 
      mean: 0, 
      variance: 0, 
      standardDeviation: 0, 
      n: 0 
    }]);
  };

  const removeGroup = (index: number) => {
    if (groups.length > 1) {
      setGroups(groups.filter((_, i) => i !== index));
    }
  };

  const updateGroupName = (index: number, name: string) => {
    const updatedGroups = [...groups];
    updatedGroups[index].name = name;
    setGroups(updatedGroups);
  };

  const updateGroupValue = (groupIndex: number, valueIndex: number, value: string) => {
    const updatedGroups = [...groups];
    const numValue = parseFloat(value) || 0;
    updatedGroups[groupIndex].values[valueIndex] = numValue;
    setGroups(updatedGroups);
  };

  const addValueToGroup = (groupIndex: number) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].values.push(0);
    setGroups(updatedGroups);
  };

  const removeValueFromGroup = (groupIndex: number, valueIndex: number) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].values.splice(valueIndex, 1);
    setGroups(updatedGroups);
  };

  const loadSampleData = () => {
    setGroups([
      { name: 'Control', values: [10, 12, 11, 9, 13], mean: 0, variance: 0, standardDeviation: 0, n: 0 },
      { name: 'Treatment A', values: [15, 17, 16, 14, 18], mean: 0, variance: 0, standardDeviation: 0, n: 0 },
      { name: 'Treatment B', values: [8, 10, 9, 11, 7], mean: 0, variance: 0, standardDeviation: 0, n: 0 }
    ]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">ANOVA Calculator</h1>
          <p className="text-green-600">Analysis of variance calculator for comparing multiple groups</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Input Data
              </CardTitle>
              <CardDescription>
                Enter data for each group to perform ANOVA analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Alpha Level */}
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

              {/* Groups */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Groups</Label>
                  <Button onClick={addGroup} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Group
                  </Button>
                </div>

                {groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Input
                          value={group.name}
                          onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                          className="w-24"
                          placeholder="Group name"
                        />
                        <Badge variant="secondary">
                          n = {group.values.filter(v => !isNaN(v)).length}
                        </Badge>
                      </div>
                      {groups.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeGroup(groupIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Values</Label>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => addValueToGroup(groupIndex)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2">
                        {group.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex gap-1">
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) => updateGroupValue(groupIndex, valueIndex, e.target.value)}
                              className="text-xs"
                              placeholder="0"
                            />
                            {group.values.length > 1 && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => removeValueFromGroup(groupIndex, valueIndex)}
                              >
                                ×
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={performANOVA} className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Calculate ANOVA
                </Button>
                <Button onClick={loadSampleData} variant="outline">
                  Load Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {showResults && result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    ANOVA Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary Statistics */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Summary Statistics</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">F-statistic</div>
                          <div className="font-bold text-lg">{result.fValue.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">p-value</div>
                          <div className="font-bold text-lg">{result.pValue.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Significance Level (α)</div>
                          <div className="font-bold">{result.alpha}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Result</div>
                          <Badge className={result.significant ? "bg-red-600" : "bg-green-600"}>
                            {result.significant ? "Significant" : "Not Significant"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* ANOVA Table */}
                    <div>
                      <h3 className="font-semibold mb-3">ANOVA Table</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border p-2 text-left">Source</th>
                              <th className="border p-2 text-right">SS</th>
                              <th className="border p-2 text-right">df</th>
                              <th className="border p-2 text-right">MS</th>
                              <th className="border p-2 text-right">F</th>
                              <th className="border p-2 text-right">p-value</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-2 font-medium">Between Groups</td>
                              <td className="border p-2 text-right">{result.ssBetween.toFixed(4)}</td>
                              <td className="border p-2 text-right">{result.dfBetween}</td>
                              <td className="border p-2 text-right">{result.msBetween.toFixed(4)}</td>
                              <td className="border p-2 text-right">{result.fValue.toFixed(4)}</td>
                              <td className="border p-2 text-right">{result.pValue.toFixed(4)}</td>
                            </tr>
                            <tr>
                              <td className="border p-2 font-medium">Within Groups</td>
                              <td className="border p-2 text-right">{result.ssWithin.toFixed(4)}</td>
                              <td className="border p-2 text-right">{result.dfWithin}</td>
                              <td className="border p-2 text-right">{result.msWithin.toFixed(4)}</td>
                              <td className="border p-2 text-right">-</td>
                              <td className="border p-2 text-right">-</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border p-2 font-bold">Total</td>
                              <td className="border p-2 text-right font-bold">{result.ssTotal.toFixed(4)}</td>
                              <td className="border p-2 text-right font-bold">{result.dfTotal}</td>
                              <td className="border p-2 text-right">-</td>
                              <td className="border p-2 text-right">-</td>
                              <td className="border p-2 text-right">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Interpretation */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Interpretation</h3>
                      <p className="text-sm text-blue-800">
                        {result.significant 
                          ? `The ANOVA results show a statistically significant difference between groups (F(${result.dfBetween}, ${result.dfWithin}) = ${result.fValue.toFixed(3)}, p = ${result.pValue.toFixed(4)} < ${result.alpha}). Post-hoc tests are recommended to identify which specific groups differ.`
                          : `The ANOVA results do not show a statistically significant difference between groups (F(${result.dfBetween}, ${result.dfWithin}) = ${result.fValue.toFixed(3)}, p = ${result.pValue.toFixed(4)} ≥ ${result.alpha}). We fail to reject the null hypothesis of equal means.`
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Group Statistics */}
            {groups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Group Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {groups.map((group, index) => {
                      const stats = calculateGroupStats(group);
                      return (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{group.name}</h4>
                            <Badge variant="secondary">n = {stats.n}</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <div className="text-gray-600">Mean</div>
                              <div className="font-medium">{stats.mean.toFixed(3)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">SD</div>
                              <div className="font-medium">{stats.standardDeviation.toFixed(3)}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Variance</div>
                              <div className="font-medium">{stats.variance.toFixed(3)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {!showResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-600" />
                    How to Use ANOVA Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">What is ANOVA?</h4>
                      <p className="text-gray-600">Analysis of Variance (ANOVA) is a statistical method used to test differences between two or more means.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Requirements:</h4>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• At least 2 groups with data</li>
                        <li>• Continuous dependent variable</li>
                        <li>• Independent groups</li>
                        <li>• Normally distributed data (approximately)</li>
                        <li>• Homogeneity of variances</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Interpretation:</h4>
                      <p className="text-gray-600">A significant p-value (p &lt; α) indicates that there are statistically significant differences between group means.</p>
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