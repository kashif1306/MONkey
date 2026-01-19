# ⚡ Quick Start - Run Locally First

Before deploying online, test the app locally to make sure everything works!

## 1. Install Dependencies

### Frontend:
```bash
npm install
```

### Backend:
```bash
cd server
npm install
cd ..
```

## 2. Install MongoDB Locally

### Windows:
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. Choose "Complete" installation
4. Install as Windows Service
5. MongoDB will start automatically

### Mac (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 3. Start the App

### Terminal 1 - Start Backend:
```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### Terminal 2 - Start Frontend:
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

## 4. Test the App

1. Open browser to `http://localhost:5173`
2. Create an account
3. Create a task
4. Mark it complete
5. Try the chatroom
6. Add a resource

## 5. Test with Friends Locally (Optional)

If you're all on the same WiFi:

1. Find your local IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `ip addr`

2. Friends visit: `http://YOUR-IP:5173`
   - Example: `http://192.168.1.100:5173`

3. Make sure Windows Firewall allows the connection

## ✅ Everything Working?

Great! Now follow `DEPLOYMENT_GUIDE.md` to deploy online!

## ❌ Not Working?

### MongoDB Connection Error
- Make sure MongoDB is running
- Windows: Check Services (mongodb should be running)
- Mac/Linux: `brew services list` or `systemctl status mongodb`

### Port Already in Use
- Close other apps using port 3000 or 5173
- Or change port in `server/.env` and `vite.config.js`

### Module Not Found
- Delete `node_modules` folders
- Delete `package-lock.json`
- Run `npm install` again

### Can't Create Account
- Check backend terminal for errors
- Make sure MongoDB is connected
- Check `server/.env` has correct MongoDB URI
