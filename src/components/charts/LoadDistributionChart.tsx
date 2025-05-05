
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface LoadDistributionChartProps {
  mentalTasks: number;
  physicalTasks: number;
}

const LoadDistributionChart = ({ mentalTasks, physicalTasks }: LoadDistributionChartProps) => {
  const data = [
    { name: 'Mental', value: mentalTasks, color: '#0EA5E9' },
    { name: 'Physical', value: physicalTasks, color: '#F97316' },
  ];

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadDistributionChart;
