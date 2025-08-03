'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, RefreshCw, Shield, Key, FileText, Terminal } from 'lucide-react';

interface SSHKey {
  id: string;
  type: string;
  bits: number;
  publicKey: string;
  privateKey: string;
  fingerprint: string;
  comment: string;
  generatedAt: string;
}

export default function SSHKeyGenerator() {
  const [formData, setFormData] = useState({
    keyType: 'rsa',
    bits: 2048,
    comment: '',
    passphrase: '',
    confirmPassphrase: ''
  });

  const [generatedKeys, setGeneratedKeys] = useState<SSHKey[]>([]);
  const [currentKey, setCurrentKey] = useState<SSHKey | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSSHKey = () => {
    if (formData.passphrase && formData.passphrase !== formData.confirmPassphrase) {
      alert('Passphrases do not match');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      // Simulate SSH key generation
      const keyType = formData.keyType;
      const bits = formData.bits;
      const comment = formData.comment || 'user@hostname';
      
      // Generate mock key data
      const publicKey = `ssh-${keyType} ${btoa('mock-public-key-data-' + Date.now()).slice(0, 43)} ${comment}`;
      const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${generateMockPrivateKey(bits)}\n-----END RSA PRIVATE KEY-----`;
      const fingerprint = generateMockFingerprint();

      const sshKey: SSHKey = {
        id: Date.now().toString(),
        type: keyType,
        bits,
        publicKey,
        privateKey,
        fingerprint,
        comment,
        generatedAt: new Date().toLocaleString()
      };

      setCurrentKey(sshKey);
      setGeneratedKeys([sshKey, ...generatedKeys]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockPrivateKey = (bits: number): string => {
    const lines = [];
    const header = `Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-256-CBC,${generateMockIV()}\n\n`;
    lines.push(header);
    
    const keyLength = Math.floor(bits / 8);
    for (let i = 0; i < keyLength; i += 64) {
      const chunk = generateMockChunk(Math.min(64, keyLength - i));
      lines.push(chunk + '\n');
    }
    
    return lines.join('');
  };

  const generateMockIV = (): string => {
    return Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateMockChunk = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateMockFingerprint = (): string => {
    return Array.from({length: 16}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const downloadKey = (key: SSHKey, type: 'public' | 'private' | 'both') => {
    let content = '';
    let filename = '';
    
    if (type === 'public') {
      content = key.publicKey;
      filename = `id_${key.type}.pub`;
    } else if (type === 'private') {
      content = key.privateKey;
      filename = `id_${key.type}`;
    } else {
      content = `# Public Key\n${key.publicKey}\n\n# Private Key\n${key.privateKey}`;
      filename = `id_${key.type}_both`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const useSSHKey = (key: SSHKey) => {
    alert(`Using SSH key: ${key.type}-${key.bits}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SSH Key Generator</h1>
          <p className="text-gray-600">Generate SSH key pairs for Git and secure authentication</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SSH Key Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Generate SSH Key
              </CardTitle>
              <CardDescription>
                Create secure SSH key pairs for authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="keyType">Key Type</Label>
                <Select value={formData.keyType} onValueChange={(value) => setFormData({...formData, keyType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rsa">RSA</SelectItem>
                    <SelectItem value="dsa">DSA</SelectItem>
                    <SelectItem value="ecdsa">ECDSA</SelectItem>
                    <SelectItem value="ed25519">Ed25519</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bits">Key Size (bits)</Label>
                <Select value={formData.bits.toString()} onValueChange={(value) => setFormData({...formData, bits: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.keyType === 'rsa' && (
                      <>
                        <SelectItem value="1024">1024 (Not recommended)</SelectItem>
                        <SelectItem value="2048">2048 (Recommended)</SelectItem>
                        <SelectItem value="3072">3072 (More secure)</SelectItem>
                        <SelectItem value="4096">4096 (Most secure)</SelectItem>
                      </>
                    )}
                    {formData.keyType === 'dsa' && (
                      <SelectItem value="1024">1024 (Fixed size)</SelectItem>
                    )}
                    {formData.keyType === 'ecdsa' && (
                      <>
                        <SelectItem value="256">256 (secp256r1)</SelectItem>
                        <SelectItem value="384">384 (secp384r1)</SelectItem>
                        <SelectItem value="521">521 (secp521r1)</SelectItem>
                      </>
                    )}
                    {formData.keyType === 'ed25519' && (
                      <SelectItem value="256">256 (Fixed size)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comment">Comment (optional)</Label>
                <Input
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({...formData, comment: e.target.value})}
                  placeholder="user@hostname"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Added to the end of the public key to identify it
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="passphrase">Passphrase (optional)</Label>
                  <Input
                    id="passphrase"
                    type="password"
                    value={formData.passphrase}
                    onChange={(e) => setFormData({...formData, passphrase: e.target.value})}
                    placeholder="Enter passphrase to encrypt private key"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassphrase">Confirm Passphrase</Label>
                  <Input
                    id="confirmPassphrase"
                    type="password"
                    value={formData.confirmPassphrase}
                    onChange={(e) => setFormData({...formData, confirmPassphrase: e.target.value})}
                    placeholder="Confirm passphrase"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  A passphrase adds an extra layer of security to your private key
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Security Recommendations</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use RSA-2048 or higher for general use</li>
                  <li>• Use Ed25519 for modern systems</li>
                  <li>• Always use a strong passphrase</li>
                  <li>• Keep your private key secure</li>
                </ul>
              </div>

              <Button 
                onClick={generateSSHKey} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating Key...
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Generate SSH Key
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated SSH Keys */}
          <div className="space-y-6">
            {/* Current Key */}
            {currentKey && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    Generated SSH Key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Info */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Type</div>
                        <div className="font-medium">{currentKey.type.toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Bits</div>
                        <div className="font-medium">{currentKey.bits}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Fingerprint</div>
                        <div className="font-mono text-xs">{currentKey.fingerprint}</div>
                      </div>
                    </div>

                    {/* Public Key */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Public Key</Label>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(currentKey.publicKey)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => downloadKey(currentKey, 'public')}>
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={currentKey.publicKey}
                        readOnly
                        className="font-mono text-xs h-20"
                      />
                    </div>

                    {/* Private Key */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Private Key</Label>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(currentKey.privateKey)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => downloadKey(currentKey, 'private')}>
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={currentKey.privateKey}
                        readOnly
                        className="font-mono text-xs h-32"
                      />
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Keep this private key secure! Do not share it with anyone.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button onClick={() => useSSHKey(currentKey)} className="flex-1">
                        <Terminal className="h-4 w-4 mr-2" />
                        Use Key
                      </Button>
                      <Button onClick={() => downloadKey(currentKey, 'both')} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Both
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Keys List */}
            {generatedKeys.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Generated SSH Keys
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedKeys.map((key) => (
                      <div key={key.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium">{key.type.toUpperCase()}-{key.bits}</div>
                            <div className="text-xs text-gray-500">{key.comment}</div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => useSSHKey(key)}>
                              <Terminal className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadKey(key, 'both')}>
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {key.generatedAt} • {key.fingerprint}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Instructions */}
            {!currentKey && generatedKeys.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-blue-600" />
                    How to Use SSH Keys
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">For Git:</h4>
                      <p className="text-gray-600">Add your public key to your Git provider (GitHub, GitLab, etc.)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">For SSH:</h4>
                      <p className="text-gray-600">Add your private key to ssh-agent: <code className="bg-gray-100 px-1 rounded">ssh-add ~/.ssh/id_rsa</code></p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Test Connection:</h4>
                      <p className="text-gray-600">Test your SSH connection: <code className="bg-gray-100 px-1 rounded">ssh -T git@github.com</code></p>
                    </div>
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