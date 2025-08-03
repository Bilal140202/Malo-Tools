'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, CheckCircle, Circle, Trash2, Edit, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  category: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('general');
  const [newDueDate, setNewDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'dueDate'>('created');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority: newPriority,
      dueDate: newDueDate || undefined,
      createdAt: new Date().toISOString(),
      category: newCategory
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
    setNewPriority('medium');
    setNewDueDate('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim() === '') return;
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getFilteredAndSortedTodos = () => {
    let filtered = todos;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  };

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const overdue = todos.filter(todo => 
      !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()
    ).length;

    return { total, completed, active, overdue };
  };

  const stats = getStats();
  const filteredTodos = getFilteredAndSortedTodos();

  const categories = [...new Set(todos.map(todo => todo.category))];

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
                <h1 className="text-xl font-bold text-slate-900">Todo List</h1>
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-slate-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
              <div className="text-sm text-slate-600">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <div className="text-sm text-slate-600">Overdue</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Todo and Filters */}
          <div className="space-y-6">
            {/* Add Todo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="What needs to be done?"
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="shopping">Shopping</option>
                      <option value="health">Health</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Due Date (optional)
                  </label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>

                <Button onClick={addTodo} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </CardContent>
            </Card>

            {/* Filters and Sort */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filter & Sort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Show
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setFilter('all')}
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => setFilter('active')}
                      variant={filter === 'active' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                    >
                      Active
                    </Button>
                    <Button
                      onClick={() => setFilter('completed')}
                      variant={filter === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                    >
                      Done
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    <option value="created">Date Created</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                  </select>
                </div>

                {categories.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Todo List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Your Tasks</span>
                  <span className="text-sm text-slate-600">
                    {filteredTodos.length} of {stats.total} tasks
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTodos.length > 0 ? (
                  <div className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                          todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className="mt-1"
                          >
                            {todo.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            {editingId === todo.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                                  className="mb-2"
                                  autoFocus
                                />
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => saveEdit(todo.id)}>
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm font-medium ${todo.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                    {todo.text}
                                  </span>
                                  <Badge className={getPriorityColor(todo.priority)}>
                                    {getPriorityIcon(todo.priority)} {todo.priority}
                                  </Badge>
                                  {todo.category !== 'general' && (
                                    <Badge variant="outline" className="text-xs">
                                      {todo.category}
                                    </Badge>
                                  )}
                                </div>
                                {todo.dueDate && (
                                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                                      {new Date(todo.dueDate) < new Date() && !todo.completed && (
                                        <span className="text-red-600 ml-1">(Overdue)</span>
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            <Button
                              onClick={() => startEditing(todo.id, todo.text)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => deleteTodo(todo.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <div className="text-lg mb-2">No tasks found</div>
                    <p className="text-sm">
                      {filter === 'completed' ? 'No completed tasks yet.' : 
                       filter === 'active' ? 'All tasks are completed!' : 
                       'Add your first task to get started.'}
                    </p>
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