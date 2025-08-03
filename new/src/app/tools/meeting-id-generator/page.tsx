'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Calendar, Clock, Users, Share2, Download } from 'lucide-react';

export default function MeetingIDGenerator() {
  const [formData, setFormData] = useState({
    meetingName: '',
    meetingType: 'video',
    participantCount: '10',
    duration: '60',
    date: '',
    time: '',
    timezone: 'UTC',
    prefix: 'MEET',
    includeNumbers: true,
    includeLetters: true,
    length: 8
  });

  const [generatedIDs, setGeneratedIDs] = useState<any[]>([]);
  const [currentID, setCurrentID] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMeetingID = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const id = generateRandomID();
      const meeting = {
        id: Date.now(),
        meetingID: id,
        meetingName: formData.meetingName || `Meeting ${generatedIDs.length + 1}`,
        meetingType: formData.meetingType,
        participantCount: formData.participantCount,
        duration: formData.duration,
        date: formData.date,
        time: formData.time,
        timezone: formData.timezone,
        generatedAt: new Date().toLocaleString(),
        expiresAt: calculateExpiry()
      };

      setCurrentID(meeting);
      setGeneratedIDs([meeting, ...generatedIDs]);
      setIsGenerating(false);
    }, 1000);
  };

  const generateRandomID = () => {
    const numbers = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charset = '';
    
    if (formData.includeNumbers) charset += numbers;
    if (formData.includeLetters) charset += letters;
    
    if (!charset) charset = numbers; // fallback to numbers only
    
    let result = formData.prefix;
    for (let i = 0; i < formData.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return result;
  };

  const calculateExpiry = () => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
    return expiry.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Meeting ID copied to clipboard!');
  };

  const shareMeeting = (meeting: any) => {
    const shareText = `Join my meeting: ${meeting.meetingID}\nMeeting: ${meeting.meetingName}\nDate: ${meeting.date} ${meeting.time} ${meeting.timezone}`;
    
    if (navigator.share) {
      navigator.share({
        title: meeting.meetingName,
        text: shareText,
        url: window.location.href
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const downloadMeetingDetails = (meeting: any) => {
    const details = `Meeting Details:
Meeting ID: ${meeting.meetingID}
Meeting Name: ${meeting.meetingName}
Type: ${meeting.meetingType}
Participants: ${meeting.participantCount}
Duration: ${meeting.duration} minutes
Date: ${meeting.date}
Time: ${meeting.time} ${meeting.timezone}
Generated: ${meeting.generatedAt}
Expires: ${meeting.expiresAt}`;

    const blob = new Blob([details], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-details-${meeting.meetingID}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateBatch = () => {
    const batchIDs = [];
    for (let i = 0; i < 5; i++) {
      const id = generateRandomID();
      batchIDs.push({
        id: Date.now() + i,
        meetingID: id,
        meetingName: `Meeting ${generatedIDs.length + i + 1}`,
        meetingType: formData.meetingType,
        participantCount: formData.participantCount,
        duration: formData.duration,
        date: formData.date,
        time: formData.time,
        timezone: formData.timezone,
        generatedAt: new Date().toLocaleString(),
        expiresAt: calculateExpiry()
      });
    }
    setGeneratedIDs([...batchIDs, ...generatedIDs]);
  };

  useEffect(() => {
    // Set default date and time to now
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0],
      time: tomorrow.toTimeString().slice(0, 5)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Meeting ID Generator</h1>
          <p className="text-blue-600">Generate unique meeting IDs for video and audio conferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meeting ID Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Generate Meeting ID
              </CardTitle>
              <CardDescription>
                Create unique meeting IDs for your conferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meetingName">Meeting Name (optional)</Label>
                <Input
                  id="meetingName"
                  value={formData.meetingName}
                  onChange={(e) => setFormData({...formData, meetingName: e.target.value})}
                  placeholder="Team Standup, Client Meeting, etc."
                />
              </div>

              <div>
                <Label htmlFor="meetingType">Meeting Type</Label>
                <Select value={formData.meetingType} onValueChange={(value) => setFormData({...formData, meetingType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Conference</SelectItem>
                    <SelectItem value="audio">Audio Conference</SelectItem>
                    <SelectItem value="both">Video & Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participantCount">Max Participants</Label>
                  <Select value={formData.participantCount} onValueChange={(value) => setFormData({...formData, participantCount: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST (Eastern)</SelectItem>
                    <SelectItem value="CST">CST (Central)</SelectItem>
                    <SelectItem value="MST">MST (Mountain)</SelectItem>
                    <SelectItem value="PST">PST (Pacific)</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                    <SelectItem value="CET">CET (Central Europe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="prefix">ID Prefix</Label>
                <Input
                  id="prefix"
                  value={formData.prefix}
                  onChange={(e) => setFormData({...formData, prefix: e.target.value})}
                  placeholder="MEET"
                  maxLength={10}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length">ID Length</Label>
                  <Select value={formData.length.toString()} onValueChange={(value) => setFormData({...formData, length: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeNumbers"
                    checked={formData.includeNumbers}
                    onChange={(e) => setFormData({...formData, includeNumbers: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="includeNumbers" className="text-sm">Numbers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeLetters"
                    checked={formData.includeLetters}
                    onChange={(e) => setFormData({...formData, includeLetters: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="includeLetters" className="text-sm">Letters</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateMeetingID} 
                  className="flex-1"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Generate Meeting ID
                    </>
                  )}
                </Button>
                <Button onClick={generateBatch} variant="outline">
                  <RefreshCw className="h-4 w-4" />
                  Batch
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Meeting IDs */}
          <div className="space-y-6">
            {currentID && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Current Meeting ID
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-6 mb-4">
                      <div className="text-3xl font-bold text-blue-900 font-mono tracking-wider">
                        {currentID.meetingID}
                      </div>
                      <div className="text-sm text-blue-700 mt-2">
                        Meeting: {currentID.meetingName}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <div className="font-medium">Type:</div>
                        <div>{currentID.meetingType}</div>
                      </div>
                      <div>
                        <div className="font-medium">Participants:</div>
                        <div>{currentID.participantCount}</div>
                      </div>
                      <div>
                        <div className="font-medium">Duration:</div>
                        <div>{currentID.duration} min</div>
                      </div>
                      <div>
                        <div className="font-medium">Expires:</div>
                        <div>{new Date(currentID.expiresAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => copyToClipboard(currentID.meetingID)} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy ID
                    </Button>
                    <Button 
                      onClick={() => shareMeeting(currentID)} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      onClick={() => downloadMeetingDetails(currentID)} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Meeting IDs List */}
            {generatedIDs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Generated Meeting IDs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedIDs.map((meeting) => (
                      <div key={meeting.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-mono font-bold text-blue-900">{meeting.meetingID}</div>
                          <div className="text-sm text-blue-600">{meeting.meetingName}</div>
                          <div className="text-xs text-gray-500">{meeting.generatedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{meeting.meetingType}</Badge>
                          <Button size="sm" onClick={() => copyToClipboard(meeting.meetingID)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => shareMeeting(meeting)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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