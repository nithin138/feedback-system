# Student Feedback System - Backend

Node.js/Express.js REST API for the Student Feedback System.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example` and configure:
   - MongoDB connection string
   - JWT secret key
   - Google OAuth credentials
   - Admin account details

3. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Feedback
- `GET /api/feedback` - Get feed (with filters)
- `POST /api/feedback` - Create feedback post
- `GET /api/feedback/:id` - Get specific post
- `POST /api/feedback/:id/like` - Like post
- `POST /api/feedback/:id/comment` - Comment on post
- `POST /api/feedback/:id/flag` - Flag post (faculty only)

### Admin
- `GET /api/admin/faculty/pending` - Pending faculty approvals
- `PUT /api/admin/faculty/:id/approve` - Approve faculty
- `GET /api/admin/flags` - Flagged posts
- `PUT /api/admin/flags/:id/dismiss` - Dismiss flag
- `GET /api/admin/analytics` - System analytics

### Analytics
- `GET /api/analytics/faculty/:id` - Faculty analytics
- `GET /api/analytics/export` - Export data

## Project Structure

```
backend/
├── config/          # Configuration files
├── models/          # Mongoose schemas
├── routes/          # API routes
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── server.js        # Entry point
└── package.json
```
