
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '@/contexts/AppContext';

interface ContributionChartProps {
  userTaskCount: number;
  partnerTaskCount: number;
}

const ContributionChart = ({ userTaskCount, partnerTaskCount }: ContributionChartProps) => {
  const { currentUser, partner } = useApp();
  
  const data = [
    {
      name: currentUser?.name || 'You',
      tasks: userTaskCount,
      color: '#9b87f5'
    },
    {
      name: partner?.name || 'Partner',
      tasks: partnerTaskCount,
      color: '#7E69AB'
    }
  ];

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip 
            formatter={(value) => [`${value} tasks`, 'Tasks']} 
          />
          <Bar dataKey="tasks" fill="#9b87f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContributionChart;
