'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ReferenceLine } from 'recharts';
import { Calculator, TrendingUp, TrendingDown, RefreshCw, Download, AlertCircle } from 'lucide-react';

export default function ResidualPlotVisualizer() {
  const [data, setData] = useState<{x: number, y: number, predicted: number, residual: number}[]>([]);
  const [slope, setSlope] = useState<number>(2);
  const [intercept, setIntercept] = useState<number>(1);
  const [noiseLevel, setNoiseLevel] = useState<number>(5);
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate sample data with linear relationship + noise
  const generateData = () => {
    const newData = [];
    for (let i = 0; i < sampleSize; i++) {
      const x = Math.random() * 20 - 10; // x from -10 to 10
      const trueY = slope * x + intercept;
      const noise = (Math.random() - 0.5) * noiseLevel;
      const y = trueY + noise;
      const predicted = slope * x + intercept;
      const residual = y - predicted;
      
      newData.push({ x, y, predicted, residual });
    }
    return newData;
  };

  const generateNewData = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newData = generateData();
      setData(newData);
    } catch (err) {
      setError('Failed to generate data');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadData = () => {
    if (data.length === 0) return;
    
    const csvContent = [
      'x,y,predicted,residual',
      ...data.map(point => 
        `${point.x.toFixed(4)},${point.y.toFixed(4)},${point.predicted.toFixed(4)},${point.residual.toFixed(4)}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `residual-plot-${slope}-${intercept}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateStatistics = () => {
    if (data.length === 0) return null;

    const residuals = data.map(d => d.residual);
    const meanResidual = residuals.reduce((sum, r) => sum + r, 0) / residuals.length;
    const sumOfSquares = residuals.reduce((sum, r) => sum + r * r, 0);
    const mse = sumOfSquares / residuals.length;
    const rmse = Math.sqrt(mse);
    
    const positiveResiduals = residuals.filter(r => r > 0).length;
    const negativeResiduals = residuals.filter(r => r < 0).length;
    const zeroResiduals = residuals.filter(r => Math.abs(r) < 0.001).length;

    return {
      meanResidual,
      mse,
      rmse,
      positiveCount: positiveResiduals,
      negativeCount: negativeResiduals,
      zeroCount: zeroResiduals,
      rSquared: 1 - (sumOfSquares / residuals.reduce((sum, r) => sum + r * r, 0))
    };
  };

  const stats = calculateStatistics();

  useEffect(() => {
    generateNewData();
  }, [slope, intercept, noiseLevel, sampleSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Residual Plot Visualizer
            </CardTitle>
            <CardDescription>
              Visualize residuals from linear regression analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="slope">Slope (m)</Label>
                <Input
                  id="slope"
                  type="number"
                  value={slope}
                  onChange={(e) => setSlope(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="intercept">Intercept (b)</Label>
                <Input
                  id="intercept"
                  type="number"
                  value={intercept}
                  onChange={(e) => setIntercept(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="noise">Noise Level</Label>
                <Input
                  id="noise"
                  type="number"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(Number(e.target.value))}
                  step="0.5"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="samples">Sample Size</Label>
                <Input
                  id="samples"
                  type="number"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  min="10"
                  max="200"
                  step="10"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-3">
              <Button
                onClick={generateNewData}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate New Data
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={downloadData}
                disabled={data.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              </div>
            )}

            {/* Statistics */}
            {stats && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-3">Residual Statistics:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Mean Residual:</span>
                    <div className={`text-lg font-bold ${Math.abs(stats.meanResidual) < 0.1 ? 'text-green-600' : 'text-orange-600'}`}>
                      {stats.meanResidual.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">RMSE:</span>
                    <div className="text-blue-600 font-bold">{stats.rmse.toFixed(4)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Positive Residuals:</span>
                    <div className="text-green-600 font-bold">{stats.positiveCount}</div>
                  </div>
                  <div>
                    <span className="font-medium">Negative Residuals:</span>
                    <div className="text-red-600 font-bold">{stats.negativeCount}</div>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={stats.meanResidual > 0 ? "destructive" : "default"}>
                    Mean {stats.meanResidual > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {stats.meanResidual > 0 ? 'Positive Bias' : 'Negative Bias'}
                  </Badge>
                  <Badge variant={stats.rmse < noiseLevel / 2 ? "default" : "secondary"}>
                    RMSE: {stats.rmse.toFixed(2)}
                  </Badge>
                </div>
              </div>
            )}

            {/* Residual Plot */}
            {data.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Residual Plot:</h3>
                
                <div className="bg-white p-4 rounded-lg border">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="x" 
                          type="number"
                          domain={['dataMin', 'dataMax']}
                          tickCount={10}
                        />
                        <YAxis 
                          dataKey="residual"
                          domain={['auto', 'auto']}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            value.toFixed(4), 
                            name === 'residual' ? 'Residual' : 'X Value'
                          ]}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `X: ${payload[0].payload.x.toFixed(3)}, Y: ${payload[0].payload.y.toFixed(3)}`;
                            }
                            return '';
                          }}
                        />
                        <Scatter 
                          dataKey="residual" 
                          fill="#3b82f6"
                          name="Residuals"
                        />
                        <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                        <ReferenceLine y={stats?.meanResidual || 0} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Interpretation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Plot Interpretation:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Points scattered randomly around zero line indicate good model fit</li>
                    <li>• Patterns in residuals suggest model misspecification</li>
                    <li>• Funnel shape indicates heteroscedasticity (non-constant variance)</li>
                    <li>• Systematic patterns suggest omitted variables or wrong functional form</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Model Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Current Model:</h3>
              <div className="text-lg font-mono text-green-800 mb-2">
                y = {slope}x + {intercept} + ε
              </div>
              <div className="text-sm text-green-700">
                Where ε represents random noise with standard deviation of {noiseLevel}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}