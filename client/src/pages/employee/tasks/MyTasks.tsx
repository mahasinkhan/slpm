// src/pages/employee/tasks/MyTasks.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  ChevronRight,
  MoreVertical,
  Flag,
} from 'lucide-react';

const MyTasks: React.FC = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tasks = [
    {
      id: 1,
      title: 'Complete Q4 Sales Report',
      description: 'Prepare the quarterly sales report with analysis and projections',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-12-20',
      assignedBy: 'John Manager',
      progress: 60,
      category: 'Reports',
    },
    {
      id: 2,
      title: 'Team Meeting Preparation',
      description: 'Prepare presentation slides for the upcoming team meeting',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '2024-12-18',
      assignedBy: 'John Manager',
      progress: 0,
      category: 'Meetings',
    },
    {
      id: 3,
      title: 'Update Documentation',
      description: 'Update the project documentation with recent changes',
      status: 'Pending',
      priority: 'Low',
      dueDate: '2024-12-22',
      assignedBy: 'Sarah Lead',
      progress: 0,
      category: 'Documentation',
    },
    {
      id: 4,
      title: 'Client Proposal Review',
      description: 'Review and provide feedback on the new client proposal',
      status: 'Completed',
      priority: 'High',
      dueDate: '2024-12-15',
      assignedBy: 'John Manager',
      progress: 100,
      category: 'Client Work',
    },
    {
      id: 5,
      title: 'Code Review for Module A',
      description: 'Review the code changes for the new feature module',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: '2024-12-19',
      assignedBy: 'Tech Lead',
      progress: 30,
      category: 'Development',
    },
    {
      id: 6,
      title: 'Training Session Attendance',
      description: 'Attend the mandatory security training session',
      status: 'Completed',
      priority: 'Medium',
      dueDate: '2024-12-10',
      assignedBy: 'HR Team',
      progress: 100,
      category: 'Training',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle size={12} /> Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            <Clock size={12} /> In Progress
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            <AlertCircle size={12} /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">
            <Flag size={10} /> High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
            <Flag size={10} /> Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
            <Flag size={10} /> Low
          </span>
        );
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'Completed';
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'all' || task.status.toLowerCase().replace(' ', '-') === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority.toLowerCase() === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate, t.status)).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{stats.inProgress}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-sm text-orange-600">Pending</p>
          <p className="text-2xl font-bold text-orange-700">{stats.pending}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm text-red-600">Overdue</p>
          <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => navigate(`/employee/tasks/${task.id}`)}
            className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer ${
              isOverdue(task.dueDate, task.status) ? 'border-red-200 bg-red-50/30' : 'border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                  {isOverdue(task.dueDate, task.status) && (
                    <span className="text-xs text-red-600 font-semibold">OVERDUE</span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-1">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>By: {task.assignedBy}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{task.category}</span>
                </div>

                {/* Progress Bar */}
                {task.status !== 'Pending' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-800">{task.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No tasks found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default MyTasks;