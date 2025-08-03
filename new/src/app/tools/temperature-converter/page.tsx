'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const [kelvin, setKelvin] = useState('');

  const convertFromCelsius = () => {
    const c = parseFloat(celsius);
    if (!isNaN(c)) {
      const f = (c * 9/5) + 32;
      const k = c + 273.15;
      setFahrenheit(f.toFixed(2));
      setKelvin(k.toFixed(2));
    } else {
      setFahrenheit('');
      setKelvin('');
    }
  };

  const convertFromFahrenheit = () => {
    const f = parseFloat(fahrenheit);
    if (!isNaN(f)) {
      const c = (f - 32) * 5/9;
      const k = (f - 32) * 5/9 + 273.15;
      setCelsius(c.toFixed(2));
      setKelvin(k.toFixed(2));
    } else {
      setCelsius('');
      setKelvin('');
    }
  };

  const convertFromKelvin = () => {
    const k = parseFloat(kelvin);
    if (!isNaN(k)) {
      const c = k - 273.15;
      const f = (k - 273.15) * 9/5 + 32;
      setCelsius(c.toFixed(2));
      setFahrenheit(f.toFixed(2));
    } else {
      setCelsius('');
      setFahrenheit('');
    }
  };

  const clearAll = () => {
    setCelsius('');
    setFahrenheit('');
    setKelvin('');
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
                <h1 className="text-xl font-bold text-slate-900">Temperature Converter</h1>
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
            <CardTitle className="text-2xl text-center">Temperature Converter</CardTitle>
            <CardDescription className="text-base text-center">
              Convert between Celsius, Fahrenheit, and Kelvin temperature scales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Celsius */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Celsius (°C)
                  </label>
                  <Input
                    type="number"
                    value={celsius}
                    onChange={(e) => setCelsius(e.target.value)}
                    placeholder="Enter temperature"
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={convertFromCelsius} 
                  disabled={!celsius.trim()}
                  className="w-full"
                >
                  Convert from Celsius
                </Button>
              </div>

              {/* Fahrenheit */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fahrenheit (°F)
                  </label>
                  <Input
                    type="number"
                    value={fahrenheit}
                    onChange={(e) => setFahrenheit(e.target.value)}
                    placeholder="Enter temperature"
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={convertFromFahrenheit} 
                  disabled={!fahrenheit.trim()}
                  className="w-full"
                >
                  Convert from Fahrenheit
                </Button>
              </div>

              {/* Kelvin */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kelvin (K)
                  </label>
                  <Input
                    type="number"
                    value={kelvin}
                    onChange={(e) => setKelvin(e.target.value)}
                    placeholder="Enter temperature"
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={convertFromKelvin} 
                  disabled={!kelvin.trim()}
                  className="w-full"
                >
                  Convert from Kelvin
                </Button>
              </div>
            </div>

            {/* Results */}
            {(celsius || fahrenheit || kelvin) && (
              <div className="mt-8 p-6 bg-slate-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  {celsius && (
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Celsius</div>
                      <div className="text-xl font-bold text-blue-600">{celsius}°C</div>
                    </div>
                  )}
                  {fahrenheit && (
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Fahrenheit</div>
                      <div className="text-xl font-bold text-red-600">{fahrenheit}°F</div>
                    </div>
                  )}
                  {kelvin && (
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Kelvin</div>
                      <div className="text-xl font-bold text-green-600">{kelvin}K</div>
                    </div>
                  )}
                </div>
              </div>
            )}

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