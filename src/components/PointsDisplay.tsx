
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import AvailablePointsChart from './charts/AvailablePointsChart';

const PointsDisplay = () => {
  const { availablePoints } = useApp();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            Available Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center mb-4">
            {availablePoints}
          </div>
         {/* <AvailablePointsChart /> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsDisplay;
