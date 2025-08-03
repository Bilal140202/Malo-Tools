'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Gift, Star, FileText, Palette } from 'lucide-react';

export default function FreeCertificateGenerator() {
  const [formData, setFormData] = useState({
    recipientName: '',
    achievementTitle: '',
    organization: '',
    issueDate: '',
    expiryDate: '',
    certificateType: 'participation',
    template: 'modern',
    backgroundColor: '#ffffff',
    textColor: '#2563eb',
    borderColor: '#e5e7eb',
    signature: '',
    watermark: ''
  });

  const [generatedCertificates, setGeneratedCertificates] = useState<any[]>([]);
  const [previewCertificate, setPreviewCertificate] = useState<any>(null);

  const generateCertificate = () => {
    if (!formData.recipientName || !formData.achievementTitle || !formData.organization) {
      alert('Please fill in all required fields');
      return;
    }

    const certificate = {
      id: Date.now(),
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
        achievementTitle: '',
        organization: '',
        issueDate: '',
        expiryDate: '',
        certificateType: 'participation',
        template: 'modern',
        backgroundColor: '#ffffff',
        textColor: '#2563eb',
        borderColor: '#e5e7eb',
        signature: '',
        watermark: ''
      });
    }
  };

  const downloadCertificate = (certificate: any) => {
    alert(`Downloading free certificate for: ${certificate.fullName}`);
  };

  const getCertificateTemplate = (template: string, certificate: any) => {
    const typeConfig = {
      participation: { icon: '👥', color: '#10b981', title: 'Participation' },
      completion: { icon: '✅', color: '#3b82f6', title: 'Completion' },
      achievement: { icon: '🏆', color: '#f59e0b', title: 'Achievement' },
      excellence: { icon: '⭐', color: '#ef4444', title: 'Excellence' },
      honor: { icon: '🎖️', color: '#8b5cf6', title: 'Honor' }
    };

    const config = typeConfig[certificate.certificateType as keyof typeof typeConfig] || typeConfig.participation;

    if (template === 'modern') {
      return (
        <div 
          className="relative p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-2"
          style={{ 
            backgroundColor: certificate.backgroundColor, 
            borderColor: certificate.borderColor,
            color: certificate.textColor 
          }}
        >
          {/* Watermark */}
          {certificate.watermark && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="text-6xl font-bold">{certificate.watermark}</div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: config.color }}>
                {config.icon}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Certificate of {config.title}</h1>
            <div className="w-24 h-1 mx-auto mb-4" style={{ backgroundColor: config.color }}></div>
            <p className="text-lg opacity-75">This certificate is proudly presented to</p>
          </div>

          {/* Recipient Name */}
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-2" style={{ color: certificate.textColor }}>
              {certificate.fullName}
            </h2>
            <div className="w-48 h-1 mx-auto mb-4" style={{ backgroundColor: config.color }}></div>
          </div>

          {/* Achievement */}
          <div className="text-center mb-8">
            <p className="text-xl mb-2">in recognition of</p>
            <h3 className="text-3xl font-semibold mb-2" style={{ color: certificate.textColor }}>
              {certificate.achievementTitle}
            </h3>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-center">
            <div>
              <p className="text-sm opacity-75 mb-1">Issued By</p>
              <p className="font-medium" style={{ color: certificate.textColor }}>{certificate.organization}</p>
            </div>
            <div>
              <p className="text-sm opacity-75 mb-1">Date</p>
              <p className="font-medium" style={{ color: certificate.textColor }}>{certificate.issueDate}</p>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <div className="w-32 h-16 border-b-2 border-gray-400 mb-2"></div>
                <p className="text-sm opacity-75">Authorized Signature</p>
                {certificate.signature && (
                  <p className="text-sm font-medium" style={{ color: certificate.textColor }}>{certificate.signature}</p>
                )}
              </div>
              <div className="text-right">
                <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <Star className="h-6 w-6" style={{ color: config.color }} />
                </div>
                <p className="text-sm opacity-75 mt-1">Official Seal</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs opacity-75">
            <p>Certificate ID: FREE-{certificate.id.toString().slice(-6)}</p>
            <p>Generated on {certificate.generatedAt} • Free Certificate</p>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto border-2"
        style={{ borderColor: certificate.borderColor }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2" style={{ borderColor: config.color }}>
              {config.icon}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4" style={{ color: certificate.textColor }}>
            Certificate of {config.title}
          </h1>
          
          <p className="text-lg mb-6 opacity-75">This certificate is proudly presented to</p>
          
          <h2 className="text-4xl font-bold mb-4" style={{ color: certificate.textColor }}>
            {certificate.fullName}
          </h2>
          
          <p className="text-xl mb-2">in recognition of</p>
          <h3 className="text-2xl font-semibold mb-8" style={{ color: certificate.textColor }}>
            {certificate.achievementTitle}
          </h3>
          
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <p className="text-sm opacity-75 mb-1">Issued By</p>
              <p className="font-medium" style={{ color: certificate }}>{certificate.organization}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-75 mb-1">Date</p>
              <p className="font-medium" style={{ color: certificate }}>{certificate.issueDate}</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex justify-between items-end">
              <div className="w-32 h-16 border-b-2 border-gray-400"></div>
              <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <Star className="h-6 w-6" style={{ color: config.color }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Free Certificate Generator</h1>
          <p className="text-green-600">Create free certificates of achievement and participation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificate Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Create Free Certificate
              </CardTitle>
              <CardDescription>
                Generate professional certificates at no cost
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
                <Label htmlFor="achievementTitle">Achievement Title *</Label>
                <Input
                  id="achievementTitle"
                  value={formData.achievementTitle}
                  onChange={(e) => setFormData({...formData, achievementTitle: e.target.value})}
                  placeholder="Web Development Course"
                />
              </div>

              <div>
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  placeholder="Training Institute"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueDate">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select value={formData.certificateType} onValueChange={(value) => setFormData({...formData, certificateType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participation">Participation</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="excellence">Excellence</SelectItem>
                    <SelectItem value="honor">Honor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="template">Template Style</Label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="signature">Authorized Signature</Label>
                  <Input
                    id="signature"
                    value={formData.signature}
                    onChange={(e) => setFormData({...formData, signature: e.target.value})}
                    placeholder="Director Name"
                  />
                </div>
                <div>
                  <Label htmlFor="watermark">Watermark (optional)</Label>
                  <Input
                    id="watermark"
                    value={formData.watermark}
                    onChange={(e) => setFormData({...formData, watermark: e.target.value})}
                    placeholder="Your Company"
                  />
                </div>
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
                    <Star className="h-5 w-5 text-green-600" />
                    Certificate Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getCertificateTemplate(previewCertificate.template, previewCertificate)}
                  </div>
                  <Button onClick={() => downloadCertificate(previewCertificate)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Free Certificate
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Certificates List */}
            {generatedCertificates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Generated Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">{cert.fullName}</div>
                          <div className="text-sm text-green-600">{cert.achievementTitle}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{cert.certificateType}</Badge>
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
          </div>
        </div>
      </div>
    </div>
  );
}