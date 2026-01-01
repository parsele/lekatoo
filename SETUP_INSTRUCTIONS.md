# Setup Instructions for Green Planet Tree Tracker

## Important: This is a React App

**You CANNOT open the HTML file directly with Live Server!** React apps need to be compiled and served by the development server.

## Step-by-Step Setup

### 1. Install Client Dependencies

Open PowerShell or Command Prompt in the project root and run:

```powershell
cd client
npm install
cd ..
```

Or from the root directory:
```powershell
npm run install-all
```

### 2. Start the Application

From the root directory, run:

```powershell
npm run dev
```

This will start:
- **Backend server** on http://localhost:5000
- **React app** on http://localhost:3000

### 3. Access the Application

Open your browser and go to:
**http://localhost:3000**

The React development server will automatically:
- Compile your React code
- Hot-reload when you make changes
- Show errors in the browser console

## Troubleshooting

### If you see "react-scripts is not recognized":
- Make sure you've run `npm install` in the `client` folder
- Delete `client/node_modules` and `client/package-lock.json` and reinstall

### If the page is blank:
- Check the browser console (F12) for errors
- Make sure the backend server is running on port 5000
- Check that both servers started successfully

### If you see CORS errors:
- Make sure the backend server is running
- Check that the API_BASE_URL in App.js matches your backend URL

## Why Not Live Server?

React uses JSX (JavaScript XML) which needs to be:
1. Transpiled from JSX to regular JavaScript
2. Bundled with all dependencies
3. Served with proper routing

Live Server just serves static files - it can't compile React code!


