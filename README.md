# 🐵 MONKey - Competitive Habit Tracker

A competitive habit tracking web app where you compete with friends weekly to build better habits!

## Features

### Core Functionality
- **User Authentication**: Username/password signup and login with MongoDB
- **Dashboard**: 
  - Weekly leaderboard with all friends ranked by points
  - Today's tasks with checkboxes
  - Friend activity feed
  - Days remaining until weekly winner

### Task Management
- Create recurring daily tasks (e.g., "Solve 1 DSA problem")
- Each task has a name, point value, and daily recurrence
- Mark tasks complete once per day
- View task history and streaks
- Delete tasks

### Social Features
- Add friends by username
- View friends list
- View friend profiles with their tasks and completion streaks

### Resources
- Share learning resources with the community
- Categorize resources (DSA, Web Dev, Mobile, AI/ML, DevOps, Other)
- Add title, URL, description, and category
- Delete your own resources

### Chatroom
- Real-time group chat with all users
- Send and delete your own messages
- Auto-refreshing message feed
- Timestamps on all messages

### Weekly Competition
- Points accumulate Monday-Sunday
- Real-time leaderboard updates
- Winner declared at Sunday 11:59 PM with confetti animation
- Auto-reset Monday 12:00 AM

## Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
cd ..
```

3. **Setup MongoDB:**

Option A - Local MongoDB:
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

Option B - MongoDB Atlas (Cloud):
- Create free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `server/.env` with your connection string

4. **Configure environment:**
- Edit `server/.env` if needed (default uses local MongoDB)

### Running the App

1. **Start the backend server:**
```bash
cd server
npm run dev
```

2. **In a new terminal, start the frontend:**
```bash
npm run dev
```

3. Open your browser to the URL shown (typically http://localhost:5173)

## How to Use

1. **Sign Up**: Create an account with a username and password
2. **Create Tasks**: Go to "My Tasks" and create your daily habits
3. **Complete Tasks**: Check off tasks on the Dashboard as you complete them
4. **Add Friends**: Go to "Friends" and add friends by their username
5. **Compete**: Watch the leaderboard and try to earn the most points each week!

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Real-time**: Polling for chat updates
- **Animations**: Canvas Confetti

## Data Storage

All data is stored in MongoDB:
- **users**: User accounts with authentication
- **tasks**: User tasks with points and recurrence
- **completions**: Task completion records with dates
- **friends**: Friend relationships
- **resources**: Shared learning resources
- **messages**: Chatroom messages

## Weekly Reset

The app automatically:
- Tracks the current week (Monday-Sunday)
- Shows days remaining until week end
- Declares winner at Sunday 11:59 PM
- Resets points Monday 12:00 AM
