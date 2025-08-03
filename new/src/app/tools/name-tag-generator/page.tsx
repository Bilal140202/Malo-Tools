'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, User, Tag, Palette, Layout, FileText } from 'lucide-react';

export default function NameTagGenerator() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    company: '',
    department: '',
    email: '',
    phone: '',
    website: '',
    template: 'professional',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    orientation: 'horizontal',
    size: 'medium'
  });

  const [generatedTags, setGeneratedTags] = useState<any[]>([]);
  const [previewTag, setPreviewTag] = useState<any>(null);

  const generateNameTag = () => {
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter first and last name');
      return;
    }

    const tag = {
      id: Date.now(),
      fullName: `${formData.firstName} ${formData.lastName}`,
      ...formData,
      generatedAt: new Date().toLocaleString()
    };

    setPreviewTag(tag);
  };

  const saveTag = () => {
    if (previewTag) {
      setGeneratedTags([...generatedTags, previewTag]);
      setPreviewTag(null);
      setFormData({
        firstName: '',
        lastName: '',
        title: '',
        company: '',
        department: '',
        email: '',
        phone: '',
        website: '',
        template: 'professional',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#3b82f6',
        orientation: 'horizontal',
        size: 'medium'
      });
    }
  };

  const downloadTag = (tag: any) => {
    alert(`Downloading name tag for: ${tag.fullName}`);
  };

  const getNameTagTemplate = (template: string, orientation: string, size: string, tag: any) => {
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg'
    };

    const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || 'text-base';

    if (orientation === 'horizontal') {
      if (template === 'professional') {
        return (
          <div 
            className="bg-white border-2 rounded-lg shadow-lg p-6 max-w-md mx-auto"
            style={{ 
              backgroundColor: tag.backgroundColor,
              borderColor: tag.accentColor,
              color: tag.textColor 
            }}
          >
            {/* Header with accent color */}
            <div className="mb-4" style={{ borderBottom: `2px solid ${tag.accentColor}`, paddingBottom: '1rem' }}>
              <h2 className={`text-xl font-bold ${sizeClass}`} style={{ color: tag.accentColor }}>
                {tag.company}
              </h2>
              {tag.department && (
                <p className={`text-sm opacity-75 ${sizeClass}`}>{tag.department}</p>
              )}
            </div>

            {/* Name and Title */}
            <div className="text-center mb-4">
              <h3 className={`text-2xl font-bold mb-1 ${sizeClass}`}>{tag.fullName}</h3>
              {tag.title && (
                <p className={`text-sm opacity-75 ${sizeClass}`}>{tag.title}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              {tag.email && (
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-75">Email:</span>
                  <span className={`text-xs ${sizeClass}`}>{tag.email}</span>
                </div>
              )}
              {tag.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-75">Phone:</span>
                  <span className={`text-xs ${sizeClass}`}>{tag.phone}</span>
                </div>
              )}
              {tag.website && (
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-75">Web:</span>
                  <span className={`text-xs ${sizeClass}`}>{tag.website}</span>
                </div>
              )}
            </div>

            {/* Footer accent */}
            <div className="mt-4 pt-3 border-t" style={{ borderColor: tag.accentColor }}>
              <div className="text-center">
                <Badge style={{ backgroundColor: tag.accentColor, color: 'white' }}>
                  Professional Name Tag
                </Badge>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div 
          className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
          style={{ backgroundColor: tag.backgroundColor }}
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10" />
            </div>
            <h2 className={`text-2xl font-bold mb-1 ${sizeClass}`}>{tag.fullName}</h2>
            {tag.title && (
              <p className={`text-sm opacity-90 mb-4 ${sizeClass}`}>{tag.title}</p>
            )}
            {tag.company && (
              <p className={`text-lg font-semibold mb-4 ${sizeClass}`}>{tag.company}</p>
            )}
            
            <div className="grid grid-cols-1 gap-2 text-sm">
              {tag.department && (
                <div className="bg-white/10 rounded p-2">
                  <span className="opacity-75">Department:</span> {tag.department}
                </div>
              )}
              {tag.email && (
                <div className="bg-white/10 rounded p-2">
                  <span className="opacity-75">Email:</span> {tag.email}
                </div>
              )}
              {tag.phone && (
                <div className="bg-white/10 rounded p-2">
                  <span className="opacity-75">Phone:</span> {tag.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Vertical orientation
      return (
        <div 
          className="bg-white border-2 rounded-lg shadow-lg p-6 max-w-32 mx-auto"
          style={{ 
            backgroundColor: tag.backgroundColor,
            borderColor: tag.accentColor,
            color: tag.textColor 
          }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="h-8 w-8" style={{ color: tag.accentColor }} />
            </div>
            <h3 className={`text-lg font-bold mb-1 ${sizeClass}`}>{tag.fullName}</h3>
            {tag.title && (
              <p className={`text-xs opacity-75 mb-2 ${sizeClass}`}>{tag.title}</p>
            )}
            {tag.company && (
              <p className={`text-xs font-semibold mb-3 ${sizeClass}`} style={{ color: tag.accentColor }}>
                {tag.company}
              </p>
            )}
            
            <div className="space-y-1 text-xs">
              {tag.department && (
                <div className="border-t pt-1">{tag.department}</div>
              )}
              {tag.email && (
                <div className="border-t pt-1">{tag.email}</div>
              )}
              {tag.phone && (
                <div className="border-t pt-1">{tag.phone}</div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-900 mb-2">Name Tag Generator</h1>
          <p className="text-cyan-600">Create professional name tags for events and conferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Name Tag Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-cyan-600" />
                Create Name Tag
              </CardTitle>
              <CardDescription>
                Design custom name tags for your event
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
                <Label htmlFor="title">Title/Position</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="Company name"
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="Department name"
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="www.company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select value={formData.orientation} onValueChange={(value) => setFormData({...formData, orientation: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Background</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                    className="h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="accentColor">Accent</Label>
                  <Input
                    id="accentColor"
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateNameTag} className="flex-1">
                  Generate Name Tag
                </Button>
                {previewTag && (
                  <Button onClick={saveTag} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Name Tag Preview */}
          <div className="space-y-6">
            {previewTag && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-cyan-600" />
                    Name Tag Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getNameTagTemplate(
                      previewTag.template, 
                      previewTag.orientation, 
                      previewTag.size, 
                      previewTag
                    )}
                  </div>
                  <Button onClick={() => downloadTag(previewTag)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Name Tag
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Tags List */}
            {generatedTags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-600" />
                    Generated Name Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedTags.map((tag) => (
                      <div key={tag.id} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                        <div>
                          <div className="font-medium">{tag.fullName}</div>
                          <div className="text-sm text-cyan-600">{tag.company} • {tag.orientation}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{tag.template}</Badge>
                          <Button size="sm" onClick={() => downloadTag(tag)}>
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