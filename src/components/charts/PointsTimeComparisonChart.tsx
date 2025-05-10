
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

type TimeFrame = 'week' | 'month' | 'year';

const PointsTimeComparisonChart = () => {
  const { browniePoints, currentUser, partner } = useApp();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  
  // Calculate the date cutoffs for different timeframes
  const getDateCutoff = () => {
    const now = new Date();
    if (timeFrame === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return weekAgo;
    } else if (timeFrame === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return monthAgo;
    } else {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      return yearAgo;
    }
  };
  
  // Filter points by timeframe
  const filteredPoints = browniePoints.filter(point => 
    point.createdAt >= getDateCutoff()
  );
  
  // Calculate total points for each user within the selected time frame
  const pointsData = filteredPoints.reduce((acc, point) => {
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
      color: '#f97316' // orange
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
  
  // Get the title based on the current timeframe
  const getTimeframeTitle = () => {
    switch (timeFrame) {
      case 'week':
        return 'Past Week';
      case 'month':
        return 'Past Month';
      case 'year':
        return 'Past Year';
      default:
        return 'Points Competition';
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="week" value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
      </Tabs>
      
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
      <div className="text-center text-sm text-gray-500">
        Points earned during the {getTimeframeTitle().toLowerCase()}
      </div>
    </div>
  );
};

export default PointsTimeComparisonChart;
