# 🚀 MONKey Deployment Guide - Step by Step

This guide will help you deploy MONKey online so all 4 friends can use it together!

## 📋 What You'll Need

1. A computer (Windows/Mac/Linux)
2. Internet connection
3. 30-60 minutes of time

## 🎯 Deployment Options

### **OPTION 1: Quick & Free (Recommended for Beginners)**
Deploy to **Render** (Free tier) - No credit card needed!

### **OPTION 2: Professional**
Deploy to **Railway** or **Heroku** (May require credit card)

---

# 🟢 OPTION 1: Deploy to Render (FREE & EASY)

## Step 1: Install Required Software

### 1.1 Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version (Long Term Support)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 1.2 Install Git
1. Go to https://git-scm.com/downloads
2. Download and install
3. Verify:
   ```bash
   git --version
   ```

## Step 2: Prepare Your Code

### 2.1 Create GitHub Account
1. Go to https://github.com/
2. Sign up for free account
3. Verify your email

### 2.2 Upload Code to GitHub
1. Open terminal/command prompt in your project folder
2. Run these commands ONE BY ONE:

```bash
git init
git add .
git commit -m "Initial commit"
```

3. Create new repository on GitHub:
   - Go to https://github.com/new
   - Name it: `monkey-habit-tracker`
   - Make it Public
   - Click "Create repository"

4. Push your code (replace YOUR_USERNAME):
```bash
git remote add origin https://github.com/YOUR_USERNAME/monkey-habit-tracker.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub (click "Sign up with GitHub")
3. Authorize Render to access your repositories

### 3.2 Create MongoDB Database
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a FREE cluster:
   - Choose AWS
   - Choose closest region to you
   - Click "Create Cluster"
4. Create Database User:
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `monkeyuser`
   - Password: Create a strong password (SAVE THIS!)
   - Click "Add User"
5. Allow Network Access:
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
6. Get Connection String:
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://monkeyuser:<password>@...`)
   - Replace `<password>` with your actual password
   - SAVE THIS STRING!

### 3.3 Deploy Backend on Render
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `monkey-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   - Click "Advanced"
   - Add variable:
     - Key: `MONGODB_URI`
     - Value: (paste your MongoDB connection string)
   - Add variable:
     - Key: `PORT`
     - Value: `3000`
6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (looks like: `https://monkey-backend.onrender.com`)

## Step 4: Deploy Frontend to Render

### 4.1 Update Frontend Code
1. Create file `.env` in project root:
```
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```
Replace `YOUR-BACKEND-URL` with your actual backend URL from Step 3.3

2. Update `package.json` - add this to scripts:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

3. Push changes to GitHub:
```bash
git add .
git commit -m "Add production config"
git push
```

### 4.2 Deploy Frontend on Render
1. Go to https://dashboard.render.com/
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `monkey-frontend`
   - **Root Directory**: (leave empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND-URL.onrender.com`
6. Click "Create Static Site"
7. Wait 5-10 minutes
8. Copy your frontend URL (looks like: `https://monkey-frontend.onrender.com`)

## Step 5: Share with Friends! 🎉

1. Send your friends the frontend URL
2. Each friend creates an account
3. Add each other as friends using usernames
4. Start tracking habits together!

---

# 🔧 Troubleshooting

## Backend won't start
- Check MongoDB connection string is correct
- Make sure you replaced `<password>` with actual password
- Check Render logs for errors

## Frontend can't connect to backend
- Make sure `VITE_API_URL` is set correctly
- Check backend is running (visit backend URL in browser)
- Check browser console for errors (F12)

## "Failed to connect to server"
- Backend might be sleeping (Render free tier sleeps after 15 min)
- Wait 30 seconds and try again
- First request after sleep takes longer

## Can't add friends
- Make sure friend has created an account first
- Usernames are case-sensitive
- Check spelling

---

# 🎮 How to Use MONKey

## For Each Friend:

### 1. Create Account
- Go to the app URL
- Click "Sign Up"
- Choose username and password
- Click "Sign Up"

### 2. Create Tasks
- Click "My Tasks" in navigation
- Click "+ Create Task"
- Enter task name (e.g., "Solve 1 DSA problem")
- Set points (1-100)
- Click "Create Task"

### 3. Add Friends
- Click "Friends" in navigation
- Enter friend's username
- Click "Add Friend"
- Repeat for all friends

### 4. Complete Tasks Daily
- Go to "Dashboard"
- Check off tasks as you complete them
- Watch your points grow!
- See leaderboard update in real-time

### 5. Share Resources
- Click "Resources"
- Click "+ Add Resource"
- Share helpful learning links
- Categorize by topic

### 6. Chat with Friends
- Click "Chatroom"
- Send messages to the group
- Encourage each other!

---

# 📱 Important Notes

## Free Tier Limitations
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- This is normal for free tier!

## Best Practices
- Check in daily to complete tasks
- Add friends on Day 1
- Create tasks before Monday
- Use chatroom to stay motivated

## Weekly Competition
- Week runs Monday 12:00 AM to Sunday 11:59 PM
- Winner gets confetti animation! 🎉
- Points reset every Monday
- All-time stats saved in profiles

---

# 🆘 Need Help?

If something doesn't work:
1. Check this guide again
2. Check Render logs (click on your service → "Logs")
3. Check browser console (F12 → Console tab)
4. Make sure all 4 friends use the SAME app URL

---

# 🎊 You're Done!

Your MONKey app is now live and ready to use! Share the URL with your 3 friends and start building habits together! 🐵

**Your App URLs:**
- Frontend: `https://YOUR-APP.onrender.com`
- Backend: `https://YOUR-BACKEND.onrender.com`

Save these URLs and share with friends!
