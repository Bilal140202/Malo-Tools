'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Download, Upload, Trash2, Edit, Move, Save, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  children: string[];
  parent?: string;
  color: string;
  level: number;
}

interface Connection {
  from: string;
  to: string;
}

export default function MindMapBuilder() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [newNodeText, setNewNodeText] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sample mind map data
  const sampleMindMap = {
    nodes: [
      {
        id: 'central',
        text: 'Central Idea',
        x: 600,
        y: 400,
        children: ['branch1', 'branch2', 'branch3'],
        color: 'bg-blue-100 border-blue-300',
        level: 0
      },
      {
        id: 'branch1',
        text: 'Branch 1',
        x: 400,
        y: 300,
        children: ['leaf1', 'leaf2'],
        parent: 'central',
        color: 'bg-green-100 border-green-300',
        level: 1
      },
      {
        id: 'branch2',
        text: 'Branch 2',
        x: 600,
        y: 200,
        children: ['leaf3'],
        parent: 'central',
        color: 'bg-yellow-100 border-yellow-300',
        level: 1
      },
      {
        id: 'branch3',
        text: 'Branch 3',
        x: 800,
        y: 300,
        children: ['leaf4', 'leaf5'],
        parent: 'central',
        color: 'bg-purple-100 border-purple-300',
        level: 1
      },
      {
        id: 'leaf1',
        text: 'Leaf 1.1',
        x: 300,
        y: 200,
        parent: 'branch1',
        color: 'bg-pink-100 border-pink-300',
        level: 2
      },
      {
        id: 'leaf2',
        text: 'Leaf 1.2',
        x: 300,
        y: 400,
        parent: 'branch1',
        color: 'bg-orange-100 border-orange-300',
        level: 2
      },
      {
        id: 'leaf3',
        text: 'Leaf 2.1',
        x: 600,
        y: 100,
        parent: 'branch2',
        color: 'bg-red-100 border-red-300',
        level: 2
      },
      {
        id: 'leaf4',
        text: 'Leaf 3.1',
        x: 900,
        y: 200,
        parent: 'branch3',
        color: 'bg-indigo-100 border-indigo-300',
        level: 2
      },
      {
        id: 'leaf5',
        text: 'Leaf 3.2',
        x: 900,
        y: 400,
        parent: 'branch3',
        color: 'bg-teal-100 border-teal-300',
        level: 2
      }
    ],
    connections: [
      { from: 'central', to: 'branch1' },
      { from: 'central', to: 'branch2' },
      { from: 'central', to: 'branch3' },
      { from: 'branch1', to: 'leaf1' },
      { from: 'branch1', to: 'leaf2' },
      { from: 'branch2', to: 'leaf3' },
      { from: 'branch3', to: 'leaf4' },
      { from: 'branch3', to: 'leaf5' }
    ]
  };

  const loadSampleMindMap = () => {
    setNodes(sampleMindMap.nodes);
    setConnections(sampleMindMap.connections);
    setSelectedNode(null);
    setNewNodeText('');
  };

  useEffect(() => {
    const savedMindMap = localStorage.getItem('mind-map');
    if (savedMindMap) {
      try {
        const parsed = JSON.parse(savedMindMap);
        setNodes(parsed.nodes || []);
        setConnections(parsed.connections || []);
      } catch (e) {
        console.error('Failed to load saved mind map');
      }
    } else {
      loadSampleMindMap();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mind-map', JSON.stringify({ nodes, connections }));
  }, [nodes, connections]);

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setSelectedNode(nodeId);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedNode) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setNodes(nodes.map(node => 
      node.id === selectedNode 
        ? { ...node, x: Math.max(0, Math.min(canvasSize.width - 150, newX)), y: Math.max(0, Math.min(canvasSize.height - 50, newY)) }
        : node
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addNode = () => {
    if (!newNodeText.trim() || !selectedNode) return;

    const parentNode = nodes.find(n => n.id === selectedNode);
    if (!parentNode) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      text: newNodeText.trim(),
      x: parentNode.x + (Math.random() - 0.5) * 200,
      y: parentNode.y + (Math.random() - 0.5) * 200,
      children: [],
      parent: selectedNode,
      color: getColorByLevel(parentNode.level + 1),
      level: parentNode.level + 1
    };

    setNodes([...nodes, newNode]);
    setConnections([...connections, { from: selectedNode, to: newNode.id }]);
    setNewNodeText('');
  };

  const deleteNode = (nodeId: string) => {
    if (!confirm('Are you sure you want to delete this node and all its children?')) return;

    // Find all descendant nodes
    const descendantIds = getAllDescendantNodes(nodeId);
    
    // Remove nodes and their connections
    setNodes(nodes.filter(node => !descendantIds.includes(node.id)));
    setConnections(connections.filter(conn => 
      !descendantIds.includes(conn.from) && !descendantIds.includes(conn.to)
    ));
    
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const getAllDescendantNodes = (nodeId: string): string[] => {
    const children = nodes
      .filter(node => node.parent === nodeId)
      .map(node => node.id);
    
    const allDescendants = [...children];
    children.forEach(childId => {
      allDescendants.push(...getAllDescendantNodes(childId));
    });
    
    return allDescendants;
  };

  const getColorByLevel = (level: number): string => {
    const colors = [
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-yellow-100 border-yellow-300',
      'bg-purple-100 border-purple-300',
      'bg-pink-100 border-pink-300',
      'bg-orange-100 border-orange-300',
      'bg-red-100 border-red-300',
      'bg-indigo-100 border-indigo-300',
      'bg-teal-100 border-teal-300'
    ];
    return colors[level % colors.length];
  };

  const exportMindMap = () => {
    const dataStr = JSON.stringify({ nodes, connections }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mind-map.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearMindMap = () => {
    if (confirm('Are you sure you want to clear the entire mind map?')) {
      setNodes([]);
      setConnections([]);
      setSelectedNode(null);
      setNewNodeText('');
    }
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
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
                <h1 className="text-xl font-bold text-slate-900">Mind Map Builder</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    productivity
                  </Badge>
                  <span className="text-sm text-slate-500">No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={loadSampleMindMap} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Load Sample
            </Button>
            <Button onClick={exportMindMap} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={clearMindMap} variant="outline" size="sm" className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
          
          <div className="text-sm text-slate-600">
            {nodes.length} nodes • {connections.length} connections
          </div>
        </div>

        {/* Add Node Form */}
        {selectedNode && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Input
                  value={newNodeText}
                  onChange={(e) => setNewNodeText(e.target.value)}
                  placeholder="Enter node text..."
                  onKeyPress={(e) => e.key === 'Enter' && addNode()}
                  className="flex-1"
                />
                <Button onClick={addNode} disabled={!newNodeText.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Child Node
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Canvas */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border-2 border-slate-200"
             style={{ width: canvasSize.width, height: canvasSize.height }}
             ref={canvasRef}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}>
          
          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map((conn, index) => {
              const fromPos = getNodePosition(conn.from);
              const toPos = getNodePosition(conn.to);
              return (
                <line
                  key={index}
                  x1={fromPos.x + 75}
                  y1={fromPos.y + 25}
                  x2={toPos.x + 75}
                  y2={toPos.y + 25}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-36 h-12 rounded-lg border-2 flex items-center px-3 cursor-move transition-all duration-200 ${
                selectedNode === node.id 
                  ? 'ring-2 ring-blue-500 ring-offset-2 ' + node.color 
                  : node.color
              }`}
              style={{
                left: node.x,
                top: node.y,
                transform: selectedNode === node.id ? 'scale(1.05)' : 'scale(1)',
                zIndex: selectedNode === node.id ? 10 : 1
              }}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              onClick={() => setSelectedNode(node.id)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {node.text}
                </span>
                {selectedNode === node.id && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Instructions Overlay */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-lg mb-2">Empty Canvas</div>
                <p className="text-sm">Click "Load Sample" to start building your mind map</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-900 mb-3">How to Use</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click on any node to select it</li>
                  <li>• Drag nodes to reposition them</li>
                  <li>• Add child nodes to selected nodes</li>
                  <li>• Delete nodes with the trash icon</li>
                  <li>• Your mind map is automatically saved</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-3">Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Start with a central idea</li>
                  <li>• Use different colors for different branches</li>
                  <li>• Keep text short and concise</li>
                  <li>• Export your mind map when finished</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}