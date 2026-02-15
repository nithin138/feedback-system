# 🎉 Backend Complete!

The entire backend API for the Student Feedback System is now ready!

## ✅ What's Built

### 🔐 Authentication & Authorization
- **Email/Password Registration & Login**
- **Google OAuth** (optional - needs credentials)
- **JWT Token Management**
- **Role-Based Access Control** (Student, Faculty, Admin)
- **Faculty Approval Workflow**
- **Suspended/Banned Account Handling**

### 📝 Feedback System
- **Create Feedback Posts** with ratings
- **Get Feed** with filtering (category) and sorting (recent, most liked, highest rated)
- **Update/Delete Posts** (author or admin only)
- **Anonymous Student Identity** protection

### 💬 Social Features
- **Like/Unlike Posts**
- **Add Comments** (chronological order)
- **Get Comments** for any post
- **Duplicate Like Prevention**

### 🚩 Moderation System
- **Flag Posts** (faculty only)
- **Immediate Post Hiding** when flagged
- **Admin Review Queue**
- **Dismiss Flags** (restore posts)
- **Suspend Students** (temporary)
- **Ban Students** (permanent)
- **Notifications** to faculty and admin

### 👨‍💼 Admin Features
- **Faculty Approval Queue**
- **Approve/Reject Faculty**
- **View Flagged Posts** with student identity revealed
- **Moderation Actions** with audit trail
- **Notifications** on all actions

## 📡 API Endpoints

### Authentication (`/api/auth`)
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login with email/password
GET    /api/auth/google            - Initiate Google OAuth (if configured)
GET    /api/auth/google/callback   - OAuth callback
GET    /api/auth/me                - Get current user
POST   /api/auth/logout            - Logout
```

### Feedback (`/api/feedback`)
```
GET    /api/feedback               - Get feed (filters: category, sort, limit, skip)
POST   /api/feedback               - Create feedback post
GET    /api/feedback/:id           - Get specific post
PUT    /api/feedback/:id           - Update post (author/admin only)
DELETE /api/feedback/:id           - Delete post (author/admin only)

POST   /api/feedback/:id/like      - Like a post
DELETE /api/feedback/:id/like      - Unlike a post
POST   /api/feedback/:id/comment   - Add comment
GET    /api/feedback/:id/comments  - Get comments

POST   /api/feedback/:id/flag      - Flag post (faculty/admin only)
```

### Admin (`/api/admin`)
```
GET    /api/admin/faculty/pending  - Get pending faculty approvals
PUT    /api/admin/faculty/:id/approve - Approve faculty
PUT    /api/admin/faculty/:id/reject  - Reject faculty

GET    /api/admin/flags            - Get flagged posts
PUT    /api/admin/flags/:id/dismiss   - Dismiss flag
PUT    /api/admin/flags/:id/suspend   - Suspend student
PUT    /api/admin/flags/:id/ban       - Ban student
```

## 🚀 How to Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running locally:
```bash
# Windows (if installed as service)
net start MongoDB

# Or use MongoDB Compass to start local instance
```

### 3. Configure Environment
The `.env` file is already created with defaults:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-feedback-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Admin@123
```

### 4. Start Server
```bash
npm run dev
```

Server will run on: **http://localhost:5000**

## 🎯 Default Admin Account

On first run, the system creates a default admin account:
- **Email**: admin@college.edu
- **Password**: Admin@123

⚠️ **Change this password after first login!**

## 📊 Database Models

### Collections Created:
- `users` - All users (students, faculty, admin)
- `feedbacks` - Feedback posts
- `comments` - Comments on posts
- `likes` - Like records
- `flags` - Flagged posts
- `ratingcategories` - Dynamic rating categories
- `notifications` - User notifications

## 🔒 Security Features

✅ **Password Hashing** with bcrypt (10 salt rounds)
✅ **JWT Authentication** (24-hour expiration)
✅ **Role-Based Access Control**
✅ **Input Validation** on all endpoints
✅ **Student Anonymity** enforcement
✅ **CORS Configuration**
✅ **Error Handling** with consistent format

## 🎨 Student Anonymity

- Students get anonymous IDs (format: `AS_12345`)
- Display name: "Anonymous Student #12345"
- Real identity hidden from faculty and other students
- Admin can see real identity only when reviewing flags
- Anonymity preserved in all API responses

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## 🧪 Testing the API

### Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "Student@123",
    "name": "John Doe",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "Student@123"
  }'
```

### Create Feedback (with JWT token)
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Great course!",
    "category": "course",
    "ratings": [
      {"categoryName": "Overall Quality", "value": 5}
    ]
  }'
```

## 🔗 Integration with Frontend

The backend is ready to connect with the frontend at:
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:5000

Update `frontend/.env` if needed:
```env
REACT_APP_API_URL=http://localhost:5000
```

## ⚠️ Important Notes

1. **MongoDB Required**: The server needs MongoDB running locally
2. **Google OAuth Optional**: Works without OAuth credentials (email/password only)
3. **Admin Account**: Created automatically on first run
4. **CORS**: Configured for http://localhost:3000 (update if needed)
5. **JWT Secret**: Change in production!

## 🎉 Ready to Use!

The backend is fully functional and ready to serve the frontend. All core features are implemented:
- ✅ User authentication
- ✅ Feedback posts with ratings
- ✅ Social interactions (likes, comments)
- ✅ Moderation system
- ✅ Faculty approval workflow
- ✅ Student anonymity protection

Start MongoDB, run the server, and you're good to go! 🚀
