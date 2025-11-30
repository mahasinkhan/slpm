
// components/StatsCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'gray';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  clickable?: boolean;
  onClick?: () => void;
  link?: string;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
  clickable = false,
  onClick,
  link,
  loading = false
}) => {
  const navigate = useNavigate();

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    purple: 'bg-purple-500 text-purple-600',
    orange: 'bg-orange-500 text-orange-600',
    red: 'bg-red-500 text-red-600',
    yellow: 'bg-yellow-500 text-yellow-600',
    gray: 'bg-gray-500 text-gray-600'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      navigate(link);
    }
  };

  const CardWrapper = clickable || onClick || link ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={clickable || onClick || link ? handleClick : undefined}
      className={`bg-white rounded-lg shadow-sm p-6 transition-all ${
        (clickable || onClick || link) 
          ? 'hover:shadow-md cursor-pointer hover:-translate-y-0.5' 
          : ''
      } ${loading ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          {loading ? (
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-opacity-10 ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-sm">
          {subtitle && (
            <span className="text-gray-500">{subtitle}</span>
          )}
          {trend && (
            <div className={`flex items-center gap-1 font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      )}
    </CardWrapper>
  );
};

export default StatsCard;