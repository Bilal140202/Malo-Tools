'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Ticket, Calendar, Users, MapPin, Clock, QrCode, FileText } from 'lucide-react';

interface RotaryEventTicket {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  address: string;
  ticketNumber: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketType: string;
  price: string;
  rotaryClub: string;
  district: string;
  contact: string;
  generatedAt: string;
}

export default function RotaryEventTicketGenerator() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    address: '',
    ticketNumber: '',
    attendeeName: '',
    attendeeEmail: '',
    ticketType: 'general',
    price: '',
    rotaryClub: '',
    district: '',
    contact: ''
  });

  const [generatedTickets, setGeneratedTickets] = useState<RotaryEventTicket[]>([]);
  const [previewTicket, setPreviewTicket] = useState<RotaryEventTicket | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchCount, setBatchCount] = useState(1);

  const generateTicket = () => {
    if (!formData.eventName || !formData.attendeeName || !formData.rotaryClub) {
      alert('Please fill in required fields');
      return;
    }

    const ticketCount = batchMode ? batchCount : 1;
    const tickets = [];

    for (let i = 0; i < ticketCount; i++) {
      const ticket: RotaryEventTicket = {
        id: Date.now().toString() + i,
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venue: formData.venue,
        address: formData.address,
        ticketNumber: formData.ticketNumber || `RT-${Date.now().toString().slice(-6)}${i.toString().padStart(2, '0')}`,
        attendeeName: formData.attendeeName,
        attendeeEmail: formData.attendeeEmail,
        ticketType: formData.ticketType,
        price: formData.price,
        rotaryClub: formData.rotaryClub,
        district: formData.district,
        contact: formData.contact,
        generatedAt: new Date().toLocaleString()
      };

      tickets.push(ticket);
    }

    if (ticketCount === 1) {
      setPreviewTicket(tickets[0]);
    } else {
      setGeneratedTickets([...tickets, ...generatedTickets]);
      setFormData(prev => ({
        ...prev,
        ticketNumber: '',
        attendeeName: '',
        attendeeEmail: ''
      }));
    }
  };

  const saveTicket = () => {
    if (previewTicket) {
      setGeneratedTickets([previewTicket, ...generatedTickets]);
      setPreviewTicket(null);
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        address: '',
        ticketNumber: '',
        attendeeName: '',
        attendeeEmail: '',
        ticketType: 'general',
        price: '',
        rotaryClub: '',
        district: '',
        contact: ''
      });
    }
  };

  const downloadTicket = (ticket: RotaryEventTicket) => {
    alert(`Downloading Rotary event ticket: ${ticket.ticketNumber}`);
  };

  const getTicketPreview = (ticket: RotaryEventTicket) => (
    <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
      {/* Ticket Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <Ticket className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold">Rotary Event</h2>
        <div className="text-sm opacity-90">Official Ticket</div>
      </div>

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="text-xs opacity-75">Event</div>
          <div className="font-semibold text-sm">{ticket.eventName}</div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 opacity-75" />
          <div>
            <div className="text-xs opacity-75">Date</div>
            <div className="text-sm">{ticket.eventDate}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 opacity-75" />
          <div>
            <div className="text-xs opacity-75">Time</div>
            <div className="text-sm">{ticket.eventTime}</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 opacity-75 mt-0.5" />
          <div>
            <div className="text-xs opacity-75">Venue</div>
            <div className="text-sm">{ticket.venue}</div>
            <div className="text-xs opacity-75">{ticket.address}</div>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="bg-white/10 rounded-lg p-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="opacity-75">Ticket Type</div>
            <div className="font-medium">{ticket.ticketType}</div>
          </div>
          <div>
            <div className="opacity-75">Price</div>
            <div className="font-medium">{ticket.price || 'Free'}</div>
          </div>
          <div>
            <div className="opacity-75">Ticket #</div>
            <div className="font-mono text-xs">{ticket.ticketNumber}</div>
          </div>
          <div>
            <div className="opacity-75">For</div>
            <div className="font-medium text-sm truncate">{ticket.attendeeName}</div>
          </div>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="bg-white rounded-lg p-3 mb-4 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
          <QrCode className="h-10 w-10 text-gray-400" />
        </div>
        <div className="text-xs text-gray-600">Scan for event details</div>
      </div>

      {/* Rotary Club Info */}
      <div className="border-t border-white/20 pt-3 text-center text-xs">
        <div className="font-semibold">{ticket.rotaryClub}</div>
        <div className="opacity-75">District {ticket.district}</div>
        <div className="opacity-75 mt-1">Ticket ID: {ticket.id.slice(-8)}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Rotary Event Ticket Generator</h1>
          <p className="text-red-600">Create professional tickets for Rotary events and fundraisers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-red-600" />
                Create Event Ticket
              </CardTitle>
              <CardDescription>
                Generate tickets for Rotary club events and fundraisers
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
                  <Label htmlFor="batchCount">Number of Tickets</Label>
                  <Input
                    id="batchCount"
                    type="number"
                    min="1"
                    max="50"
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              )}

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
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventTime">Event Time *</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
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

              {/* Ticket Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Ticket Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ticketType">Ticket Type</Label>
                    <Select value={formData.ticketType} onValueChange={(value) => setFormData({...formData, ticketType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Admission</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="sponsor">Sponsor</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="$50.00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ticketNumber">Ticket Number (optional)</Label>
                  <Input
                    id="ticketNumber"
                    value={formData.ticketNumber}
                    onChange={(e) => setFormData({...formData, ticketNumber: e.target.value})}
                    placeholder="RT-001"
                  />
                </div>
              </div>

              {/* Attendee Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Attendee Information</h3>
                <div>
                  <Label htmlFor="attendeeName">Attendee Name *</Label>
                  <Input
                    id="attendeeName"
                    value={formData.attendeeName}
                    onChange={(e) => setFormData({...formData, attendeeName: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="attendeeEmail">Email (optional)</Label>
                  <Input
                    id="attendeeEmail"
                    type="email"
                    value={formData.attendeeEmail}
                    onChange={(e) => setFormData({...formData, attendeeEmail: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Rotary Club Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Rotary Club Information</h3>
                <div>
                  <Label htmlFor="rotaryClub">Rotary Club *</Label>
                  <Input
                    id="rotaryClub"
                    value={formData.rotaryClub}
                    onChange={(e) => setFormData({...formData, rotaryClub: e.target.value})}
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
                  <Label htmlFor="contact">Contact Information</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="events@rotaryclub.org"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateTicket} className="flex-1">
                  Generate Ticket
                </Button>
                {previewTicket && (
                  <Button onClick={saveTicket} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Preview */}
          <div className="space-y-6">
            {previewTicket && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-red-600" />
                    Ticket Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getTicketPreview(previewTicket)}
                  </div>
                  <Button onClick={() => downloadTicket(previewTicket)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Tickets List */}
            {generatedTickets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    Generated Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium">{ticket.eventName}</div>
                          <div className="text-sm text-red-600">{ticket.attendeeName} • {ticket.ticketNumber}</div>
                          <div className="text-xs text-gray-500">{ticket.eventDate} at {ticket.eventTime}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{ticket.ticketType}</Badge>
                          <Button size="sm" onClick={() => downloadTicket(ticket)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Types */}
            {!previewTicket && generatedTickets.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-600" />
                    Common Rotary Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-red-50 p-3 rounded">
                      <div className="font-medium text-red-900">Fundraisers</div>
                      <div className="text-red-700 text-xs">Gala dinners, auctions, charity events</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <div className="font-medium text-red-900">Conferences</div>
                      <div className="text-red-700 text-xs">District conferences, leadership seminars</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <div className="font-medium text-red-900">Social Events</div>
                      <div className="text-red-700 text-xs">Installation dinners, holiday parties</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <div className="font-medium text-red-900">Community Service</div>
                      <div className="text-red-700 text-xs">Volunteer events, community cleanups</div>
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