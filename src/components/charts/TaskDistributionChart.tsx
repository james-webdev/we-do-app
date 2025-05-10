
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useApp } from '@/contexts/AppContext';

interface TaskDistributionChartProps {
  userTaskCount: number;
  partnerTaskCount: number;
  userPoints: number;
  partnerPoints: number;
}

const COLORS = ['#8b5cf6', '#c4b5fd'];

const TaskDistributionChart = ({ 
  userTaskCount, 
  partnerTaskCount,
  userPoints,
  partnerPoints
}: TaskDistributionChartProps) => {
  const { currentUser, partner } = useApp();

  // Calculate weighted tasks based on rating points
  const data = [
    {
      name: currentUser?.name || 'You',
      value: userPoints,
      color: COLORS[0]
    },
    {
      name: partner?.name || 'Partner',
      value: partnerPoints,
      color: COLORS[1]
    }
  ];

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p>Point Total: {payload[0].value}</p>
          <p className="text-gray-500">Based on action ratings</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskDistributionChart;
