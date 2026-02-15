# 🔧 Troubleshooting Guide

## MongoDB Connection Issues

### Issue: "Could not connect to any servers in your MongoDB Atlas cluster"

**What happened**: You're trying to connect to MongoDB Atlas (cloud database) but the connection is failing.

**Solutions**:

#### Option 1: Use Local MongoDB (Recommended for Development)

1. **Install MongoDB locally** (if not already installed):
   - **Windows**: Download from https://www.mongodb.com/try/download/community
   - **Mac**: `brew install mongodb-community`
   - **Linux**: Follow official MongoDB installation guide

2. **Start MongoDB**:
   ```bash
   # Windows (as service)
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Update backend/.env**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/student-feedback-system
   ```

4. **Restart backend server**:
   ```bash
   cd backend
   npm run dev
   ```

#### Option 2: Fix MongoDB Atlas Connection

If you want to use MongoDB Atlas (cloud):

1. **Check your connection string** in backend/.env:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Whitelist your IP address**:
   - Go to MongoDB Atlas dashboard
   - Navigate to Network Access
   - Click "Add IP Address"
   - Add your current IP or use `0.0.0.0/0` (allow all - for development only)

3. **Verify credentials**:
   - Make sure username and password are correct
   - Password should be URL-encoded if it contains special characters

4. **Add database name**:
   Your connection string should include the database name:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/student-feedback-system?retryWrites=true&w=majority
   ```

---

## Mongoose Warnings (FIXED)

### Warning: "Duplicate schema index found"

**Status**: ✅ FIXED

**What was wrong**: The User model had `unique: true` on fields AND `schema.index()` declarations, causing duplicates.

**Fix applied**: Removed `unique: true` from schema fields, keeping only `schema.index()` declarations.

### Warning: "useNewUrlParser is a deprecated option"

**Status**: ✅ FIXED

**What was wrong**: These options are no longer needed in Mongoose 6+.

**Fix applied**: Removed deprecated options from `backend/config/database.js`.

---

## Common Issues

### 1. Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change PORT in backend/.env:
```env
PORT=5001
```

---

### 2. MongoDB Not Running

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:

**Check if MongoDB is running**:
```bash
# Try to connect
mongosh

# If it fails, start MongoDB
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Verify MongoDB is listening**:
```bash
# Windows
netstat -an | findstr :27017

# Mac/Linux
lsof -i :27017
```

---

### 3. CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:

1. Make sure backend is running on port 5000
2. Check FRONTEND_URL in backend/.env:
   ```env
   FRONTEND_URL=http://localhost:3000
   ```
3. Restart backend server

---

### 4. JWT Token Expired

**Error**: `Token expired` or `Unauthorized`

**Solution**:
1. Logout from the application
2. Clear browser localStorage (F12 → Application → Local Storage → Clear)
3. Login again

---

### 5. Admin Account Not Created

**Error**: Can't login with admin credentials

**Solution**:

1. Check backend logs for admin creation message
2. Manually create admin in MongoDB:
   ```bash
   mongosh
   use student-feedback-system
   
   db.users.insertOne({
     email: "admin@college.edu",
     password: "$2a$10$...", // hashed password
     name: "System Administrator",
     role: "admin",
     approvalStatus: "approved",
     oauthProvider: "local",
     isSuspended: false,
     isBanned: false,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

3. Or delete the user and restart backend to recreate:
   ```bash
   mongosh
   use student-feedback-system
   db.users.deleteOne({ email: "admin@college.edu" })
   ```

---

### 6. Frontend Not Loading

**Error**: Blank page or errors in console

**Solution**:

1. Check if backend is running (http://localhost:5000/health)
2. Check browser console for errors (F12)
3. Clear browser cache
4. Delete node_modules and reinstall:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

---

### 7. Database Connection Timeout

**Error**: `MongooseServerSelectionError: connection timed out`

**Solution**:

**For Local MongoDB**:
1. Check if MongoDB is running
2. Check if port 27017 is open
3. Try connecting with MongoDB Compass

**For MongoDB Atlas**:
1. Check internet connection
2. Verify IP whitelist
3. Check if cluster is active (not paused)
4. Try connection string in MongoDB Compass first

---

### 8. Module Not Found Errors

**Error**: `Cannot find module 'express'` or similar

**Solution**:
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Diagnostics

### Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Student Feedback System API is running",
  "timestamp": "2024-..."
}
```

### Check MongoDB Connection
```bash
mongosh
show dbs
use student-feedback-system
show collections
```

### Check Backend Logs
Look for these messages when starting backend:
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected: localhost
```

### Check Frontend Connection
Open browser console (F12) and check for:
- No CORS errors
- API calls to http://localhost:5000
- No 401/403 errors

---

## Environment Setup Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend .env file configured
- [ ] Frontend .env file configured
- [ ] MongoDB connection working
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)

---

## Reset Everything (Nuclear Option)

If nothing works, start fresh:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clear MongoDB database
mongosh
use student-feedback-system
db.dropDatabase()
exit

# 3. Delete node_modules
cd backend
rm -rf node_modules package-lock.json
cd ../frontend
rm -rf node_modules package-lock.json

# 4. Reinstall dependencies
cd ../backend
npm install
cd ../frontend
npm install

# 5. Restart MongoDB
# Windows: net start MongoDB
# Mac: brew services restart mongodb-community

# 6. Start backend
cd backend
npm run dev

# 7. Start frontend (new terminal)
cd frontend
npm start
```

---

## Getting Help

### Check Logs
- Backend logs: Terminal where you ran `npm run dev`
- Frontend logs: Browser console (F12)
- MongoDB logs: Check MongoDB log files

### Verify Versions
```bash
node --version  # Should be v16+
npm --version   # Should be v8+
mongosh --version  # Should be v1.0+
```

### Test API Manually
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.edu","password":"Admin@123"}'
```

---

## Contact & Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/
- Express Documentation: https://expressjs.com/
- React Documentation: https://react.dev/

---

**Most Common Fix**: Use local MongoDB instead of Atlas for development!

Update backend/.env:
```env
MONGODB_URI=mongodb://localhost:27017/student-feedback-system
```

Then restart the backend server. This solves 90% of connection issues! 🎉
