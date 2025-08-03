'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export default function KgToPound() {
  const [kg, setKg] = useState('');
  const [pound, setPound] = useState('');
  const [ounce, setOunce] = useState('');

  const convertKgToPounds = () => {
    const k = parseFloat(kg);
    if (!isNaN(k)) {
      const p = k * 2.20462;
      const o = k * 35.274;
      setPound(p.toFixed(4));
      setOunce(o.toFixed(4));
    } else {
      setPound('');
      setOunce('');
    }
  };

  const convertPoundToKg = () => {
    const p = parseFloat(pound);
    if (!isNaN(p)) {
      const k = p / 2.20462;
      const o = p * 16;
      setKg(k.toFixed(4));
      setOunce(o.toFixed(4));
    } else {
      setKg('');
      setOunce('');
    }
  };

  const convertOunceToKg = () => {
    const o = parseFloat(ounce);
    if (!isNaN(o)) {
      const k = o / 35.274;
      const p = o / 16;
      setKg(k.toFixed(4));
      setPound(p.toFixed(4));
    } else {
      setKg('');
      setPound('');
    }
  };

  const clearAll = () => {
    setKg('');
    setPound('');
    setOunce('');
  };

  const quickConvert = (value: number) => {
    setKg(value.toString());
    setTimeout(() => {
      const p = value * 2.20462;
      const o = value * 35.274;
      setPound(p.toFixed(4));
      setOunce(o.toFixed(4));
    }, 100);
  };

  const getWeightCategory = (kgValue: number) => {
    if (kgValue < 18.5) return { category: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (kgValue < 25) return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (kgValue < 30) return { category: 'Overweight', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
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
                <h1 className="text-xl font-bold text-slate-900">KG to Pound</h1>
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
              <Scale className="h-6 w-6" />
              Weight Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert between kilograms, pounds, and ounces with precision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kilograms */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Kilograms (kg)</h3>
                  <Input
                    type="number"
                    value={kg}
                    onChange={(e) => setKg(e.target.value)}
                    placeholder="Enter weight in kg"
                    className="text-center text-lg"
                  />
                  <Button 
                    onClick={convertKgToPounds} 
                    disabled={!kg.trim()}
                    className="w-full mt-3"
                  >
                    Convert
                  </Button>
                </div>
              </div>

              {/* Pounds */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Pounds (lb)</h3>
                  <Input
                    type="number"
                    value={pound}
                    onChange={(e) => setPound(e.target.value)}
                    placeholder="Enter weight in lb"
                    className="text-center text-lg"
                  />
                  <Button 
                    onClick={convertPoundToKg} 
                    disabled={!pound.trim()}
                    className="w-full mt-3"
                  >
                    Convert
                  </Button>
                </div>
              </div>

              {/* Ounces */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Ounces (oz)</h3>
                  <Input
                    type="number"
                    value={ounce}
                    onChange={(e) => setOunce(e.target.value)}
                    placeholder="Enter weight in oz"
                    className="text-center text-lg"
                  />
                  <Button 
                    onClick={convertOunceToKg} 
                    disabled={!ounce.trim()}
                    className="w-full mt-3"
                  >
                    Convert
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {(kg || pound || ounce) && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-orange-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Conversion Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {kg && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Kilograms</div>
                      <div className="text-2xl font-bold text-blue-600">{kg} kg</div>
                      {parseFloat(kg) > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-slate-500">Weight Category</div>
                          <div className={`text-xs font-medium ${getWeightCategory(parseFloat(kg)).color}`}>
                            {getWeightCategory(parseFloat(kg)).category}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {pound && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Pounds</div>
                      <div className="text-2xl font-bold text-purple-600">{pound} lb</div>
                    </div>
                  )}
                  {ounce && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Ounces</div>
                      <div className="text-2xl font-bold text-orange-600">{ounce} oz</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Conversions */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Common Weight Conversions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(1)}
                >
                  1 kg = 2.205 lb
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(5)}
                >
                  5 kg = 11.023 lb
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(10)}
                >
                  10 kg = 22.046 lb
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(50)}
                >
                  50 kg = 110.231 lb
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(100)}
                >
                  100 kg = 220.462 lb
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(0.453592)}
                >
                  1 lb = 0.454 kg
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(2.20462)}
                >
                  2.205 lb = 1 kg
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(16)}
                >
                  16 oz = 1 lb
                </Button>
              </div>
            </div>

            {/* Conversion Formulas */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Conversion Formulas</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-blue-600 mb-1">Kilograms to Pounds</div>
                  <div className="text-slate-600">lb = kg × 2.20462</div>
                </div>
                <div>
                  <div className="font-medium text-purple-600 mb-1">Pounds to Kilograms</div>
                  <div className="text-slate-600">kg = lb ÷ 2.20462</div>
                </div>
                <div>
                  <div className="font-medium text-orange-600 mb-1">Ounces to Pounds</div>
                  <div className="text-slate-600">lb = oz ÷ 16</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                1 pound = 16 ounces | 1 kilogram = 35.274 ounces
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