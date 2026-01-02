import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: any;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
}) => (
  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div
        className={`p-3 rounded-lg  bg-blue-50
        `}
      >
        <Icon
          className={`w-5 h-5 text-blue-600
          `}
        />
      </div>
    </div>
  </div>
);
