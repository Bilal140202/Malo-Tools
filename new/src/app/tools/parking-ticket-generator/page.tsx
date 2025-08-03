'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Car, Ticket, Calendar, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function ParkingTicketGenerator() {
  const [formData, setFormData] = useState({
    ticketNumber: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    location: '',
    zone: '',
    spotNumber: '',
    date: '',
    timeIn: '',
    timeOut: '',
    duration: '',
    rate: '',
    total: '',
    violationType: '',
    officerName: '',
    notes: ''
  });

  const [generatedTickets, setGeneratedTickets] = useState<any[]>([]);
  const [previewTicket, setPreviewTicket] = useState<any>(null);
  const [ticketType, setTicketType] = useState<'parking' | 'violation'>('parking');

  const generateTicket = () => {
    if (!formData.licensePlate || !formData.location) {
      alert('Please fill in license plate and location');
      return;
    }

    const ticket = {
      id: Date.now(),
      ticketNumber: formData.ticketNumber || `TICK-${Date.now().toString().slice(-6)}`,
      ...formData,
      ticketType,
      generatedAt: new Date().toLocaleString()
    };

    setPreviewTicket(ticket);
  };

  const saveTicket = () => {
    if (previewTicket) {
      setGeneratedTickets([...generatedTickets, previewTicket]);
      setPreviewTicket(null);
      setFormData({
        ticketNumber: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleColor: '',
        licensePlate: '',
        location: '',
        zone: '',
        spotNumber: '',
        date: '',
        timeIn: '',
        timeOut: '',
        duration: '',
        rate: '',
        total: '',
        violationType: '',
        officerName: '',
        notes: ''
      });
    }
  };

  const downloadTicket = (ticket: any) => {
    alert(`Downloading parking ticket #${ticket.ticketNumber}`);
  };

  const getTicketPreview = (ticket: any) => {
    if (ticket.ticketType === 'violation') {
      return (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-sm mx-auto shadow-lg">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900">PARKING VIOLATION</h2>
            <div className="text-2xl font-mono text-red-700 mt-2">#{ticket.ticketNumber}</div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="border-t border-red-200 pt-2">
              <div className="text-red-700 font-medium mb-2">Vehicle Information</div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-red-600">License:</div>
                <div className="font-mono text-red-900">{ticket.licensePlate}</div>
                <div className="text-red-600">Make:</div>
                <div>{ticket.vehicleMake}</div>
                <div className="text-red-600">Model:</div>
                <div>{ticket.vehicleModel}</div>
                <div className="text-red-600">Color:</div>
                <div>{ticket.vehicleColor}</div>
              </div>
            </div>

            <div className="border-t border-red-200 pt-2">
              <div className="text-red-700 font-medium mb-2">Violation Details</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-red-600">Type:</span>
                  <span className="font-medium">{ticket.violationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Location:</span>
                  <span>{ticket.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Zone:</span>
                  <span>{ticket.zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Date:</span>
                  <span>{ticket.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Time:</span>
                  <span>{ticket.timeIn}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-red-200 pt-2">
              <div className="text-red-700 font-medium mb-2">Issuing Officer</div>
              <div className="text-red-900">{ticket.officerName}</div>
            </div>

            {ticket.notes && (
              <div className="border-t border-red-200 pt-2">
                <div className="text-red-700 font-medium mb-1">Notes:</div>
                <div className="text-red-900 text-xs">{ticket.notes}</div>
              </div>
            )}

            <div className="text-center mt-4">
              <Badge className="bg-red-600 text-white">VIOLATION TICKET</Badge>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 max-w-sm mx-auto shadow-lg">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Car className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-blue-900">PARKING TICKET</h2>
          <div className="text-2xl font-mono text-blue-700 mt-2">#{ticket.ticketNumber}</div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="border-t border-blue-200 pt-2">
            <div className="text-blue-700 font-medium mb-2">Vehicle Information</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-blue-600">License:</div>
              <div className="font-mono text-blue-900">{ticket.licensePlate}</div>
              <div className="text-blue-600">Make:</div>
              <div>{ticket.vehicleMake}</div>
              <div className="text-blue-600">Model:</div>
              <div>{ticket.vehicleModel}</div>
              <div className="text-blue-600">Color:</div>
              <div>{ticket.vehicleColor}</div>
            </div>
          </div>

          <div className="border-t border-blue-200 pt-2">
            <div className="text-blue-700 font-medium mb-2">Parking Details</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-600">Location:</span>
                <span>{ticket.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Zone:</span>
                <span>{ticket.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Spot:</span>
                <span>{ticket.spotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Date:</span>
                <span>{ticket.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Time In:</span>
                <span>{ticket.timeIn}</span>
              </div>
              {ticket.timeOut && (
                <div className="flex justify-between">
                  <span className="text-blue-600">Time Out:</span>
                  <span>{ticket.timeOut}</span>
                </div>
              )}
              {ticket.duration && (
                <div className="flex justify-between">
                  <span className="text-blue-600">Duration:</span>
                  <span>{ticket.duration}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-blue-200 pt-2">
            <div className="text-blue-700 font-medium mb-2">Payment Details</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-600">Rate:</span>
                <span>${ticket.rate}/hr</span>
              </div>
              {ticket.total && (
                <div className="flex justify-between font-bold text-blue-900">
                  <span>Total:</span>
                  <span>${ticket.total}</span>
                </div>
              )}
            </div>
          </div>

          {ticket.notes && (
            <div className="border-t border-blue-200 pt-2">
              <div className="text-blue-700 font-medium mb-1">Notes:</div>
              <div className="text-blue-900 text-xs">{ticket.notes}</div>
            </div>
          )}

          <div className="text-center mt-4">
            <Badge className="bg-blue-600 text-white">PARKING TICKET</Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parking Ticket Generator</h1>
          <p className="text-gray-600">Generate parking tickets and violation notices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-blue-600" />
                Create Parking Ticket
              </CardTitle>
              <CardDescription>
                Generate parking tickets or violation notices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ticket Type */}
              <div>
                <Label>Ticket Type</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={ticketType === 'parking' ? 'default' : 'outline'}
                    onClick={() => setTicketType('parking')}
                    className="flex-1"
                  >
                    Parking Ticket
                  </Button>
                  <Button
                    variant={ticketType === 'violation' ? 'default' : 'outline'}
                    onClick={() => setTicketType('violation')}
                    className="flex-1"
                  >
                    Violation Notice
                  </Button>
                </div>
              </div>

              {/* Ticket Number */}
              <div>
                <Label htmlFor="ticketNumber">Ticket Number</Label>
                <Input
                  id="ticketNumber"
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({...formData, ticketNumber: e.target.value})}
                  placeholder="TICK-001"
                />
              </div>

              {/* Vehicle Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licensePlate">License Plate *</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                      placeholder="ABC-123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleMake">Make</Label>
                    <Input
                      id="vehicleMake"
                      value={formData.vehicleMake}
                      onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                      placeholder="Toyota"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleModel">Model</Label>
                    <Input
                      id="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                      placeholder="Camry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleColor">Color</Label>
                    <Input
                      id="vehicleColor"
                      value={formData.vehicleColor}
                      onChange={(e) => setFormData({...formData, vehicleColor: e.target.value})}
                      placeholder="Blue"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Location Information</h3>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="zone">Zone</Label>
                    <Input
                      id="zone"
                      value={formData.zone}
                      onChange={(e) => setFormData({...formData, zone: e.target.value})}
                      placeholder="A"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spotNumber">Spot Number</Label>
                    <Input
                      id="spotNumber"
                      value={formData.spotNumber}
                      onChange={(e) => setFormData({...formData, spotNumber: e.target.value})}
                      placeholder="101"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Time Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timeIn">Time In</Label>
                  <Input
                    id="timeIn"
                    type="time"
                    value={formData.timeIn}
                    onChange={(e) => setFormData({...formData, timeIn: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="timeOut">Time Out</Label>
                  <Input
                    id="timeOut"
                    type="time"
                    value={formData.timeOut}
                    onChange={(e) => setFormData({...formData, timeOut: e.target.value})}
                  />
                </div>
              </div>

              {/* Payment Information (for parking tickets) */}
              {ticketType === 'parking' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="2 hours"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Rate ($/hr)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={formData.rate}
                      onChange={(e) => setFormData({...formData, rate: e.target.value})}
                      placeholder="5.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total">Total</Label>
                    <Input
                      id="total"
                      type="number"
                      value={formData.total}
                      onChange={(e) => setFormData({...formData, total: e.target.value})}
                      placeholder="10.00"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Violation Type (for violation tickets) */}
              {ticketType === 'violation' && (
                <div>
                  <Label htmlFor="violationType">Violation Type</Label>
                  <Select value={formData.violationType} onValueChange={(value) => setFormData({...formData, violationType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expired Meter">Expired Meter</SelectItem>
                      <SelectItem value="No Permit">No Permit</SelectItem>
                      <SelectItem value="Handicap Violation">Handicap Violation</SelectItem>
                      <SelectItem value="Fire Lane">Fire Lane</SelectItem>
                      <SelectItem value="Double Parking">Double Parking</SelectItem>
                      <SelectItem value="Over Time Limit">Over Time Limit</SelectItem>
                      <SelectItem value="Wrong Zone">Wrong Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Officer Information */}
              <div>
                <Label htmlFor="officerName">Officer Name</Label>
                <Input
                  id="officerName"
                  value={formData.officerName}
                  onChange={(e) => setFormData({...formData, officerName: e.target.value})}
                  placeholder="John Smith"
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes"
                />
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
                    <Car className="h-5 w-5 text-blue-600" />
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
                    <FileText className="h-5 w-5 text-blue-600" />
                    Generated Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium">#{ticket.ticketNumber}</div>
                          <div className="text-sm text-blue-600">{ticket.licensePlate}</div>
                          <div className="text-xs text-gray-500">{ticket.location}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={ticket.ticketType === 'violation' ? 'destructive' : 'secondary'}>
                            {ticket.ticketType}
                          </Badge>
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
          </div>
        </div>
      </div>
    </div>
  );
}