'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Square } from 'lucide-react';
import Link from 'next/link';

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const lap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getLapTime = (lapIndex: number) => {
    if (lapIndex === 0) {
      return laps[0];
    }
    return laps[lapIndex] - laps[lapIndex - 1];
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
                <h1 className="text-xl font-bold text-slate-900">Stopwatch</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    productivity
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Stopwatch */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">Stopwatch</CardTitle>
                <CardDescription className="text-center">
                  Precision timing with lap functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-8">
                  {/* Time Display */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg p-8">
                    <div className="text-6xl font-mono font-bold tracking-tight">
                      {formatTime(time)}
                    </div>
                    <div className="text-sm text-slate-300 mt-2">
                      {isRunning ? 'RUNNING' : 'STOPPED'}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={startStop}
                      size="lg"
                      className="px-8"
                      variant={isRunning ? "destructive" : "default"}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={lap}
                      size="lg"
                      className="px-8"
                      variant="outline"
                      disabled={!isRunning}
                    >
                      Lap
                    </Button>
                    
                    <Button
                      onClick={reset}
                      size="lg"
                      className="px-8"
                      variant="outline"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Laps */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Laps</span>
                  <span className="text-sm font-normal text-slate-500">
                    {laps.length} lap{laps.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {laps.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {laps.map((lapTime, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              Lap {index + 1}
                            </div>
                            {index > 0 && (
                              <div className="text-xs text-slate-500">
                                Split: {formatTime(getLapTime(index))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="font-mono font-semibold text-slate-900">
                          {formatTime(lapTime)}
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                        <div className="font-semibold text-slate-900">
                          Total Time
                        </div>
                        <div className="font-mono font-bold text-slate-900">
                          {formatTime(time)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Square className="h-12 w-12 mx-auto mb-4" />
                    <p>No laps recorded yet</p>
                    <p className="text-sm">Click "Lap" while running to record lap times</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium text-slate-900">Start/Stop</div>
                  <div className="text-slate-600">Click Start to begin timing, Stop to pause</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium text-slate-900">Lap</div>
                  <div className="text-slate-600">Record lap times while running</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium text-slate-900">Reset</div>
                  <div className="text-slate-600">Clear all times and start over</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}