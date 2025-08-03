'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0
  });

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const current = currentDate ? new Date(currentDate) : new Date();

    // Validate dates
    if (birth > current) {
      alert('Birth date cannot be in the future!');
      return;
    }

    // Calculate age
    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const diffTime = Math.abs(current.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = diffDays * 24;
    const diffMinutes = diffHours * 60;
    const diffSeconds = diffMinutes * 60;

    setAge({
      years,
      months,
      days,
      totalDays: diffDays,
      totalHours: diffHours,
      totalMinutes: diffMinutes,
      totalSeconds: diffSeconds
    });
  };

  const clearAll = () => {
    setBirthDate('');
    setCurrentDate('');
    setAge({
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalHours: 0,
      totalMinutes: 0,
      totalSeconds: 0
    });
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
                <h1 className="text-xl font-bold text-slate-900">Age Calculator</h1>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Age Calculator</CardTitle>
            <CardDescription className="text-base text-center">
              Calculate your age in years, months, days, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Calculate Age As Of (optional)
                  </label>
                  <Input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    placeholder="Leave blank for today"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <Button 
                onClick={calculateAge} 
                disabled={!birthDate}
                className="px-8 py-2"
              >
                Calculate Age
              </Button>
              <Button 
                onClick={clearAll} 
                variant="outline" 
                className="ml-4"
              >
                Clear
              </Button>
            </div>

            {age.totalDays > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Age */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Age</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{age.years}</div>
                      <div className="text-sm text-slate-600">Years</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-indigo-600">{age.months}</div>
                      <div className="text-sm text-slate-600">Months</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{age.days}</div>
                      <div className="text-sm text-slate-600">Days</div>
                    </div>
                  </div>
                </div>

                {/* Total Time */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Total Time Lived</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Days:</span>
                      <span className="font-semibold text-green-600">{age.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Hours:</span>
                      <span className="font-semibold text-emerald-600">{age.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Minutes:</span>
                      <span className="font-semibold text-teal-600">{age.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Seconds:</span>
                      <span className="font-semibold text-cyan-600">{age.totalSeconds.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {age.totalDays > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  🎉 Congratulations! You've lived {age.totalDays.toLocaleString()} amazing days!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}