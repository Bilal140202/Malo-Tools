'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Thermometer } from 'lucide-react';
import Link from 'next/link';

export default function CelsiusToFahrenheit() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  const convertCelsiusToFahrenheit = () => {
    const c = parseFloat(celsius);
    if (!isNaN(c)) {
      const f = (c * 9/5) + 32;
      setFahrenheit(f.toFixed(2));
    } else {
      setFahrenheit('');
    }
  };

  const convertFahrenheitToCelsius = () => {
    const f = parseFloat(fahrenheit);
    if (!isNaN(f)) {
      const c = (f - 32) * 5/9;
      setCelsius(c.toFixed(2));
    } else {
      setCelsius('');
    }
  };

  const clearAll = () => {
    setCelsius('');
    setFahrenheit('');
  };

  const quickConvert = (value: number) => {
    setCelsius(value.toString());
    setTimeout(() => {
      const f = (value * 9/5) + 32;
      setFahrenheit(f.toFixed(2));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Celsius to Fahrenheit</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-green-100 text-green-800">
                    converter
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Thermometer className="h-6 w-6" />
              Celsius to Fahrenheit Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert between Celsius and Fahrenheit temperature scales with precision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Celsius Input */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Celsius (°C)</h3>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      value={celsius}
                      onChange={(e) => setCelsius(e.target.value)}
                      placeholder="Enter Celsius temperature"
                      className="text-center text-lg"
                    />
                    <Button 
                      onClick={convertCelsiusToFahrenheit} 
                      disabled={!celsius.trim()}
                      className="w-full"
                    >
                      Convert to Fahrenheit
                    </Button>
                  </div>
                </div>

                {/* Quick Conversions */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Conversions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => quickConvert(0)}
                    >
                      0°C = 32°F
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => quickConvert(100)}
                    >
                      100°C = 212°F
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => quickConvert(37)}
                    >
                      37°C = 98.6°F
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => quickConvert(25)}
                    >
                      25°C = 77°F
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fahrenheit Input */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Fahrenheit (°F)</h3>
                  <div className="space-y-4">
                    <Input
                      type="number"
                      value={fahrenheit}
                      onChange={(e) => setFahrenheit(e.target.value)}
                      placeholder="Enter Fahrenheit temperature"
                      className="text-center text-lg"
                    />
                    <Button 
                      onClick={convertFahrenheitToCelsius} 
                      disabled={!fahrenheit.trim()}
                      className="w-full"
                    >
                      Convert to Celsius
                    </Button>
                  </div>
                </div>

                {/* Formula Display */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Conversion Formulas</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>°F = (°C × 9/5) + 32</div>
                    <div>°C = (°F - 32) × 5/9</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {(celsius || fahrenheit) && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Conversion Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {celsius && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Celsius</div>
                      <div className="text-2xl font-bold text-blue-600">{celsius}°C</div>
                    </div>
                  )}
                  {fahrenheit && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Fahrenheit</div>
                      <div className="text-2xl font-bold text-red-600">{fahrenheit}°F</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Temperature Reference */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Temperature Reference</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Freezing Point</div>
                  <div className="text-blue-700">0°C = 32°F</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">Room Temperature</div>
                  <div className="text-green-700">20-25°C = 68-77°F</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium text-red-900">Boiling Point</div>
                  <div className="text-red-700">100°C = 212°F</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button onClick={clearAll} variant="outline">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}