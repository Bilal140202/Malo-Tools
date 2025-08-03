'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Wand2, FileText, Sparkles, Lightbulb } from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  variables: string[];
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    category: 'Writing',
    description: 'Generate a blog post outline and content',
    template: 'Write a blog post about [topic] targeting [audience]. The post should be approximately [word_count] words long and focus on [key_points]. Include an engaging headline, introduction, main sections with subheadings, and a conclusion.',
    variables: ['topic', 'audience', 'word_count', 'key_points']
  },
  {
    id: 'social-media',
    name: 'Social Media Post',
    category: 'Marketing',
    description: 'Create engaging social media content',
    template: 'Create a [platform] post about [subject] with a [tone] tone. Include [hashtags] and make it [length] characters long. The post should [objective].',
    variables: ['platform', 'subject', 'tone', 'hashtags', 'length', 'objective']
  },
  {
    id: 'email-campaign',
    name: 'Email Campaign',
    category: 'Marketing',
    description: 'Generate email marketing copy',
    template: 'Write an email campaign for [company_name] targeting [audience]. The email should have a [tone] tone and focus on [product_service]. Include a compelling subject line, personalization placeholders, and a clear [call_to_action].',
    variables: ['company_name', 'audience', 'tone', 'product_service', 'call_to_action']
  },
  {
    id: 'code-review',
    name: 'Code Review',
    category: 'Development',
    description: 'Generate code review comments',
    template: 'Review the following [language] code for [focus_areas]. Provide specific feedback on [specific_concerns] and suggest improvements. Code:\n\n[code_block]',
    variables: ['language', 'focus_areas', 'specific_concerns', 'code_block']
  },
  {
    id: 'product-description',
    name: 'Product Description',
    category: 'E-commerce',
    description: 'Create compelling product descriptions',
    template: 'Write a product description for [product_name] that highlights [key_features] and [benefits]. The target audience is [target_audience] and the tone should be [tone]. Include [additional_details] if relevant.',
    variables: ['product_name', 'key_features', 'benefits', 'target_audience', 'tone', 'additional_details']
  },
  {
    id: 'story-outline',
    name: 'Story Outline',
    category: 'Creative',
    description: 'Generate story outlines and plots',
    template: 'Create a [genre] story outline with the following elements: protagonist [protagonist], setting [setting], conflict [conflict], and theme [theme]. The story should follow a [structure] structure and include [key_elements].',
    variables: ['genre', 'protagonist', 'setting', 'conflict', 'theme', 'structure', 'key_elements']
  }
];

export default function PromptGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedPrompts, setGeneratedPrompts] = useState<any[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    const initialFormData: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialFormData[variable] = '';
    });
    setFormData(initialFormData);
    setCurrentPrompt('');
  };

  const updateFormData = (variable: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const generatePrompt = () => {
    if (!selectedTemplate) {
      alert('Please select a prompt template');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      let prompt = selectedTemplate.template;
      
      // Replace variables with actual values
      selectedTemplate.variables.forEach(variable => {
        const value = formData[variable] || `[${variable}]`;
        const regex = new RegExp(`\\[${variable}\\]`, 'g');
        prompt = prompt.replace(regex, value);
      });

      setCurrentPrompt(prompt);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Prompt copied to clipboard!');
  };

  const savePrompt = () => {
    if (currentPrompt && selectedTemplate) {
      const savedPrompt = {
        id: Date.now(),
        template: selectedTemplate.name,
        category: selectedTemplate.category,
        prompt: currentPrompt,
        variables: formData,
        generatedAt: new Date().toLocaleString()
      };
      setGeneratedPrompts([savedPrompt, ...generatedPrompts]);
    }
  };

  const generateRandomPrompt = () => {
    const randomTemplate = promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
    handleTemplateSelect(randomTemplate);
    
    // Fill some random values
    const randomValues: Record<string, string> = {
      topic: 'Artificial Intelligence',
      audience: 'beginners',
      word_count: '1000',
      key_points: 'benefits, applications, and future implications',
      platform: 'Twitter',
      subject: 'new technology',
      tone: 'enthusiastic',
      hashtags: '#tech #innovation',
      length: '280',
      objective: 'drive engagement'
    };

    const newFormData = { ...formData };
    Object.keys(randomValues).forEach(key => {
      if (newFormData.hasOwnProperty(key)) {
        newFormData[key] = randomValues[key];
      }
    });
    setFormData(newFormData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">AI Prompt Generator</h1>
          <p className="text-purple-600">Generate professional prompts for AI tools and content creation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection and Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                Create Prompt
              </CardTitle>
              <CardDescription>
                Select a template and customize it for your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div>
                <Label htmlFor="template">Choose Template</Label>
                <Select onValueChange={(value) => {
                  const template = promptTemplates.find(t => t.id === value);
                  if (template) handleTemplateSelect(template);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prompt template" />
                  </SelectTrigger>
                  <SelectContent>
                    {promptTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Description */}
              {selectedTemplate && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">{selectedTemplate.name}</h3>
                  <p className="text-sm text-purple-700 mb-3">{selectedTemplate.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.variables.map(variable => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Fields */}
              {selectedTemplate && selectedTemplate.variables.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">Customize Variables</h3>
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable}>
                      <Label htmlFor={variable} className="capitalize">
                        {variable.replace(/_/g, ' ')}
                      </Label>
                      <Textarea
                        id={variable}
                        value={formData[variable] || ''}
                        onChange={(e) => updateFormData(variable, e.target.value)}
                        placeholder={`Enter ${variable}`}
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={generatePrompt} 
                  className="flex-1"
                  disabled={!selectedTemplate || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Prompt
                    </>
                  )}
                </Button>
                <Button onClick={generateRandomPrompt} variant="outline">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Prompts */}
          <div className="space-y-6">
            {/* Current Prompt */}
            {currentPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    Generated Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {currentPrompt}
                      </pre>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => copyToClipboard(currentPrompt)} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </Button>
                    <Button onClick={savePrompt} variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Saved Prompts */}
            {generatedPrompts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Saved Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedPrompts.map((prompt) => (
                      <div key={prompt.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-sm">{prompt.template}</div>
                            <div className="text-xs text-gray-500">{prompt.category}</div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(prompt.prompt)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {prompt.generatedAt}
                        </div>
                        <div className="text-xs text-gray-700 line-clamp-2">
                          {prompt.prompt}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Templates */}
            {generatedPrompts.length === 0 && !currentPrompt && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Quick Start
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {promptTemplates.slice(0, 4).map(template => (
                      <Button
                        key={template.id}
                        variant="outline"
                        onClick={() => handleTemplateSelect(template)}
                        className="text-left h-auto p-3"
                      >
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{template.category}</div>
                      </Button>
                    ))}
                  </div>
                  <Button onClick={generateRandomPrompt} variant="outline" className="w-full mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Random Prompt
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}