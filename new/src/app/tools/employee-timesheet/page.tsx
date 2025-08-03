'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, User, DollarSign, Download, Upload, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakDuration: number; // in minutes
  totalHours: number;
  hourlyRate: number;
  overtimeHours: number;
  description: string;
}

interface Employee {
  id: string;
  name: string;
  hourlyRate: number;
  position: string;
}

export default function EmployeeTimesheet() {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'John Smith', hourlyRate: 25.00, position: 'Developer' },
    { id: '2', name: 'Jane Doe', hourlyRate: 22.50, position: 'Designer' },
    { id: '3', name: 'Bob Johnson', hourlyRate: 20.00, position: 'Manager' }
  ]);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<Partial<TimeEntry>>({
    employeeId: '',
    date: selectedDate,
    clockIn: '',
    clockOut: '',
    breakDuration: 0,
    hourlyRate: 0,
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('timesheet-entries');
    const savedEmployees = localStorage.getItem('timesheet-employees');
    
    if (savedEntries) {
      try {
        setTimeEntries(JSON.parse(savedEntries));
      } catch (e) {
        console.error('Failed to load saved entries');
      }
    }
    
    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch (e) {
        console.error('Failed to load saved employees');
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('timesheet-entries', JSON.stringify(timeEntries));
    localStorage.setItem('timesheet-employees', JSON.stringify(employees));
  }, [timeEntries, employees]);

  const calculateHours = (clockIn: string, clockOut: string, breakDuration: number): number => {
    if (!clockIn || !clockOut) return 0;
    
    const inTime = new Date(`2000-01-01T${clockIn}`);
    const outTime = new Date(`2000-01-01T${clockOut}`);
    const breakHours = breakDuration / 60;
    
    const totalHours = (outTime.getTime() - inTime.getTime()) / (1000 * 60 * 60) - breakHours;
    return Math.max(0, totalHours);
  };

  const calculateOvertime = (totalHours: number): number => {
    return Math.max(0, totalHours - 8); // Overtime after 8 hours
  };

  const calculatePay = (totalHours: number, overtimeHours: number, hourlyRate: number): number => {
    const regularHours = totalHours - overtimeHours;
    return (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5); // 1.5x overtime rate
  };

  const addTimeEntry = () => {
    if (!currentTimeEntry.employeeId || !currentTimeEntry.clockIn || !currentTimeEntry.clockOut) {
      alert('Please fill in all required fields');
      return;
    }

    const employee = employees.find(emp => emp.id === currentTimeEntry.employeeId);
    if (!employee) {
      alert('Invalid employee selected');
      return;
    }

    const totalHours = calculateHours(
      currentTimeEntry.clockIn || '',
      currentTimeEntry.clockOut || '',
      currentTimeEntry.breakDuration || 0
    );

    const overtimeHours = calculateOvertime(totalHours);

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      employeeId: currentTimeEntry.employeeId,
      employeeName: employee.name,
      date: currentTimeEntry.date || selectedDate,
      clockIn: currentTimeEntry.clockIn || '',
      clockOut: currentTimeEntry.clockOut || '',
      breakDuration: currentTimeEntry.breakDuration || 0,
      totalHours,
      hourlyRate: employee.hourlyRate,
      overtimeHours,
      description: currentTimeEntry.description || ''
    };

    if (isEditing && editingId) {
      setTimeEntries(timeEntries.map(entry => 
        entry.id === editingId ? newEntry : entry
      ));
      setIsEditing(false);
      setEditingId(null);
    } else {
      setTimeEntries([...timeEntries, newEntry]);
    }

    // Reset form
    setCurrentTimeEntry({
      employeeId: '',
      date: selectedDate,
      clockIn: '',
      clockOut: '',
      breakDuration: 0,
      hourlyRate: 0,
      description: ''
    });
  };

  const deleteTimeEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this time entry?')) {
      setTimeEntries(timeEntries.filter(entry => entry.id !== id));
    }
  };

  const editTimeEntry = (entry: TimeEntry) => {
    setCurrentTimeEntry({
      employeeId: entry.employeeId,
      date: entry.date,
      clockIn: entry.clockIn,
      clockOut: entry.clockOut,
      breakDuration: entry.breakDuration,
      hourlyRate: entry.hourlyRate,
      description: entry.description
    });
    setIsEditing(true);
    setEditingId(entry.id);
  };

  const getFilteredEntries = () => {
    return timeEntries.filter(entry => entry.date === selectedDate);
  };

  const getDailyTotals = () => {
    const entries = getFilteredEntries();
    const totalHours = entries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const totalOvertime = entries.reduce((sum, entry) => sum + entry.overtimeHours, 0);
    const totalPay = entries.reduce((sum, entry) => sum + calculatePay(entry.totalHours, entry.overtimeHours, entry.hourlyRate), 0);
    
    return { totalHours, totalOvertime, totalPay };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Employee', 'Position', 'Clock In', 'Clock Out', 'Break (hrs)', 'Total Hours', 'Overtime Hours', 'Hourly Rate', 'Total Pay', 'Description'];
    const csvContent = [
      headers.join(','),
      ...getFilteredEntries().map(entry => [
        entry.date,
        entry.employeeName,
        employees.find(emp => emp.id === entry.employeeId)?.position || '',
        entry.clockIn,
        entry.clockOut,
        (entry.breakDuration / 60).toFixed(2),
        entry.totalHours.toFixed(2),
        entry.overtimeHours.toFixed(2),
        entry.hourlyRate.toFixed(2),
        calculatePay(entry.totalHours, entry.overtimeHours, entry.hourlyRate).toFixed(2),
        `"${entry.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${selectedDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const dailyTotals = getDailyTotals();

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
                <h1 className="text-xl font-bold text-slate-900">Employee Timesheet</h1>
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
        {/* Date Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Date Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-64"
              />
              <Button onClick={exportToCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add/Edit Time Entry */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isEditing ? 'Edit Time Entry' : 'Add Time Entry'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Employee
                  </label>
                  <select
                    value={currentTimeEntry.employeeId || ''}
                    onChange={(e) => setCurrentTimeEntry(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} (${employee.hourlyRate}/hr)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Clock In
                    </label>
                    <Input
                      type="time"
                      value={currentTimeEntry.clockIn || ''}
                      onChange={(e) => setCurrentTimeEntry(prev => ({ ...prev, clockIn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Clock Out
                    </label>
                    <Input
                      type="time"
                      value={currentTimeEntry.clockOut || ''}
                      onChange={(e) => setCurrentTimeEntry(prev => ({ ...prev, clockOut: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Break Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={currentTimeEntry.breakDuration || ''}
                    onChange={(e) => setCurrentTimeEntry(prev => ({ ...prev, breakDuration: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description (optional)
                  </label>
                  <Input
                    value={currentTimeEntry.description || ''}
                    onChange={(e) => setCurrentTimeEntry(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Work description..."
                  />
                </div>

                <Button onClick={addTimeEntry} className="w-full">
                  {isEditing ? 'Update Entry' : 'Add Entry'}
                </Button>

                {isEditing && (
                  <Button onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                    setCurrentTimeEntry({
                      employeeId: '',
                      date: selectedDate,
                      clockIn: '',
                      clockOut: '',
                      breakDuration: 0,
                      hourlyRate: 0,
                      description: ''
                    });
                  }} variant="outline" className="w-full">
                    Cancel Edit
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Daily Totals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Totals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Hours:</span>
                  <span className="font-medium">{dailyTotals.totalHours.toFixed(2)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Overtime Hours:</span>
                  <span className="font-medium text-orange-600">{dailyTotals.totalOvertime.toFixed(2)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Pay:</span>
                  <span className="font-medium text-green-600">${dailyTotals.totalPay.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Entries:</span>
                  <span className="font-medium">{getFilteredEntries().length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Time Entries */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Time Entries for {selectedDate}</span>
                  <span className="text-sm text-slate-600">
                    {getFilteredEntries().length} entries
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getFilteredEntries().length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredEntries().map((entry) => (
                      <div key={entry.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{entry.employeeName}</h4>
                            <p className="text-sm text-slate-600">
                              {employees.find(emp => emp.id === entry.employeeId)?.position}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              ${entry.hourlyRate}/hr
                            </Badge>
                            <Button
                              onClick={() => editTimeEntry(entry)}
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => deleteTimeEntry(entry.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-slate-600">Clock In</div>
                            <div className="font-medium">{entry.clockIn}</div>
                          </div>
                          <div>
                            <div className="text-slate-600">Clock Out</div>
                            <div className="font-medium">{entry.clockOut}</div>
                          </div>
                          <div>
                            <div className="text-slate-600">Total Hours</div>
                            <div className="font-medium">{entry.totalHours.toFixed(2)} hrs</div>
                          </div>
                          <div>
                            <div className="text-slate-600">Pay</div>
                            <div className="font-medium text-green-600">
                              ${calculatePay(entry.totalHours, entry.overtimeHours, entry.hourlyRate).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {entry.breakDuration > 0 && (
                          <div className="mt-2 text-sm text-slate-600">
                            Break: {entry.breakDuration} minutes
                          </div>
                        )}

                        {entry.description && (
                          <div className="mt-2 text-sm text-slate-700">
                            {entry.description}
                          </div>
                        )}

                        {entry.overtimeHours > 0 && (
                          <div className="mt-2 text-sm text-orange-600 font-medium">
                            Overtime: {entry.overtimeHours.toFixed(2)} hours
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <p>No time entries for this date</p>
                    <p className="text-sm">Add a time entry to get started</p>
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