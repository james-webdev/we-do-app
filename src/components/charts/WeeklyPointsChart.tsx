
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrowniePoint } from '@/types';
import { format, subDays, isAfter, isBefore, isEqual } from 'date-fns';

interface WeeklyPointsChartProps {
  browniePoints: BrowniePoint[];
  userId: string;
}

const WeeklyPointsChart = ({ browniePoints, userId }: WeeklyPointsChartProps) => {
  const today = new Date();
  
  // Generate data for the last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, i);
    const points = browniePoints.filter(bp => 
      bp.toUserId === userId && 
      (isEqual(new Date(bp.createdAt).setHours(0,0,0,0), new Date(date).setHours(0,0,0,0)) ||
       (isAfter(new Date(bp.createdAt), new Date(date).setHours(0,0,0,0)) && 
        isBefore(new Date(bp.createdAt), new Date(date).setHours(23,59,59,999))))
    ).reduce((sum, bp) => sum + bp.points, 0);
    
    return {
      name: format(date, 'EEE'),
      date: format(date, 'yyyy-MM-dd'),
      points
    };
  }).reverse();

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={days}
          margin={{
            top: 5, right: 10, left: 10, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip 
            formatter={(value) => [`${value} points`, 'Points']}
            labelFormatter={(label) => `${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="points" 
            stroke="#6d28d9" 
            strokeWidth={2} 
            dot={{ stroke: '#6d28d9', strokeWidth: 2, fill: '#ffffff', r: 4 }}
            activeDot={{ stroke: '#6d28d9', strokeWidth: 2, fill: '#6d28d9', r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyPointsChart;
