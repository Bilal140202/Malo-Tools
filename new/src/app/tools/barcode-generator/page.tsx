'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, QrCode, BarChart3, Copy, RefreshCw } from 'lucide-react';

export default function BarcodeGenerator() {
  const [formData, setFormData] = useState({
    text: '',
    barcodeType: 'CODE128',
    width: 2,
    height: 100,
    format: 'PNG'
  });

  const [generatedBarcodes, setGeneratedBarcodes] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBarcode = () => {
    if (!formData.text.trim()) {
      alert('Please enter text to generate barcode');
      return;
    }

    const barcode = {
      id: Date.now(),
      text: formData.text,
      type: formData.barcodeType,
      width: formData.width,
      height: formData.height,
      format: formData.format,
      timestamp: new Date().toLocaleString()
    };

    // Simulate barcode generation (in real app, use a barcode library)
    setGeneratedBarcodes([barcode, ...generatedBarcodes]);
    
    // Show success message
    alert(`Barcode generated successfully for: ${formData.text}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Barcode text copied to clipboard!');
  };

  const downloadBarcode = (barcode: any) => {
    alert(`Downloading ${barcode.format} barcode for: ${barcode.text}`);
  };

  const generateMultiple = () => {
    const texts = ['123456789', '987654321', '5551234567', '4448889999'];
    texts.forEach(text => {
      const barcode = {
        id: Date.now() + Math.random(),
        text: text,
        type: formData.barcodeType,
        width: formData.width,
        height: formData.height,
        format: formData.format,
        timestamp: new Date().toLocaleString()
      };
      setGeneratedBarcodes(prev => [barcode, ...prev]);
    });
    alert(`Generated ${texts.length} sample barcodes!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Barcode Generator</h1>
          <p className="text-blue-600">Create various types of barcodes for products and inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Barcode Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Generate Barcode
              </CardTitle>
              <CardDescription>
                Enter text and select barcode type to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text">Text/Number *</Label>
                <Input
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  placeholder="Enter text or number for barcode"
                />
              </div>

              <div>
                <Label htmlFor="barcodeType">Barcode Type</Label>
                <Select value={formData.barcodeType} onValueChange={(value) => setFormData({...formData, barcodeType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CODE128">CODE 128</SelectItem>
                    <SelectItem value="CODE39">CODE 39</SelectItem>
                    <SelectItem value="EAN13">EAN-13</SelectItem>
                    <SelectItem value="EAN8">EAN-8</SelectItem>
                    <SelectItem value="UPC">UPC-A</SelectItem>
                    <SelectItem value="ITF14">ITF-14</SelectItem>
                    <SelectItem value="MSI">MSI</SelectItem>
                    <SelectItem value=" Pharmacode">Pharmacode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Bar Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: parseInt(e.target.value) || 2})}
                  />
                </div>

                <div>
                  <Label htmlFor="height">Bar Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="50"
                    max="200"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: parseInt(e.target.value) || 100})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="format">Output Format</Label>
                <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PNG">PNG</SelectItem>
                    <SelectItem value="SVG">SVG</SelectItem>
                    <SelectItem value="JPG">JPG</SelectItem>
                    <SelectItem value="BMP">BMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateBarcode} className="flex-1">
                  Generate Barcode
                </Button>
                <Button onClick={generateMultiple} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Barcodes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                Generated Barcodes
              </CardTitle>
              <CardDescription>
                Your generated barcodes will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedBarcodes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No barcodes generated yet</p>
                  <p className="text-sm">Generate your first barcode using the form</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedBarcodes.map((barcode) => (
                    <div key={barcode.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-sm">{barcode.text}</div>
                          <div className="text-xs text-gray-500">{barcode.type}</div>
                        </div>
                        <Badge variant="secondary">{barcode.format}</Badge>
                      </div>
                      
                      {/* Simulated Barcode Display */}
                      <div className="bg-gray-100 p-4 rounded mb-3">
                        <div className="flex items-center justify-center space-x-0.5">
                          {barcode.text.split('').map((char: string, index: number) => (
                            <div
                              key={index}
                              className="bg-black"
                              style={{
                                width: `${barcode.width}px`,
                                height: `${barcode.height * (0.3 + Math.random() * 0.7)}px`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {barcode.timestamp}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(barcode.text)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => downloadBarcode(barcode)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Canvas for barcode generation (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}