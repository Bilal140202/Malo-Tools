'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, SwapHorizontal } from 'lucide-react';
import Link from 'next/link';

type UnitType = 'length' | 'weight' | 'volume' | 'temperature' | 'area' | 'speed';

interface UnitSystem {
  [key: string]: number;
}

const unitConversions: Record<UnitType, { [key: string]: UnitSystem }> = {
  length: {
    meter: { meter: 1, kilometer: 0.001, mile: 0.000621371, yard: 1.09361, foot: 3.28084, inch: 39.3701 },
    kilometer: { meter: 1000, kilometer: 1, mile: 0.621371, yard: 1093.61, foot: 3280.84, inch: 39370.1 },
    mile: { meter: 1609.34, kilometer: 1.60934, mile: 1, yard: 1760, foot: 5280, inch: 63360 },
    yard: { meter: 0.9144, kilometer: 0.0009144, mile: 0.000568182, yard: 1, foot: 3, inch: 36 },
    foot: { meter: 0.3048, kilometer: 0.0003048, mile: 0.000189394, yard: 0.333333, foot: 1, inch: 12 },
    inch: { meter: 0.0254, kilometer: 0.0000254, mile: 0.0000157828, yard: 0.0277778, foot: 0.0833333, inch: 1 }
  },
  weight: {
    gram: { gram: 1, kilogram: 0.001, pound: 0.00220462, ounce: 0.035274, ton: 0.00000110231 },
    kilogram: { gram: 1000, kilogram: 1, pound: 2.20462, ounce: 35.274, ton: 0.00110231 },
    pound: { gram: 453.592, kilogram: 0.453592, pound: 1, ounce: 16, ton: 0.0005 },
    ounce: { gram: 28.3495, kilogram: 0.0283495, pound: 0.0625, ounce: 1, ton: 0.00003125 },
    ton: { gram: 907185, kilogram: 907.185, pound: 2000, ounce: 32000, ton: 1 }
  },
  volume: {
    liter: { liter: 1, milliliter: 1000, gallon: 0.264172, quart: 1.05669, pint: 2.11338, cup: 4.22675 },
    milliliter: { liter: 0.001, milliliter: 1, gallon: 0.000264172, quart: 0.00105669, pint: 0.00211338, cup: 0.00422675 },
    gallon: { liter: 3.78541, milliliter: 3785.41, gallon: 1, quart: 4, pint: 8, cup: 16 },
    quart: { liter: 0.946353, milliliter: 946.353, gallon: 0.25, quart: 1, pint: 2, cup: 4 },
    pint: { liter: 0.473176, milliliter: 473.176, gallon: 0.125, quart: 0.5, pint: 1, cup: 2 },
    cup: { liter: 0.236588, milliliter: 236.588, gallon: 0.0625, quart: 0.25, pint: 0.5, cup: 1 }
  },
  temperature: {
    celsius: { celsius: 1, fahrenheit: 1.8, rankine: 1.8 },
    fahrenheit: { celsius: 0.555556, fahrenheit: 1, rankine: 1 },
    rankine: { celsius: 0.555556, fahrenheit: 1, rankine: 1 }
  },
  area: {
    squaremeter: { squaremeter: 1, squarekilometer: 0.000001, hectare: 0.0001, acre: 0.000247105, squarefoot: 10.7639 },
    squarekilometer: { squaremeter: 1000000, squarekilometer: 1, hectare: 100, acre: 247.105, squarefoot: 10763900 },
    hectare: { squaremeter: 10000, squarekilometer: 0.01, hectare: 1, acre: 2.47105, squarefoot: 107639 },
    acre: { squaremeter: 4046.86, squarekilometer: 0.00404686, hectare: 0.404686, acre: 1, squarefoot: 43560 },
    squarefoot: { squaremeter: 0.092903, squarekilometer: 0.000000092903, hectare: 0.0000092903, acre: 0.0000229568, squarefoot: 1 }
  },
  speed: {
    meterpersecond: { meterpersecond: 1, kilometerperhour: 3.6, mileperhour: 2.23694, footpersecond: 3.28084, knot: 1.94384 },
    kilometerperhour: { meterpersecond: 0.277778, kilometerperhour: 1, mileperhour: 0.621371, footpersecond: 0.911344, knot: 0.539957 },
    mileperhour: { meterpersecond: 0.44704, kilometerperhour: 1.60934, mileperhour: 1, footpersecond: 1.46667, knot: 0.868976 },
    footpersecond: { meterpersecond: 0.3048, kilometerperhour: 1.09728, mileperhour: 0.681818, footpersecond: 1, knot: 0.592484 },
    knot: { meterpersecond: 0.514444, kilometerperhour: 1.852, mileperhour: 1.15078, footpersecond: 1.68781, knot: 1 }
  }
};

const unitCategories: Record<UnitType, { name: string; units: string[] }> = {
  length: { name: 'Length', units: ['meter', 'kilometer', 'mile', 'yard', 'foot', 'inch'] },
  weight: { name: 'Weight', units: ['gram', 'kilogram', 'pound', 'ounce', 'ton'] },
  volume: { name: 'Volume', units: ['liter', 'milliliter', 'gallon', 'quart', 'pint', 'cup'] },
  temperature: { name: 'Temperature', units: ['celsius', 'fahrenheit', 'rankine'] },
  area: { name: 'Area', units: ['squaremeter', 'squarekilometer', 'hectare', 'acre', 'squarefoot'] },
  speed: { name: 'Speed', units: ['meterpersecond', 'kilometerperhour', 'mileperhour', 'footpersecond', 'knot'] }
};

const unitLabels: Record<string, string> = {
  meter: 'm',
  kilometer: 'km',
  mile: 'mi',
  yard: 'yd',
  foot: 'ft',
  inch: 'in',
  gram: 'g',
  kilogram: 'kg',
  pound: 'lb',
  ounce: 'oz',
  ton: 'ton',
  liter: 'L',
  milliliter: 'mL',
  gallon: 'gal',
  quart: 'qt',
  pint: 'pt',
  cup: 'cup',
  celsius: '°C',
  fahrenheit: '°F',
  rankine: '°R',
  squaremeter: 'm²',
  squarekilometer: 'km²',
  hectare: 'ha',
  acre: 'ac',
  squarefoot: 'ft²',
  meterpersecond: 'm/s',
  kilometerperhour: 'km/h',
  mileperhour: 'mph',
  footpersecond: 'ft/s',
  knot: 'knot'
};

export default function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [results, setResults] = useState<{ [key: string]: number }>({});

  const convert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setResults({});
      return;
    }

    const conversions = unitConversions[unitType];
    const fromUnitSystem = conversions[fromUnit];
    
    const newResults: { [key: string]: number } = {};
    
    Object.keys(fromUnitSystem).forEach(targetUnit => {
      if (targetUnit !== fromUnit) {
        newResults[targetUnit] = value * fromUnitSystem[targetUnit];
      }
    });
    
    setResults(newResults);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(results[toUnit]?.toString() || '');
    setResults({});
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    if (value.trim()) {
      setTimeout(convert, 300); // Debounce conversion
    } else {
      setResults({});
    }
  };

  const handleUnitTypeChange = (newType: UnitType) => {
    setUnitType(newType);
    setFromUnit(unitCategories[newType].units[0]);
    setToUnit(unitCategories[newType].units[1] || unitCategories[newType].units[0]);
    setFromValue('');
    setResults({});
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    setResults({});
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    setResults({});
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
                <h1 className="text-xl font-bold text-slate-900">Unit Converter</h1>
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
            <CardTitle className="text-2xl text-center">Unit Converter</CardTitle>
            <CardDescription className="text-base text-center">
              Convert between different units of measurement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Category Selection */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {Object.entries(unitCategories).map(([key, category]) => (
                <Button
                  key={key}
                  variant={unitType === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUnitTypeChange(key as UnitType)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    From
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={fromValue}
                      onChange={(e) => handleFromValueChange(e.target.value)}
                      placeholder="Enter value"
                      className="flex-1"
                    />
                    <select
                      value={fromUnit}
                      onChange={(e) => handleFromUnitChange(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md bg-white"
                    >
                      {unitCategories[unitType].units.map(unit => (
                        <option key={unit} value={unit}>
                          {unitLabels[unit] || unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={swapUnits}
                    variant="outline"
                    size="sm"
                    className="px-4"
                  >
                    <SwapHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    To
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={results[toUnit]?.toFixed(6) || ''}
                      readOnly
                      placeholder="Result"
                      className="flex-1 bg-slate-50"
                    />
                    <select
                      value={toUnit}
                      onChange={(e) => handleToUnitChange(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md bg-white"
                    >
                      {unitCategories[unitType].units.map(unit => (
                        <option key={unit} value={unit}>
                          {unitLabels[unit] || unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">All Conversions</h3>
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {Object.entries(results).map(([unit, value]) => (
                    <div
                      key={unit}
                      className={`p-3 rounded-lg border ${
                        unit === toUnit ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-sm text-slate-600">
                        {unitLabels[unit] || unit}
                      </div>
                      <div className="font-semibold text-slate-900">
                        {value.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversion Formula */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Conversion Formula</h4>
              <div className="text-sm text-slate-600">
                1 {unitLabels[fromUnit] || fromUnit} = {unitConversions[unitType][fromUnit][toUnit]} {unitLabels[toUnit] || toUnit}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                1 {unitLabels[toUnit] || toUnit} = {1 / unitConversions[unitType][fromUnit][toUnit]} {unitLabels[fromUnit] || fromUnit}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}