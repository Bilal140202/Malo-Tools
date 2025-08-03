'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Users, User, MapPin, Phone, Mail, Calendar, FileText, Plus } from 'lucide-react';

interface RotaryMemberCard {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  memberID: string;
  position: string;
  classification: string;
  club: string;
  district: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  anniversary: string;
  photo: string;
  signature: string;
  template: string;
  generatedAt: string;
}

export default function RotaryMemberDirectoryCards() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    memberID: '',
    position: '',
    classification: '',
    club: '',
    district: '',
    email: '',
    phone: '',
    address: '',
    joinDate: '',
    anniversary: '',
    photo: '',
    signature: '',
    template: 'modern'
  });

  const [generatedCards, setGeneratedCards] = useState<RotaryMemberCard[]>([]);
  const [previewCard, setPreviewCard] = useState<RotaryMemberCard | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchMembers, setBatchMembers] = useState<string[]>(['']);

  const addBatchMember = () => {
    setBatchMembers([...batchMembers, '']);
  };

  const updateBatchMember = (index: number, value: string) => {
    const updated = [...batchMembers];
    updated[index] = value;
    setBatchMembers(updated);
  };

  const removeBatchMember = (index: number) => {
    const updated = batchMembers.filter((_, i) => i !== index);
    setBatchMembers(updated);
  };

  const generateCard = () => {
    if (!formData.firstName || !formData.lastName || !formData.club || !formData.district) {
      alert('Please fill in required fields');
      return;
    }

    const member: RotaryMemberCard = {
      id: Date.now().toString(),
      fullName: `${formData.firstName} ${formData.lastName}`,
      ...formData,
      generatedAt: new Date().toLocaleString()
    };

    setPreviewCard(member);
  };

  const generateBatchCards = () => {
    const validMembers = batchMembers.filter(name => name.trim());
    if (validMembers.length === 0) {
      alert('Please add at least one member name');
      return;
    }

    const cards = validMembers.map((name, index) => {
      const [firstName, lastName] = name.split(' ').filter(n => n);
      return {
        id: (Date.now() + index).toString(),
        firstName: firstName || '',
        lastName: lastName || '',
        fullName: name,
        memberID: `RM-${(Date.now() + index).toString().slice(-6)}`,
        position: formData.position,
        classification: formData.classification,
        club: formData.club,
        district: formData.district,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        joinDate: formData.joinDate,
        anniversary: formData.anniversary,
        photo: formData.photo,
        signature: formData.signature,
        template: formData.template,
        generatedAt: new Date().toLocaleString()
      };
    });

    setGeneratedCards([...cards, ...generatedCards]);
    setBatchMembers(['']);
  };

  const saveCard = () => {
    if (previewCard) {
      setGeneratedCards([previewCard, ...generatedCards]);
      setPreviewCard(null);
      setFormData({
        firstName: '',
        lastName: '',
        memberID: '',
        position: '',
        classification: '',
        club: '',
        district: '',
        email: '',
        phone: '',
        address: '',
        joinDate: '',
        anniversary: '',
        photo: '',
        signature: '',
        template: 'modern'
      });
    }
  };

  const downloadCard = (card: RotaryMemberCard) => {
    alert(`Downloading Rotary member card for: ${card.fullName}`);
  };

  const getMemberCardTemplate = (template: string, member: RotaryMemberCard) => {
    if (template === 'modern') {
      return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold">{member.fullName}</h2>
            <div className="text-sm opacity-90">{member.position}</div>
          </div>

          {/* Member ID */}
          <div className="bg-white/10 rounded-lg p-3 mb-4 text-center">
            <div className="text-xs opacity-75">Member ID</div>
            <div className="font-mono text-lg font-bold">{member.memberID}</div>
          </div>

          {/* Classification */}
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <div className="text-sm opacity-75 mb-1">Classification</div>
            <div className="font-medium">{member.classification}</div>
          </div>

          {/* Club Information */}
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <h3 className="font-semibold mb-2 text-center">{member.club}</h3>
            <div className="text-center text-sm opacity-90">District {member.district}</div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 mb-4">
            {member.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 opacity-75" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 opacity-75" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 opacity-75 mt-0.5" />
                <span className="truncate">{member.address}</span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            {member.joinDate && (
              <div>
                <div className="opacity-75">Joined</div>
                <div>{member.joinDate}</div>
              </div>
            )}
            {member.anniversary && (
              <div>
                <div className="opacity-75">Anniversary</div>
                <div>{member.anniversary}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-3 border-t border-white/20 text-xs opacity-75">
            <div>Rotary International</div>
            <div>Service Above Self</div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border-2 border-blue-600 rounded-lg shadow-lg max-w-sm mx-auto">
        <div className="bg-blue-600 text-white p-4 text-center">
          <h2 className="text-lg font-bold">{member.fullName}</h2>
          <div className="text-sm opacity-90">{member.position}</div>
        </div>
        
        <div className="p-4">
          <div className="text-center mb-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="font-mono text-sm font-bold text-blue-600">{member.memberID}</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Classification:</span> {member.classification}</div>
            <div><span className="font-medium">Club:</span> {member.club}</div>
            <div><span className="font-medium">District:</span> {member.district}</div>
            
            {member.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-blue-600" />
                <span>{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-blue-600" />
                <span>{member.phone}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t text-xs text-gray-500 text-center">
            Rotary International • Service Above Self
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Rotary Member Directory Cards</h1>
          <p className="text-blue-600">Create professional directory cards for Rotary club members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Create Member Directory Card
              </CardTitle>
              <CardDescription>
                Generate professional directory cards for Rotary club members
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

              {batchMode ? (
                <div className="space-y-3">
                  <div>
                    <Label>Member Names (one per line)</Label>
                    <div className="space-y-2">
                      {batchMembers.map((name, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={name}
                            onChange={(e) => updateBatchMember(index, e.target.value)}
                            placeholder="First Last"
                          />
                          {batchMembers.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeBatchMember(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button onClick={addBatchMember} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Member
                      </Button>
                    </div>
                  </div>
                  <Button onClick={generateBatchCards} className="w-full">
                    Generate Batch Cards
                  </Button>
                </div>
              ) : (
                <>
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="First"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Last"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="memberID">Member ID (optional)</Label>
                    <Input
                      id="memberID"
                      value={formData.memberID}
                      onChange={(e) => setFormData({...formData, memberID: e.target.value})}
                      placeholder="RM-123456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Position/Title</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      placeholder="President, Treasurer, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="classification">Classification</Label>
                    <Input
                      id="classification"
                      value={formData.classification}
                      onChange={(e) => setFormData({...formData, classification: e.target.value})}
                      placeholder="Business/Professional Classification"
                    />
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
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">Contact Information</h3>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="member@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
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

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="anniversary">Anniversary Date</Label>
                      <Input
                        id="anniversary"
                        type="date"
                        value={formData.anniversary}
                        onChange={(e) => setFormData({...formData, anniversary: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="template">Template</Label>
                    <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={generateCard} className="flex-1">
                      Generate Card
                    </Button>
                    {previewCard && (
                      <Button onClick={saveCard} variant="outline">
                        Save
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card Preview */}
          <div className="space-y-6">
            {previewCard && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Member Card Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getMemberCardTemplate(previewCard.template, previewCard)}
                  </div>
                  <Button onClick={() => downloadCard(previewCard)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Card
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Cards List */}
            {generatedCards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Generated Member Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedCards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium">{card.fullName}</div>
                          <div className="text-sm text-blue-600">{card.club} • {card.position}</div>
                          <div className="text-xs text-gray-500">ID: {card.memberID}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{card.classification}</Badge>
                          <Button size="sm" onClick={() => downloadCard(card)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rotary Info */}
            {!previewCard && generatedCards.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    About Rotary Member Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p>
                      Rotary member directory cards are professional identification cards used by 
                      Rotary club members for networking and identification purposes.
                    </p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="font-medium text-blue-900 mb-1">Key Information:</p>
                      <ul className="text-blue-800 space-y-1">
                        <li>• Member name and position</li>
                        <li>• Rotary club and district information</li>
                        <li>• Contact details for networking</li>
                        <li>• Member ID for tracking</li>
                        <li>• Professional classification</li>
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