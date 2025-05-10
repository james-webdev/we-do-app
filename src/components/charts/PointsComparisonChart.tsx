
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useApp } from '@/contexts/AppContext';

const PointsComparisonChart = () => {
  const { browniePoints, currentUser, partner } = useApp();
  
  // Calculate total points for each user
  const pointsData = browniePoints.reduce((acc, point) => {
    // If points are received, add to the recipient's total
    if (point.toUserId === currentUser?.id) {
      acc.userPoints += point.points;
    } else if (point.toUserId === partner?.id) {
      acc.partnerPoints += point.points;
    }
    return acc;
  }, { userPoints: 0, partnerPoints: 0 });
  
  const data = [
    {
      name: currentUser?.name || 'You',
      value: pointsData.userPoints,
      color: '#8b5cf6' // purple
    },
    {
      name: partner?.name || 'Partner',
      value: pointsData.partnerPoints,
      color: '#c4b5fd' // lighter purple
    }
  ];
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p>Total Points: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

export default PointsComparisonChart;
