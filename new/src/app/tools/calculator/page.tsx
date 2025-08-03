'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
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
                <h1 className="text-xl font-bold text-slate-900">Calculator</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-blue-100 text-blue-800">
                    calculator
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Calculator</CardTitle>
            <CardDescription className="text-base text-center">
              A fully functional calculator for basic mathematical operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto">
              <div className="mb-6">
                <Input
                  value={display}
                  readOnly
                  className="text-right text-3xl h-20 text-center font-mono"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-4">
                  <Button onClick={clear} variant="outline" className="w-full h-14 text-lg">
                    Clear
                  </Button>
                </div>
                
                <Button 
                  onClick={() => inputOperation('/')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  ÷
                </Button>
                <Button 
                  onClick={() => inputOperation('*')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  ×
                </Button>
                <Button 
                  onClick={() => inputOperation('-')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  −
                </Button>
                <Button 
                  onClick={() => inputOperation('+')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  +
                </Button>
                
                <Button 
                  onClick={() => inputNumber('7')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  7
                </Button>
                <Button 
                  onClick={() => inputNumber('8')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  8
                </Button>
                <Button 
                  onClick={() => inputNumber('9')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  9
                </Button>
                <Button 
                  onClick={handleEquals} 
                  variant="outline" 
                  className="h-14 text-lg row-span-2"
                >
                  =
                </Button>
                
                <Button 
                  onClick={() => inputNumber('4')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  4
                </Button>
                <Button 
                  onClick={() => inputNumber('5')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  5
                </Button>
                <Button 
                  onClick={() => inputNumber('6')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  6
                </Button>
                
                <Button 
                  onClick={() => inputNumber('1')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  1
                </Button>
                <Button 
                  onClick={() => inputNumber('2')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  2
                </Button>
                <Button 
                  onClick={() => inputNumber('3')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  3
                </Button>
                
                <Button 
                  onClick={() => inputNumber('0')} 
                  variant="outline" 
                  className="h-14 text-lg col-span-2"
                >
                  0
                </Button>
                <Button 
                  onClick={() => inputNumber('.')} 
                  variant="outline" 
                  className="h-14 text-lg"
                >
                  .
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}