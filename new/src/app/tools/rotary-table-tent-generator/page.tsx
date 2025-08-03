'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Layout, Users, MapPin, Calendar, FileText, Gift } from 'lucide-react';

interface RotaryTableTent {
  id: string;
  title: string;
  subtitle: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  club: string;
  district: string;
  contact: string;
  sponsor: string;
  tableNumber: string;
  template: string;
  generatedAt: string;
}

export default function RotaryTableTentGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    eventName: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    club: '',
    district: '',
    contact: '',
    sponsor: '',
    tableNumber: '',
    template: 'foldable'
  });

  const [generatedTents, setGeneratedTents] = useState<RotaryTableTent[]>([]);
  const [previewTent, setPreviewTent] = useState<RotaryTableTent | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchCount, setBatchCount] = useState(1);

  const generateTent = () => {
    if (!formData.title || !formData.eventName || !formData.club) {
      alert('Please fill in required fields');
      return;
    }

    const tentCount = batchMode ? batchCount : 1;
    const tents = [];

    for (let i = 0; i < tentCount; i++) {
      const tent: RotaryTableTent = {
        id: Date.now().toString() + i,
        ...formData,
        tableNumber: formData.tableNumber || `T${(i + 1).toString().padStart(2, '0')}`,
        generatedAt: new Date().toLocaleString()
      };

      tents.push(tent);
    }

    if (tentCount === 1) {
      setPreviewTent(tents[0]);
    } else {
      setGeneratedTents([...tents, ...generatedTents]);
      setFormData(prev => ({
        ...prev,
        tableNumber: ''
      }));
    }
  };

  const saveTent = () => {
    if (previewTent) {
      setGeneratedTents([previewTent, ...generatedTents]);
      setPreviewTent(null);
      setFormData({
        title: '',
        subtitle: '',
        eventName: '',
        date: '',
        time: '',
        venue: '',
        address: '',
        club: '',
        district: '',
        contact: '',
        sponsor: '',
        tableNumber: '',
        template: 'foldable'
      });
    }
  };

  const downloadTent = (tent: RotaryTableTent) => {
    alert(`Downloading Rotary table tent: ${tent.title}`);
  };

  const getTableTentTemplate = (template: string, tent: RotaryTableTent) => {
    if (template === 'foldable') {
      return (
        <div className="bg-white border-2 border-blue-600 rounded-lg shadow-lg max-w-xs mx-auto">
          {/* Front Panel */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold mb-1">{tent.title}</h2>
            {tent.subtitle && (
              <p className="text-sm opacity-90 mb-3">{tent.subtitle}</p>
            )}
            <div className="bg-white/10 rounded p-2">
              <div className="text-xs opacity-75">Table</div>
              <div className="text-xl font-bold">{tent.tableNumber}</div>
            </div>
          </div>

          {/* Side Panel 1 */}
          <div className="p-3 border-r border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">Event Details</h3>
            <div className="space-y-1 text-xs">
              <div className="font-medium">{tent.eventName}</div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-600" />
                <span>{tent.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-600" />
                <span>{tent.time}</span>
              </div>
              <div className="flex items-start gap-1">
                <MapPin className="h-3 w-3 text-blue-600 mt-0.5" />
                <span>{tent.venue}</span>
              </div>
            </div>
          </div>

          {/* Side Panel 2 */}
          <div className="p-3">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">Hosted By</h3>
            <div className="space-y-1 text-xs">
              <div className="font-medium">{tent.club}</div>
              <div className="opacity-75">District {tent.district}</div>
              {tent.sponsor && (
                <div className="bg-yellow-100 text-yellow-800 rounded px-2 py-1 mt-2">
                  Sponsored by {tent.sponsor}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="bg-blue-50 p-2 text-center">
            <div className="text-xs text-blue-700">
              {tent.contact && `Contact: ${tent.contact}`}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-blue-300 rounded-lg shadow-lg max-w-xs mx-auto">
        <div className="bg-blue-600 text-white p-3 text-center">
          <h2 className="text-lg font-bold">{tent.title}</h2>
          <div className="text-xs opacity-90">Table {tent.tableNumber}</div>
        </div>
        
        <div className="p-3">
          <div className="mb-3">
            <h3 className="font-semibold text-sm text-blue-900 mb-1">{tent.eventName}</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-600" />
                <span>{tent.date} at {tent.time}</span>
              </div>
              <div className="flex items-start gap-1">
                <MapPin className="h-3 w-3 text-blue-600 mt-0.5" />
                <span>{tent.venue}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-2">
            <div className="text-xs text-gray-600 mb-1">Hosted by {tent.club}</div>
            <div className="text-xs text-gray-600">District {tent.district}</div>
            {tent.sponsor && (
              <div className="bg-yellow-100 text-yellow-800 rounded px-2 py-1 mt-2 text-xs">
                Sponsored by {tent.sponsor}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Rotary Table Tent Generator</h1>
          <p className="text-blue-600">Create professional table tents for Rotary events and meetings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Table Tent Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-blue-600" />
                Create Table Tent
              </CardTitle>
              <CardDescription>
                Generate table tents for Rotary club events and meetings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Batch Mode Toggle */}
              <div className="flex items-center justify-between">
                <Label>Batch Generation</Label>
                <Button
                  variant={batchMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBatchMode(!batchMode)}
                >
                  {batchMode ? 'On' : 'Off'}
                </Button>
              </div>

              {batchMode && (
                <div>
                  <Label htmlFor="batchCount">Number of Tents</Label>
                  <Input
                    id="batchCount"
                    type="number"
                    min="1"
                    max="20"
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}

              {/* Tent Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Tent Information</h3>
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Welcome" or "Reserved"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle (optional)</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="Rotary Club Event"
                  />
                </div>
                <div>
                  <Label htmlFor="tableNumber">Table Number</Label>
                  <Input
                    id="tableNumber"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                    placeholder="T01"
                  />
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Event Information</h3>
                <div>
                  <Label htmlFor="eventName">Event Name *</Label>
                  <Input
                    id="eventName"
                    value={formData.eventName}
                    onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                    placeholder="Annual Gala Dinner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    placeholder="Grand Hotel Ballroom"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>

              {/* Club Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Club Information</h3>
                <div>
                  <Label htmlFor="club">Rotary Club *</Label>
                  <Input
                    id="club"
                    value={formData.club}
                    onChange={(e) => setFormData({...formData, club: e.target.value})}
                    placeholder="Rotary Club of Downtown"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="District 1234"
                  />
                </div>
                <div>
                  <Label htmlFor="sponsor">Sponsor (optional)</Label>
                  <Input
                    id="sponsor"
                    value={formData.sponsor}
                    onChange={(e) => setFormData({...formData, sponsor: e.target.value})}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="events@rotaryclub.org"
                />
              </div>

              <div>
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="foldable">Foldable</SelectItem>
                    <SelectItem value="standalone">Standalone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateTent} className="flex-1">
                  Generate Tent
                </Button>
                {previewTent && (
                  <Button onClick={saveTent} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Table Tent Preview */}
          <div className="space-y-6">
            {previewTent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-blue-600" />
                    Table Tent Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getTableTentTemplate(previewTent.template, previewTent)}
                  </div>
                  <Button onClick={() => downloadTent(previewTent)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Tent
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Tents List */}
            {generatedTents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Generated Table Tents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedTents.map((tent) => (
                      <div key={tent.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium">{tent.title}</div>
                          <div className="text-sm text-blue-600">{tent.eventName} • Table {tent.tableNumber}</div>
                          <div className="text-xs text-gray-500">{tent.club}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{tent.template}</Badge>
                          <Button size="sm" onClick={() => downloadTent(tent)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Instructions */}
            {!previewTent && generatedTents.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-blue-600" />
                    About Table Tents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p>
                      Table tents are perfect for Rotary events, meetings, and fundraisers. 
                      They help guests identify their tables and provide event information.
                    </p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-medium text-blue-900 mb-1">Common Uses:</p>
                      <ul className="text-blue-800 space-y-1">
                        <li>• Gala dinners and banquets</li>
                        <li>• Conference registration tables</li>
                        <li>• Club meetings and events</li>
                        <li>• Fundraiser table assignments</li>
                        <li>• Sponsor recognition displays</li>
                      </ul>
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