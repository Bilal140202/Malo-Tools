'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dna, Rna, Copy, Download, AlertCircle, Info, RefreshCw } from 'lucide-react';

export default function DNARNA() {
  const [sequence, setSequence] = useState('');
  const [sequenceType, setSequenceType] = useState<'dna' | 'rna'>('dna');
  const [result, setResult] = useState('');
  const [resultType, setResultType] = useState<'dna' | 'rna' | 'protein'>('dna');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // DNA to RNA transcription
  const transcribeDNAtoRNA = (dna: string): string => {
    return dna.toUpperCase().replace(/G/g, '1').replace(/C/g, '2').replace(/T/g, 'U').replace(/A/g, '3')
                           .replace(/1/g, 'C').replace(/2/g, 'G').replace(/U/g, 'T').replace(/3/g, 'A');
  };

  // RNA to DNA transcription
  const transcribeRNAtoDNA = (rna: string): string => {
    return rna.toUpperCase().replace(/G/g, '1').replace(/C/g, '2').replace(/U/g, 'T').replace(/A/g, '3')
                           .replace(/1/g, 'C').replace(/2/g, 'G').replace(/T/g, 'U').replace(/3/g, 'A');
  };

  // DNA to protein translation
  const translateDNAToProtein = (dna: string): string => {
    const codonTable: Record<string, string> = {
      'ATA': 'I', 'ATC': 'I', 'ATT': 'I', 'ATG': 'M',
      'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACT': 'T',
      'AAC': 'N', 'AAT': 'N', 'AAA': 'K', 'AAG': 'K',
      'AGC': 'S', 'AGT': 'S', 'AGA': 'R', 'AGG': 'R',
      'CTA': 'L', 'CTC': 'L', 'CTG': 'L', 'CTT': 'L',
      'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCT': 'P',
      'CAC': 'H', 'CAT': 'H', 'CAA': 'Q', 'CAG': 'Q',
      'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGT': 'R',
      'GTA': 'V', 'GTC': 'V', 'GTG': 'V', 'GTT': 'V',
      'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCT': 'A',
      'GAC': 'D', 'GAT': 'D', 'GAA': 'E', 'GAG': 'E',
      'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGT': 'G',
      'TCA': 'S', 'TCC': 'S', 'TCG': 'S', 'TCT': 'S',
      'TTC': 'F', 'TTT': 'F', 'TTA': 'L', 'TTG': 'L',
      'TAC': 'Y', 'TAT': 'Y', 'TAA': '*', 'TAG': '*',
      'TGC': 'C', 'TGT': 'C', 'TGA': '*', 'TGG': 'W'
    };

    const protein = [];
    const cleanDna = dna.toUpperCase().replace(/[^ATCG]/g, '');
    
    for (let i = 0; i < cleanDna.length; i += 3) {
      const codon = cleanDna.substr(i, 3);
      if (codon.length === 3) {
        protein.push(codonTable[codon] || '?');
      }
    }
    
    return protein.join('');
  };

  // RNA to protein translation
  const translateRNAToProtein = (rna: string): string => {
    const codonTable: Record<string, string> = {
      'AUA': 'I', 'AUC': 'I', 'AUU': 'I', 'AUG': 'M',
      'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACU': 'T',
      'AAC': 'N', 'AAU': 'N', 'AAA': 'K', 'AAG': 'K',
      'AGC': 'S', 'AGU': 'S', 'AGA': 'R', 'AGG': 'R',
      'CUA': 'L', 'CUC': 'L', 'CUG': 'L', 'CUU': 'L',
      'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCU': 'P',
      'CAC': 'H', 'CAU': 'H', 'CAA': 'Q', 'CAG': 'Q',
      'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGU': 'R',
      'GUA': 'V', 'GUC': 'V', 'GUG': 'V', 'GUU': 'V',
      'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCU': 'A',
      'GAC': 'D', 'GAU': 'D', 'GAA': 'E', 'GAG': 'E',
      'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGU': 'G',
      'UCA': 'S', 'UCC': 'S', 'UCG': 'S', 'UCU': 'S',
      'UUC': 'F', 'UUU': 'F', 'UUA': 'L', 'UUG': 'L',
      'UAC': 'Y', 'UAU': 'Y', 'UAA': '*', 'UAG': '*',
      'UGC': 'C', 'UGU': 'C', 'UGA': '*', 'UGG': 'W'
    };

    const protein = [];
    const cleanRna = rna.toUpperCase().replace(/[^AUCG]/g, '');
    
    for (let i = 0; i < cleanRna.length; i += 3) {
      const codon = cleanRna.substr(i, 3);
      if (codon.length === 3) {
        protein.push(codonTable[codon] || '?');
      }
    }
    
    return protein.join('');
  };

  // Reverse complement
  const reverseComplement = (seq: string, type: 'dna' | 'rna'): string => {
    const complement = type === 'dna' ? {
      'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C'
    } : {
      'A': 'U', 'U': 'A', 'C': 'G', 'G': 'C'
    };

    const reversed = seq.toUpperCase().split('').reverse().join('');
    return reversed.split('').map(nucleotide => complement[nucleotide] || nucleotide).join('');
  };

  // Validate sequence
  const validateSequence = (seq: string, type: 'dna' | 'rna'): boolean => {
    const validNucleotides = type === 'dna' ? /^[ATCG]+$/i : /^[AUCG]+$/i;
    return validNucleotides.test(seq.replace(/\s/g, ''));
  };

  const processSequence = () => {
    if (!sequence.trim()) {
      setError('Please enter a sequence');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cleanSequence = sequence.toUpperCase().replace(/\s/g, '');
      
      if (!validateSequence(cleanSequence, sequenceType)) {
        setError(`Invalid ${sequenceType.toUpperCase()} sequence. Please use only valid nucleotides (${sequenceType === 'dna' ? 'A, T, C, G' : 'A, U, C, G'})`);
        setIsProcessing(false);
        return;
      }

      let processedResult = '';
      let processedType: 'dna' | 'rna' | 'protein' = 'dna';

      switch (sequenceType) {
        case 'dna':
          if (resultType === 'rna') {
            processedResult = transcribeDNAtoRNA(cleanSequence);
            processedType = 'rna';
          } else if (resultType === 'protein') {
            processedResult = translateDNAToProtein(cleanSequence);
            processedType = 'protein';
          } else {
            processedResult = reverseComplement(cleanSequence, 'dna');
          }
          break;
        case 'rna':
          if (resultType === 'dna') {
            processedResult = transcribeRNAtoDNA(cleanSequence);
            processedType = 'dna';
          } else if (resultType === 'protein') {
            processedResult = translateRNAToProtein(cleanSequence);
            processedType = 'protein';
          } else {
            processedResult = reverseComplement(cleanSequence, 'rna');
          }
          break;
      }

      setResult(processedResult);
      setResultType(processedType);
    } catch (err) {
      setError('Failed to process sequence');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResult = () => {
    if (!result) return;
    
    const content = `Original ${sequenceType.toUpperCase()}: ${sequence}\nProcessed ${resultType.toUpperCase()}: ${result}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dna-rna-result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleData = () => {
    setSequenceType('dna');
    setSequence('ATGCGATAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCT');
    setSequenceType('dna');
    setResultType('protein');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-6 w-6" />
              DNA/RNA Transcription & Translation
            </CardTitle>
            <CardDescription>
              Perform DNA/RNA transcription, translation, and reverse complement operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sequence-type">Input Sequence Type</Label>
                  <Select value={sequenceType} onValueChange={(value: 'dna' | 'rna') => setSequenceType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dna">DNA</SelectItem>
                      <SelectItem value="rna">RNA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="result-type">Output Operation</Label>
                  <Select value={resultType} onValueChange={(value: 'dna' | 'rna' | 'protein') => setResultType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rna">Transcribe to RNA</SelectItem>
                      <SelectItem value="protein">Translate to Protein</SelectItem>
                      <SelectItem value="dna">Reverse Complement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="sequence">
                  {sequenceType.toUpperCase()} Sequence
                </Label>
                <Textarea
                  id="sequence"
                  value={sequence}
                  onChange={(e) => setSequence(e.target.value)}
                  placeholder={`Enter ${sequenceType.toUpperCase()} sequence (e.g., ATGCGATAGC...)`}
                  rows={4}
                  className="font-mono"
                />
                <div className="text-sm text-slate-500 mt-1">
                  Valid nucleotides: {sequenceType === 'dna' ? 'A, T, C, G' : 'A, U, C, G'}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={processSequence}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Process Sequence
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={loadSampleData}
                >
                  Load Sample
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              </div>
            )}

            {/* Result Section */}
            {result && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">Result:</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResult}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {resultType === 'protein' ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Protein
                      </Badge>
                    ) : resultType === 'rna' ? (
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        RNA
                      </Badge>
                    ) : (
                      <Badge variant="default" className="bg-purple-100 text-purple-800">
                        DNA
                      </Badge>
                    )}
                    <span className="text-sm text-slate-600">
                      Length: {result.length} {resultType === 'protein' ? 'amino acids' : 'nucleotides'}
                    </span>
                  </div>
                  
                  <div className="bg-white p-3 rounded border font-mono text-sm break-all max-h-64 overflow-y-auto">
                    {result}
                  </div>
                </div>

                {/* Statistics */}
                {resultType === 'protein' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Protein Analysis:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Stop Codons (*):</span>
                        <div className="text-blue-600">
                          {result.split('').filter(aa => aa === '*').length}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Methionine (M):</span>
                        <div className="text-blue-600">
                          {result.split('').filter(aa => aa === 'M').length}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Unknown (?):</span>
                        <div className="text-blue-600">
                          {result.split('').filter(aa => aa === '?').length}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Molecular Weight:</span>
                        <div className="text-blue-600">
                          {Math.round(result.split('').reduce((sum, aa) => {
                            const weights: Record<string, number> = {
                              'A': 89, 'R': 174, 'N': 132, 'D': 133, 'C': 121,
                              'Q': 146, 'E': 147, 'G': 75, 'H': 155, 'I': 131,
                              'L': 131, 'K': 146, 'M': 149, 'F': 165, 'P': 115,
                              'S': 105, 'T': 119, 'W': 204, 'Y': 181, 'V': 117,
                              '*': 0, '?': 0
                            };
                            return sum + (weights[aa] || 0);
                          }, 0))} Da
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Select your input sequence type (DNA or RNA)</li>
                <li>2. Choose the operation you want to perform</li>
                <li>3. Enter your nucleotide sequence</li>
                <li>4. Click "Process Sequence" to get the result</li>
                <li>5. Copy or download the result as needed</li>
              </ul>
            </div>

            {/* Biology Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Molecular Biology Info:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Transcription:</strong> DNA → RNA (T → U replacement)</li>
                <li>• <strong>Translation:</strong> mRNA → Protein (codon → amino acid)</li>
                <li>• <strong>Reverse Complement:</strong> A↔T/U, C↔G, sequence reversed</li>
                <li>• <strong>Codons:</strong> 3-nucleotide sequences that code for amino acids</li>
                <li>• <strong>Stop Codons:</strong> UAA, UAG, UGA (terminate protein synthesis)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}