'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Globe, Plus, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';

interface WorldTime {
  id: string;
  city: string;
  country: string;
  timezone: string;
  time: string;
  date: string;
  offset: string;
  isDaylight: boolean;
}

interface TimezoneData {
  city: string;
  country: string;
  timezone: string;
  offset: number;
}

export default function WorldClock() {
  const [worldTimes, setWorldTimes] = useState<WorldTime[]>([]);
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);

  // Major world timezones
  const availableTimezones: TimezoneData[] = [
    { city: 'New York', country: 'USA', timezone: 'America/New_York', offset: -5 },
    { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', offset: -8 },
    { city: 'Chicago', country: 'USA', timezone: 'America/Chicago', offset: -6 },
    { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', offset: -5 },
    { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', offset: -6 },
    { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', offset: -3 },
    { city: 'London', country: 'UK', timezone: 'Europe/London', offset: 0 },
    { city: 'Paris', country: 'France', timezone: 'Europe/Paris', offset: 1 },
    { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', offset: 1 },
    { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', offset: 3 },
    { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', offset: 4 },
    { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5 },
    { city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', offset: 8 },
    { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 9 },
    { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', offset: 9 },
    { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', offset: 8 },
    { city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8 },
    { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 11 },
    { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', offset: 13 },
    { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', offset: 2 },
    { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', offset: 2 }
  ];

  // Initialize with popular cities
  useEffect(() => {
    const popularTimezones = [
      'America/New_York',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Australia/Sydney',
      'Asia/Dubai'
    ];
    
    setSelectedTimezones(popularTimezones);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateWorldTimes();
    }, 1000);

    updateWorldTimes();

    return () => clearInterval(timer);
  }, [selectedTimezones, is24Hour]);

  const updateWorldTimes = () => {
    const now = new Date();
    const newWorldTimes: WorldTime[] = selectedTimezones.map(timezoneId => {
      const timezoneData = availableTimezones.find(tz => tz.timezone === timezoneId);
      if (!timezoneData) return null;

      // Calculate time for this timezone
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const cityTime = new Date(utcTime + (timezoneData.offset * 3600000));

      return {
        id: timezoneId,
        city: timezoneData.city,
        country: timezoneData.country,
        timezone: timezoneData.timezone,
        time: formatTime(cityTime, is24Hour),
        date: formatDate(cityTime),
        offset: formatOffset(timezoneData.offset),
        isDaylight: isDaylightTime(cityTime)
      };
    }).filter(Boolean) as WorldTime[];

    setWorldTimes(newWorldTimes);
  };

  const formatTime = (date: Date, is24Hour: boolean): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (!is24Hour) {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatOffset = (offset: number): string => {
    const sign = offset >= 0 ? '+' : '';
    const hours = Math.floor(Math.abs(offset));
    const minutes = Math.abs(offset % 1) * 60;
    return `${sign}${hours}${minutes > 0 ? ':' + Math.round(minutes) : ''}`;
  };

  const isDaylightTime = (date: Date): boolean => {
    const hour = date.getHours();
    return hour >= 6 && hour < 18;
  };

  const addTimezone = (timezoneId: string) => {
    if (!selectedTimezones.includes(timezoneId)) {
      setSelectedTimezones([...selectedTimezones, timezoneId]);
    }
  };

  const removeTimezone = (timezoneId: string) => {
    setSelectedTimezones(selectedTimezones.filter(id => id !== timezoneId));
  };

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const getFlag = (country: string): string => {
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Russia': '🇷🇺',
      'UAE': '🇦🇪',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Hong Kong': '🇭🇰',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
      'Egypt': '🇪🇬',
      'South Africa': '🇿🇦',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'Canada': '🇨🇦'
    };
    return flags[country] || '🌍';
  };

  const getTimeOfDayIcon = (isDaylight: boolean) => {
    return isDaylight ? (
      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
    ) : (
      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
    );
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
                <h1 className="text-xl font-bold text-slate-900">World Clock</h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleTimeFormat}
              variant={is24Hour ? "default" : "outline"}
              size="sm"
            >
              {is24Hour ? '24-Hour' : '12-Hour'}
            </Button>
            <span className="text-sm text-slate-600">
              {worldTimes.length} cities tracked
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add City
          </Button>
        </div>

        {/* World Clock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {worldTimes.map((timeInfo) => (
            <Card key={timeInfo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getFlag(timeInfo.country)}</span>
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-900">
                        {timeInfo.city}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {timeInfo.country}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTimeOfDayIcon(timeInfo.isDaylight)}
                    <Button
                      onClick={() => removeTimezone(timeInfo.timezone)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-slate-900 font-mono">
                    {timeInfo.time}
                  </div>
                  <div className="text-sm text-slate-600">
                    {timeInfo.date}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    UTC{timeInfo.offset}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Timezone Modal Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Add More Cities</CardTitle>
            <CardDescription>
              Select cities to add to your world clock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {availableTimezones
                .filter(tz => !selectedTimezones.includes(tz.timezone))
                .map((timezone) => (
                  <Button
                    key={timezone.timezone}
                    onClick={() => addTimezone(timezone.timezone)}
                    variant="outline"
                    size="sm"
                    className="text-left h-auto p-3"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getFlag(timezone.country)}</span>
                      <div className="text-left">
                        <div className="text-xs font-medium">{timezone.city}</div>
                        <div className="text-xs text-slate-500">{timezone.country}</div>
                      </div>
                    </div>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Zone Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Americas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Americas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {worldTimes
                  .filter(t => ['America/New_York', 'America/Los_Angeles', 'America/Chicago', 'America/Toronto', 'America/Mexico_City', 'America/Sao_Paulo'].includes(t.timezone))
                  .map(time => (
                    <div key={time.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span>{getFlag(time.country)}</span>
                        <span className="font-medium">{time.city}</span>
                      </div>
                      <span className="font-mono text-sm">{time.time}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Europe & Africa */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Europe & Africa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {worldTimes
                  .filter(t => ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow', 'Africa/Cairo', 'Africa/Johannesburg'].includes(t.timezone))
                  .map(time => (
                    <div key={time.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span>{getFlag(time.country)}</span>
                        <span className="font-medium">{time.city}</span>
                      </div>
                      <span className="font-mono text-sm">{time.time}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Asia & Oceania */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asia & Oceania</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {worldTimes
                  .filter(t => ['Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Dubai', 'Australia/Sydney', 'Pacific/Auckland'].includes(t.timezone))
                  .map(time => (
                    <div key={time.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <span>{getFlag(time.country)}</span>
                        <span className="font-medium">{time.city}</span>
                      </div>
                      <span className="font-mono text-sm">{time.time}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}