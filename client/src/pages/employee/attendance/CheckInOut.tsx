// src/pages/employee/attendance/CheckInOut.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Calendar,
  Coffee,
  Wifi,
  AlertCircle,
  History,
} from 'lucide-react';

const CheckInOut: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [location, setLocation] = useState<string>('Detecting...');
  const [workHours, setWorkHours] = useState<string>('00:00:00');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Calculate work hours if checked in
      if (checkInTime && !isOnBreak) {
        const diff = new Date().getTime() - checkInTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setWorkHours(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [checkInTime, isOnBreak]);

  // Simulate location detection
  useEffect(() => {
    setTimeout(() => {
      setLocation('SL Brothers Ltd, Main Office');
    }, 1500);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setWorkHours('00:00:00');
  };

  const handleBreakStart = () => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
  };

  const handleBreakEnd = () => {
    setIsOnBreak(false);
    setBreakStartTime(null);
  };

  // Today's attendance history (mock data)
  const todayHistory = [
    { time: '09:00 AM', action: 'Checked In', status: 'success' },
    { time: '01:00 PM', action: 'Break Started', status: 'warning' },
    { time: '01:45 PM', action: 'Break Ended', status: 'success' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Clock Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="text-center">
          <p className="text-blue-200 mb-2">{formatDate(currentTime)}</p>
          <p className="text-5xl md:text-7xl font-bold font-mono mb-4">
            {formatTime(currentTime)}
          </p>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-blue-200 mb-6">
            <MapPin size={18} />
            <span>{location}</span>
            {location !== 'Detecting...' && (
              <CheckCircle size={16} className="text-green-400" />
            )}
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <div className={`w-3 h-3 rounded-full ${isCheckedIn ? (isOnBreak ? 'bg-orange-400' : 'bg-green-400') : 'bg-gray-400'} animate-pulse`} />
            <span className="font-semibold">
              {isCheckedIn ? (isOnBreak ? 'On Break' : 'Working') : 'Not Checked In'}
            </span>
          </div>

          {/* Work Hours Counter */}
          {isCheckedIn && (
            <div className="mb-6">
              <p className="text-blue-200 text-sm mb-1">Hours Worked Today</p>
              <p className="text-3xl font-bold font-mono">{workHours}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                className="w-full sm:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
              >
                <CheckCircle size={24} />
                Check In
              </button>
            ) : (
              <>
                {!isOnBreak ? (
                  <button
                    onClick={handleBreakStart}
                    className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Coffee size={20} />
                    Start Break
                  </button>
                ) : (
                  <button
                    onClick={handleBreakEnd}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Coffee size={20} />
                    End Break
                  </button>
                )}
                <button
                  onClick={handleCheckOut}
                  disabled={isOnBreak}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isOnBreak
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 hover:scale-105'
                  }`}
                >
                  <XCircle size={24} />
                  Check Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Check In Time */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <span className="font-semibold text-gray-800">Check In</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {checkInTime ? formatTime(checkInTime) : '--:--:--'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {checkInTime ? 'On time' : 'Not checked in yet'}
          </p>
        </div>

        {/* Expected Check Out */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <XCircle className="text-red-600" size={20} />
            </div>
            <span className="font-semibold text-gray-800">Expected Out</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">06:00 PM</p>
          <p className="text-sm text-gray-500 mt-1">Standard shift end</p>
        </div>

        {/* Break Time */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-100 rounded-lg">
              <Coffee className="text-orange-600" size={20} />
            </div>
            <span className="font-semibold text-gray-800">Break Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {isOnBreak && breakStartTime
              ? formatTime(breakStartTime)
              : '45 min'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isOnBreak ? 'Break started' : 'Total break allowed'}
          </p>
        </div>
      </div>

      {/* Today's History & Guidelines */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <History className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Today's Activity</h2>
          </div>
          <div className="p-5">
            {todayHistory.length > 0 ? (
              <div className="space-y-4">
                {todayHistory.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'success' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock size={40} className="mx-auto mb-3 opacity-50" />
                <p>No activity recorded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Guidelines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <AlertCircle className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Guidelines</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">
                Standard work hours are <strong>9:00 AM to 6:00 PM</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">
                Check-in after 9:30 AM will be marked as <strong>Late</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">
                Maximum break time allowed is <strong>45 minutes</strong>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">4</span>
              </div>
              <p className="text-sm text-gray-600">
                Location must be enabled for accurate tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <Wifi className="text-green-600" size={20} />
        <p className="text-sm text-green-700">
          <strong>Connected to office network.</strong> Your attendance will be recorded accurately.
        </p>
      </div>
    </div>
  );
};

export default CheckInOut;