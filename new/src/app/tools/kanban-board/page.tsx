'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, GripVertical, Trash2, Edit, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [],
      color: 'bg-blue-100 border-blue-200'
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      tasks: [],
      color: 'bg-yellow-100 border-yellow-200'
    },
    {
      id: 'review',
      title: 'Review',
      tasks: [],
      color: 'bg-purple-100 border-purple-200'
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [],
      color: 'bg-green-100 border-green-200'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('todo');
  const [editingTask, setEditingTask] = useState<{columnId: string, taskId: string} | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanban-columns');
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, []);

  // Save to localStorage when columns change
  useEffect(() => {
    localStorage.setItem('kanban-columns', JSON.stringify(columns));
  }, [columns]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      assignee: newTaskAssignee.trim() || undefined,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      createdAt: new Date().toISOString()
    };

    setColumns(columns.map(column => 
      column.id === selectedColumn 
        ? { ...column, tasks: [...column.tasks, task] }
        : column
    ));

    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
  };

  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(column => 
      column.id === columnId
        ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
        : column
    ));
  };

  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    const taskToMove = columns.find(col => col.id === fromColumnId)?.tasks.find(task => task.id === taskId);
    if (!taskToMove) return;

    setColumns(columns.map(column => {
      if (column.id === fromColumnId) {
        return { ...column, tasks: column.tasks.filter(task => task.id !== taskId) };
      }
      if (column.id === toColumnId) {
        return { ...column, tasks: [...column.tasks, taskToMove] };
      }
      return column;
    }));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTotalTasks = () => {
    return columns.reduce((total, column) => total + column.tasks.length, 0);
  };

  const getCompletedTasks = () => {
    return columns.find(col => col.id === 'done')?.tasks.length || 0;
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
                <h1 className="text-xl font-bold text-slate-900">Kanban Board</h1>
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
        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{getTotalTasks()}</div>
              <div className="text-sm text-slate-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getCompletedTasks()}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{columns.length}</div>
              <div className="text-sm text-slate-600">Columns</div>
            </div>
          </div>
          <Button onClick={() => {
            if (confirm('Clear all tasks? This cannot be undone.')) {
              localStorage.removeItem('kanban-columns');
              setColumns(columns.map(col => ({ ...col, tasks: [] })));
            }
          }} variant="outline">
            Clear Board
          </Button>
        </div>

        {/* Add Task Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title"
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
              </div>
              <div>
                <select
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  {columns.map(column => (
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  placeholder="Assignee (optional)"
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  placeholder="Due date"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addTask} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <Card key={column.id} className={`${column.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{column.title}</span>
                  <Badge variant="outline">
                    {column.tasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[400px] max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="bg-white border-slate-200 hover:shadow-md transition-shadow cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', task.id);
                        e.dataTransfer.setData('fromColumnId', column.id);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData('taskId');
                        const fromColumnId = e.dataTransfer.getData('fromColumnId');
                        if (fromColumnId !== column.id) {
                          moveTask(taskId, fromColumnId, column.id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 mb-1">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-slate-600 mb-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              <Button
                                onClick={() => deleteTask(column.id, task.id)}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityIcon(task.priority)} {task.priority}
                            </Badge>
                            {task.assignee && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {task.assignee}
                              </Badge>
                            )}
                          </div>

                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {column.tasks.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <GripVertical className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No tasks in this column</p>
                      <p className="text-xs">Drag tasks here or add new ones</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">How to Use</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click "Add New Task" to create tasks and assign them to columns</li>
                  <li>• Drag and drop tasks between columns to update their status</li>
                  <li>• Click the trash icon to delete tasks</li>
                  <li>• Your board is automatically saved in your browser</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}