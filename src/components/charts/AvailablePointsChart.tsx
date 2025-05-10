
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AvailablePointsChart = () => {
  const { availablePoints, partner, currentUser } = useApp();
  
  // Calculate partner's available points
  // This is a simple approximation since we don't have direct access to partner's availablePoints
  // In a real app, this would come from the API/database
  const partnerAvailablePoints = partner?.availablePoints || 0;
  
  const data = [
    {
      name: currentUser?.name || 'You',
      value: availablePoints,
      color: '#0ea5e9' // sky blue
    },
    {
      name: partner?.name || 'Partner',
      value: partnerAvailablePoints,
      color: '#f43f5e' // pink
    }
  ];
  
  // Filter out zero values to avoid empty segments
  const filteredData = data.filter(item => item.value > 0);
  
  // If no data, show a message
  if (filteredData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-gray-500">
        No points data available
      </div>
    );
  }
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p>Available Points: {payload[0].value}</p>
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
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={70}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-500 mt-2">
        Available points comparison
      </div>
    </div>
  );
};

export default AvailablePointsChart;
