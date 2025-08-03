'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Award, Calendar, User, FileText, Palette, Star } from 'lucide-react';

interface RotaryCertificate {
  id: string;
  recipientName: string;
  certificateType: string;
  rotaryClub: string;
  district: string;
  president: string;
  secretary: string;
  date: string;
  year: string;
  signature: string;
  template: string;
  generatedAt: string;
}

export default function RotaryCertificateGenerator() {
  const [formData, setFormData] = useState({
    recipientName: '',
    certificateType: 'membership',
    rotaryClub: '',
    district: '',
    president: '',
    secretary: '',
    date: '',
    year: '',
    signature: '',
    template: 'rotary-standard',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#dc2626'
  });

  const [generatedCertificates, setGeneratedCertificates] = useState<RotaryCertificate[]>([]);
  const [previewCertificate, setPreviewCertificate] = useState<RotaryCertificate | null>(null);

  const generateCertificate = () => {
    if (!formData.recipientName || !formData.rotaryClub || !formData.district) {
      alert('Please fill in all required fields');
      return;
    }

    const certificate: RotaryCertificate = {
      id: Date.now().toString(),
      ...formData,
      fullName: formData.recipientName,
      generatedAt: new Date().toLocaleString()
    };

    setPreviewCertificate(certificate);
  };

  const saveCertificate = () => {
    if (previewCertificate) {
      setGeneratedCertificates([...generatedCertificates, previewCertificate]);
      setPreviewCertificate(null);
      setFormData({
        recipientName: '',
        certificateType: 'membership',
        rotaryClub: '',
        district: '',
        president: '',
        secretary: '',
        date: '',
        year: '',
        signature: '',
        template: 'rotary-standard',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#dc2626'
      });
    }
  };

  const downloadCertificate = (certificate: RotaryCertificate) => {
    alert(`Downloading Rotary certificate for: ${certificate.recipientName}`);
  };

  const getRotaryCertificateTemplate = (template: string, certificate: RotaryCertificate) => {
    const typeConfig = {
      membership: { 
        title: 'Membership', 
        icon: '👤', 
        color: '#dc2626',
        description: 'This is to certify that'
      },
      recognition: { 
        title: 'Recognition', 
        icon: '🏆', 
        color: '#f59e0b',
        description: 'This certificate is presented to'
      },
      achievement: { 
        title: 'Achievement', 
        icon: '⭐', 
        color: '#10b981',
        description: 'In recognition of outstanding'
      },
      service: { 
        title: 'Service', 
        icon: '🤝', 
        color: '#3b82f6',
        description: 'This certificate acknowledges'
      },
      leadership: { 
        title: 'Leadership', 
        icon: '👑', 
        color: '#8b5cf6',
        description: 'This certificate honors'
      }
    };

    const config = typeConfig[certificate.certificateType as keyof typeof typeConfig] || typeConfig.membership;

    if (template === 'rotary-standard') {
      return (
        <div 
          className="relative bg-white border-2 rounded-lg shadow-lg max-w-2xl mx-auto overflow-hidden"
          style={{ 
            backgroundColor: certificate.backgroundColor,
            borderColor: config.color,
            color: certificate.textColor 
          }}
        >
          {/* Rotary Header */}
          <div className="text-center py-6 border-b" style={{ borderColor: config.color }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: config.color }}>
                {config.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: config.color }}>
                  Rotary International
                </h1>
                <p className="text-lg opacity-75">Certificate of {config.title}</p>
              </div>
            </div>
          </div>

          {/* Certificate Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-xl mb-4 opacity-75">{config.description}</p>
              <h2 className="text-4xl font-bold mb-2" style={{ color: certificate.textColor }}>
                {certificate.recipientName}
              </h2>
              <div className="w-32 h-1 mx-auto mb-4" style={{ backgroundColor: config.color }}></div>
              
              {certificate.certificateType === 'membership' && (
                <p className="text-lg mb-6">for their commitment to the ideals of Rotary</p>
              )}
              {certificate.certificateType === 'recognition' && (
                <p className="text-lg mb-6">for their exceptional contributions to our community</p>
              )}
              {certificate.certificateType === 'achievement' && (
                <p className="text-lg mb-6">achievement and dedication to service</p>
              )}
              {certificate.certificateType === 'service' && (
                <p className="text-lg mb-6">outstanding service to the Rotary club</p>
              )}
              {certificate.certificateType === 'leadership' && (
                <p className="text-lg mb-6">exemplary leadership and vision</p>
              )}
            </div>

            {/* Rotary Club Information */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Rotary Club Information</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-sm opacity-75">Club Name</div>
                  <div className="font-medium">{certificate.rotaryClub}</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">District</div>
                  <div className="font-medium">{certificate.district}</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">President</div>
                  <div className="font-medium">{certificate.president}</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">Secretary</div>
                  <div className="font-medium">{certificate.secretary}</div>
                </div>
              </div>
            </div>

            {/* Date and Year */}
            <div className="text-center mb-8">
              <p className="text-lg">This certificate is presented on</p>
              <p className="text-2xl font-bold mt-2" style={{ color: config.color }}>
                {certificate.date}
              </p>
              <p className="text-sm opacity-75 mt-1">Rotary Year {certificate.year}</p>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between items-end pt-8 border-t" style={{ borderColor: config.color }}>
              <div className="text-left w-1/2">
                <div className="w-32 h-20 border-b-2 border-gray-400 mb-2"></div>
                <p className="text-sm opacity-75">Club President</p>
                {certificate.signature && (
                  <p className="text-sm font-medium mt-1">{certificate.signature}</p>
                )}
              </div>
              <div className="text-right w-1/2">
                <div className="w-32 h-20 border-b-2 border-gray-400 mb-2"></div>
                <p className="text-sm opacity-75">Club Secretary</p>
              </div>
            </div>
          </div>

          {/* Rotary Footer */}
          <div className="bg-gray-100 py-4 text-center text-xs opacity-75">
            <p>Rotary International • Service Above Self</p>
            <p>Certificate ID: RC-{certificate.id.slice(-6)}</p>
            <p>Generated on {certificate.generatedAt}</p>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="bg-white border-2 rounded-lg shadow-lg max-w-2xl mx-auto"
        style={{ borderColor: config.color }}
      >
        <div className="text-center p-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-2" style={{ borderColor: config.color }}>
              {config.icon}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: config.color }}>
            Certificate of {config.title}
          </h1>
          <p className="text-lg mb-6 opacity-75">Rotary International</p>
          
          <p className="text-xl mb-4">{config.description}</p>
          <h2 className="text-4xl font-bold mb-4" style={{ color: certificate.textColor }}>
            {certificate.recipientName}
          </h2>
          
          <div className="w-48 h-1 mx-auto mb-6" style={{ backgroundColor: config.color }}></div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <h3 className="font-semibold mb-3">Rotary Club</h3>
            <p className="font-medium mb-1">{certificate.rotaryClub}</p>
            <p className="text-sm opacity-75">District {certificate.district}</p>
            <p className="text-sm opacity-75">Year {certificate.year}</p>
          </div>
          
          <div className="text-lg mb-6">
            Presented on {certificate.date}
          </div>
          
          <div className="flex justify-between items-end max-w-md mx-auto">
            <div className="text-left">
              <div className="w-32 h-16 border-b-2 border-gray-400"></div>
              <p className="text-sm mt-1">President</p>
            </div>
            <div className="text-right">
              <div className="w-32 h-16 border-b-2 border-gray-400"></div>
              <p className="text-sm mt-1">Secretary</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-2">Rotary Certificate Generator</h1>
          <p className="text-red-600">Create professional certificates for Rotary club members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificate Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-red-600" />
                Create Rotary Certificate
              </CardTitle>
              <CardDescription>
                Generate official Rotary International certificates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipientName">Recipient Name *</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select value={formData.certificateType} onValueChange={(value) => setFormData({...formData, certificateType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="recognition">Recognition</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  placeholder="District 1234"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="president">President</Label>
                  <Input
                    id="president"
                    value={formData.president}
                    onChange={(e) => setFormData({...formData, president: e.target.value})}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="secretary">Secretary</Label>
                  <Input
                    id="secretary"
                    value={formData.secretary}
                    onChange={(e) => setFormData({...formData, secretary: e.target.value})}
                    placeholder="Bob Johnson"
                  />
                </div>
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
                  <Label htmlFor="year">Rotary Year</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    placeholder="2024-25"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signature">President Signature</Label>
                <Input
                  id="signature"
                  value={formData.signature}
                  onChange={(e) => setFormData({...formData, signature: e.target.value})}
                  placeholder="President Name"
                />
              </div>

              <div>
                <Label htmlFor="template">Template</Label>
                <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rotary-standard">Rotary Standard</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateCertificate} className="flex-1">
                  Generate Certificate
                </Button>
                {previewCertificate && (
                  <Button onClick={saveCertificate} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Certificate Preview */}
          <div className="space-y-6">
            {previewCertificate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-600" />
                    Certificate Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getRotaryCertificateTemplate(
                      previewCertificate.template, 
                      previewCertificate
                    )}
                  </div>
                  <Button onClick={() => downloadCertificate(previewCertificate)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Certificates List */}
            {generatedCertificates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-600" />
                    Generated Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium">{cert.recipientName}</div>
                          <div className="text-sm text-red-600">{cert.rotaryClub} • {cert.certificateType}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{cert.district}</Badge>
                          <Button size="sm" onClick={() => downloadCertificate(cert)}>
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
            {!previewCertificate && generatedCertificates.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-red-600" />
                    About Rotary Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p>
                      Rotary International certificates are official documents recognizing member achievements, 
                      service, and leadership within Rotary clubs.
                    </p>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="font-medium text-red-900 mb-1">Certificate Types:</p>
                      <ul className="text-red-800 space-y-1">
                        <li>• Membership - New member induction</li>
                        <li>• Recognition - Outstanding contributions</li>
                        <li>• Achievement - Personal accomplishments</li>
                        <li>• Service - Community service hours</li>
                        <li>• Leadership - Leadership roles</li>
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