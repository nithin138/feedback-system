# Student Feedback System - Frontend

React.js frontend application for the Student Feedback System.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example` and configure:
   - Backend API URL
   - Google OAuth Client ID

3. Start development server:
   ```bash
   npm start
   ```

The app will open at http://localhost:3000

## Features

- Twitter/X-like feed interface
- Anonymous student posts
- Like and comment functionality
- Faculty and admin dashboards
- Light/dark mode with Tailwind CSS
- Responsive design

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── context/     # React context
│   ├── utils/       # Utility functions
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
└── package.json
```
