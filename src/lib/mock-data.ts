
import { User, Task, BrowniePoint, TaskType, TaskLoad, BrowniePointType } from "../types";

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
  const loads: TaskLoad[] = ["light", "medium", "heavy"];
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
      load: loads[Math.floor(Math.random() * loads.length)],
      userId,
      timestamp
    });
  }

  return tasks;
};

export const tasks: Task[] = generateMockTasks();

// Mock Brownie Points Data
const generateMockBrowniePoints = (): BrowniePoint[] => {
  const points: BrowniePoint[] = [];
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

    points.push({
      id: `point${i}`,
      fromUserId,
      toUserId,
      type: types[Math.floor(Math.random() * types.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      redeemed: Math.random() > 0.7,
      createdAt
    });
  }

  return points;
};

export const browniePoints: BrowniePoint[] = generateMockBrowniePoints();

export const mockCurrentUser = users[0];
