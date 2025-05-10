
import { User, Task, TaskType, BrowniePoint, TaskStatus, BrowniePointType, TaskRating } from "../types";

// Mock data for development
// Users
export const users: User[] = [
  {
    id: "1",
    name: "Alex",
    email: "alex@example.com",
    partnerId: "2"
  },
  {
    id: "2",
    name: "Sam",
    email: "sam@example.com",
    partnerId: "1"
  }
];

export const mockCurrentUser: User = users[0];

// Tasks
export const tasks: Task[] = [
  {
    id: "t1",
    title: "Take out the trash",
    type: "physical",
    rating: 3,
    userId: "1",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    status: "approved"
  },
  {
    id: "t2",
    title: "Cook dinner",
    type: "physical",
    rating: 5,
    userId: "2",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "approved"
  },
  {
    id: "t3",
    title: "Plan vacation",
    type: "mental",
    rating: 5,
    userId: "1",
    timestamp: new Date(),
    status: "pending"
  },
  {
    id: "t4",
    title: "Pay bills",
    type: "mental",
    rating: 4,
    userId: "2",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "approved"
  },
  {
    id: "t5",
    title: "Clean bathroom",
    type: "physical",
    rating: 6,
    userId: "1", 
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: "approved"
  },
  {
    id: "t6",
    title: "Schedule appointments",
    type: "mental",
    rating: 3,
    userId: "2",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "pending"
  },
  {
    id: "t7",
    title: "Grocery shopping",
    type: "both",
    rating: 5,
    userId: "1",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: "approved"
  }
];

// Brownie Points
export const browniePoints: BrowniePoint[] = [
  {
    id: "bp1",
    fromUserId: "1",
    toUserId: "2",
    type: "effort",
    message: "Thanks for making dinner last night!",
    redeemed: false,
    points: 3,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "bp2",
    fromUserId: "2",
    toUserId: "1",
    type: "time",
    message: "Thanks for cleaning the bathroom, it looks great!",
    redeemed: false,
    points: 2,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    id: "bp3",
    fromUserId: "1",
    toUserId: "2",
    type: "fun",
    message: "Thanks for the surprise movie night!",
    redeemed: true,
    points: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    id: "bp4",
    fromUserId: "2",
    toUserId: "1",
    type: "effort",
    message: "Thanks for doing the grocery shopping!",
    redeemed: false,
    points: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
];
