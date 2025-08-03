'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, Globe } from 'lucide-react';
import Link from 'next/link';

interface Timezone {
  id: string;
  name: string;
  offset: string;
  time: string;
  date: string;
}

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [is24Hour, setIs24Hour] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);

  // Common timezones
  const commonTimezones = [
    { id: 'local', name: 'Local Time', offset: '' },
    { id: 'utc', name: 'UTC', offset: '+0:00' },
    { id: 'newyork', name: 'New York', offset: '-5:00' },
    { id: 'london', name: 'London', offset: '+0:00' },
    { id: 'paris', name: 'Paris', offset: '+1:00' },
    { id: 'tokyo', name: 'Tokyo', offset: '+9:00' },
    { id: 'sydney', name: 'Sydney', offset: '+11:00' },
    { id: 'dubai', name: 'Dubai', offset: '+4:00' },
    { id: 'beijing', name: 'Beijing', offset: '+8:00' },
    { id: 'moscow', name: 'Moscow', offset: '+3:00' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateTimezones();
    }, 1000);

    updateTimezones();

    return () => clearInterval(timer);
  }, [is24Hour, showSeconds]);

  const updateTimezones = () => {
    const now = new Date();
    const newTimezones: Timezone[] = commonTimezones.map(tz => {
      let time = now;
      let offset = 0;

      // Calculate offset based on timezone
      switch (tz.id) {
        case 'utc':
          offset = 0;
          break;
        case 'newyork':
          offset = -5;
          break;
        case 'london':
          offset = 0;
          break;
        case 'paris':
          offset = 1;
          break;
        case 'tokyo':
          offset = 9;
          break;
        case 'sydney':
          offset = 11;
          break;
        case 'dubai':
          offset = 4;
          break;
        case 'beijing':
          offset = 8;
          break;
        case 'moscow':
          offset = 3;
          break;
        default:
          offset = now.getTimezoneOffset() / -60; // Local timezone offset
      }

      if (tz.id !== 'local') {
        time = new Date(now.getTime() + (offset - now.getTimezoneOffset() / 60) * 3600000);
      }

      return {
        id: tz.id,
        name: tz.name,
        offset: tz.offset || formatOffset(offset),
        time: formatTime(time, is24Hour, showSeconds),
        date: formatDate(time)
      };
    });

    setTimezones(newTimezones);
  };

  const formatTime = (date: Date, is24Hour: boolean, showSeconds: boolean): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (!is24Hour) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return showSeconds 
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`
        : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    return showSeconds 
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatOffset = (offset: number): string => {
    const sign = offset >= 0 ? '+' : '';
    return `${sign}${offset}:00`;
  };

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const toggleSeconds = () => {
    setShowSeconds(!showSeconds);
  };

  const copyTime = () => {
    const timeText = formatTime(currentTime, is24Hour, showSeconds);
    navigator.clipboard.writeText(timeText);
    alert('Time copied to clipboard!');
  };

  const copyDate = () => {
    const dateText = formatDate(currentTime);
    navigator.clipboard.writeText(dateText);
    alert('Date copied to clipboard!');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getBackgroundGradient = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'from-blue-50 to-yellow-50';
    if (hour >= 12 && hour < 18) return 'from-yellow-50 to-orange-50';
    if (hour >= 18 && hour < 22) return 'from-orange-50 to-purple-50';
    return 'from-purple-50 to-blue-50';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
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
                <h1 className="text-xl font-bold text-slate-900">Clock</h1>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Clock Display */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Clock className="h-6 w-6" />
              Current Time
            </CardTitle>
            <CardDescription className="text-lg">
              {getGreeting()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* Main Time Display */}
              <div className="space-y-2">
                <div className="text-6xl md:text-8xl font-bold text-slate-900 font-mono">
                  {formatTime(currentTime, is24Hour, showSeconds)}
                </div>
                <div className="text-xl text-slate-600">
                  {formatDate(currentTime)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleTimeFormat}
                  variant={is24Hour ? "default" : "outline"}
                  size="sm"
                >
                  {is24Hour ? '24-Hour' : '12-Hour'}
                </Button>
                <Button
                  onClick={toggleSeconds}
                  variant={showSeconds ? "default" : "outline"}
                  size="sm"
                >
                  {showSeconds ? 'Hide Seconds' : 'Show Seconds'}
                </Button>
                <Button
                  onClick={copyTime}
                  variant="outline"
                  size="sm"
                >
                  Copy Time
                </Button>
                <Button
                  onClick={copyDate}
                  variant="outline"
                  size="sm"
                >
                  Copy Date
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* World Clocks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Globe className="h-5 w-5" />
              World Clocks
            </CardTitle>
            <CardDescription>
              Current time around the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timezones.map((timezone) => (
                <div key={timezone.id} className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{timezone.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {timezone.offset}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-mono font-bold text-slate-800">
                      {timezone.time}
                    </div>
                    <div className="text-sm text-slate-600">
                      {timezone.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-sm text-blue-600">Today is</div>
                  <div className="font-semibold text-blue-900">
                    {currentTime.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-sm text-green-600">Week</div>
                  <div className="font-semibold text-green-900">
                    Week {Math.ceil((currentTime.getDate() + new Date(currentTime.getFullYear(), currentTime.getMonth(), 1).getDay()) / 7)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-sm text-purple-600">Timezone</div>
                  <div className="font-semibold text-purple-900">
                    UTC{currentTime.getTimezoneOffset() <= 0 ? '+' : ''}{currentTime.getTimezoneOffset() / -60}:00
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}