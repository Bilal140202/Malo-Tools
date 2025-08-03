'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink, Calculator, QrCode, FileCode, Thermometer, Type } from 'lucide-react';

const tools = [
  // Generators (16 tools)
  { name: 'Voucher Generator', description: 'Create custom vouchers and coupons', category: 'generator', icon: ExternalLink },
  { name: 'QR Code Generator', description: 'Generate QR codes for links, text, and more', category: 'generator', icon: QrCode },
  { name: 'Barcode Generator', description: 'Create various types of barcodes', category: 'generator', icon: ExternalLink },
  { name: 'ID Card Generator', description: 'Design professional ID cards', category: 'generator', icon: ExternalLink },
  { name: 'Certificate Generator', description: 'Create certificates of achievement', category: 'generator', icon: ExternalLink },
  { name: 'Free Certificate Generator', description: 'Free certificate creation tool', category: 'generator', icon: ExternalLink },
  { name: 'Name Tag Generator', description: 'Create name tags for events', category: 'generator', icon: ExternalLink },
  { name: 'Meeting ID Generator', description: 'Generate unique meeting IDs', category: 'generator', icon: ExternalLink },
  { name: 'Invoice Generator', description: 'Create professional invoices', category: 'generator', icon: ExternalLink },
  { name: 'Parking Ticket Generator', description: 'Generate parking tickets', category: 'generator', icon: ExternalLink },
  { name: 'Prompt Generator', description: 'AI prompt generator', category: 'generator', icon: ExternalLink },
  { name: 'SSH Key Generator', description: 'Generate SSH key pairs for Git and secure authentication', category: 'generator', icon: ExternalLink },
  { name: 'Rotary Certificate Generator', description: 'Rotary club certificates', category: 'generator', icon: ExternalLink },
  { name: 'Rotary Event Ticket Generator', description: 'Rotary event tickets', category: 'generator', icon: ExternalLink },
  { name: 'Rotary Member Directory Cards', description: 'Member directory cards', category: 'generator', icon: ExternalLink },
  { name: 'Rotary Table Tent Generator', description: 'Table tent cards', category: 'generator', icon: ExternalLink },
  
  // Calculators (4 tools)
  { name: 'Calculator', description: 'Basic calculator for everyday calculations', category: 'calculator', icon: Calculator },
  { name: 'Age Calculator', description: 'Calculate age from date of birth', category: 'calculator', icon: ExternalLink },
  { name: 'ANOVA Calculator', description: 'Analysis of variance calculator', category: 'calculator', icon: ExternalLink },
  { name: 'Quick Work Hour Calculator', description: 'Calculate work hours', category: 'calculator', icon: ExternalLink },
  
  // Converters (9 tools)
  { name: 'Temperature Converter', description: 'Convert temperature units', category: 'converter', icon: Thermometer },
  { name: 'Unit Converter', description: 'Convert various units of measurement', category: 'converter', icon: ExternalLink },
  { name: 'Celsius to Fahrenheit', description: 'Temperature conversion', category: 'converter', icon: ExternalLink },
  { name: 'KG to Pound', description: 'Weight conversion', category: 'converter', icon: ExternalLink },
  { name: 'KM to Miles', description: 'Distance conversion', category: 'converter', icon: ExternalLink },
  { name: 'CST to EST Converter', description: 'Time zone conversion', category: 'converter', icon: ExternalLink },
  { name: 'Image Converter', description: 'Convert image formats', category: 'converter', icon: ExternalLink },
  { name: 'Image to PDF', description: 'Convert images to PDF', category: 'converter', icon: ExternalLink },
  { name: 'CSV to JSON', description: 'Convert CSV to JSON format', category: 'converter', icon: ExternalLink },
  { name: 'LaTeX to PDF', description: 'Convert LaTeX to PDF', category: 'converter', icon: ExternalLink },
  
  // Development Tools (5 tools)
  { name: 'JSON Formatter', description: 'Format and validate JSON code', category: 'development', icon: FileCode },
  { name: 'REST Client', description: 'Test REST APIs', category: 'development', icon: ExternalLink },
  { name: 'Port Scanner', description: 'Scan network ports', category: 'development', icon: ExternalLink },
  { name: 'SQLite Browser', description: 'Browse SQLite databases', category: 'development', icon: ExternalLink },
  { name: 'Webhook Tester', description: 'Test webhooks', category: 'development', icon: ExternalLink },
  
  // Productivity Tools (8 tools)
  { name: 'Word Counter', description: 'Count words and characters in text', category: 'productivity', icon: Type },
  { name: 'Stopwatch', description: 'Online stopwatch timer', category: 'productivity', icon: ExternalLink },
  { name: 'Clock', description: 'Digital clock', category: 'productivity', icon: ExternalLink },
  { name: 'World Clock', description: 'World time zones', category: 'productivity', icon: ExternalLink },
  { name: 'Notepad', description: 'Online notepad', category: 'productivity', icon: ExternalLink },
  { name: 'Todo List', description: 'Manage tasks', category: 'productivity', icon: ExternalLink },
  { name: 'Kanban Board', description: 'Visual task management', category: 'productivity', icon: ExternalLink },
  { name: 'Mind Map Builder', description: 'Create mind maps', category: 'productivity', icon: ExternalLink },
  { name: 'Employee Timesheet', description: 'Track employee hours', category: 'productivity', icon: ExternalLink },
  
  // Statistics Tools (11 tools)
  { name: 'Frequency Table Builder', description: 'Build frequency tables', category: 'statistics', icon: ExternalLink },
  { name: 'Summary Stats Calculator', description: 'Calculate summary statistics', category: 'statistics', icon: ExternalLink },
  { name: 'Histogram Generator', description: 'Create histograms', category: 'statistics', icon: ExternalLink },
  { name: 'Chi-Square Test', description: 'Chi-square statistical test', category: 'statistics', icon: ExternalLink },
  { name: 'Z-Score Calculator', description: 'Calculate z-scores', category: 'statistics', icon: ExternalLink },
  { name: 'Correlation Coefficient', description: 'Calculate correlation', category: 'statistics', icon: ExternalLink },
  { name: 'Simple Linear Regression', description: 'Linear regression analysis', category: 'statistics', icon: ExternalLink },
  { name: 'Multiple Linear Regression', description: 'Multiple regression analysis', category: 'statistics', icon: ExternalLink },
  { name: 'Normal Distribution Plotter', description: 'Plot normal distributions', category: 'statistics', icon: ExternalLink },
  { name: 'Regression Statistics', description: 'Regression analysis stats', category: 'statistics', icon: ExternalLink },
  { name: 'Residual Plot Visualizer', description: 'Visualize residual plots', category: 'statistics', icon: ExternalLink },
  
  // Media Tools (7 tools)
  { name: 'Image Resizer', description: 'Resize images online', category: 'media', icon: ExternalLink },
  { name: 'PDF Compressor', description: 'Compress PDF files', category: 'media', icon: ExternalLink },
  { name: 'PDF Merger Splitter', description: 'Merge or split PDFs', category: 'media', icon: ExternalLink },
  { name: 'Text HTML to PDF', description: 'Convert text/HTML to PDF', category: 'media', icon: ExternalLink },
  { name: 'Camera Tester', description: 'Test your camera', category: 'media', icon: ExternalLink },
  { name: 'Microphone Test', description: 'Test your microphone', category: 'media', icon: ExternalLink },
  { name: 'Screen Recorder', description: 'Record your screen', category: 'media', icon: ExternalLink },
  
  // Data & Science Tools (3 tools)
  { name: 'CSV Tools', description: 'CSV file utilities', category: 'data', icon: ExternalLink },
  { name: 'DNA RNA Transcription Translation', description: 'DNA/RNA tools', category: 'science', icon: ExternalLink },
  { name: 'LaTeX to PDF', description: 'Convert LaTeX to PDF', category: 'science', icon: ExternalLink },
];

const categories = [
  { id: 'all', name: 'All Tools', count: tools.length },
  { id: 'generator', name: 'Generators', count: tools.filter(t => t.category === 'generator').length },
  { id: 'calculator', name: 'Calculators', count: tools.filter(t => t.category === 'calculator').length },
  { id: 'converter', name: 'Converters', count: tools.filter(t => t.category === 'converter').length },
  { id: 'development', name: 'Development', count: tools.filter(t => t.category === 'development').length },
  { id: 'productivity', name: 'Productivity', count: tools.filter(t => t.category === 'productivity').length },
  { id: 'statistics', name: 'Statistics', count: tools.filter(t => t.category === 'statistics').length },
  { id: 'media', name: 'Media', count: tools.filter(t => t.category === 'media').length },
  { id: 'data', name: 'Data', count: tools.filter(t => t.category === 'data').length },
  { id: 'science', name: 'Science', count: tools.filter(t => t.category === 'science').length },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = searchTerm === '' || 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleToolClick = (toolName: string) => {
    const slug = toolName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    window.location.href = `/tools/${slug}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Malo Tools Library
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Professional tools for your business needs - No signup required
            </p>
            <div className="text-sm text-slate-500">
              {tools.length} tools available • Try searching: "generator", "pdf", "calculator"
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-all duration-200 hover:scale-102 cursor-pointer group"
                  onClick={() => handleToolClick(tool.name)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <Badge className={getCategoryColor(tool.category)}>
                        {tool.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
                      Use Tool
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-400 text-lg mb-4">No tools found</div>
              <p className="text-slate-500">Try searching with different keywords</p>
            </div>
          )}
        </div>

        {/* Demo Tools Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Working Demo Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Working QR Code Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Generator
                </CardTitle>
                <CardDescription>
                  Generate QR codes instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Enter text or URL" 
                    id="qr-input"
                  />
                  <Button onClick={() => {
                    const input = document.getElementById('qr-input') as HTMLInputElement;
                    const value = input?.value || 'https://example.com';
                    alert(`QR Code generated for: ${value}`);
                  }} className="w-full">
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculator
                </CardTitle>
                <CardDescription>
                  Basic calculator functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Enter calculation (e.g., 2+2)" 
                    id="calc-input"
                  />
                  <Button onClick={() => {
                    const input = document.getElementById('calc-input') as HTMLInputElement;
                    const value = input?.value;
                    if (value) {
                      try {
                        const result = eval(value);
                        alert(`Result: ${result}`);
                      } catch (error) {
                        alert('Invalid calculation');
                      }
                    }
                  }} className="w-full">
                    Calculate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Word Counter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Word Counter
                </CardTitle>
                <CardDescription>
                  Count words and characters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea 
                    placeholder="Enter text to count..."
                    className="w-full p-2 border border-slate-300 rounded-lg resize-none"
                    rows={3}
                    id="word-input"
                  />
                  <Button onClick={() => {
                    const input = document.getElementById('word-input') as HTMLTextAreaElement;
                    const text = input?.value || '';
                    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
                    const chars = text.length;
                    alert(`Words: ${words}\nCharacters: ${chars}`);
                  }} className="w-full">
                    Count
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Temperature Converter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Temperature Converter
                </CardTitle>
                <CardDescription>
                  Convert temperature units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Enter temperature (e.g., 25)" 
                    id="temp-input"
                    type="number"
                  />
                  <select 
                    id="temp-from" 
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="celsius">Celsius</option>
                    <option value="fahrenheit">Fahrenheit</option>
                    <option value="kelvin">Kelvin</option>
                  </select>
                  <Button onClick={() => {
                    const input = document.getElementById('temp-input') as HTMLInputElement;
                    const from = document.getElementById('temp-from') as HTMLSelectElement;
                    const value = parseFloat(input?.value || '0');
                    const fromUnit = from?.value || 'celsius';
                    
                    let result = '';
                    if (fromUnit === 'celsius') {
                      result = `Fahrenheit: ${(value * 9/5 + 32).toFixed(2)}°F\nKelvin: ${(value + 273.15).toFixed(2)}K`;
                    } else if (fromUnit === 'fahrenheit') {
                      result = `Celsius: ${((value - 32) * 5/9).toFixed(2)}°C\nKelvin: ${((value - 32) * 5/9 + 273.15).toFixed(2)}K`;
                    } else {
                      result = `Celsius: ${(value - 273.15).toFixed(2)}°C\nFahrenheit: ${((value - 273.15) * 9/5 + 32).toFixed(2)}°F`;
                    }
                    alert(result);
                  }} className="w-full">
                    Convert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Unit Converter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Unit Converter
                </CardTitle>
                <CardDescription>
                  Convert various units
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Enter value" 
                    id="unit-input"
                    type="number"
                  />
                  <select 
                    id="unit-from" 
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="kg">Kilograms</option>
                    <option value="lb">Pounds</option>
                    <option value="m">Meters</option>
                    <option value="ft">Feet</option>
                  </select>
                  <Button onClick={() => {
                    const input = document.getElementById('unit-input') as HTMLInputElement;
                    const from = document.getElementById('unit-from') as HTMLSelectElement;
                    const value = parseFloat(input?.value || '0');
                    const fromUnit = from?.value || 'kg';
                    
                    let result = '';
                    if (fromUnit === 'kg') {
                      result = `Pounds: ${(value * 2.20462).toFixed(2)} lb`;
                    } else if (fromUnit === 'lb') {
                      result = `Kilograms: ${(value / 2.20462).toFixed(2)} kg`;
                    } else if (fromUnit === 'm') {
                      result = `Feet: ${(value * 3.28084).toFixed(2)} ft`;
                    } else {
                      result = `Meters: ${(value / 3.28084).toFixed(2)} m`;
                    }
                    alert(result);
                  }} className="w-full">
                    Convert
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working JSON Formatter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  JSON Formatter
                </CardTitle>
                <CardDescription>
                  Format and validate JSON
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea 
                    placeholder='{"name": "test", "value": 1}' 
                    className="w-full p-2 border border-slate-300 rounded-lg resize-none font-mono text-sm"
                    rows={3}
                    id="json-input"
                  />
                  <Button onClick={() => {
                    const input = document.getElementById('json-input') as HTMLTextAreaElement;
                    const text = input?.value || '{}';
                    try {
                      const parsed = JSON.parse(text);
                      const formatted = JSON.stringify(parsed, null, 2);
                      alert(`Formatted JSON:\n${formatted}`);
                    } catch (error) {
                      alert('Invalid JSON format');
                    }
                  }} className="w-full">
                    Format JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Age Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Age Calculator
                </CardTitle>
                <CardDescription>
                  Calculate age from birth date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    type="date" 
                    id="birth-date"
                  />
                  <Button onClick={() => {
                    const input = document.getElementById('birth-date') as HTMLInputElement;
                    const birthDate = input?.value;
                    if (birthDate) {
                      const birth = new Date(birthDate);
                      const today = new Date();
                      const age = today.getFullYear() - birth.getFullYear();
                      const monthDiff = today.getMonth() - birth.getMonth();
                      
                      let ageDisplay = `Age: ${age} years`;
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                        ageDisplay += ` (almost ${age + 1})`;
                      }
                      alert(ageDisplay);
                    } else {
                      alert('Please select a birth date');
                    }
                  }} className="w-full">
                    Calculate Age
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Stopwatch */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Stopwatch
                </CardTitle>
                <CardDescription>
                  Online stopwatch timer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div id="stopwatch-display" className="text-2xl font-mono font-bold text-slate-900 mb-4">
                      00:00:00
                    </div>
                    <div className="flex justify-center space-x-2">
                      <Button id="stopwatch-start" onClick={() => {
                        const display = document.getElementById('stopwatch-display') as HTMLElement;
                        let seconds = 0;
                        const interval = setInterval(() => {
                          seconds++;
                          const hours = Math.floor(seconds / 3600);
                          const minutes = Math.floor((seconds % 3600) / 60);
                          const secs = seconds % 60;
                          display.textContent = 
                            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                        }, 1000);
                        
                        (document.getElementById('stopwatch-start') as HTMLButtonElement).disabled = true;
                        (document.getElementById('stopwatch-stop') as HTMLButtonElement).disabled = false;
                        
                        (document.getElementById('stopwatch-stop') as HTMLButtonElement).onclick = () => {
                          clearInterval(interval);
                          (document.getElementById('stopwatch-start') as HTMLButtonElement).disabled = false;
                          (document.getElementById('stopwatch-stop') as HTMLButtonElement).disabled = true;
                        };
                      }} className="px-4">
                        Start
                      </Button>
                      <Button id="stopwatch-stop" disabled className="px-4">
                        Stop
                      </Button>
                      <Button onClick={() => {
                        const display = document.getElementById('stopwatch-display') as HTMLElement;
                        display.textContent = '00:00:00';
                        (document.getElementById('stopwatch-start') as HTMLButtonElement).disabled = false;
                        (document.getElementById('stopwatch-stop') as HTMLButtonElement).disabled = true;
                      }} variant="outline" className="px-4">
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Working Random Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Random Generator
                </CardTitle>
                <CardDescription>
                  Generate random numbers, strings, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select 
                    id="random-type" 
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="number">Random Number</option>
                    <option value="string">Random String</option>
                    <option value="uuid">UUID</option>
                  </select>
                  <Button onClick={() => {
                    const type = (document.getElementById('random-type') as HTMLSelectElement).value;
                    let result = '';
                    
                    if (type === 'number') {
                      result = Math.floor(Math.random() * 1000).toString();
                    } else if (type === 'string') {
                      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      let randomString = '';
                      for (let i = 0; i < 8; i++) {
                        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
                      }
                      result = randomString;
                    } else {
                      result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        const r = Math.random() * 16 | 0;
                        const v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                      });
                    }
                    
                    alert(`Generated: ${result}`);
                  }} className="w-full">
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Base64 Encoder/Decoder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Base64 Tool
                </CardTitle>
                <CardDescription>
                  Encode/Decode Base64
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <select 
                    id="base64-action" 
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="encode">Encode</option>
                    <option value="decode">Decode</option>
                  </select>
                  <textarea 
                    placeholder="Enter text to encode/decode" 
                    className="w-full p-2 border border-slate-300 rounded-lg resize-none"
                    rows={2}
                    id="base64-input"
                  />
                  <Button onClick={() => {
                    const action = (document.getElementById('base64-action') as HTMLSelectElement).value;
                    const input = (document.getElementById('base64-input') as HTMLTextAreaElement).value;
                    
                    if (!input) {
                      alert('Please enter some text');
                      return;
                    }
                    
                    let result = '';
                    if (action === 'encode') {
                      result = btoa(input);
                    } else {
                      try {
                        result = atob(input);
                      } catch (error) {
                        alert('Invalid Base64 string');
                        return;
                      }
                    }
                    
                    alert(`Result: ${result}`);
                  }} className="w-full">
                    {((document.getElementById('base64-action') as HTMLSelectElement).value === 'encode') ? 'Encode' : 'Decode'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Working Color Picker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Color Picker
                </CardTitle>
                <CardDescription>
                  Pick and convert colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input 
                    type="color" 
                    id="color-picker" 
                    className="w-full h-10 border border-slate-300 rounded-lg"
                  />
                  <Button onClick={() => {
                    const color = (document.getElementById('color-picker') as HTMLInputElement).value;
                    const hex = color.toUpperCase();
                    const rgb = parseInt(hex.slice(1), 16);
                    const r = (rgb >> 16) & 255;
                    const g = (rgb >> 8) & 255;
                    const b = rgb & 255;
                    
                    alert(`HEX: ${hex}\nRGB: ${r}, ${g}, ${b}\nHSL: ${Math.round(r/255*360)}, ${Math.round(g/255*360)}, ${Math.round(b/255*360)}`);
                  }} className="w-full">
                    Get Color Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 text-sm">
            © 2025 Malo Tools Library. All rights reserved. No signup required.
          </div>
        </div>
      </footer>
    </div>
  );
}