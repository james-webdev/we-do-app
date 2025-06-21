import React from 'react';
import PointsDisplay from '@/components/PointsDisplay';
import DashboardCharts from '@/components/DashboardCharts';
import BackToMainMenu from '@/components/BackToMainMenu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Stats = () => {
  return (
    <div className="container py-8">
      <div className="mb-4">
        <BackToMainMenu />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stats</h1>
      </div>
      
      {/* Points Display centered at the top */}
      <div className="mb-8 max-w-md mx-auto">
        <PointsDisplay />
      </div>
      
      {/* Stats Card */}
      <Card className="border-indigo-100 bg-indigo-50/20 mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Your Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCharts />
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
