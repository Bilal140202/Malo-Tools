'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wifi, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PortResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service: string;
  timestamp: string;
}

interface ScanProgress {
  current: number;
  total: number;
  percentage: number;
}

export default function PortScanner() {
  const [target, setTarget] = useState('');
  const [ports, setPorts] = useState('80,443,8080,8443,21,22,25,53,110,143,993,995,3306,5432,6379,27017');
  const [results, setResults] = useState<PortResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanMode, setScanMode] = useState<'quick' | 'custom'>('quick');

  const commonPorts = {
    quick: [80, 443, 8080, 8443, 21, 22, 25, 53, 110, 143, 993, 995, 3306, 5432, 6379, 27017],
    custom: []
  };

  const portServices: { [key: number]: string } = {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    993: 'IMAPS',
    995: 'POP3S',
    3306: 'MySQL',
    5432: 'PostgreSQL',
    6379: 'Redis',
    8080: 'HTTP-Alt',
    8443: 'HTTPS-Alt',
    27017: 'MongoDB'
  };

  const validateTarget = (target: string): boolean => {
    // Simple validation - check if it's an IP address or domain
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return ipRegex.test(target) || domainRegex.test(target);
  };

  const scanPort = async (port: number, target: string): Promise<PortResult> => {
    return new Promise((resolve) => {
      // Simulate port scanning (in a real app, this would use actual network scanning)
      // For demo purposes, we'll simulate results based on port numbers
      setTimeout(() => {
        let status: 'open' | 'closed' | 'filtered' = 'closed';
        let service = portServices[port] || 'Unknown';

        // Simulate some open ports for demo
        if ([80, 443, 8080, 8443, 22].includes(port)) {
          status = 'open';
        } else if (port > 10000 && port < 20000) {
          status = 'filtered';
        }

        resolve({
          port,
          status,
          service,
          timestamp: new Date().toLocaleTimeString()
        });
      }, Math.random() * 1000 + 200); // Random delay between 200-1200ms
    });
  };

  const startScan = async () => {
    if (!target.trim()) {
      setError('Please enter a target IP address or domain');
      return;
    }

    if (!validateTarget(target)) {
      setError('Please enter a valid IP address or domain name');
      return;
    }

    setError('');
    setIsScanning(true);
    setResults([]);
    setScanProgress(null);

    try {
      let portList: number[];
      
      if (scanMode === 'quick') {
        portList = commonPorts.quick;
      } else {
        const portsArray = ports.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p) && p > 0 && p <= 65535);
        if (portsArray.length === 0) {
          setError('Please enter valid port numbers (1-65535)');
          return;
        }
        portList = portsArray;
      }

      setScanProgress({
        current: 0,
        total: portList.length,
        percentage: 0
      });

      const scanResults: PortResult[] = [];

      for (let i = 0; i < portList.length; i++) {
        const port = portList[i];
        const result = await scanPort(port, target);
        scanResults.push(result);

        setScanProgress({
          current: i + 1,
          total: portList.length,
          percentage: Math.round(((i + 1) / portList.length) * 100)
        });

        // Update results progressively
        setResults([...scanResults]);
      }

    } catch (err) {
      setError('Scan failed. Please check your target and try again.');
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanProgress(null);
  };

  const clearResults = () => {
    setResults([]);
    setTarget('');
    setPorts('80,443,8080,8443,21,22,25,53,110,143,993,995,3306,5432,6379,27017');
    setError('');
  };

  const getStatusIcon = (status: PortResult['status']) => {
    switch (status) {
      case 'open':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'filtered':
        return <Shield className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: PortResult['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'filtered':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityLevel = (openPorts: number): string => {
    if (openPorts === 0) return 'Excellent';
    if (openPorts <= 3) return 'Good';
    if (openPorts <= 8) return 'Moderate';
    return 'Poor';
  };

  const getSecurityColor = (openPorts: number): string => {
    if (openPorts === 0) return 'text-green-600';
    if (openPorts <= 3) return 'text-blue-600';
    if (openPorts <= 8) return 'text-yellow-600';
    return 'text-red-600';
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
                <h1 className="text-xl font-bold text-slate-900">Port Scanner</h1>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Wifi className="h-6 w-6" />
              Port Scanner
            </CardTitle>
            <CardDescription className="text-base text-center">
              Scan for open ports on network devices (for educational purposes only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Scan Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Target Configuration */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Target Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Target IP or Domain
                      </label>
                      <Input
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="192.168.1.1 or example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Scan Mode
                      </label>
                      <div className="flex space-x-2">
                        <Button
                          variant={scanMode === 'quick' ? "default" : "outline"}
                          onClick={() => setScanMode('quick')}
                          className="flex-1"
                        >
                          Quick Scan
                        </Button>
                        <Button
                          variant={scanMode === 'custom' ? "default" : "outline"}
                          onClick={() => setScanMode('custom')}
                          className="flex-1"
                        >
                          Custom Ports
                        </Button>
                      </div>
                    </div>

                    {scanMode === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Ports to Scan (comma-separated)
                        </label>
                        <Input
                          value={ports}
                          onChange={(e) => setPorts(e.target.value)}
                          placeholder="80,443,8080,22,21"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Enter port numbers 1-65535, separated by commas
                        </p>
                      </div>
                    )}

                    <div className="pt-4 space-y-2">
                      {isScanning ? (
                        <Button
                          onClick={stopScan}
                          variant="destructive"
                          className="w-full"
                        >
                          Stop Scan
                        </Button>
                      ) : (
                        <Button
                          onClick={startScan}
                          disabled={!target.trim()}
                          className="w-full"
                        >
                          Start Scan
                        </Button>
                      )}
                      <Button
                        onClick={clearResults}
                        variant="outline"
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Scan Information */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scan Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scanProgress && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{scanProgress.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${scanProgress.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-600">
                          Scanning {scanProgress.current} of {scanProgress.total} ports
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm">Open Port</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-sm">Closed Port</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm">Filtered Port</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-slate-900 mb-2">Quick Scan Ports:</h4>
                      <div className="text-xs text-slate-600">
                        {commonPorts.quick.join(', ')}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {results.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Security Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Open Ports:</span>
                          <span className="font-medium">{results.filter(r => r.status === 'open').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Security Level:</span>
                          <span className={`font-medium ${getSecurityColor(results.filter(r => r.status === 'open').length)}`}>
                            {getSecurityLevel(results.filter(r => r.status === 'open').length)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Scan Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Port:</span>
                          <span className="font-mono font-medium">{result.port}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Service:</span>
                          <span className="font-medium">{result.service}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Time:</span>
                          <span className="text-slate-500">{result.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {results.length === 0 && !isScanning && !error && (
              <div className="text-center py-12 text-slate-400">
                <Wifi className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">No scan results yet</p>
                <p className="text-sm mt-2">Configure your scan and click "Start Scan"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>
                  This port scanner is for educational and security assessment purposes only. 
                  Only scan systems that you own or have explicit permission to scan. 
                  Unauthorized scanning of systems you don't own may be illegal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}