
import React from 'react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '@/contexts/AppContext';

interface TaskDistributionChartProps {
  userTaskCount: number;
  partnerTaskCount: number;
  userPoints: number;
  partnerPoints: number;
}

const TaskDistributionChart = ({ 
  userTaskCount, 
  partnerTaskCount,
  userPoints,
  partnerPoints
}: TaskDistributionChartProps) => {
  const { currentUser, partner } = useApp();

  const data = [
    {
      name: currentUser?.name || 'You',
      tasks: userTaskCount,
      points: userPoints,
      color: '#8b5cf6'
    },
    {
      name: partner?.name || 'Partner',
      tasks: partnerTaskCount,
      points: partnerPoints,
      color: '#c4b5fd'
    }
  ];

  const chartConfig = {
    tasks: {
      label: 'Tasks',
      color: '#8b5cf6'
    },
    points: {
      label: 'Points',
      color: '#c4b5fd'
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 15,
            left: 15,
            bottom: 20,
          }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <ChartTooltip>
            <ChartTooltipContent />
          </ChartTooltip>
          <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="points" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TaskDistributionChart;
