// src/pages/employee/components/EmployeeStats.tsx
import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  Target,
  Award,
  Briefcase,
} from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'teal';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  color,
  onClick,
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600',
      border: 'border-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600',
      border: 'border-green-100',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      valueColor: 'text-purple-600',
      border: 'border-purple-100',
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-600',
      border: 'border-orange-100',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600',
      border: 'border-red-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      valueColor: 'text-indigo-600',
      border: 'border-indigo-100',
    },
    pink: {
      bg: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
      valueColor: 'text-pink-600',
      border: 'border-pink-100',
    },
    teal: {
      bg: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      valueColor: 'text-teal-600',
      border: 'border-teal-100',
    },
  };

  const classes = colorClasses[color];

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl p-4 md:p-5 shadow-sm border ${classes.border}
        hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${classes.iconBg} p-2.5 md:p-3 rounded-xl`}>
          <Icon className={classes.iconColor} size={22} />
        </div>
        {trend && (
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend.isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <p className="text-gray-600 text-xs md:text-sm mb-1">{label}</p>
      <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${classes.valueColor}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  );
};

interface EmployeeStatsProps {
  variant?: 'dashboard' | 'attendance' | 'leaves' | 'tasks' | 'payroll';
  onStatClick?: (statType: string) => void;
}

const EmployeeStats: React.FC<EmployeeStatsProps> = ({
  variant = 'dashboard',
  onStatClick,
}) => {
  // Dashboard Stats
  const dashboardStats = [
    {
      icon: Calendar,
      label: 'Days Present',
      value: '22/24',
      subValue: 'This month',
      trend: { value: 5, isPositive: true },
      color: 'green' as const,
      type: 'attendance',
    },
    {
      icon: Clock,
      label: 'Hours Worked',
      value: '176h',
      subValue: 'This month',
      trend: { value: 3, isPositive: true },
      color: 'blue' as const,
      type: 'hours',
    },
    {
      icon: FileText,
      label: 'Pending Tasks',
      value: '8',
      subValue: '3 high priority',
      color: 'orange' as const,
      type: 'tasks',
    },
    {
      icon: DollarSign,
      label: 'This Month Salary',
      value: '₹45,000',
      subValue: 'After deductions',
      color: 'purple' as const,
      type: 'salary',
    },
  ];

  // Attendance Stats
  const attendanceStats = [
    {
      icon: Calendar,
      label: 'Total Working Days',
      value: '24',
      subValue: 'November 2024',
      color: 'blue' as const,
      type: 'total',
    },
    {
      icon: CheckCircle,
      label: 'Present Days',
      value: '22',
      subValue: '91.7% attendance',
      trend: { value: 2, isPositive: true },
      color: 'green' as const,
      type: 'present',
    },
    {
      icon: AlertCircle,
      label: 'Absent Days',
      value: '1',
      color: 'red' as const,
      type: 'absent',
    },
    {
      icon: Clock,
      label: 'Late Arrivals',
      value: '1',
      color: 'orange' as const,
      type: 'late',
    },
    {
      icon: TrendingUp,
      label: 'Avg. Hours/Day',
      value: '8.9h',
      trend: { value: 5, isPositive: true },
      color: 'purple' as const,
      type: 'avgHours',
    },
  ];

  // Leaves Stats
  const leavesStats = [
    {
      icon: Calendar,
      label: 'Casual Leave',
      value: '7/12',
      subValue: 'Available',
      color: 'blue' as const,
      type: 'casual',
    },
    {
      icon: FileText,
      label: 'Sick Leave',
      value: '8/10',
      subValue: 'Available',
      color: 'green' as const,
      type: 'sick',
    },
    {
      icon: Briefcase,
      label: 'Earned Leave',
      value: '12/15',
      subValue: 'Available',
      color: 'purple' as const,
      type: 'earned',
    },
    {
      icon: AlertCircle,
      label: 'Pending Requests',
      value: '1',
      color: 'orange' as const,
      type: 'pending',
    },
  ];

  // Tasks Stats
  const tasksStats = [
    {
      icon: ClipboardList,
      label: 'Total Tasks',
      value: '15',
      subValue: 'This month',
      color: 'blue' as const,
      type: 'total',
    },
    {
      icon: AlertCircle,
      label: 'Pending',
      value: '5',
      color: 'orange' as const,
      type: 'pending',
    },
    {
      icon: Clock,
      label: 'In Progress',
      value: '3',
      color: 'blue' as const,
      type: 'inProgress',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: '7',
      trend: { value: 15, isPositive: true },
      color: 'green' as const,
      type: 'completed',
    },
    {
      icon: Target,
      label: 'Completion Rate',
      value: '87%',
      color: 'purple' as const,
      type: 'rate',
    },
  ];

  // Payroll Stats
  const payrollStats = [
    {
      icon: DollarSign,
      label: 'Gross Salary',
      value: '₹50,000',
      color: 'blue' as const,
      type: 'gross',
    },
    {
      icon: TrendingDown,
      label: 'Total Deductions',
      value: '₹5,000',
      color: 'red' as const,
      type: 'deductions',
    },
    {
      icon: TrendingUp,
      label: 'Net Salary',
      value: '₹45,000',
      color: 'green' as const,
      type: 'net',
    },
    {
      icon: Award,
      label: 'YTD Earnings',
      value: '₹4,95,000',
      trend: { value: 10, isPositive: true },
      color: 'purple' as const,
      type: 'ytd',
    },
  ];

  const getStats = () => {
    switch (variant) {
      case 'attendance':
        return attendanceStats;
      case 'leaves':
        return leavesStats;
      case 'tasks':
        return tasksStats;
      case 'payroll':
        return payrollStats;
      default:
        return dashboardStats;
    }
  };

  const stats = getStats();

  // Determine grid columns based on number of stats
  const getGridCols = () => {
    const count = stats.length;
    if (count <= 4) {
      return 'grid-cols-2 lg:grid-cols-4';
    } else if (count === 5) {
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    } else {
      return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
    }
  };

  return (
    <div className={`grid ${getGridCols()} gap-3 md:gap-4 lg:gap-5`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          subValue={stat.subValue}
          trend={stat.trend}
          color={stat.color}
          onClick={onStatClick ? () => onStatClick(stat.type) : undefined}
        />
      ))}
    </div>
  );
};

// Export individual stat card for custom usage
export { StatCard };
export default EmployeeStats;

// Additional Utility Components

interface MiniStatProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const MiniStat: React.FC<MiniStatProps> = ({
  icon: Icon,
  label,
  value,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

interface ProgressStatProps {
  label: string;
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  showPercentage?: boolean;
}

export const ProgressStat: React.FC<ProgressStatProps> = ({
  label,
  current,
  total,
  color = 'blue',
  showPercentage = true,
}) => {
  const percentage = Math.round((current / total) * 100);

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-800">
          {current}/{total}
          {showPercentage && ` (${percentage}%)`}
        </span>
      </div>
      <div className={`h-2 rounded-full ${bgColorClasses[color]} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Import fix for ClipboardList
import { ClipboardList } from 'lucide-react';