'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, RefreshCw, Calculator, AlertCircle } from 'lucide-react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function NormalDistributionPlotter() {
  const [mean, setMean] = useState<number>(0);
  const [stdDev, setStdDev] = useState<number>(1);
  const [sampleSize, setSampleSize] = useState<number>(1000);
  const [data, setData] = useState<{x: number, y: number}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate normal distribution data
  const generateNormalDistribution = () => {
    const newData = [];
    const step = 0.1;
    const range = 4 * stdDev; // 4 standard deviations
    
    for (let x = mean - range; x <= mean + range; x += step) {
      // Normal distribution formula: f(x) = (1/(σ√(2π))) * e^(-(x-μ)²/(2σ²))
      const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = coefficient * Math.exp(exponent);
      
      newData.push({ x, y });
    }
    
    return newData;
  };

  // Generate random samples from normal distribution
  const generateSamples = () => {
    const samples = [];
    for (let i = 0; i < sampleSize; i++) {
      // Box-Muller transform for generating normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const sample = mean + stdDev * z0;
      samples.push(sample);
    }
    return samples;
  };

  // Create histogram data from samples
  const createHistogramData = (samples: number[]) => {
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const binCount = Math.min(50, Math.max(10, Math.floor(Math.sqrt(samples.length))));
    const binWidth = (max - min) / binCount;
    
    const histogram = new Array(binCount).fill(0);
    const binEdges = [];
    
    for (let i = 0; i <= binCount; i++) {
      binEdges.push(min + i * binWidth);
    }
    
    samples.forEach(sample => {
      const binIndex = Math.min(Math.floor((sample - min) / binWidth), binCount - 1);
      histogram[binIndex]++;
    });
    
    // Normalize to probability density
    const total = samples.length;
    return histogram.map((count, index) => ({
      x: (binEdges[index] + binEdges[index + 1]) / 2, // bin center
      y: count / total / binWidth, // probability density
      count: count
    }));
  };

  const generateData = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate theoretical normal distribution
      const theoreticalData = generateNormalDistribution();
      
      // Generate samples and create histogram
      const samples = generateSamples();
      const histogramData = createHistogramData(samples);
      
      // Combine theoretical and histogram data
      const combinedData = theoreticalData.map((point, index) => ({
        x: point.x,
        theoretical: point.y,
        histogram: histogramData[index]?.y || 0,
        count: histogramData[index]?.count || 0
      }));
      
      setData(combinedData);
    } catch (err) {
      setError('Failed to generate distribution data');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadData = () => {
    if (data.length === 0) return;
    
    const csvContent = [
      'x,theoretical,histogram,count',
      ...data.map(point => 
        `${point.x.toFixed(4)},${point.theoretical.toFixed(6)},${point.histogram.toFixed(6)},${point.count}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `normal-distribution-${mean}-${stdDev}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    generateData();
  }, [mean, stdDev, sampleSize]);

  const calculateStatistics = () => {
    const samples = generateSamples();
    const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
    const variance = samples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / samples.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      sampleMean: mean,
      sampleStdDev: stdDev,
      min: Math.min(...samples),
      max: Math.max(...samples),
      range: Math.max(...samples) - Math.min(...samples)
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Normal Distribution Plotter
            </CardTitle>
            <CardDescription>
              Visualize normal distribution curves and generate statistical analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="mean">Mean (μ)</Label>
                <Input
                  id="mean"
                  type="number"
                  value={mean}
                  onChange={(e) => setMean(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="stddev">Standard Deviation (σ)</Label>
                <Input
                  id="stddev"
                  type="number"
                  value={stdDev}
                  onChange={(e) => setStdDev(Number(e.target.value))}
                  step="0.1"
                  min="0.1"
                />
              </div>
              <div>
                <Label htmlFor="samples">Sample Size</Label>
                <Input
                  id="samples"
                  type="number"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  min="100"
                  max="10000"
                  step="100"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-3">
              <Button
                onClick={generateData}
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
                    Generate Distribution
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
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-3">Sample Statistics:</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className="font-medium">Sample Mean:</span>
                  <div className="text-blue-600">{stats.sampleMean.toFixed(4)}</div>
                </div>
                <div>
                  <span className="font-medium">Sample Std Dev:</span>
                  <div className="text-blue-600">{stats.sampleStdDev.toFixed(4)}</div>
                </div>
                <div>
                  <span className="font-medium">Min:</span>
                  <div className="text-green-600">{stats.min.toFixed(4)}</div>
                </div>
                <div>
                  <span className="font-medium">Max:</span>
                  <div className="text-green-600">{stats.max.toFixed(4)}</div>
                </div>
                <div>
                  <span className="font-medium">Range:</span>
                  <div className="text-purple-600">{stats.range.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            {data.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-slate-900">Distribution Visualization:</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Theoretical Curve */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Theoretical Normal Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="x" 
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickCount={10}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => [value.toFixed(6), 'Probability Density']}
                            labelFormatter={(label) => `x: ${label.toFixed(3)}`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="theoretical" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.3}
                            name="Theoretical"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Histogram */}
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Sample Histogram</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="x" 
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            tickCount={10}
                          />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number, name: string) => [
                              name === 'count' ? value : value.toFixed(6), 
                              name === 'count' ? 'Count' : 'Probability Density'
                            ]}
                            labelFormatter={(label) => `x: ${label.toFixed(3)}`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="histogram" 
                            stroke="#10b981" 
                            fill="#10b981" 
                            fillOpacity={0.5}
                            name="Histogram"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Combined Chart */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Combined View</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <Line data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="x" 
                          type="number"
                          domain={['dataMin', 'dataMax']}
                          tickCount={10}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            value.toFixed(6), 
                            name === 'theoretical' ? 'Theoretical' : 'Histogram'
                          ]}
                          labelFormatter={(label) => `x: ${label.toFixed(3)}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="theoretical" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                          name="Theoretical"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="histogram" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={false}
                          name="Histogram"
                        />
                      </Line>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">About Normal Distribution:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Also known as Gaussian distribution or bell curve</li>
                <li>• Defined by mean (μ) and standard deviation (σ)</li>
                <li>• 68% of data falls within 1σ of the mean</li>
                <li>• 95% of data falls within 2σ of the mean</li>
                <li>• 99.7% of data falls within 3σ of the mean</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}