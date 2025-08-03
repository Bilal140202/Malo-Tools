'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Award, Calendar, User, FileText, Palette } from 'lucide-react';

export default function CertificateGenerator() {
  const [formData, setFormData] = useState({
    recipientName: '',
    courseName: '',
    issuedBy: '',
    issueDate: '',
    expiryDate: '',
    certificateType: 'achievement',
    template: 'elegant',
    backgroundColor: '#f8f9fa',
    textColor: '#2c3e50',
    signature: '',
    seal: ''
  });

  const [generatedCertificates, setGeneratedCertificates] = useState<any[]>([]);
  const [previewCertificate, setPreviewCertificate] = useState<any>(null);

  const generateCertificate = () => {
    if (!formData.recipientName || !formData.courseName || !formData.issuedBy) {
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
        courseName: '',
        issuedBy: '',
        issueDate: '',
        expiryDate: '',
        certificateType: 'achievement',
        template: 'elegant',
        backgroundColor: '#f8f9fa',
        textColor: '#2c3e50',
        signature: '',
        seal: ''
      });
    }
  };

  const downloadCertificate = (certificate: any) => {
    alert(`Downloading certificate for: ${certificate.fullName}`);
  };

  const getCertificateTemplate = (template: string, certificate: any) => {
    const typeColors = {
      achievement: 'from-yellow-400 to-orange-500',
      completion: 'from-blue-400 to-purple-500',
      participation: 'from-green-400 to-teal-500',
      excellence: 'from-red-400 to-pink-500',
      honor: 'from-purple-400 to-indigo-500'
    };

    const colorClass = typeColors[certificate.certificateType as keyof typeof typeColors] || 'from-yellow-400 to-orange-500';

    if (template === 'elegant') {
      return (
        <div className={`bg-gradient-to-br ${colorClass} text-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto relative overflow-hidden`} style={{ backgroundColor: certificate.backgroundColor }}>
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white/30 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 border-4 border-white/30 rounded-full"></div>
          
          <div className="text-center relative z-10">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ color: certificate.textColor }}>
                Certificate of {certificate.certificateType.charAt(0).toUpperCase() + certificate.certificateType.slice(1)}
              </h1>
              <div className="w-32 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-lg opacity-90">This is to certify that</p>
            </div>

            {/* Recipient Name */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold mb-2" style={{ color: certificate.textColor }}>
                {certificate.fullName}
              </h2>
              <div className="w-48 h-1 bg-white mx-auto"></div>
            </div>

            {/* Course/ Achievement */}
            <div className="mb-8">
              <p className="text-xl mb-2" style={{ color: certificate.textColor }}>
                has successfully completed
              </p>
              <h3 className="text-3xl font-semibold mb-2" style={{ color: certificate.textColor }}>
                {certificate.courseName}
              </h3>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <p className="opacity-75">Issued By:</p>
                <p style={{ color: certificate.textColor }}>{certificate.issuedBy}</p>
              </div>
              <div>
                <p className="opacity-75">Issue Date:</p>
                <p style={{ color: certificate.textColor }}>{certificate.issueDate}</p>
              </div>
              {certificate.expiryDate && (
                <div>
                  <p className="opacity-75">Valid Until:</p>
                  <p style={{ color: certificate.textColor }}>{certificate.expiryDate}</p>
                </div>
              )}
            </div>

            {/* Signature and Seal */}
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="text-left">
                <div className="w-32 h-20 border-b-2 border-white/50 mb-2"></div>
                <p className="text-sm opacity-75">Signature</p>
                {certificate.signature && (
                  <p className="text-sm" style={{ color: certificate.textColor }}>{certificate.signature}</p>
                )}
              </div>
              <div className="text-right">
                <div className="w-16 h-16 border-2 border-white/50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-8 w-8" />
                </div>
                <p className="text-sm opacity-75">Official Seal</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-white/30 text-xs opacity-75">
              <p>Certificate ID: CERT-{certificate.id.toString().slice(-6)}</p>
              <p>Generated on {certificate.generatedAt}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border-2 border-gray-200 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Certificate of {certificate.certificateType.charAt(0).toUpperCase() + certificate.certificateType.slice(1)}</h1>
          <p className="text-gray-600 mb-6">This certificate is proudly presented to</p>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{certificate.fullName}</h2>
          <p className="text-lg text-gray-600 mb-2">for successfully completing</p>
          <h3 className="text-2xl font-semibold text-gray-800 mb-8">{certificate.courseName}</h3>
          
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-left">
              <p className="text-sm text-gray-500">Issued By:</p>
              <p className="font-medium text-gray-800">{certificate.issuedBy}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date:</p>
              <p className="font-medium text-gray-800">{certificate.issueDate}</p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-300">
            <div className="flex justify-between items-end">
              <div className="w-32 h-20 border-b-2 border-gray-400"></div>
              <div className="w-16 h-16 border-2 border-gray-400 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Certificate Generator</h1>
          <p className="text-purple-600">Create professional certificates of achievement and completion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificate Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Create Certificate
              </CardTitle>
              <CardDescription>
                Fill in the details to generate a professional certificate
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
                <Label htmlFor="courseName">Course/ Achievement *</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  placeholder="Advanced Web Development"
                />
              </div>

              <div>
                <Label htmlFor="issuedBy">Issued By *</Label>
                <Input
                  id="issuedBy"
                  value={formData.issuedBy}
                  onChange={(e) => setFormData({...formData, issuedBy: e.target.value})}
                  placeholder="Company Name or Institution"
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
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="participation">Participation</SelectItem>
                    <SelectItem value="excellence">Excellence</SelectItem>
                    <SelectItem value="honor">Honor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elegant">Elegant</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="signature">Authorized Signature</Label>
                  <Input
                    id="signature"
                    value={formData.signature}
                    onChange={(e) => setFormData({...formData, signature: e.target.value})}
                    placeholder="Director Name"
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
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Certificate Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getCertificateTemplate(previewCertificate.template, previewCertificate)}
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
                    <FileText className="h-5 w-5 text-purple-600" />
                    Generated Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">{cert.fullName}</div>
                          <div className="text-sm text-purple-600">{cert.courseName}</div>
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