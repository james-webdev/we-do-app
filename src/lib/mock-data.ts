
import { User, Task, BrowniePoint, TaskType, TaskLoad, BrowniePointType, Reward, TaskStatus, TaskRating } from "../types";

// Mock User Data
export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    email: "alex@example.com",
    partnerId: "user2"
  },
  {
    id: "user2",
    name: "Sam Taylor",
    email: "sam@example.com",
    partnerId: "user1"
  }
];

// Mock Task Data
const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];
  const types: TaskType[] = ["mental", "physical", "both"];
  const statuses: TaskStatus[] = ["approved", "approved", "approved", "pending"]; // Most tasks approved, some pending
  const ratings: TaskRating[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const taskNames = [
    "School pickup", "Doctor appointment", "Grocery shopping", 
    "Meal planning", "Bath time", "Bedtime routine",
    "Homework help", "Making dinner", "Cleaning toys",
    "Washing clothes", "Paying bills", "Scheduling playdates"
  ];

  // Generate tasks for the past week
  for (let i = 0; i < 20; i++) {
    const userId = i % 2 === 0 ? "user1" : "user2";
    const daysAgo = Math.floor(Math.random() * 7);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    tasks.push({
      id: `task${i}`,
      title: taskNames[Math.floor(Math.random() * taskNames.length)],
      type: types[Math.floor(Math.random() * types.length)],
      rating: ratings[Math.floor(Math.random() * ratings.length)], // Using rating instead of level
      userId,
      timestamp,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  return tasks;
};

export const tasks: Task[] = generateMockTasks();

// Mock Brownie Points Data
const generateMockBrowniePoints = (): BrowniePoint[] => {
  const browniePoints: BrowniePoint[] = []; // Renamed from 'points' to 'browniePoints'
  const types: BrowniePointType[] = ["time", "effort", "fun"];
  const messages = [
    "Thanks for taking care of the kids yesterday!",
    "I appreciate you handling the doctor's appointment.",
    "Thanks for the night off!",
    "You're amazing for dealing with that tantrum.",
    "Thank you for picking up my slack this week."
  ];
  
  // Generate brownie points for the past week
  for (let i = 0; i < 5; i++) {
    const fromUserId = i % 2 === 0 ? "user1" : "user2";
    const toUserId = fromUserId === "user1" ? "user2" : "user1";
    const daysAgo = Math.floor(Math.random() * 7);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Determine points based on type
    let pointsValue = 1;
    if (type === 'time') pointsValue = 2;
    if (type === 'effort') pointsValue = 3;

    browniePoints.push({
      id: `point${i}`,
      fromUserId,
      toUserId,
      type,
      message: messages[Math.floor(Math.random() * messages.length)],
      redeemed: Math.random() > 0.7,
      createdAt,
      points: pointsValue
    });
  }

  return browniePoints;
};

export const browniePoints: BrowniePoint[] = generateMockBrowniePoints();

// Mock Rewards
export const mockRewards: Reward[] = [
  {
    id: "reward1",
    title: "Back Rub",
    description: "Enjoy a relaxing 15-minute back massage",
    pointsCost: 3,
    imageIcon: "gift"
  },
  {
    id: "reward2",
    title: "Nighttime Routine",
    description: "Partner handles the entire bedtime routine tonight",
    pointsCost: 4,
    imageIcon: "star"
  },
  {
    id: "reward3",
    title: "Weekend Time Off",
    description: "Get 2 hours to yourself on the weekend",
    pointsCost: 5,
    imageIcon: "circle-dollar-sign"
  },
  {
    id: "reward4",
    title: "Breakfast in Bed",
    description: "Enjoy a peaceful morning with breakfast served in bed",
    pointsCost: 2,
    imageIcon: "award"
  }
];

export const mockCurrentUser = users[0];
