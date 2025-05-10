
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '@/types';
import { format, subDays, isAfter, isBefore, parseISO } from 'date-fns';

interface TaskCompletionChartProps {
  tasks: Task[];
}

const TaskCompletionChart = ({ tasks }: TaskCompletionChartProps) => {
  const today = new Date();
  
  // Generate data for the last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, i);
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Count tasks for this day
    const taskCount = tasks.filter(task => {
      const taskDate = new Date(task.timestamp);
      return taskDate >= dayStart && taskDate <= dayEnd;
    }).length;
    
    return {
      name: format(date, 'EEE'),
      count: taskCount
    };
  }).reverse();

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          <p>{payload[0].value} actions completed</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={days}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskCompletionChart;
