'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Download, Copy, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface RequestData {
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  body: string;
  time: number;
  size: number;
}

export default function RestClient() {
  const [request, setRequest] = useState<RequestData>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'MaloTools-REST-Client/1.0'
    },
    body: ''
  });

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const makeRequest = async () => {
    if (!request.url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse(null);

    try {
      const startTime = Date.now();
      
      // Prepare headers
      const headers: Record<string, string> = {};
      Object.entries(request.headers).forEach(([key, value]) => {
        if (key.trim() && value.trim()) {
          headers[key.trim()] = value.trim();
        }
      });

      // Prepare options
      const options: RequestInit = {
        method: request.method,
        headers: headers
      };

      // Add body for methods that typically have a body
      if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body.trim()) {
        options.body = request.body;
      }

      // Make the request
      const res = await fetch(request.url, options);
      
      // Read response body
      let responseBody = '';
      let responseSize = 0;
      
      try {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseBody = JSON.stringify(await res.json(), null, 2);
        } else {
          responseBody = await res.text();
        }
        responseSize = new Blob([responseBody]).size;
      } catch (e) {
        responseBody = await res.text();
        responseSize = new Blob([responseBody]).size;
      }

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Convert headers to object
      const responseHeaders: { [key: string]: string } = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body,
        time: responseTime,
        size: responseSize
      });

    } catch (err) {
      console.error('Request error:', err);
      setError(`Request failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = { ...request.headers };
    if (key.trim() || value.trim()) {
      newHeaders[`header_${index}`] = `${key}: ${value}`;
    } else {
      delete newHeaders[`header_${index}`];
    }
    setRequest({ ...request, headers: newHeaders });
  };

  const addHeader = () => {
    const newHeaders = { ...request.headers };
    const newIndex = Object.keys(newHeaders).length;
    newHeaders[`header_${newIndex}`] = '';
    setRequest({ ...request, headers: newHeaders });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...request.headers };
    delete newHeaders[key];
    setRequest({ ...request, headers: newHeaders });
  };

  const copyResponse = () => {
    if (!response) return;
    
    const copyText = `Status: ${response.status} ${response.statusText}
Time: ${response.time}ms
Size: ${formatFileSize(response.size)}

Headers:
${Object.entries(response.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}

Body:
${response.body}`;
    
    navigator.clipboard.writeText(copyText);
    alert('Response copied to clipboard!');
  };

  const downloadResponse = () => {
    if (!response) return;
    
    const blob = new Blob([response.body], { 
      type: response.headers['content-type'] || 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response_${response.status}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const sampleRequests = [
    { method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts/1', body: '' },
    { method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts', body: '' },
    { method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts', body: '{"title": "foo", "body": "bar", "userId": 1}' },
    { method: 'PUT', url: 'https://jsonplaceholder.typicode.com/posts/1', body: '{"id": 1, "title": "updated", "body": "updated content", "userId": 1}' }
  ];

  const loadSampleRequest = (sample: typeof sampleRequests[0]) => {
    setRequest({
      ...request,
      method: sample.method,
      url: sample.url,
      body: sample.body
    });
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
                <h1 className="text-xl font-bold text-slate-900">REST Client</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-indigo-100 text-indigo-800">
                    development
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HTTP Request</CardTitle>
                <CardDescription>
                  Configure and send HTTP requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Method and URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Method
                    </label>
                    <select
                      value={request.method}
                      onChange={(e) => setRequest({ ...request, method: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                      <option value="HEAD">HEAD</option>
                      <option value="OPTIONS">OPTIONS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL
                    </label>
                    <Input
                      value={request.url}
                      onChange={(e) => setRequest({ ...request, url: e.target.value })}
                      placeholder="https://api.example.com/endpoint"
                    />
                  </div>
                </div>

                {/* Headers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Headers
                    </label>
                    <Button onClick={addHeader} variant="outline" size="sm">
                      Add Header
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(request.headers).map(([key, value]) => {
                      const [headerKey, headerValue] = value.split(': ', 2);
                      return (
                        <div key={key} className="flex space-x-2">
                          <Input
                            placeholder="Header key"
                            value={headerKey}
                            onChange={(e) => updateHeader(parseInt(key.split('_')[1]), e.target.value, headerValue)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Header value"
                            value={headerValue}
                            onChange={(e) => updateHeader(parseInt(key.split('_')[1]), headerKey, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => removeHeader(key)}
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Body */}
                {['POST', 'PUT', 'PATCH'].includes(request.method) && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Request Body
                    </label>
                    <textarea
                      value={request.body}
                      onChange={(e) => setRequest({ ...request, body: e.target.value })}
                      placeholder='{"key": "value"}'
                      className="w-full h-32 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none"
                    />
                  </div>
                )}

                {/* Send Button */}
                <Button
                  onClick={makeRequest}
                  disabled={isLoading || !request.url.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Sample Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sample Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleRequests.map((sample, index) => (
                    <Button
                      key={index}
                      onClick={() => loadSampleRequest(sample)}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                    >
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono mr-2">
                        {sample.method}
                      </span>
                      {sample.url}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Response</span>
                  {response && (
                    <div className="flex space-x-2">
                      <Button onClick={copyResponse} variant="outline" size="sm">
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </Button>
                      <Button onClick={downloadResponse} variant="outline" size="sm">
                        <Download className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-700 font-medium">Error</div>
                    <div className="text-red-600 text-sm mt-1">{error}</div>
                  </div>
                ) : response ? (
                  <div className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(response.status)}>
                          {response.status} {response.statusText}
                        </Badge>
                        <span className="text-sm text-slate-600">
                          {response.time}ms
                        </span>
                        <span className="text-sm text-slate-600">
                          {formatFileSize(response.size)}
                        </span>
                      </div>
                      <Button
                        onClick={() => window.open(request.url, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Headers */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Headers</h4>
                      <div className="bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="text-xs font-mono text-slate-600 mb-1">
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Body</h4>
                      <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono overflow-auto max-h-64">
                        {response.body}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Send className="h-12 w-12 mx-auto mb-4" />
                    <p>No response yet</p>
                    <p className="text-sm">Send a request to see the response</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}