'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Database, Upload, Download, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface TableInfo {
  name: string;
  rows: number;
  columns: string[];
}

interface QueryResult {
  columns: string[];
  rows: any[][];
  rowCount: number;
  query: string;
  error?: string;
}

export default function SQLiteBrowser() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [databaseName, setDatabaseName] = useState('sample.db');

  // Sample database schema and data for demonstration
  const sampleDatabase = {
    tables: [
      {
        name: 'users',
        columns: ['id', 'name', 'email', 'created_at'],
        rows: [
          [1, 'John Doe', 'john@example.com', '2024-01-15 10:00:00'],
          [2, 'Jane Smith', 'jane@example.com', '2024-01-16 11:30:00'],
          [3, 'Bob Johnson', 'bob@example.com', '2024-01-17 14:45:00'],
          [4, 'Alice Brown', 'alice@example.com', '2024-01-18 09:15:00'],
          [5, 'Charlie Wilson', 'charlie@example.com', '2024-01-19 16:20:00']
        ]
      },
      {
        name: 'products',
        columns: ['id', 'name', 'price', 'category', 'stock'],
        rows: [
          [1, 'Laptop', 999.99, 'Electronics', 50],
          [2, 'Mouse', 29.99, 'Electronics', 200],
          [3, 'Keyboard', 79.99, 'Electronics', 150],
          [4, 'Monitor', 299.99, 'Electronics', 75],
          [5, 'Desk Chair', 199.99, 'Furniture', 30]
        ]
      },
      {
        name: 'orders',
        columns: ['id', 'user_id', 'product_id', 'quantity', 'order_date', 'status'],
        rows: [
          [1, 1, 1, 1, '2024-01-20 10:00:00', 'completed'],
          [2, 2, 2, 2, '2024-01-21 11:30:00', 'shipped'],
          [3, 1, 3, 1, '2024-01-22 14:45:00', 'processing'],
          [4, 3, 4, 1, '2024-01-23 09:15:00', 'pending'],
          [5, 4, 5, 2, '2024-01-24 16:20:00', 'completed']
        ]
      }
    ]
  };

  const loadSampleDatabase = () => {
    setTables(sampleDatabase.tables.map(table => ({
      name: table.name,
      rows: table.rows.length,
      columns: table.columns
    })));
    setQueryResults([]);
    setSqlQuery('');
    setError('');
    setDatabaseName('sample.db');
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1000));

      const query = sqlQuery.trim().toLowerCase();
      let result: QueryResult | null = null;

      // Handle different SQL commands
      if (query.startsWith('select')) {
        // SELECT query simulation
        const match = query.match(/from\s+(\w+)/i);
        if (match) {
          const tableName = match[1];
          const table = sampleDatabase.tables.find(t => t.name === tableName);
          
          if (table) {
            // Apply WHERE clause simulation
            let filteredRows = [...table.rows];
            
            if (query.includes('where')) {
              // Simple WHERE simulation
              if (query.includes('id > 2')) {
                filteredRows = filteredRows.slice(2);
              } else if (query.includes('price > 50')) {
                filteredRows = table.rows.filter((row, index) => index > 0); // Skip header
              }
            }

            // Apply LIMIT simulation
            if (query.includes('limit')) {
              const limitMatch = query.match(/limit\s+(\d+)/i);
              if (limitMatch) {
                const limit = parseInt(limitMatch[1]);
                filteredRows = filteredRows.slice(0, limit);
              }
            }

            result = {
              columns: table.columns,
              rows: filteredRows,
              rowCount: filteredRows.length,
              query: sqlQuery
            };
          } else {
            throw new Error(`Table '${tableName}' not found`);
          }
        } else {
          throw new Error('Invalid SELECT query - missing FROM clause');
        }
      } else if (query.startsWith('show tables') || query.startsWith('.tables')) {
        // SHOW TABLES
        result = {
          columns: ['Tables'],
          rows: sampleDatabase.tables.map(table => [table.name]),
          rowCount: sampleDatabase.tables.length,
          query: sqlQuery
        };
      } else if (query.startsWith('describe') || query.startsWith('.schema')) {
        // DESCRIBE/SIMPLE SCHEMA
        const match = query.match(/describe\s+(\w+)/i);
        if (match) {
          const tableName = match[1];
          const table = sampleDatabase.tables.find(t => t.name === tableName);
          
          if (table) {
            result = {
              columns: ['Column Name', 'Type'],
              rows: table.columns.map(col => [col, 'TEXT']),
              rowCount: table.columns.length,
              query: sqlQuery
            };
          } else {
            throw new Error(`Table '${tableName}' not found`);
          }
        } else {
          throw new Error('Invalid DESCRIBE query - missing table name');
        }
      } else if (query.startsWith('drop table')) {
        // DROP TABLE simulation
        const match = query.match(/drop\s+table\s+(\w+)/i);
        if (match) {
          const tableName = match[1];
          setTables(prev => prev.filter(t => t.name !== tableName));
          result = {
            columns: ['Message'],
            rows: [[`Table '${tableName}' dropped successfully`]],
            rowCount: 1,
            query: sqlQuery
          };
        } else {
          throw new Error('Invalid DROP TABLE query');
        }
      } else {
        throw new Error('Unsupported SQL command. Only SELECT, SHOW TABLES, DESCRIBE, and DROP TABLE are supported in this demo.');
      }

      if (result) {
        setQueryResults(prev => [result!, ...prev]);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearQuery = () => {
    setSqlQuery('');
    setError('');
  };

  const clearResults = () => {
    setQueryResults([]);
    setSqlQuery('');
    setError('');
  };

  const copyResult = (result: QueryResult) => {
    const text = `${result.query}\n\n${result.columns.join('\t')}\n${result.rows.map(row => row.join('\t')).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Result copied to clipboard!');
  };

  const downloadResult = (result: QueryResult) => {
    const text = `${result.query}\n\n${result.columns.join('\t')}\n${result.rows.map(row => row.join('\t')).join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query_result_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getQueryExamples = () => {
    return [
      'SELECT * FROM users',
      'SELECT name, email FROM users WHERE id > 2',
      'SELECT * FROM products WHERE price > 50',
      'SELECT * FROM orders LIMIT 3',
      'SHOW TABLES',
      'DESCRIBE users',
      'DROP TABLE users'
    ];
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
                <h1 className="text-xl font-bold text-slate-900">SQLite Browser</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Database Info and Query */}
          <div className="lg:col-span-2 space-y-6">
            {/* Database Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database: {databaseName}
                  </span>
                  <Button onClick={loadSampleDatabase} variant="outline" size="sm">
                    Load Sample
                  </Button>
                </CardTitle>
                <CardDescription>
                  Interactive SQLite database browser
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tables.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Tables ({tables.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tables.map((table, index) => (
                        <div key={index} className="p-3 bg-slate-50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-900">{table.name}</span>
                            <Badge variant="outline">{table.rows} rows</Badge>
                          </div>
                          <div className="text-xs text-slate-600">
                            {table.columns.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Database className="h-12 w-12 mx-auto mb-4" />
                    <p>No database loaded</p>
                    <p className="text-sm">Click "Load Sample" to start</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SQL Query */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SQL Query</CardTitle>
                <CardDescription>
                  Enter your SQL query below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="SELECT * FROM users;"
                    className="w-full h-32 p-3 border border-slate-300 rounded-lg font-mono text-sm resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                      Supports: SELECT, SHOW TABLES, DESCRIBE, DROP TABLE
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={clearQuery} variant="outline" size="sm">
                        Clear
                      </Button>
                      <Button
                        onClick={executeQuery}
                        disabled={isLoading || !tables.length}
                        className="px-6"
                      >
                        {isLoading ? 'Executing...' : 'Execute'}
                      </Button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Query Examples */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Query Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getQueryExamples().map((example, index) => (
                      <Button
                        key={index}
                        onClick={() => setSqlQuery(example)}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Query Results
                  <div className="flex space-x-1">
                    <Button
                      onClick={clearResults}
                      variant="outline"
                      size="sm"
                      disabled={queryResults.length === 0}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {queryResults.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {queryResults.map((result, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {result.query}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              onClick={() => copyResult(result)}
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => downloadResult(result)}
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-600 mb-2">
                          {result.rowCount} rows returned
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-slate-50">
                                {result.columns.map((col, colIndex) => (
                                  <th key={colIndex} className="p-1 text-left font-medium text-slate-700 border-b">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {result.rows.slice(0, 10).map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-100">
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-1 text-slate-600">
                                      {String(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                              {result.rows.length > 10 && (
                                <tr>
                                  <td colSpan={result.columns.length} className="p-2 text-center text-slate-400 bg-slate-50">
                                    +{result.rows.length - 10} more rows
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>No query results</p>
                    <p className="text-sm">Execute a query to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">SQL Help</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <div><strong>SELECT:</strong> Query data from tables</div>
                <div><strong>SHOW TABLES:</strong> List all tables</div>
                <div><strong>DESCRIBE table:</strong> Show table schema</div>
                <div><strong>DROP TABLE:</strong> Delete a table</div>
                <div className="pt-2 text-blue-600">
                  Try: SELECT * FROM users LIMIT 5
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}