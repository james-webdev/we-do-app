# WeDo App

## About

WeDo is a collaborative parenting app designed to help partners track and reward parenting actions. The app allows users to:

- Record parenting actions they've completed
- Send brownie points to their partner as appreciation
- Redeem brownie points for rewards
- Track action history and brownie point statistics
- Create and manage custom rewards

The app features a fun reward redemption system with confetti animations to celebrate achievements..

## Features

- **Action Tracking**: Record parenting actions with details, dates, and ratings
- **Brownie Points**: Send unlimited brownie points to your partner
- **Rewards System**: Create, manage, and redeem rewards using brownie points
- **Dashboard**: View statistics, available points, and recent activity
- **History**: Track all actions and brownie point transactions
- **Partner Connection**: Connect with your partner to share the experience

## Technologies

This project is built with:

- React
- TypeScript
- Vite
- Supabase (for database and authentication)
- shadcn/ui components
- Tailwind CSS
- Canvas Confetti (for reward celebrations)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account (for database)

### Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/wedo-app.git

# Navigate to the project directory
cd wedo-app

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
# Create a .env file with your Supabase credentials
# Example:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm run dev
# or
yarn dev
```

### Running the App

After starting the development server, open your browser and navigate to:

```
http://localhost:5173
```

## Deployment

The app can be deployed to any static hosting service that supports React applications:

1. Build the production version:
   ```sh
   npm run build
   # or
   yarn build
   ```

2. Deploy the contents of the `dist` folder to your hosting provider of choice (Netlify, Vercel, GitHub Pages, etc.)
