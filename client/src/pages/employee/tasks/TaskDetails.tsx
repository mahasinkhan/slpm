// src/pages/employee/tasks/TaskDetails.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Flag,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  Download,
  Edit,
  Play,
  Pause,
} from 'lucide-react';

const TaskDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(60);
  const [comment, setComment] = useState('');

  // Mock task data
  const task = {
    id: 1,
    title: 'Complete Q4 Sales Report',
    description: 'Prepare the quarterly sales report with detailed analysis of sales performance across all regions. Include projections for the next quarter based on current trends and market analysis.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-12-20',
    startDate: '2024-12-01',
    assignedBy: 'John Manager',
    assignedTo: 'You',
    progress: 60,
    category: 'Reports',
    attachments: [
      { name: 'Q3_Report_Template.xlsx', size: '2.4 MB', type: 'xlsx' },
      { name: 'Sales_Data_2024.csv', size: '1.1 MB', type: 'csv' },
    ],
    comments: [
      {
        id: 1,
        user: 'John Manager',
        message: 'Please ensure to include the regional breakdown in the report.',
        time: '2 days ago',
        avatar: 'JM',
      },
      {
        id: 2,
        user: 'You',
        message: 'Sure, I will add a separate section for regional analysis.',
        time: '2 days ago',
        avatar: 'YU',
      },
      {
        id: 3,
        user: 'Sarah Lead',
        message: 'Great progress so far! Let me know if you need any data from the analytics team.',
        time: '1 day ago',
        avatar: 'SL',
      },
    ],
    timeline: [
      { action: 'Task Created', time: 'Dec 1, 2024', by: 'John Manager' },
      { action: 'Started Working', time: 'Dec 2, 2024', by: 'You' },
      { action: 'Progress Updated to 30%', time: 'Dec 8, 2024', by: 'You' },
      { action: 'Progress Updated to 60%', time: 'Dec 14, 2024', by: 'You' },
    ],
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // Add comment logic here
      setComment('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/employee/tasks')}
          className="p-2 hover:bg-gray-100 rounded-lg transition mt-1"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              <Clock size={12} /> {task.status}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
              <Flag size={12} /> {task.priority} Priority
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
              {task.category}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-600">{task.description}</p>
          </div>

          {/* Progress Update */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Update Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Current Progress</span>
                  <span className="font-bold text-gray-800">{progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  Save Progress
                </button>
                {progress < 100 && (
                  <button className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2">
                    <CheckCircle size={18} />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Paperclip size={18} />
              Attachments ({task.attachments.length})
            </h2>
            <div className="space-y-3">
              {task.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 uppercase">{file.type}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition">
                    <Download size={18} className="text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={18} />
              Comments ({task.comments.length})
            </h2>
            <div className="space-y-4 mb-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{comment.user}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmitComment} className="flex gap-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Task Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar size={16} /> Start Date
                </span>
                <span className="font-medium text-gray-800">
                  {new Date(task.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar size={16} /> Due Date
                </span>
                <span className="font-medium text-gray-800">
                  {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <User size={16} /> Assigned By
                </span>
                <span className="font-medium text-gray-800">{task.assignedBy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <User size={16} /> Assigned To
                </span>
                <span className="font-medium text-gray-800">{task.assignedTo}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2">
                <Edit size={18} />
                Request Edit
              </button>
              <button className="w-full py-2.5 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition font-medium flex items-center justify-center gap-2">
                <Pause size={18} />
                Request Extension
              </button>
              <button className="w-full py-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2">
                <AlertCircle size={18} />
                Report Issue
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Activity Timeline</h2>
            <div className="space-y-4">
              {task.timeline.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mt-1.5" />
                    {index < task.timeline.length - 1 && (
                      <div className="absolute top-4 left-1.5 w-0.5 h-full bg-gray-200 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-gray-800 text-sm">{item.action}</p>
                    <p className="text-xs text-gray-500">
                      {item.time} • {item.by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;