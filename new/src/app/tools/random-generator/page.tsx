'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Dice6, Shuffle, Hash, Letters } from 'lucide-react';
import Link from 'next/link';

type GeneratorType = 'number' | 'string' | 'password' | 'list' | 'dice';

export default function RandomGenerator() {
  const [generatorType, setGeneratorType] = useState<GeneratorType>('number');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [length, setLength] = useState('8');
  const [count, setCount] = useState('1');
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [separator, setSeparator] = useState(',');
  const [results, setResults] = useState<string[]>([]);

  const generateNumber = () => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    if (isNaN(minVal) || isNaN(maxVal) || minVal > maxVal) {
      alert('Please enter valid min and max values');
      return;
    }

    const resultCount = parseInt(count);
    const newResults = [];
    
    for (let i = 0; i < resultCount; i++) {
      const randomNum = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      newResults.push(randomNum.toString());
    }
    
    setResults(newResults);
  };

  const generateString = () => {
    const len = parseInt(length);
    if (isNaN(len) || len < 1 || len > 100) {
      alert('Please enter a valid length between 1 and 100');
      return;
    }

    const resultCount = parseInt(count);
    const newResults = [];
    
    for (let i = 0; i < resultCount; i++) {
      let chars = '';
      if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeNumbers) chars += '0123456789';
      
      if (chars === '') {
        alert('Please select at least one character type');
        return;
      }

      let result = '';
      for (let j = 0; j < len; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newResults.push(result);
    }
    
    setResults(newResults);
  };

  const generatePassword = () => {
    const len = parseInt(length);
    if (isNaN(len) || len < 4 || len > 50) {
      alert('Please enter a valid length between 4 and 50');
      return;
    }

    const resultCount = parseInt(count);
    const newResults = [];
    
    for (let i = 0; i < resultCount; i++) {
      let chars = '';
      if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeNumbers) chars += '0123456789';
      if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      if (chars === '') {
        alert('Please select at least one character type');
        return;
      }

      let result = '';
      for (let j = 0; j < len; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newResults.push(result);
    }
    
    setResults(newResults);
  };

  const generateFromList = () => {
    const listItems = document.getElementById('list-items')?.textContent || '';
    const items = listItems.split('\n').filter(item => item.trim() !== '');
    
    if (items.length === 0) {
      alert('Please enter some items in the list');
      return;
    }

    const resultCount = Math.min(parseInt(count), items.length);
    const newResults = [];
    const usedIndices = new Set<number>();
    
    for (let i = 0; i < resultCount; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * items.length);
      } while (usedIndices.has(randomIndex) && usedIndices.size < items.length);
      
      usedIndices.add(randomIndex);
      newResults.push(items[randomIndex].trim());
    }
    
    setResults(newResults);
  };

  const generateDice = () => {
    const sides = parseInt(max) || 6;
    const diceCount = parseInt(min) || 1;
    
    if (sides < 1 || diceCount < 1 || diceCount > 10) {
      alert('Please enter valid dice count (1-10) and sides (1+)');
      return;
    }

    const resultCount = parseInt(count);
    const newResults = [];
    
    for (let i = 0; i < resultCount; i++) {
      const rolls = [];
      let total = 0;
      
      for (let j = 0; j < diceCount; j++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
      }
      
      newResults.push(`${rolls.join(' + ')} = ${total}`);
    }
    
    setResults(newResults);
  };

  const generate = () => {
    switch (generatorType) {
      case 'number':
        generateNumber();
        break;
      case 'string':
        generateString();
        break;
      case 'password':
        generatePassword();
        break;
      case 'list':
        generateFromList();
        break;
      case 'dice':
        generateDice();
        break;
    }
  };

  const copyResults = () => {
    const text = results.join(separator + ' ');
    navigator.clipboard.writeText(text);
    alert('Results copied to clipboard!');
  };

  const clearResults = () => {
    setResults([]);
  };

  const getGeneratorDescription = () => {
    switch (generatorType) {
      case 'number':
        return 'Generate random numbers within a specified range';
      case 'string':
        return 'Generate random strings with customizable character sets';
      case 'password':
        return 'Generate secure random passwords with various character types';
      case 'list':
        return 'Pick random items from a custom list';
      case 'dice':
        return 'Roll multiple dice and get the total';
      default:
        return '';
    }
  };

  const getGeneratorIcon = () => {
    switch (generatorType) {
      case 'number':
        return <Hash className="h-5 w-5" />;
      case 'string':
        return <Letters className="h-5 w-5" />;
      case 'password':
        return <Shuffle className="h-5 w-5" />;
      case 'list':
        return <Shuffle className="h-5 w-5" />;
      case 'dice':
        return <Dice6 className="h-5 w-5" />;
      default:
        return <Dice6 className="h-5 w-5" />;
    }
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
                <h1 className="text-xl font-bold text-slate-900">Random Generator</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-purple-100 text-purple-800">
                    generator
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
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="h-5 w-5" />
              Random Generator
            </CardTitle>
            <CardDescription>
              {getGeneratorDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Generator Type Selection */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { type: 'number', label: 'Numbers' },
                { type: 'string', label: 'Strings' },
                { type: 'password', label: 'Passwords' },
                { type: 'list', label: 'From List' },
                { type: 'dice', label: 'Dice' }
              ].map(({ type, label }) => (
                <Button
                  key={type}
                  variant={generatorType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setGeneratorType(type as GeneratorType);
                    setResults([]);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration */}
              <div className="space-y-6">
                {generatorType === 'number' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Minimum
                        </label>
                        <Input
                          type="number"
                          value={min}
                          onChange={(e) => setMin(e.target.value)}
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Maximum
                        </label>
                        <Input
                          type="number"
                          value={max}
                          onChange={(e) => setMax(e.target.value)}
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(generatorType === 'string' || generatorType === 'password') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Length
                      </label>
                      <Input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="8"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-slate-700">
                        Character Types
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">a-z</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">A-Z</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">0-9</span>
                        </label>
                        {generatorType === 'password' && (
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={includeSymbols}
                              onChange={(e) => setIncludeSymbols(e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm">Symbols</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {generatorType === 'list' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        List Items (one per line)
                      </label>
                      <textarea
                        id="list-items"
                        placeholder="Item 1&#10;Item 2&#10;Item 3"
                        className="w-full h-32 p-3 border border-slate-300 rounded-lg resize-none text-sm"
                        defaultValue=""
                      />
                    </div>
                  </div>
                )}

                {generatorType === 'dice' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Number of Dice
                        </label>
                        <Input
                          type="number"
                          value={min}
                          onChange={(e) => setMin(e.target.value)}
                          placeholder="2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Sides per Die
                        </label>
                        <Input
                          type="number"
                          value={max}
                          onChange={(e) => setMax(e.target.value)}
                          placeholder="6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Results
                  </label>
                  <Input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    placeholder="1"
                    min="1"
                    max="100"
                  />
                </div>

                {results.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Separator
                    </label>
                    <Input
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      placeholder=","
                      maxLength={1}
                    />
                  </div>
                )}

                <Button onClick={generate} className="w-full">
                  {getGeneratorIcon()}
                  Generate {generatorType === 'dice' ? 'Dice' : generatorType.slice(0, -1)}
                </Button>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Results</h3>
                  <div className="flex space-x-2">
                    {results.length > 0 && (
                      <>
                        <Button onClick={copyResults} variant="outline" size="sm">
                          Copy
                        </Button>
                        <Button onClick={clearResults} variant="outline" size="sm">
                          Clear
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {results.length > 0 ? (
                  <div className="min-h-[300px] max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {results.map((result, index) => (
                        <div
                          key={index}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-lg"
                        >
                          <div className="font-mono text-sm text-slate-900">
                            {result}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-400">
                    <Shuffle className="h-12 w-12 mx-auto mb-4" />
                    <p>No results yet</p>
                    <p className="text-sm">Configure settings and click generate</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      Generated {results.length} {generatorType === 'dice' ? 'dice roll' : generatorType.slice(0, -1)}
                      {results.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}