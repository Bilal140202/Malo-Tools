'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function KmToMiles() {
  const [km, setKm] = useState('');
  const [miles, setMiles] = useState('');
  const [meters, setMeters] = useState('');
  const [feet, setFeet] = useState('');

  const convertKmToMiles = () => {
    const k = parseFloat(km);
    if (!isNaN(k)) {
      const m = k * 0.621371;
      const me = k * 1000;
      const f = k * 3280.84;
      setMiles(m.toFixed(6));
      setMeters(me.toFixed(2));
      setFeet(f.toFixed(2));
    } else {
      setMiles('');
      setMeters('');
      setFeet('');
    }
  };

  const convertMilesToKm = () => {
    const m = parseFloat(miles);
    if (!isNaN(m)) {
      const k = m / 0.621371;
      const me = k * 1000;
      const f = k * 3280.84;
      setKm(k.toFixed(6));
      setMeters(me.toFixed(2));
      setFeet(f.toFixed(2));
    } else {
      setKm('');
      setMeters('');
      setFeet('');
    }
  };

  const clearAll = () => {
    setKm('');
    setMiles('');
    setMeters('');
    setFeet('');
  };

  const quickConvert = (value: number) => {
    setKm(value.toString());
    setTimeout(() => {
      const m = value * 0.621371;
      const me = value * 1000;
      const f = value * 3280.84;
      setMiles(m.toFixed(6));
      setMeters(me.toFixed(2));
      setFeet(f.toFixed(2));
    }, 100);
  };

  const getRunningPace = (kmValue: number, timeMinutes: number) => {
    if (!kmValue || kmValue <= 0) return '';
    const pacePerKm = timeMinutes / kmValue;
    const minutes = Math.floor(pacePerKm);
    const seconds = Math.round((pacePerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
  };

  const getDrivingTime = (kmValue: number) => {
    if (!kmValue || kmValue <= 0) return '';
    // Assuming average city speed of 40 km/h
    const hours = kmValue / 40;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    }
    return `${m}m`;
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
                <h1 className="text-xl font-bold text-slate-900">KM to Miles</h1>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <MapPin className="h-6 w-6" />
              Distance Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert between kilometers, miles, meters, and feet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Kilometers */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">Kilometers (km)</h3>
                  <Input
                    type="number"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    placeholder="Enter distance"
                    className="text-center text-lg"
                  />
                  <Button 
                    onClick={convertKmToMiles} 
                    disabled={!km.trim()}
                    className="w-full mt-3"
                  >
                    Convert
                  </Button>
                </div>
              </div>

              {/* Miles */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-purple-600 mb-2">Miles (mi)</h3>
                  <Input
                    type="number"
                    value={miles}
                    onChange={(e) => setMiles(e.target.value)}
                    placeholder="Enter distance"
                    className="text-center text-lg"
                  />
                  <Button 
                    onClick={convertMilesToKm} 
                    disabled={!miles.trim()}
                    className="w-full mt-3"
                  >
                    Convert
                  </Button>
                </div>
              </div>

              {/* Meters */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-600 mb-2">Meters (m)</h3>
                  <Input
                    type="number"
                    value={meters}
                    onChange={(e) => setMeters(e.target.value)}
                    placeholder="Enter distance"
                    className="text-center text-lg"
                    readOnly
                  />
                </div>
              </div>

              {/* Feet */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">Feet (ft)</h3>
                  <Input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    placeholder="Enter distance"
                    className="text-center text-lg"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Results Display */}
            {(km || miles || meters || feet) && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Conversion Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {km && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Kilometers</div>
                      <div className="text-xl font-bold text-blue-600">{km} km</div>
                      {parseFloat(km) > 0 && (
                        <div className="mt-2 text-xs text-slate-500">
                          {getDrivingTime(parseFloat(km))} driving time
                        </div>
                      )}
                    </div>
                  )}
                  {miles && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Miles</div>
                      <div className="text-xl font-bold text-purple-600">{miles} mi</div>
                    </div>
                  )}
                  {meters && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Meters</div>
                      <div className="text-xl font-bold text-green-600">{meters} m</div>
                    </div>
                  )}
                  {feet && (
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-sm text-slate-600">Feet</div>
                      <div className="text-xl font-bold text-orange-600">{feet} ft</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Conversions */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Common Distance Conversions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(1)}
                >
                  1 km = 0.621 mi
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(5)}
                >
                  5 km = 3.107 mi
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(10)}
                >
                  10 km = 6.214 mi
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(42.195)}
                >
                  Marathon = 26.2 mi
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(0.621371)}
                >
                  1 mi = 1.609 km
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(1.60934)}
                >
                  1 mi = 1,609 m
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(3.28084)}
                >
                  1 m = 3.281 ft
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => quickConvert(5280)}
                >
                  1 mi = 5,280 ft
                </Button>
              </div>
            </div>

            {/* Running Reference */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Running Distances</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">5K</div>
                    <div className="text-sm text-blue-800">3.1 miles</div>
                    <div className="text-xs text-blue-600 mt-1">Popular beginner race</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">10K</div>
                    <div className="text-sm text-purple-800">6.2 miles</div>
                    <div className="text-xs text-purple-600 mt-1">Common distance goal</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">Half Marathon</div>
                    <div className="text-lg font-semibold text-green-700">21.0975 miles</div>
                    <div className="text-xs text-green-600 mt-1">21.1 km / 13.1 miles</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Conversion Formulas */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-lg font-semibold text-slate-900 mb-3">Conversion Formulas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-blue-600 mb-1">Kilometers to Miles</div>
                  <div className="text-slate-600">mi = km × 0.621371</div>
                </div>
                <div>
                  <div className="font-medium text-purple-600 mb-1">Miles to Kilometers</div>
                  <div className="text-slate-600">km = mi ÷ 0.621371</div>
                </div>
                <div>
                  <div className="font-medium text-green-600 mb-1">Kilometers to Meters</div>
                  <div className="text-slate-600">m = km × 1,000</div>
                </div>
                <div>
                  <div className="font-medium text-orange-600 mb-1">Kilometers to Feet</div>
                  <div className="text-slate-600">ft = km × 3,280.84</div>
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