'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, User, Camera, Palette, FileText } from 'lucide-react';

export default function IDCardGenerator() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    startDate: '',
    photo: '',
    cardColor: 'blue',
    template: 'modern'
  });

  const [generatedCards, setGeneratedCards] = useState<any[]>([]);
  const [previewCard, setPreviewCard] = useState<any>(null);

  const generateIDCard = () => {
    if (!formData.firstName || !formData.lastName || !formData.employeeId) {
      alert('Please fill in all required fields');
      return;
    }

    const card = {
      id: Date.now(),
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`,
      generatedAt: new Date().toLocaleString()
    };

    setPreviewCard(card);
  };

  const saveCard = () => {
    if (previewCard) {
      setGeneratedCards([...generatedCards, previewCard]);
      setPreviewCard(null);
      setFormData({
        firstName: '',
        lastName: '',
        employeeId: '',
        department: '',
        position: '',
        email: '',
        phone: '',
        startDate: '',
        photo: '',
        cardColor: 'blue',
        template: 'modern'
      });
    }
  };

  const downloadCard = (card: any) => {
    alert(`Downloading ID card for: ${card.fullName}`);
  };

  const getCardTemplate = (template: string, color: string) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      red: 'from-red-500 to-red-600',
      orange: 'from-orange-500 to-orange-600',
      teal: 'from-teal-500 to-teal-600'
    };

    const bgClass = colorClasses[color as keyof typeof colorClasses] || 'from-blue-500 to-blue-600';

    if (template === 'modern') {
      return (
        <div className={`bg-gradient-to-br ${bgClass} text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto`}>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{card.fullName}</h3>
              <p className="text-sm opacity-90">{card.position}</p>
              <Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/30">
                {card.employeeId}
              </Badge>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-75">Department:</span>
              <span>{card.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Email:</span>
              <span>{card.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Phone:</span>
              <span>{card.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Since:</span>
              <span>{card.startDate}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs text-center opacity-75">
            Valid ID Card • Generated {card.generatedAt}
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-gradient-to-br ${bgClass} text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto`}>
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <User className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold">{card.fullName}</h3>
          <p className="text-sm opacity-90">{card.position}</p>
        </div>
        <div className="bg-white/10 rounded p-3 mb-4">
          <div className="text-center font-mono text-lg">{card.employeeId}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="opacity-75">Department</div>
            <div>{card.department}</div>
          </div>
          <div>
            <div className="opacity-75">Email</div>
            <div className="truncate">{card.email}</div>
          </div>
          <div>
            <div className="opacity-75">Phone</div>
            <div>{card.phone}</div>
          </div>
          <div>
            <div className="opacity-75">Since</div>
            <div>{card.startDate}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">ID Card Generator</h1>
          <p className="text-indigo-600">Design professional ID cards for employees and members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ID Card Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Create ID Card
              </CardTitle>
              <CardDescription>
                Fill in the employee details to generate an ID card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  placeholder="EMP001"
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="e.g., Engineering, Sales"
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@company.com"
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
              </div>

              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardColor">Card Color</Label>
                  <Select value={formData.cardColor} onValueChange={(value) => setFormData({...formData, cardColor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="teal">Teal</SelectItem>
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="flex gap-2">
                <Button onClick={generateIDCard} className="flex-1">
                  Generate ID Card
                </Button>
                {previewCard && (
                  <Button onClick={saveCard} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ID Card Preview */}
          <div className="space-y-6">
            {previewCard && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-indigo-600" />
                    ID Card Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getCardTemplate(previewCard.template, previewCard.cardColor)}
                  </div>
                  <Button onClick={() => downloadCard(previewCard)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download ID Card
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Cards List */}
            {generatedCards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Generated ID Cards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedCards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <div>
                          <div className="font-medium">{card.fullName}</div>
                          <div className="text-sm text-indigo-600">{card.employeeId} • {card.department}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{card.cardColor}</Badge>
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
          </div>
        </div>
      </div>
    </div>
  );
}