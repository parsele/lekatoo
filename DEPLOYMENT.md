# Deployment Guide

This guide covers deploying the Green Planet Tree Tracker application.

## Architecture

- **Frontend**: React app (client directory)
- **Backend**: Express.js API (server directory)
- **Database**: SQLite (trees.db)

## Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend) - Recommended

#### Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to client directory**:
   ```bash
   cd client
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   Follow the prompts. When asked for environment variables, add:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com/api`)

4. **Or deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `client`
   - Add environment variable: `REACT_APP_API_URL`

#### Deploy Backend to Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Set:
     - **Name**: tree-tracker-api
     - **Root Directory**: server
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js`
     - **Plan**: Free

3. **Add Environment Variables**:
   - `PORT`: 10000 (or let Render assign)
   - `NODE_ENV`: production

4. **Note**: Render free tier spins down after inactivity. For production, consider:
   - Upgrading to a paid plan, or
   - Using Railway (better free tier), or
   - Using a different service

#### Deploy Backend to Railway (Alternative)

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and connect your GitHub repo

3. **Add a new service**:
   - Select your repository
   - Set root directory to `server`
   - Railway will auto-detect Node.js

4. **Add Environment Variables**:
   - `PORT`: Will be auto-assigned
   - `NODE_ENV`: production

5. **Get your Railway URL** and update frontend's `REACT_APP_API_URL`

### Option 2: Render (Full Stack)

1. **Use the provided `render.yaml`**:
   - Push your code to GitHub
   - Go to Render Dashboard
   - Create a new "Blueprint"
   - Connect your repository
   - Render will use `render.yaml` to deploy both services

2. **Update environment variables** in Render dashboard after deployment

### Option 3: Railway (Full Stack)

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Create a new project** and connect your GitHub repo

3. **Add two services**:
   - **Backend**: Root directory `server`
   - **Frontend**: Root directory `client`, build command `npm run build`

4. **Configure environment variables**:
   - Backend: `NODE_ENV=production`
   - Frontend: `REACT_APP_API_URL` pointing to backend URL

### Option 4: Heroku (Full Stack)

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Create two Heroku apps**:
   ```bash
   # Backend
   heroku create tree-tracker-api
   cd server
   heroku git:remote -a tree-tracker-api
   git push heroku main
   
   # Frontend
   heroku create tree-tracker-frontend
   cd ../client
   heroku git:remote -a tree-tracker-frontend
   echo "web: npm start" > Procfile
   git add Procfile
   git commit -m "Add Procfile"
   git push heroku main
   ```

## Important Notes

### Database Considerations

- **SQLite on Render/Railway**: Works for small apps, but data may be lost on free tier restarts
- **For production**: Consider migrating to PostgreSQL:
  - Render offers free PostgreSQL
  - Update `server/index.js` to use PostgreSQL instead of SQLite

### CORS Configuration

The server already has CORS enabled. If you encounter CORS issues:
- Update `server/index.js` to allow your frontend domain:
  ```javascript
  app.use(cors({
    origin: 'https://your-frontend-domain.vercel.app'
  }));
  ```

### Environment Variables

**Frontend (.env.production or Vercel/Render settings)**:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Backend**:
```
PORT=5000 (or assigned port)
NODE_ENV=production
```

## Quick Deploy Commands

### Build for Production

```bash
# Build frontend
cd client
npm run build

# Test production build locally
npx serve -s build
```

### Test Locally with Production Build

```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Serve frontend build
cd client
npx serve -s build -l 3000
```

## Troubleshooting

1. **API not connecting**: Check `REACT_APP_API_URL` environment variable
2. **CORS errors**: Update server CORS configuration
3. **Database issues**: Ensure database file is included in deployment
4. **Port issues**: Use environment variable for port, not hardcoded

## Recommended Production Setup

For a production-ready deployment:
1. Use **Vercel** for frontend (excellent free tier)
2. Use **Railway** or **Render** for backend
3. Migrate to **PostgreSQL** for database (instead of SQLite)
4. Set up proper error logging and monitoring

