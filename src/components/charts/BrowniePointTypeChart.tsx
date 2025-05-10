
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BrowniePoint } from '@/types';

interface BrowniePointTypeChartProps {
  browniePoints: BrowniePoint[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#14b8a6'];

const BrowniePointTypeChart = ({ browniePoints }: BrowniePointTypeChartProps) => {
  const data = useMemo(() => {
    const typeCounts: Record<string, number> = {
      time: 0,
      effort: 0,
      fun: 0
    };

    browniePoints.forEach(point => {
      if (typeCounts[point.type] !== undefined) {
        typeCounts[point.type] += 1;
      }
    });

    return [
      { name: 'Time', value: typeCounts.time, color: COLORS[0] },
      { name: 'Effort', value: typeCounts.effort, color: COLORS[1] },
      { name: 'Fun', value: typeCounts.fun, color: COLORS[2] }
    ].filter(item => item.value > 0);
  }, [browniePoints]);

  // If no data, show a placeholder
  if (data.length === 0) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center text-gray-400">
        No brownie points data available
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} points`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BrowniePointTypeChart;
