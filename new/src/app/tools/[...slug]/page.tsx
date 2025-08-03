'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ToolData {
  name: string;
  description: string;
  category: string;
  component?: React.ComponentType<any>;
}

const tools: Record<string, ToolData> = {
  'qr-code-generator': {
    name: 'QR Code Generator',
    description: 'Generate QR codes for links, text, and more',
    category: 'generator'
  },
  'calculator': {
    name: 'Calculator',
    description: 'Basic calculator for everyday calculations',
    category: 'calculator'
  },
  'json-formatter': {
    name: 'JSON Formatter',
    description: 'Format and validate JSON code',
    category: 'development'
  },
  'temperature-converter': {
    name: 'Temperature Converter',
    description: 'Convert temperature units',
    category: 'converter'
  },
  'unit-converter': {
    name: 'Unit Converter',
    description: 'Convert various units of measurement',
    category: 'converter'
  },
  'age-calculator': {
    name: 'Age Calculator',
    description: 'Calculate age from date of birth',
    category: 'calculator'
  },
  'word-counter': {
    name: 'Word Counter',
    description: 'Count words and characters in text',
    category: 'productivity'
  },
  'stopwatch': {
    name: 'Stopwatch',
    description: 'Online stopwatch timer',
    category: 'productivity'
  },
  'base64-encoder': {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings',
    category: 'converter'
  },
  'color-picker': {
    name: 'Color Picker',
    description: 'Pick and manipulate colors',
    category: 'media'
  },
  'random-generator': {
    name: 'Random Generator',
    description: 'Generate random numbers, strings, and more',
    category: 'generator'
  },
  'celsius-to-fahrenheit': {
    name: 'Celsius to Fahrenheit',
    description: 'Temperature conversion',
    category: 'converter'
  }
};

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [tool, setTool] = useState<ToolData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const toolSlug = slug?.[0] || '';
    const foundTool = tools[toolSlug];
    setTool(foundTool || null);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Tool Not Found</CardTitle>
              <CardDescription className="text-center">
                The tool you're looking for doesn't exist or hasn't been implemented yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Link href="/">
                  <Button>Browse All Tools</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      generator: 'bg-purple-100 text-purple-800',
      calculator: 'bg-blue-100 text-blue-800',
      converter: 'bg-green-100 text-green-800',
      development: 'bg-indigo-100 text-indigo-800',
      productivity: 'bg-yellow-100 text-yellow-800',
      statistics: 'bg-red-100 text-red-800',
      media: 'bg-pink-100 text-pink-800',
      data: 'bg-teal-100 text-teal-800',
      science: 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
                <h1 className="text-xl font-bold text-slate-900">{tool.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getCategoryColor(tool.category)}>
                    {tool.category}
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">{tool.name}</CardTitle>
            <CardDescription className="text-base text-center">
              {tool.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                This tool is coming soon!
              </div>
              <div className="text-sm text-slate-500">
                This tool is currently under development. Please check back later.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}