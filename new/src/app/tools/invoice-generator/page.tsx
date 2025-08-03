'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, DollarSign, Calendar, User, Plus, Trash2 } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export default function InvoiceGenerator() {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    fromPhone: '',
    toName: '',
    toEmail: '',
    toAddress: '',
    toPhone: '',
    items: [] as InvoiceItem[],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    terms: 'Payment due within 30 days'
  });

  const [generatedInvoices, setGeneratedInvoices] = useState<any[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      total: 0
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.total = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      });

      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = subtotal * (prev.taxRate / 100);
      const total = subtotal + taxAmount;

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  const removeItem = (id: string) => {
    setFormData(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      const taxAmount = subtotal * (prev.taxRate / 100);
      const total = subtotal + taxAmount;

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  const generateInvoice = () => {
    if (!formData.fromName || !formData.toName || formData.items.length === 0) {
      alert('Please fill in required fields and add at least one invoice item');
      return;
    }

    const invoice = {
      id: Date.now(),
      ...formData,
      invoiceNumber: formData.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      generatedAt: new Date().toLocaleString()
    };

    setPreviewInvoice(invoice);
  };

  const saveInvoice = () => {
    if (previewInvoice) {
      setGeneratedInvoices([...generatedInvoices, previewInvoice]);
      setPreviewInvoice(null);
      setFormData({
        invoiceNumber: '',
        invoiceDate: '',
        dueDate: '',
        fromName: '',
        fromEmail: '',
        fromAddress: '',
        fromPhone: '',
        toName: '',
        toEmail: '',
        toAddress: '',
        toPhone: '',
        items: [],
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 0,
        notes: '',
        terms: 'Payment due within 30 days'
      });
    }
  };

  const downloadInvoice = (invoice: any) => {
    alert(`Downloading invoice #${invoice.invoiceNumber}`);
  };

  const getInvoicePreview = (invoice: any) => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto border">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
        <div className="text-2xl font-mono text-gray-600">#{invoice.invoiceNumber}</div>
      </div>

      {/* From and To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">FROM:</h3>
          <div className="text-sm text-gray-600">
            <div className="font-medium">{invoice.fromName}</div>
            {invoice.fromEmail && <div>{invoice.fromEmail}</div>}
            {invoice.fromPhone && <div>{invoice.fromPhone}</div>}
            {invoice.fromAddress && <div>{invoice.fromAddress}</div>}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">TO:</h3>
          <div className="text-sm text-gray-600">
            <div className="font-medium">{invoice.toName}</div>
            {invoice.toEmail && <div>{invoice.toEmail}</div>}
            {invoice.toPhone && <div>{invoice.toPhone}</div>}
            {invoice.toAddress && <div>{invoice.toAddress}</div>}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
        <div>
          <div className="text-gray-500">Invoice Date</div>
          <div className="font-medium">{invoice.invoiceDate}</div>
        </div>
        <div>
          <div className="text-gray-500">Due Date</div>
          <div className="font-medium">{invoice.dueDate}</div>
        </div>
        <div>
          <div className="text-gray-500">Generated</div>
          <div className="font-medium">{invoice.generatedAt.split(',')[0]}</div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-2 font-semibold text-gray-900">Description</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-900">Qty</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-900">Rate</th>
              <th className="text-right py-2 px-2 font-semibold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: InvoiceItem, index: number) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2 text-sm">{item.description}</td>
                <td className="py-3 px-2 text-sm text-right">{item.quantity}</td>
                <td className="py-3 px-2 text-sm text-right">${item.rate.toFixed(2)}</td>
                <td className="py-3 px-2 text-sm text-right font-medium">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
        </div>
        {invoice.taxRate > 0 && (
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Tax ({invoice.taxRate}%):</span>
            <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${invoice.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Notes and Terms */}
      {invoice.notes && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
          <p className="text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {invoice.terms && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Terms:</h4>
          <p className="text-sm text-gray-600">{invoice.terms}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
        <p>Invoice generated by Malo Tools Library</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Invoice Generator</h1>
          <p className="text-green-600">Create professional invoices for your business</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Create Invoice
              </CardTitle>
              <CardDescription>
                Fill in the details to generate a professional invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Invoice Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                    placeholder="INV-001"
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({...formData, invoiceDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>

              {/* From Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-700">From (Your Company)</h3>
                <Input
                  value={formData.fromName}
                  onChange={(e) => setFormData({...formData, fromName: e.target.value})}
                  placeholder="Your Company Name"
                />
                <Input
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({...formData, fromEmail: e.target.value})}
                  placeholder="your@email.com"
                />
                <Input
                  value={formData.fromPhone}
                  onChange={(e) => setFormData({...formData, fromPhone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
                <Input
                  value={formData.fromAddress}
                  onChange={(e) => setFormData({...formData, fromAddress: e.target.value})}
                  placeholder="123 Main St, City, State"
                />
              </div>

              {/* To Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-700">To (Client)</h3>
                <Input
                  value={formData.toName}
                  onChange={(e) => setFormData({...formData, toName: e.target.value})}
                  placeholder="Client Name"
                />
                <Input
                  value={formData.toEmail}
                  onChange={(e) => setFormData({...formData, toEmail: e.target.value})}
                  placeholder="client@email.com"
                />
                <Input
                  value={formData.toPhone}
                  onChange={(e) => setFormData({...formData, toPhone: e.target.value})}
                  placeholder="+1 (555) 987-6543"
                />
                <Input
                  value={formData.toAddress}
                  onChange={(e) => setFormData({...formData, toAddress: e.target.value})}
                  placeholder="456 Client Ave, City, State"
                />
              </div>

              {/* Invoice Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-green-700">Invoice Items</h3>
                  <Button onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {formData.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3 space-y-2">
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label className="text-xs">Rate ($)</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Total</Label>
                        <div className="text-sm font-medium text-right">${item.total.toFixed(2)}</div>
                      </div>
                      <div className="col-span-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span>Subtotal:</span>
                  <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
                </div>
                {formData.taxRate > 0 && (
                  <div className="flex justify-between mb-1">
                    <span>Tax ({formData.taxRate}%):</span>
                    <span className="font-medium">${formData.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-green-700">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
                <div>
                  <Label htmlFor="terms">Terms</Label>
                  <Input
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => setFormData({...formData, terms: e.target.value})}
                    placeholder="Payment terms"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateInvoice} className="flex-1">
                  Generate Invoice
                </Button>
                {previewInvoice && (
                  <Button onClick={saveInvoice} variant="outline">
                    Save
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Preview */}
          <div className="space-y-6">
            {previewInvoice && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Invoice Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {getInvoicePreview(previewInvoice)}
                  </div>
                  <Button onClick={() => downloadInvoice(previewInvoice)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Invoices List */}
            {generatedInvoices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Generated Invoices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {generatedInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">#{invoice.invoiceNumber}</div>
                          <div className="text-sm text-green-600">{invoice.toName}</div>
                          <div className="text-xs text-gray-500">${invoice.total.toFixed(2)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{invoice.items.length} items</Badge>
                          <Button size="sm" onClick={() => downloadInvoice(invoice)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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