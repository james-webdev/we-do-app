import React from 'react';
import { useApp } from '@/contexts/AppContext';
import ConnectPartner from '@/components/ConnectPartner';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Gift, 
  History as HistoryIcon, 
  Award,
  CheckCircle,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { hasPartner } = useApp();
  const navigate = useNavigate();
  
  // Function to determine text color based on background color
  const getTextColor = (bgColor: string) => {
    switch(bgColor) {
      case "#e9d5ff": // Purple-200
        return "text-purple-950";
      case "#d8b4fe": // Purple-300
        return "text-purple-900";
      case "#c084fc": // Purple-400 (Brownie Point)
        return "text-white";
      case "#a855f7": // Purple-500
        return "text-purple-100";
      case "#9333ea": // Purple-600
        return "text-white";
      default:
        return "text-white";
    }
  };
  
  // Function to determine icon color based on background color
  const getIconColor = (bgColor: string) => {
    switch(bgColor) {
      case "#e9d5ff": // Purple-200
        return "#4c1d95"; // Purple-950
      case "#d8b4fe": // Purple-300
        return "#581c87"; // Purple-900
      case "#c084fc": // Purple-400
        return "#6b21a8"; // Purple-800
      case "#a855f7": // Purple-500
        return "#f5f3ff"; // Purple-100
      case "#9333ea": // Purple-600
        return "#ffffff"; // White
      default:
        return "#ffffff"; // White
    }
  };
  
  // If user doesn't have a partner, show the connect partner flow
  if (!hasPartner) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Welcome to We-Do</h1>
        
        <div className="mb-8">
          <ConnectPartner />
        </div>
        
        <div className="text-center text-gray-600 mt-12">
          <p className="mb-4">To start using We-Do, connect with your partner first.</p>
          <p>Don't have a partner on We-Do yet? Ask them to sign up and then connect using their email address.</p>
        </div>
      </div>
    );
  }

  // Navigation buttons configuration
  const navigationButtons = [
    {
      title: "Activity",
      icon: <LayoutDashboard size={64} color={getIconColor("#e9d5ff")} />,
      color: "#e9d5ff", // Purple-200
      path: "/dashboard-details"
    },
    {
      title: "Add Action",
      icon: <img 
              src="/action-icon.png" 
              alt="Action Icon" 
              width={64} 
              height={64} 
              className="object-contain" 
            />,
      color: "#d8b4fe", // Purple-300
      path: "/add-task"
    },
    {
      title: "Add Brownie Point",
      icon: <img 
              src="/brownie-icon.png" 
              alt="Brownie Icon" 
              width={64} 
              height={64} 
              className="object-contain" 
            />,
      color: "#c084fc", // Purple-400
      path: "/give-brownie-point"
    },
    {
      title: "Rewards",
      icon: <img 
              src="/cool.png" 
              alt="Reward Icon" 
              width={80} 
              height={80} 
              className="object-contain" 
            />,
      color: "#a855f7", // Purple-500
      path: "/rewards"
    },
    {
      title: "History",
      icon: <HistoryIcon size={64} color={getIconColor("#9333ea")} />,
      color: "#9333ea", // Purple-600
      path: "/history"
    }
  ];

  // If user has a partner, show the grid of buttons
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full p-4 bg-gray-50">
      <div className="grid gap-4 md:gap-6 w-full max-w-[1000px] p-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gridAutoRows: 'minmax(150px, auto)' }}>
        {navigationButtons.map((button, index) => (
          <div
            key={index}
            onClick={() => navigate(button.path)}
            className="flex flex-col items-center justify-center rounded-lg p-4 md:p-8 cursor-pointer text-purple-900 h-[150px] md:h-[200px] transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md"
            style={{ backgroundColor: button.color }}
          >
            <div className="mb-1">
              {button.icon}
            </div>
            <h2 className={`text-lg md:text-xl lg:text-2xl font-bold text-center break-words ${getTextColor(button.color)}`}>
              {button.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
