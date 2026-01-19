# ✅ MONKey Deployment Checklist

Use this checklist to track your progress!

## 📦 Pre-Deployment Setup

### Software Installation
- [ ] Node.js installed (verify with `node --version`)
- [ ] npm installed (verify with `npm --version`)
- [ ] Git installed (verify with `git --version`)

### Account Creation
- [ ] GitHub account created
- [ ] GitHub email verified
- [ ] Render account created (sign up with GitHub)
- [ ] MongoDB Atlas account created

---

## 🧪 Local Testing (Optional)

- [ ] MongoDB installed locally
- [ ] MongoDB service running
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend starts successfully (`cd server && npm run dev`)
- [ ] Frontend starts successfully (`npm run dev`)
- [ ] Can create account
- [ ] Can create task
- [ ] Can mark task complete
- [ ] Can add friend (create 2nd account to test)
- [ ] Chatroom works
- [ ] Resources page works

---

## 🗄️ Database Setup

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Username saved: ________________
- [ ] Password saved: ________________
- [ ] Network access set to "Allow from Anywhere"
- [ ] Connection string copied
- [ ] Connection string password replaced
- [ ] Connection string saved securely

---

## 📤 GitHub Upload

- [ ] Git initialized in project (`git init`)
- [ ] Files added (`git add .`)
- [ ] First commit made (`git commit -m "Initial commit"`)
- [ ] GitHub repository created
- [ ] Repository name: ________________
- [ ] Repository is Public
- [ ] Remote added (`git remote add origin ...`)
- [ ] Code pushed to GitHub (`git push -u origin main`)
- [ ] Code visible on GitHub website

---

## 🚀 Backend Deployment (Render)

- [ ] New Web Service created on Render
- [ ] GitHub repository connected
- [ ] Root Directory set to: `server`
- [ ] Environment set to: `Node`
- [ ] Build Command set to: `npm install`
- [ ] Start Command set to: `npm start`
- [ ] Plan set to: `Free`
- [ ] Environment variable `MONGODB_URI` added
- [ ] Environment variable `PORT` added (value: 3000)
- [ ] Service created
- [ ] Deployment successful (check logs)
- [ ] Backend URL copied: ________________
- [ ] Backend URL works (visit in browser, should see JSON or message)

---

## 🌐 Frontend Deployment (Render)

- [ ] `.env` file created in project root
- [ ] `VITE_API_URL` set to backend URL
- [ ] Changes committed and pushed to GitHub
- [ ] New Static Site created on Render
- [ ] GitHub repository connected
- [ ] Root Directory left empty
- [ ] Build Command set to: `npm install && npm run build`
- [ ] Publish Directory set to: `dist`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Site created
- [ ] Deployment successful (check logs)
- [ ] Frontend URL copied: ________________
- [ ] Frontend URL works (visit in browser, should see login page)

---

## 🧪 Production Testing

- [ ] Can access frontend URL
- [ ] Login page loads
- [ ] Can create account
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can create task
- [ ] Can mark task complete
- [ ] Can go to Friends page
- [ ] Can go to Resources page
- [ ] Can go to Chatroom
- [ ] Can send chat message
- [ ] Can add resource

---

## 👥 Friend Setup

### Friend 1
- [ ] Shared URL with Friend 1
- [ ] Friend 1 created account
- [ ] Friend 1 username: ________________
- [ ] Added Friend 1 as friend
- [ ] Friend 1 added you back

### Friend 2
- [ ] Shared URL with Friend 2
- [ ] Friend 2 created account
- [ ] Friend 2 username: ________________
- [ ] Added Friend 2 as friend
- [ ] Friend 2 added you back

### Friend 3
- [ ] Shared URL with Friend 3
- [ ] Friend 3 created account
- [ ] Friend 3 username: ________________
- [ ] Added Friend 3 as friend
- [ ] Friend 3 added you back

---

## 🎮 Final Setup

- [ ] All 4 friends have accounts
- [ ] All 4 friends added each other
- [ ] Everyone created at least 1 task
- [ ] Leaderboard shows all 4 friends
- [ ] Tested chatroom with all friends
- [ ] Shared at least 1 resource

---

## 📝 Important URLs to Save

```
Frontend URL: ________________________________
Backend URL:  ________________________________
GitHub Repo:  ________________________________
MongoDB URI:  ________________________________
```

---

## 🎊 Success Criteria

You're done when:
- ✅ All 4 friends can access the app from their phones/computers
- ✅ Everyone can create and complete tasks
- ✅ Leaderboard updates when tasks are completed
- ✅ Chatroom works for all friends
- ✅ Resources can be shared
- ✅ Friend profiles are visible

---

## 🆘 If Something Fails

### Backend Deployment Failed
- [ ] Check Render logs
- [ ] Verify MongoDB connection string
- [ ] Verify environment variables are set
- [ ] Check `server/package.json` exists
- [ ] Try redeploying

### Frontend Deployment Failed
- [ ] Check Render logs
- [ ] Verify build command is correct
- [ ] Verify `dist` folder is created during build
- [ ] Check `VITE_API_URL` is set
- [ ] Try redeploying

### Can't Connect Frontend to Backend
- [ ] Verify backend is running (visit backend URL)
- [ ] Verify `VITE_API_URL` matches backend URL exactly
- [ ] Check browser console for errors (F12)
- [ ] Verify backend URL has no trailing slash
- [ ] Redeploy frontend after fixing

### Friends Can't Access
- [ ] Verify URL is correct
- [ ] Check if backend is sleeping (wait 30 seconds)
- [ ] Try accessing from incognito/private window
- [ ] Check if Render services are running

---

## 🎯 Next Steps After Deployment

1. **Week 1**: Get everyone comfortable with the app
2. **Set Goals**: Decide on tasks to track
3. **Daily Check-ins**: Make it a habit to check the app daily
4. **Use Chatroom**: Encourage each other
5. **Share Resources**: Help each other learn
6. **Compete**: Try to win the weekly competition!

---

## 💡 Pro Tips

- **Bookmark the URL** on your phone home screen
- **Set daily reminders** to check tasks
- **Use chatroom** to stay accountable
- **Share progress** in the group
- **Celebrate wins** together
- **Don't give up** if you miss a day!

---

# 🎉 CONGRATULATIONS!

If you checked all the boxes, your MONKey app is live and ready! 

Time to build some habits! 🐵💪
