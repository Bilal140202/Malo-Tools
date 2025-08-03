'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Copy, Download, RefreshCw, Server, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface WebhookRequest {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: string;
  status: number;
  response: string;
  duration: number;
}

interface WebhookEndpoint {
  url: string;
  method: string;
  headers: { [key: string]: string };
  body: string;
}

export default function WebhookTester() {
  const [endpoint, setEndpoint] = useState<WebhookEndpoint>({
    url: '',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'MaloTools-WebhookTester/1.0'
    },
    body: '{"message": "Hello from webhook tester", "timestamp": "2024-01-01T00:00:00Z"}'
  });

  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [isReceiving, setIsReceiving] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const endpointRef = useRef<HTMLInputElement>(null);

  // Generate a unique server URL for demo purposes
  useEffect(() => {
    if (!serverUrl) {
      const randomId = Math.random().toString(36).substring(7);
      setServerUrl(`https://webhook-tester.malotools.com/${randomId}`);
    }
  }, [serverUrl]);

  const startWebhookServer = async () => {
    if (!endpoint.url.trim()) {
      setError('Please enter a webhook endpoint URL');
      return;
    }

    setIsReceiving(true);
    setError('');
    
    // Simulate starting a webhook server
    // In a real application, this would set up an actual server
    console.log('Starting webhook server for:', endpoint.url);
  };

  const stopWebhookServer = () => {
    setIsReceiving(false);
    console.log('Stopping webhook server');
  };

  const sendWebhook = async () => {
    if (!endpoint.url.trim()) {
      setError('Please enter a webhook endpoint URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const startTime = Date.now();
      
      // Prepare headers
      const headers: Record<string, string> = {};
      Object.entries(endpoint.headers).forEach(([key, value]) => {
        if (key.trim() && value.trim()) {
          headers[key.trim()] = value.trim();
        }
      });

      // Prepare options
      const options: RequestInit = {
        method: endpoint.method,
        headers: headers
      };

      // Add body for methods that typically have a body
      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.body.trim()) {
        options.body = endpoint.body;
      }

      // Make the request
      const response = await fetch(endpoint.url, options);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Read response
      let responseBody = '';
      try {
        if (response.headers.get('content-type')?.includes('application/json')) {
          responseBody = JSON.stringify(await response.json(), null, 2);
        } else {
          responseBody = await response.text();
        }
      } catch (e) {
        responseBody = await response.text();
      }

      // Create request record
      const newRequest: WebhookRequest = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        method: endpoint.method,
        url: endpoint.url,
        headers: headers,
        body: endpoint.body,
        status: response.status,
        response: responseBody,
        duration
      };

      setRequests(prev => [newRequest, ...prev]);

    } catch (err) {
      console.error('Webhook error:', err);
      setError(`Webhook failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHeader = (index: number, key: string, value: string) => {
    const newHeaders = { ...endpoint.headers };
    if (key.trim() || value.trim()) {
      newHeaders[`header_${index}`] = `${key}: ${value}`;
    } else {
      delete newHeaders[`header_${index}`];
    }
    setEndpoint({ ...endpoint, headers: newHeaders });
  };

  const addHeader = () => {
    const newHeaders = { ...endpoint.headers };
    const newIndex = Object.keys(newHeaders).length;
    newHeaders[`header_${newIndex}`] = '';
    setEndpoint({ ...endpoint, headers: newHeaders });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...endpoint.headers };
    delete newHeaders[key];
    setEndpoint({ ...endpoint, headers: newHeaders });
  };

  const copyWebhookUrl = () => {
    if (serverUrl) {
      navigator.clipboard.writeText(serverUrl);
      alert('Webhook URL copied to clipboard!');
    }
  };

  const clearRequests = () => {
    setRequests([]);
  };

  const downloadLog = () => {
    if (requests.length === 0) return;
    
    const logText = requests.map(req => 
      `[${req.timestamp}] ${req.method} ${req.url} - ${req.status} (${req.duration}ms)
Headers: ${Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join(', ')}
Body: ${req.body}
Response: ${req.response}
---
`).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webhook-log-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 400) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
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
                <h1 className="text-xl font-bold text-slate-900">Webhook Tester</h1>
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
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Webhook Server */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Webhook Server
                </CardTitle>
                <CardDescription>
                  Receive webhooks at your unique URL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Webhook URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={serverUrl}
                      readOnly
                      placeholder="Generating unique URL..."
                      className="flex-1"
                    />
                    <Button onClick={copyWebhookUrl} variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {isReceiving ? (
                    <Button
                      onClick={stopWebhookServer}
                      variant="destructive"
                      className="flex-1"
                    >
                      Stop Server
                    </Button>
                  ) : (
                    <Button
                      onClick={startWebhookServer}
                      disabled={!endpoint.url.trim()}
                      className="flex-1"
                    >
                      Start Server
                    </Button>
                  )}
                </div>

                {isReceiving && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Server is active</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Send webhooks to the URL above to receive them here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Webhook Sender */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Send Webhook</CardTitle>
                <CardDescription>
                  Configure and send test webhooks
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
                      value={endpoint.method}
                      onChange={(e) => setEndpoint({ ...endpoint, method: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    >
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL
                    </label>
                    <Input
                      ref={endpointRef}
                      value={endpoint.url}
                      onChange={(e) => setEndpoint({ ...endpoint, url: e.target.value })}
                      placeholder="https://api.example.com/webhook"
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
                    {Object.entries(endpoint.headers).map(([key, value]) => {
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Request Body
                  </label>
                  <textarea
                    value={endpoint.body}
                    onChange={(e) => setEndpoint({ ...endpoint, body: e.target.value })}
                    placeholder='{"key": "value"}'
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none"
                  />
                </div>

                {/* Send Button */}
                <Button
                  onClick={sendWebhook}
                  disabled={isLoading || !endpoint.url.trim()}
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
                      Send Webhook
                    </>
                  )}
                </Button>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requests Log */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Webhook Requests</span>
                  <div className="flex space-x-2">
                    <Button onClick={clearRequests} variant="outline" size="sm">
                      Clear
                    </Button>
                    <Button onClick={downloadLog} variant="outline" size="sm">
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {requests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            {getStatusIcon(request.status)}
                            <span className="text-sm text-slate-600">
                              {request.duration}ms
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {request.timestamp}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="font-medium text-slate-900">
                            {request.method} {request.url}
                          </div>
                          
                          <div>
                            <span className="text-slate-600">Headers:</span>
                            <div className="text-xs text-slate-500 mt-1">
                              {Object.entries(request.headers).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-600">Body:</span>
                            <pre className="text-xs bg-slate-50 p-2 rounded mt-1 overflow-x-auto">
                              {request.body}
                            </pre>
                          </div>

                          <div>
                            <span className="text-slate-600">Response:</span>
                            <pre className="text-xs bg-green-50 p-2 rounded mt-1 overflow-x-auto">
                              {request.response}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Server className="h-12 w-12 mx-auto mb-4" />
                    <p>No webhook requests received</p>
                    <p className="text-sm">Start your server and send webhooks to see them here</p>
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