
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';

const WeeklyPointsBarChart = () => {
  const { browniePoints, currentUser } = useApp();
  
  // Create daily data for the past week
  const today = new Date();
  const data = Array(7).fill(0).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i)); // Start from 6 days ago
    
    // Filter points received on this date
    const dayPoints = browniePoints.filter(point => {
      const pointDate = new Date(point.createdAt);
      return pointDate.getDate() === date.getDate() && 
             pointDate.getMonth() === date.getMonth() && 
             pointDate.getFullYear() === date.getFullYear() &&
             point.toUserId === currentUser?.id;
    });
    
    // Sum points for this day
    const totalPoints = dayPoints.reduce((sum, point) => sum + point.points, 0);
    
    return {
      name: format(date, 'EEE'),
      points: totalPoints
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} points`, 'Points']}
          labelFormatter={(label) => `${label}`}
        />
        <Bar 
          dataKey="points" 
          fill="#7c3aed" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyPointsBarChart;
