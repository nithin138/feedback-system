# 🚀 Quick Start Guide - Student Feedback System

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

---

## 1. Clone and Setup

```bash
# Clone the repository (if applicable)
cd student-feedback-system
```

---

## 2. Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Configure Environment
The `.env` file should already exist with these settings:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-feedback-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Admin@123
NODE_ENV=development
```

### Start MongoDB
**Windows:**
```bash
# If MongoDB is installed as a service
net start MongoDB

# Or use MongoDB Compass to start local instance
```

**Mac/Linux:**
```bash
# Using Homebrew
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

### Run Backend Server
```bash
npm run dev
```

✅ Backend should be running on: **http://localhost:5000**

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected
```

---

## 3. Frontend Setup

### Open New Terminal
```bash
cd frontend
npm install
```

### Configure Environment
The `.env` file should exist with:
```env
REACT_APP_API_URL=http://localhost:5000
```

### Run Frontend App
```bash
npm start
```

✅ Frontend should open automatically at: **http://localhost:3000**

---

## 4. First Time Setup

### Default Admin Account
On first run, the system automatically creates an admin account:
- **Email**: admin@college.edu
- **Password**: Admin@123

⚠️ **Important**: Change this password after first login!

---

## 5. Quick Test

### Test 1: Admin Login
1. Go to http://localhost:3000/login
2. Login with admin credentials
3. You should see the admin dashboard

### Test 2: Register Student
1. Click "Register" or go to /register
2. Fill in:
   - Name: Test Student
   - Email: student@test.com
   - Password: Student@123
   - Role: Student
3. Click "Register"
4. Login with student credentials
5. Create a test post

### Test 3: Like and Comment
1. View the feed
2. Click the heart icon to like a post
3. Click the comment icon
4. Add a comment
5. Refresh the page - your like and comment should persist

### Test 4: Faculty Approval
1. Register as Faculty (faculty@test.com)
2. You'll be redirected to "Pending Approval" page
3. Logout
4. Login as Admin
5. Go to "Faculty Approvals"
6. Approve the faculty member
7. Logout and login as faculty - you can now access the system

---

## 6. Troubleshooting

### MongoDB Connection Error
**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Make sure MongoDB is running
2. Check if MongoDB is on port 27017
3. Try: `mongosh` to test connection

### Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
1. Kill the process using port 5000
2. Or change PORT in backend/.env

### CORS Error
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Make sure backend is running
2. Check FRONTEND_URL in backend/.env matches frontend URL
3. Restart backend server

### JWT Token Expired
**Error**: `Token expired` or `Unauthorized`

**Solution**:
1. Logout and login again
2. Clear browser localStorage
3. Check JWT_SECRET is set in backend/.env

---

## 7. Testing All Features

### Student Features
- ✅ Register and login
- ✅ Create feedback posts
- ✅ Rate with 1-5 stars
- ✅ Like/unlike posts
- ✅ Add comments
- ✅ View feed with filters
- ✅ Anonymous posting

### Faculty Features
- ✅ All student features
- ✅ Flag inappropriate posts
- ✅ Wait for admin approval

### Admin Features
- ✅ All faculty features
- ✅ Approve/reject faculty
- ✅ View moderation queue
- ✅ Dismiss flags
- ✅ Suspend students
- ✅ Ban students
- ✅ View real student identities (in moderation only)

---

## 8. Sample Test Data

### Create Test Users

**Student 1**:
- Email: student1@test.com
- Password: Student@123
- Role: Student

**Student 2**:
- Email: student2@test.com
- Password: Student@123
- Role: Student

**Faculty 1**:
- Email: faculty1@test.com
- Password: Faculty@123
- Role: Faculty

**Admin** (already created):
- Email: admin@college.edu
- Password: Admin@123

### Create Test Posts
1. Login as Student 1
2. Create 3-4 posts with different categories
3. Add ratings to each post
4. Logout

5. Login as Student 2
6. Like some posts
7. Comment on some posts
8. Create 2-3 more posts

### Test Moderation
1. Login as Faculty (after approval)
2. Flag a post with reason
3. Logout

4. Login as Admin
5. Go to Moderation Queue
6. Test dismiss/suspend/ban actions

---

## 9. Development Tips

### Hot Reload
- Backend: Uses nodemon, auto-restarts on file changes
- Frontend: React hot reload, auto-refreshes on save

### View Database
Use MongoDB Compass:
1. Connect to: `mongodb://localhost:27017`
2. Database: `student-feedback-system`
3. Collections: users, feedbacks, likes, comments, flags

### API Testing
Use Postman or curl:
```bash
# Health check
curl http://localhost:5000/health

# Get feed (no auth required)
curl http://localhost:5000/api/feedback

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.edu","password":"Admin@123"}'
```

### Check Logs
- Backend logs appear in terminal where you ran `npm run dev`
- Frontend logs appear in browser console (F12)

---

## 10. Common Commands

### Backend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start

# Run tests (if configured)
npm test
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use database
use student-feedback-system

# Show collections
show collections

# Find all users
db.users.find()

# Find all feedbacks
db.feedbacks.find()

# Clear all data (careful!)
db.dropDatabase()
```

---

## 11. Project URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **MongoDB**: mongodb://localhost:27017

---

## 12. Next Steps

1. ✅ Test all features
2. ✅ Create sample data
3. ✅ Test moderation workflow
4. ✅ Test anonymity protection
5. ✅ Test like/comment functionality
6. ✅ Prepare demo presentation
7. ⏳ Deploy to production (Phase 2)

---

## 🎉 You're All Set!

Your Student Feedback System is now running and ready to use!

**Need Help?**
- Check PHASE1_COMPLETE.md for detailed testing scenarios
- Check PHASE_FEATURES.md for complete feature list
- Check backend/README.md for API documentation
- Check frontend/README.md for frontend details

**Happy Testing!** 🚀
