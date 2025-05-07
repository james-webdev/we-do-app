
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskCard from '@/components/TaskCard';
import BrowniePointCard from '@/components/BrowniePointCard';
import { format } from 'date-fns';

const History = () => {
  const { currentUser, partner, tasks, browniePoints } = useApp();
  const [mainTab, setMainTab] = useState<string>("tasks");
  const [taskFilterTab, setTaskFilterTab] = useState<string>("all");
  const [pointFilterTab, setPointFilterTab] = useState<string>("all");
  
  // Group items by date for displaying in sections
  const groupByDate = (items: { timestamp?: Date, createdAt?: Date }[]) => {
    const groups: Record<string, typeof items> = {};
    
    items.forEach(item => {
      const date = item.timestamp || item.createdAt;
      if (date) {
        const dateStr = format(new Date(date), 'yyyy-MM-dd');
        if (!groups[dateStr]) {
          groups[dateStr] = [];
        }
        groups[dateStr].push(item);
      }
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, items]) => ({
        date,
        items,
      }));
  };

  console.log("Current tasks in History:", tasks);
  console.log("Current user:", currentUser);
  console.log("Partner:", partner);

  // Filter and sort tasks
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Fix task filtering logic with the dedicated taskFilterTab
  const filteredTasks = sortedTasks.filter(task => {
    if (taskFilterTab === "all") return true;
    if (taskFilterTab === "my-tasks" && currentUser) return task.userId === currentUser.id;
    if (taskFilterTab === "partner-tasks" && partner) return task.userId === partner.id;
    return false; // Default to not showing if criteria not met
  });
  
  console.log("Filtered tasks:", filteredTasks);
  console.log("Current task filter tab:", taskFilterTab);
  
  const groupedTasks = groupByDate(filteredTasks);
  
  // Filter and sort brownie points
  const sortedBrowniePoints = [...browniePoints].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const filteredBrowniePoints = sortedBrowniePoints.filter(point => {
    if (pointFilterTab === "all") return true;
    if (pointFilterTab === "sent" && currentUser) return point.fromUserId === currentUser.id;
    if (pointFilterTab === "received" && currentUser) return point.toUserId === currentUser.id;
    return false; // Default to not showing if criteria not met
  });
  
  const groupedBrowniePoints = groupByDate(filteredBrowniePoints);
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">History</h1>
        <p className="text-gray-500">View your activity history and contributions</p>
      </div>
      
      <Tabs defaultValue="tasks" className="w-full" value={mainTab} onValueChange={setMainTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="browniePoints">Brownie Points</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex overflow-x-auto pb-2">
            <TabsList className="justify-start">
              <TabsTrigger 
                value="all" 
                onClick={() => setTaskFilterTab("all")}
                className={taskFilterTab === "all" ? "bg-primary text-white" : ""}
              >
                All Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="my-tasks" 
                onClick={() => setTaskFilterTab("my-tasks")}
                className={taskFilterTab === "my-tasks" ? "bg-primary text-white" : ""}
              >
                My Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="partner-tasks" 
                onClick={() => setTaskFilterTab("partner-tasks")}
                className={taskFilterTab === "partner-tasks" ? "bg-primary text-white" : ""}
              >
                Partner's Tasks
              </TabsTrigger>
            </TabsList>
          </div>
          
          {groupedTasks.length > 0 ? (
            groupedTasks.map(({ date, items }) => (
              <div key={date} className="space-y-4">
                <h2 className="text-xl font-semibold sticky top-0 bg-white py-2 border-b">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((task: any) => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      userName={task.userId === currentUser?.id ? currentUser?.name : partner?.name}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks found for the selected filter</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="browniePoints" className="space-y-6">
          <div className="flex overflow-x-auto pb-2">
            <TabsList className="justify-start">
              <TabsTrigger 
                value="all" 
                onClick={() => setPointFilterTab("all")}
                className={pointFilterTab === "all" ? "bg-primary text-white" : ""}
              >
                All Points
              </TabsTrigger>
              <TabsTrigger 
                value="sent" 
                onClick={() => setPointFilterTab("sent")}
                className={pointFilterTab === "sent" ? "bg-primary text-white" : ""}
              >
                Points Sent
              </TabsTrigger>
              <TabsTrigger 
                value="received" 
                onClick={() => setPointFilterTab("received")}
                className={pointFilterTab === "received" ? "bg-primary text-white" : ""}
              >
                Points Received
              </TabsTrigger>
            </TabsList>
          </div>
          
          {groupedBrowniePoints.length > 0 ? (
            groupedBrowniePoints.map(({ date, items }) => (
              <div key={date} className="space-y-4">
                <h2 className="text-xl font-semibold sticky top-0 bg-white py-2 border-b">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((point: any) => (
                    <BrowniePointCard key={point.id} browniePoint={point} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No brownie points found for the selected filter</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
