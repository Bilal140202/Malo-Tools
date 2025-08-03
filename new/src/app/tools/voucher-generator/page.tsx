'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, Percent, Download, Eye } from 'lucide-react';

export default function VoucherGenerator() {
  const [formData, setFormData] = useState({
    businessName: '',
    voucherTitle: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    validFrom: '',
    validTo: '',
    terms: '',
    maxUses: '',
    code: ''
  });

  const [generatedVouchers, setGeneratedVouchers] = useState<any[]>([]);
  const [previewVoucher, setPreviewVoucher] = useState<any>(null);

  const generateVoucher = () => {
    if (!formData.businessName || !formData.voucherTitle || !formData.discountValue) {
      alert('Please fill in all required fields');
      return;
    }

    const voucher = {
      id: Date.now(),
      businessName: formData.businessName,
      title: formData.voucherTitle,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      validFrom: formData.validFrom,
      validTo: formData.validTo,
      terms: formData.terms,
      maxUses: formData.maxUses,
      code: formData.code || generateRandomCode(),
      createdAt: new Date().toLocaleDateString()
    };

    setPreviewVoucher(voucher);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const saveVoucher = () => {
    if (previewVoucher) {
      setGeneratedVouchers([...generatedVouchers, previewVoucher]);
      setPreviewVoucher(null);
      setFormData({
        businessName: '',
        voucherTitle: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        validFrom: '',
        validTo: '',
        terms: '',
        maxUses: '',
        code: ''
      });
    }
  };

  const downloadVoucher = (voucher: any) => {
    alert(`Downloading voucher: ${voucher.code}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Voucher Generator</h1>
          <p className="text-purple-600">Create custom vouchers and coupons for your business</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Voucher Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                Create New Voucher
              </CardTitle>
              <CardDescription>
                Fill in the details below to generate a custom voucher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <Label htmlFor="voucherTitle">Voucher Title *</Label>
                <Input
                  id="voucherTitle"
                  value={formData.voucherTitle}
                  onChange={(e) => setFormData({...formData, voucherTitle: e.target.value})}
                  placeholder="e.g., Summer Sale Discount"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the offer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(value) => setFormData({...formData, discountType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      <SelectItem value="free">Free Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    placeholder="e.g., 20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxUses">Max Uses (optional)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <Label htmlFor="code">Custom Code (optional)</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Leave blank for auto-generated code"
                />
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Input
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({...formData, terms: e.target.value})}
                  placeholder="Terms and conditions"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={generateVoucher} className="flex-1">
                  Generate Voucher
                </Button>
                {previewVoucher && (
                  <Button onClick={saveVoucher} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Voucher Preview */}
          <div className="space-y-6">
            {previewVoucher && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    Voucher Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{previewVoucher.title}</h3>
                      <p className="text-purple-100 mb-4">{previewVoucher.description}</p>
                      <div className="text-4xl font-bold mb-4">
                        {previewVoucher.discountType === 'percentage' && `${previewVoucher.discountValue}% OFF`}
                        {previewVoucher.discountType === 'fixed' && `$${previewVoucher.discountValue} OFF`}
                        {previewVoucher.discountType === 'free' && 'FREE ITEM'}
                      </div>
                      <div className="bg-white/20 rounded p-3 mb-4">
                        <div className="text-sm">Code: <span className="font-mono font-bold">{previewVoucher.code}</span></div>
                      </div>
                      <div className="text-sm text-purple-100">
                        Valid {previewVoucher.validFrom && `from ${previewVoucher.validFrom} `}
                        {previewVoucher.validTo && `to ${previewVoucher.validTo}`}
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => downloadVoucher(previewVoucher)} className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download Voucher
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Vouchers List */}
            {generatedVouchers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Generated Vouchers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedVouchers.map((voucher) => (
                      <div key={voucher.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">{voucher.title}</div>
                          <div className="text-sm text-purple-600">Code: {voucher.code}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{voucher.discountValue}%</Badge>
                          <Button size="sm" onClick={() => downloadVoucher(voucher)}>
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