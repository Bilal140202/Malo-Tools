'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, Palette, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface ColorFormat {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorFormats, setColorFormats] = useState<ColorFormat>({
    hex: '#3b82f6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    hsv: 'hsv(217, 76%, 96%)'
  });
  const [copied, setCopied] = useState('');

  useEffect(() => {
    updateColorFormats(selectedColor);
  }, [selectedColor]);

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h! /= 6;
    }

    return [h! * 360, s * 100, l * 100];
  };

  const rgbToHsv = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, v * 100];
  };

  const updateColorFormats = (hex: string) => {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    const [hv, sv, vv] = rgbToHsv(r, g, b);

    setColorFormats({
      hex: hex.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`,
      hsv: `hsv(${Math.round(hv)}, ${Math.round(sv)}%, ${Math.round(vv)}%)`
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.startsWith('#') && (value.length === 7 || value.length === 4)) {
      setSelectedColor(value);
    }
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) {
      value = '#' + value;
    }
    
    // Simple validation for hex color
    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
      setSelectedColor(value);
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(''), 2000);
  };

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    setSelectedColor(color);
  };

  const [showText, setShowText] = useState(true);
  const [textColor, setTextColor] = useState('#ffffff');

  const getContrastColor = (hexColor: string): string => {
    const [r, g, b] = hexToRgb(hexColor);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Color Picker</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-pink-100 text-pink-800">
                    media
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Picker
                </CardTitle>
                <CardDescription>
                  Select or enter a color to see different formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Color Preview */}
                  <div 
                    className="w-full h-32 rounded-lg border-2 border-slate-300 relative overflow-hidden"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {showText && (
                      <div 
                        className="w-full h-full flex items-center justify-center font-bold text-lg"
                        style={{ color: textColor }}
                      >
                        {selectedColor}
                      </div>
                    )}
                  </div>

                  {/* Color Input */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Hex Color
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          value={selectedColor}
                          onChange={handleColorChange}
                          className="flex-1 font-mono"
                        />
                        <Input
                          value={selectedColor.slice(1)}
                          onChange={handleHexInput}
                          placeholder="Hex without #"
                          className="w-24 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={generateRandomColor}
                        variant="outline"
                        className="flex-1"
                      >
                        Random Color
                      </Button>
                      <Button
                        onClick={() => setShowText(!showText)}
                        variant="outline"
                        className="flex-1"
                      >
                        {showText ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {showText ? 'Hide Text' : 'Show Text'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Formats */}
            <Card>
              <CardHeader>
                <CardTitle>Color Formats</CardTitle>
                <CardDescription>
                  Different representations of your selected color
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(colorFormats).map(([format, value]) => (
                  <div key={format} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: value }}
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900 capitalize">
                          {format}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format === 'hex' ? 'Hexadecimal' : 
                           format === 'rgb' ? 'Red Green Blue' :
                           format === 'hsl' ? 'Hue Saturation Lightness' :
                           'Hue Saturation Value'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={value}
                        readOnly
                        className="w-32 font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(value, format)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Color Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">RGB Values</div>
                    <div className="font-mono text-sm font-medium">
                      {colorFormats.rgb}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">HSL Values</div>
                    <div className="font-mono text-sm font-medium">
                      {colorFormats.hsl}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">HSV Values</div>
                    <div className="font-mono text-sm font-medium">
                      {colorFormats.hsv}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">HEX</div>
                    <div className="font-mono text-sm font-medium">
                      {colorFormats.hex}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Harmony</CardTitle>
                <CardDescription>
                  Color schemes that work well with your selected color
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded mb-2 border"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div className="text-xs text-slate-600">Original</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded mb-2 border"
                      style={{ backgroundColor: adjustBrightness(selectedColor, -20) }}
                    />
                    <div className="text-xs text-slate-600">Darker</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded mb-2 border"
                      style={{ backgroundColor: adjustBrightness(selectedColor, 20) }}
                    />
                    <div className="text-xs text-slate-600">Lighter</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded mb-2 border"
                      style={{ backgroundColor: getComplementaryColor(selectedColor) }}
                    />
                    <div className="text-xs text-slate-600">Complement</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-full h-16 rounded mb-2 border"
                      style={{ backgroundColor: getTriadicColor(selectedColor, 1) }}
                    />
                    <div className="text-xs text-slate-600">Triadic</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {copied && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {copied} copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions
function adjustBrightness(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));
  return rgbToHex(newR, newG, newB);
}

function getComplementaryColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(255 - r, 255 - g, 255 - b);
}

function getTriadicColor(hex: string, index: number): string {
  const [r, g, b] = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  const newH = (hsl[0] + 120 * index) % 360;
  return hslToHex(newH, hsl[1], hsl[2]);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}