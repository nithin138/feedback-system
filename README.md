# Student Feedback and Review System

A full-stack web application that enables students to provide anonymous feedback about courses, faculty, and facilities in a Twitter/X-like social feed format.

## Features

- 🔐 **Authentication**: Google OAuth + Email/Password with JWT
- 👤 **Three User Roles**: Student, Faculty, Admin
- 🎭 **Student Anonymity**: Complete identity protection
- 💬 **Social Interactions**: Like, comment on feedback posts
- 🚩 **Moderation System**: Faculty flagging, admin review
- 📊 **Analytics Dashboards**: Faculty and admin insights
- 🌓 **Light/Dark Mode**: Minimalistic, attractive design
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React.js + Tailwind CSS + React Router
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Google OAuth + JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables (see backend/.env.example and frontend/.env.example)

4. Start the development servers:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:5000 and frontend on http://localhost:3000

## Project Structure

```
student-feedback-system/
├── backend/          # Node.js/Express API
├── frontend/         # React application
└── README.md
```

## Documentation

- [Requirements Document](.kiro/specs/student-feedback-system/requirements.md)
- [Design Document](.kiro/specs/student-feedback-system/design.md)
- [Implementation Tasks](.kiro/specs/student-feedback-system/tasks.md)

## License

MIT
