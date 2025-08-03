'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

interface TimeConversion {
  cst: string;
  est: string;
  utc: string;
  pst: string;
  mst: string;
  gmt: string;
}

export default function CstToEstConverter() {
  const [cstTime, setCstTime] = useState('');
  const [conversions, setConversions] = useState<TimeConversion | null>(null);

  const convertTime = () => {
    const time = cstTime.trim();
    if (!time) {
      setConversions(null);
      return;
    }

    // Parse the time (assuming HH:MM format)
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      alert('Please enter a valid time in HH:MM format');
      return;
    }

    // Convert CST to EST (CST is UTC-6, EST is UTC-5, so EST is 1 hour ahead of CST)
    const cstTotalMinutes = hours * 60 + minutes;
    const estTotalMinutes = cstTotalMinutes + 60; // EST is 1 hour ahead of CST
    let estHours = Math.floor(estTotalMinutes / 60) % 24;
    const estMinutes = estTotalMinutes % 60;

    // Convert to other time zones
    const utcTotalMinutes = cstTotalMinutes + 360; // CST is UTC-6, so UTC is 6 hours ahead
    const utcHours = Math.floor(utcTotalMinutes / 60) % 24;
    const utcMinutes = utcTotalMinutes % 60;

    const pstTotalMinutes = cstTotalMinutes - 120; // PST is UTC-8, so 2 hours behind CST
    let pstHours = Math.floor(pstTotalMinutes / 60) % 24;
    if (pstHours < 0) pstHours += 24;
    const pstMinutes = pstTotalMinutes % 60;

    const mstTotalMinutes = cstTotalMinutes - 60; // MST is UTC-7, so 1 hour behind CST
    let mstHours = Math.floor(mstTotalMinutes / 60) % 24;
    if (mstHours < 0) mstHours += 24;
    const mstMinutes = mstTotalMinutes % 60;

    const gmtTotalMinutes = cstTotalMinutes + 360; // GMT is UTC+0, so 6 hours ahead of CST
    let gmtHours = Math.floor(gmtTotalMinutes / 24);
    const gmtDisplayHours = Math.floor(gmtTotalMinutes / 60) % 24;
    const gmtMinutes = gmtTotalMinutes % 60;

    setConversions({
      cst: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      est: `${estHours.toString().padStart(2, '0')}:${estMinutes.toString().padStart(2, '0')}`,
      utc: `${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`,
      pst: `${pstHours.toString().padStart(2, '0')}:${pstMinutes.toString().padStart(2, '0')}`,
      mst: `${mstHours.toString().padStart(2, '0')}:${mstMinutes.toString().padStart(2, '0')}`,
      gmt: `${gmtDisplayHours.toString().padStart(2, '0')}:${gmtMinutes.toString().padStart(2, '0')}`
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const cstOffset = -6; // CST is UTC-6
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const cstTime = new Date(utcTime + (3600000 * cstOffset));
    
    const hours = cstTime.getHours().toString().padStart(2, '0');
    const minutes = cstTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const setCurrentTime = () => {
    setCstTime(getCurrentTime());
    setTimeout(convertTime, 100);
  };

  const clearAll = () => {
    setCstTime('');
    setConversions(null);
  };

  const getTimeZoneInfo = (timezone: string) => {
    const info = {
      cst: { name: 'Central Standard Time', offset: 'UTC-6', cities: 'Chicago, Dallas, Houston' },
      est: { name: 'Eastern Standard Time', offset: 'UTC-5', cities: 'New York, Miami, Atlanta' },
      utc: { name: 'Coordinated Universal Time', offset: 'UTC±0', cities: 'London, Dublin, Lisbon' },
      pst: { name: 'Pacific Standard Time', offset: 'UTC-8', cities: 'Los Angeles, Seattle, San Francisco' },
      mst: { name: 'Mountain Standard Time', offset: 'UTC-7', cities: 'Denver, Phoenix, Salt Lake City' },
      gmt: { name: 'Greenwich Mean Time', offset: 'UTC±0', cities: 'London, Edinburgh, Belfast' }
    };
    return info[timezone as keyof typeof info];
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
                <h1 className="text-xl font-bold text-slate-900">CST to EST Converter</h1>
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
              <Clock className="h-6 w-6" />
              Time Zone Converter
            </CardTitle>
            <CardDescription className="text-base text-center">
              Convert Central Standard Time (CST) to other time zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Input Section */}
            <div className="space-y-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">Central Standard Time (CST)</h3>
                <div className="flex items-center justify-center space-x-4">
                  <Input
                    type="text"
                    value={cstTime}
                    onChange={(e) => setCstTime(e.target.value)}
                    placeholder="HH:MM"
                    className="w-32 text-center text-lg font-mono"
                  />
                  <Button 
                    onClick={convertTime} 
                    disabled={!cstTime.trim()}
                  >
                    Convert
                  </Button>
                  <Button 
                    onClick={setCurrentTime} 
                    variant="outline"
                  >
                    Use Current Time
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Enter time in 24-hour format (HH:MM)
                </p>
              </div>
            </div>

            {/* Results */}
            {conversions && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(conversions).map(([timezone, time]) => (
                    <div key={timezone} className="p-4 bg-white rounded-lg border">
                      <div className="text-center">
                        <div className="text-sm font-medium text-slate-600 mb-1">
                          {getTimeZoneInfo(timezone).name}
                        </div>
                        <div className="text-xs text-slate-500 mb-2">
                          {getTimeZoneInfo(timezone).offset}
                        </div>
                        <div className="text-2xl font-bold font-mono mb-1">
                          {time}
                        </div>
                        <div className="text-sm text-slate-700">
                          {formatTime(time)}
                        </div>
                        <div className="text-xs text-slate-400 mt-2">
                          {getTimeZoneInfo(timezone).cities}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Zone Information */}
                <div className="p-6 bg-slate-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Time Zone Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">Central Standard Time (CST)</h5>
                      <ul className="space-y-1 text-slate-600">
                        <li>• UTC-6</li>
                        <li>• Used in Central US</li>
                        <li>• Major cities: Chicago, Dallas, Houston</li>
                        <li>• Observes DST (UTC-5 during summer)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">Eastern Standard Time (EST)</h5>
                      <ul className="space-y-1 text-slate-600">
                        <li>• UTC-5</li>
                        <li>• Used in Eastern US</li>
                        <li>• Major cities: New York, Miami, Atlanta</li>
                        <li>• 1 hour ahead of CST</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Business Hours Reference */}
                <div className="p-6 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">Business Hours Reference</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">CST Business Hours</h5>
                      <ul className="space-y-1 text-blue-700">
                        <li>• 9:00 AM - 5:00 CST</li>
                        <li>• 10:00 AM - 6:00 EST</li>
                        <li>• 7:00 AM - 3:00 PST</li>
                        <li>• 8:00 AM - 4:00 MST</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Meeting Times</h5>
                      <ul className="space-y-1 text-blue-700">
                        <li>• 9:00 AM CST = 10:00 AM EST</li>
                        <li>• 11:00 AM CST = 12:00 PM EST</li>
                        <li>• 2:00 PM CST = 3:00 PM EST</li>
                        <li>• 4:00 PM CST = 5:00 PM EST</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!conversions && (
              <div className="text-center py-12 text-slate-400">
                <Clock className="h-12 w-12 mx-auto mb-4" />
                <p>Enter a time to see conversions</p>
                <p className="text-sm mt-2">Current CST time: {getCurrentTime()}</p>
              </div>
            )}

            <div className="mt-8 text-center">
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