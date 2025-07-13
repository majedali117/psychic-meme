# Agentive Buddy Admin Panel Documentation

## Overview

The Agentive Buddy Admin Panel is a comprehensive web-based interface for managing the Agentive Buddy career guidance platform. This documentation provides detailed information on the implementation, features, and usage of the admin panel.

## Table of Contents

1. [Implementation Summary](#implementation-summary)
2. [Features](#features)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage Guide](#usage-guide)
6. [API Integration](#api-integration)
7. [Component Structure](#component-structure)
8. [Troubleshooting](#troubleshooting)

## Implementation Summary

The Agentive Buddy Admin Panel has been successfully implemented with the following enhancements:

- **Complete Mentors Management**: Added a comprehensive interface for managing AI mentors
- **File Upload Functionality**: Implemented secure file upload for mentor avatars and other assets
- **Enhanced Error Handling**: Improved error handling and user feedback throughout the application
- **Responsive Design**: Ensured full responsiveness across desktop, tablet, and mobile devices
- **Form Validation**: Added robust validation for all form inputs
- **Loading States**: Implemented consistent loading indicators for better user experience

All features have been thoroughly tested and validated against the backend API, ensuring seamless integration and functionality.

## Features

### Authentication System
- Secure JWT-based authentication
- Protected routes for authenticated users only
- Automatic token refresh mechanism
- Secure logout functionality

### Dashboard
- Overview of key platform metrics
- Quick access to important features
- System status indicators
- Recent activity feed

### User Management
- View and search user accounts
- Create new user accounts
- Edit user details and permissions
- Manage user status and roles

### Mentors Management
- Comprehensive list of AI mentors
- Create, edit, and delete mentor profiles
- Upload mentor avatar images
- Manage mentor specializations and status

### Missions Management
- View and manage career guidance missions
- Create new mission templates
- Edit mission parameters and rewards
- Track mission completion statistics

### Protocols Management
- Manage long-term learning paths
- Create structured learning protocols
- Edit protocol milestones and requirements
- Track protocol effectiveness

### Analytics
- User engagement metrics
- Mission completion statistics
- Protocol effectiveness data
- Growth and retention analytics

### Dashboard Management
- Customize admin dashboard layout
- Configure widget visibility and placement
- Save dashboard configurations

## Installation

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher
- Agentive Buddy backend API running (default: http://localhost:5000/api/v1)

### Setup Instructions

1. Extract the Agentive Buddy admin panel files to your desired location
2. Navigate to the project directory:
   ```bash
   cd timetravelers
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure the API endpoint in `src/admin/services/api.ts` if your backend is not running on the default URL
5. Start the development server:
   ```bash
   npm start
   ```
6. Access the admin panel at http://localhost:5173/admin

### Production Deployment

1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `dist` directory to your web server
3. Configure your web server to serve the `index.html` for all routes

## Configuration

### API Endpoint

The admin panel connects to the Agentive Buddy backend API. To configure the API endpoint:

1. Open `src/admin/services/api.ts`
2. Modify the `API_BASE_URL` constant:
   ```typescript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://your-api-url/api/v1';
   ```

### Environment Variables

For production deployments, you can use environment variables:

```
REACT_APP_API_URL=http://your-api-url/api/v1
REACT_APP_AUTH_TOKEN_KEY=admin_token
```

## Usage Guide

### Logging In

1. Navigate to `/admin` to access the login page
2. Enter your admin credentials (email and password)
3. Click "Sign In" to authenticate

### Managing Mentors

1. Click "Mentors" in the sidebar navigation
2. View the list of existing mentors
3. Use the search box to find specific mentors
4. Click "Add Mentor" to create a new mentor profile
5. Fill in the required information and upload an avatar image
6. Click "Add Mentor" to save the new profile
7. Use the edit and delete buttons to manage existing mentors

### Managing Users

1. Click "Users" in the sidebar navigation
2. View the list of registered users
3. Use the search and filter options to find specific users
4. Click on a user to view detailed information
5. Edit user details, roles, or status as needed

### Managing Missions

1. Click "Missions" in the sidebar navigation
2. View the list of available missions
3. Create new missions with the "Add Mission" button
4. Configure mission parameters, difficulty, and rewards
5. Edit or delete existing missions as needed

### Managing Protocols

1. Click "Protocols" in the sidebar navigation
2. View the list of learning protocols
3. Create new protocols with structured milestones
4. Edit protocol details and requirements
5. Track protocol completion and effectiveness

### Viewing Analytics

1. Click "Analytics" in the sidebar navigation
2. Select the desired date range
3. View engagement, mission, and protocol metrics
4. Export data in various formats for further analysis

## API Integration

The admin panel integrates with the Agentive Buddy backend API using the following services:

### Authentication API
- `login(email, password)`: Authenticate admin user
- `logout()`: End user session

### User API
- `getAllUsers(page, limit)`: Get paginated user list
- `getUser(id)`: Get specific user details
- `updateUser(id, userData)`: Update user details
- `deleteUser(id)`: Delete user

### Mentor API
- `getAllMentors(page, limit)`: Get paginated mentor list
- `getMentor(id)`: Get specific mentor details
- `createMentor(mentorData)`: Create new mentor
- `updateMentor(id, mentorData)`: Update mentor details
- `deleteMentor(id)`: Delete mentor

### Mission API
- `getAllMissions(page, limit)`: Get paginated mission list
- `getMission(id)`: Get specific mission details
- `createMission(missionData)`: Create new mission
- `updateMission(id, missionData)`: Update mission details
- `deleteMission(id)`: Delete mission

### Protocol API
- `getAllProtocols(page, limit)`: Get paginated protocol list
- `getProtocol(id)`: Get specific protocol details
- `createProtocol(protocolData)`: Create new protocol
- `updateProtocol(id, protocolData)`: Update protocol details
- `deleteProtocol(id)`: Delete protocol

### Analytics API
- `getUserEngagement(startDate, endDate)`: Get user engagement metrics
- `getMissionMetrics(startDate, endDate)`: Get mission performance metrics
- `getProtocolMetrics(startDate, endDate)`: Get protocol progress metrics
- `getUserGrowth(startDate, endDate)`: Get user growth metrics

### File Upload API
- `uploadFile(formData)`: Upload files to the server

## Component Structure

The admin panel follows a modular component structure:

```
src/admin/
├── components/       # Reusable UI components
│   ├── AdminLayout.tsx
│   ├── FileUploader.tsx
│   ├── Pagination.tsx
│   ├── ProtectedRoute.tsx
│   └── Sidebar.tsx
├── context/          # React context providers
│   └── AuthContext.tsx
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── AnalyticsPage.tsx
│   ├── DashboardManagementPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── MentorsPage.tsx
│   ├── MissionsPage.tsx
│   ├── ProtocolsPage.tsx
│   └── UsersPage.tsx
├── services/         # API services
│   └── api.ts
├── utils/            # Utility functions
└── AdminRoutes.tsx   # Main routing component
```

## Troubleshooting

### Common Issues and Solutions

#### Authentication Issues

- **Issue**: Unable to log in with correct credentials
  - **Solution**: Verify the API endpoint is correct and accessible
  - **Solution**: Check browser console for specific error messages
  - **Solution**: Clear browser cookies and local storage

#### API Connection Errors

- **Issue**: "Failed to fetch" errors in console
  - **Solution**: Verify the backend API is running
  - **Solution**: Check CORS configuration on the backend
  - **Solution**: Verify network connectivity between frontend and backend

#### File Upload Issues

- **Issue**: File uploads fail
  - **Solution**: Verify the file size is within limits
  - **Solution**: Check that the file type is supported
  - **Solution**: Ensure the upload endpoint is correctly configured

#### Layout Issues

- **Issue**: UI elements misaligned or overlapping
  - **Solution**: Try a different browser
  - **Solution**: Clear browser cache
  - **Solution**: Check for CSS conflicts if you've customized the admin panel

#### Missing Start Script

- **Issue**: "Missing script: start" error when running npm start
  - **Solution**: The start script has been added to package.json
  - **Solution**: You can now run the application using `npm start`
  - **Solution**: This will launch the Vite development server

### Debugging Tools

- Browser Developer Tools (F12)
- Network tab to inspect API requests
- Console tab for JavaScript errors
- Application tab to inspect local storage and cookies

For additional support, please contact the Agentive Buddy development team.
