'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Calculator, Download, FileText, Play, Pause, RotateCcw } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakTime: number;
  totalHours: number;
  overtime: number;
  notes: string;
}

interface WeeklySummary {
  totalHours: number;
  overtimeHours: number;
  regularHours: number;
  dailyAverage: number;
  entries: TimeEntry[];
}

export default function QuickWorkHourCalculator() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [notes, setNotes] = useState('');
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [regularHoursLimit, setRegularHoursLimit] = useState(8);

  // Initialize current time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 5));
      setCurrentDate(now.toISOString().split('T')[0]);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setStartTime(currentTime);
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime('');
  };

  const saveTimeEntry = () => {
    if (!startTime || !currentTime) {
      alert('Please start the timer before saving');
      return;
    }

    const clockIn = startTime;
    const clockOut = currentTime;
    
    // Calculate time difference
    const inTime = new Date(`2000-01-01T${clockIn}`);
    const outTime = new Date(`2000-01-01T${clockOut}`);
    let diffMs = outTime.getTime() - inTime.getTime();
    
    // Handle overnight shifts
    if (diffMs < 0) {
      diffMs += 24 * 60 * 60 * 1000;
    }
    
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = totalMinutes / 60;
    const regularHours = Math.min(totalHours, regularHoursLimit);
    const overtime = Math.max(0, totalHours - regularHours);

    const entry: TimeEntry = {
      id: Date.now().toString(),
      date: currentDate,
      clockIn,
      clockOut,
      breakTime,
      totalHours,
      overtime,
      notes
    };

    setTimeEntries([entry, ...timeEntries]);
    resetTimer();
    setNotes('');
    setBreakTime(0);
    
    // Update weekly summary
    updateWeeklySummary();
  };

  const updateWeeklySummary = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const totalHours = weekEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const overtimeHours = weekEntries.reduce((sum, entry) => sum + entry.overtime, 0);
    const regularHours = totalHours - overtimeHours;
    const dailyAverage = weekEntries.length > 0 ? totalHours / weekEntries.length : 0;

    setWeeklySummary({
      totalHours,
      overtimeHours,
      regularHours,
      dailyAverage,
      entries: weekEntries
    });
  };

  const deleteEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
    updateWeeklySummary();
  };

  const exportTimesheet = () => {
    alert('Exporting timesheet data...');
  };

  const calculatePay = (hours: number, rate: number, isOvertime: boolean = false): number => {
    const overtimeMultiplier = isOvertime ? overtimeRate : 1;
    return hours * rate * overtimeMultiplier;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Quick Work Hour Calculator</h1>
          <p className="text-blue-600">Calculate work hours, track overtime, and manage timesheets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer and Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Time Tracker
              </CardTitle>
              <CardDescription>
                Track your work hours and manage time entries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Date and Time */}
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-sm text-blue-600">{currentDate}</div>
                <div className="text-2xl font-bold text-blue-900">{currentTime}</div>
              </div>

              {/* Timer Display */}
              <div className="text-center py-4">
                <div className="text-3xl font-mono font-bold text-blue-900 mb-4">
                  {formatTime(elapsedTime)}
                </div>
                
                <div className="flex justify-center gap-2">
                  {!isRunning ? (
                    <Button onClick={startTimer} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} variant="outline" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button onClick={resetTimer} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {startTime && (
                  <div className="text-sm text-gray-600 mt-2">
                    Started at: {startTime}
                  </div>
                )}
              </div>

              {/* Time Entry Form */}
              <div className="space-y-3">
                <h3 className="font-semibold">Time Entry</h3>
                
                <div>
                  <Label htmlFor="breakTime">Break Time (minutes)</Label>
                  <Input
                    id="breakTime"
                    type="number"
                    min="0"
                    value={breakTime}
                    onChange={(e) => setBreakTime(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Project, task description..."
                  />
                </div>

                <Button onClick={saveTimeEntry} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Save Time Entry
                </Button>
              </div>

              {/* Settings */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="regularHours">Regular Hours Limit</Label>
                    <Input
                      id="regularHours"
                      type="number"
                      min="1"
                      value={regularHoursLimit}
                      onChange={(e) => setRegularHoursLimit(parseInt(e.target.value) || 8)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeRate">Overtime Rate</Label>
                    <Input
                      id="overtimeRate"
                      type="number"
                      step="0.1"
                      min="1"
                      value={overtimeRate}
                      onChange={(e) => setOvertimeRate(parseFloat(e.target.value) || 1.5)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary and Entries */}
          <div className="space-y-6">
            {/* Weekly Summary */}
            {weeklySummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Weekly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-sm text-green-600">Total Hours</div>
                      <div className="text-xl font-bold text-green-900">
                        {weeklySummary.totalHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <div className="text-sm text-orange-600">Overtime</div>
                      <div className="text-xl font-bold text-orange-900">
                        {weeklySummary.overtimeHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-sm text-blue-600">Regular Hours</div>
                      <div className="text-xl font-bold text-blue-900">
                        {weeklySummary.regularHours.toFixed(1)}h
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <div className="text-sm text-purple-600">Daily Average</div>
                      <div className="text-xl font-bold text-purple-900">
                        {weeklySummary.dailyAverage.toFixed(1)}h
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={exportTimesheet} variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Calculate Pay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Time Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {timeEntries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No time entries yet</p>
                      <p className="text-sm">Start tracking your time above</p>
                    </div>
                  ) : (
                    timeEntries.map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium">{entry.date}</div>
                            <div className="text-sm text-gray-600">
                              {entry.clockIn} - {entry.clockOut}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteEntry(entry.id)}
                          >
                            ×
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                          <div>
                            <div className="text-gray-500">Total</div>
                            <div className="font-medium">{entry.totalHours.toFixed(1)}h</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Break</div>
                            <div className="font-medium">{entry.breakTime}min</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Overtime</div>
                            <div className="font-medium text-orange-600">
                              {entry.overtime > 0 ? `${entry.overtime.toFixed(1)}h` : '-'}
                            </div>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {entry.notes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pay Calculator */}
            {weeklySummary && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Pay Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Regular Hours Pay</div>
                        <div className="font-medium">
                          ${calculatePay(weeklySummary.regularHours, 20).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Overtime Hours Pay</div>
                        <div className="font-medium text-orange-600">
                          ${calculatePay(weeklySummary.overtimeHours, 20, true).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <div className="text-lg font-bold text-blue-900">
                        Total: ${calculatePay(weeklySummary.totalHours, 20, true).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}