
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

type TimeFrame = 'week' | 'month' | 'year';

const PointsTimeComparisonChart = () => {
  const { currentUser, partner, totalPointsEarned } = useApp();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  const [userPointsByTimeFrame, setUserPointsByTimeFrame] = useState({ week: 0, month: 0, year: 0 });
  const [partnerPointsByTimeFrame, setPartnerPointsByTimeFrame] = useState({ week: 0, month: 0, year: 0 });
  
  // Calculate the date cutoffs for different timeframes
  const getDateCutoff = useCallback(() => {
    const now = new Date();
    
    if (timeFrame === 'week') {
      // Get the start of the current week (Monday)
      const startOfWeek = new Date(now);
      const day = startOfWeek.getDay(); // 0 is Sunday, 1 is Monday, etc.
      // If today is not Monday, go back to the previous Monday
      // For Monday, day = 1, so we don't need to adjust
      // For other days, we calculate how many days to go back to reach Monday
      // Sunday (0) needs to go back 6 days to reach previous Monday
      const daysToSubtract = day === 0 ? 6 : day - 1;
      startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
      startOfWeek.setHours(0, 0, 0, 0); // Set to midnight
      return startOfWeek;
    } else if (timeFrame === 'month') {
      // Get the start of the current month (1st day)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0); // Set to midnight
      return startOfMonth;
    } else {
      // Get the start of the current year (January 1st)
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      startOfYear.setHours(0, 0, 0, 0); // Set to midnight
      return startOfYear;
    }
  }, [timeFrame]);
  
  // We're using the getDateCutoff function defined above
  
  // Fetch points history data from the database
  useEffect(() => {
    const fetchPointsHistory = async () => {
      if (!currentUser?.id) return;
      
      try {
        // Fetch all points history for the user
        const { data: userPointsHistory, error: userError } = await supabase
          .from('points_history')
          .select('points, created_at')
          .eq('user_id', currentUser.id);
        
        if (userError) {
          console.error('Error fetching user points history:', userError);
          return;
        }
        
        // Fetch all points history for the partner if exists
        let partnerPointsHistory = [];
        if (partner?.id) {
          const { data: partnerData, error: partnerError } = await supabase
            .from('points_history')
            .select('points, created_at')
            .eq('user_id', partner.id);
            
          if (!partnerError && partnerData) {
            partnerPointsHistory = partnerData;
          }
        }
        
        // Get date cutoffs for filtering
        const dateCutoff = getDateCutoff();
        
        // Filter and calculate totals
        const userTotal = userPointsHistory
          ? userPointsHistory
              .filter(record => new Date(record.created_at) >= dateCutoff)
              .reduce((sum, record) => sum + record.points, 0)
          : 0;
          
        const partnerTotal = partnerPointsHistory.length > 0
          ? partnerPointsHistory
              .filter(record => new Date(record.created_at) >= dateCutoff)
              .reduce((sum, record) => sum + record.points, 0)
          : 0;
        
        // Update state with the filtered totals
        setUserPointsByTimeFrame(prev => ({
          ...prev,
          [timeFrame]: userTotal
        }));
        
        setPartnerPointsByTimeFrame(prev => ({
          ...prev,
          [timeFrame]: partnerTotal
        }));
        
      } catch (error) {
        console.error('Error processing points history:', error);
      }
    };
    
    fetchPointsHistory();
  }, [currentUser?.id, partner?.id, timeFrame, getDateCutoff]);
  
  // Get points data based on selected time frame
  const getPointsForTimeFrame = () => {
    return {
      userPoints: userPointsByTimeFrame[timeFrame],
      partnerPoints: partnerPointsByTimeFrame[timeFrame]
    };
  };
  
  const pointsData = getPointsForTimeFrame();
  
  const data = [
    {
      name: currentUser?.name || 'You',
      value: pointsData.userPoints,
      color: '#78c2fa' // lighter purple (violet-300)
    },
    {
      name: partner?.name || 'Partner',
      value: pointsData.partnerPoints,
      color: '#7659ff' // even lighter purple (violet-200)
    }
  ];
  
  // Custom tooltip formatter
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        name: string;
        value: number;
      };
    }>;
  }
  
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
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
        return 'Current Week';
      case 'month':
        return 'Current Month';
      case 'year':
        return 'Current Year';
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
