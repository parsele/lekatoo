# 🌳 Green Planet Tree Tracker

A modern web application for tracking trees planted in parts ofKenya. This application show  you to record, view, and manage tree planting data with an interactive map interface and comprehensive admin dashboard.

## Features

- 🗺️ **Interactive Map View**: Visualize all planted trees on a map of Amboseli
- ➕ **Add Trees**: Add new trees with manual coordinate entry or automatic geolocation
- ✏️ **Edit Trees**: Update tree information including species, location, status, and notes
- 🗑️ **Delete Trees**: Remove trees from the database
- 📊 **Statistics Dashboard**: View total trees, species count, and health status
- 📍 **Automatic Location Detection**: Use browser geolocation to automatically detect coordinates
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

### Frontend
- React 18
- React Leaflet (for map visualization)
- Axios (for API calls)
- CSS3 (modern styling)

### Backend
- Node.js
- Express.js
- SQLite3 (database)

## Installation

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd server && 
   npm install
   cd ../client && npm install
   ```

## Running the Application

1. **Start both server and client** (recommended):
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Start server
   npm run server

   # Terminal 2 - Start client
   npm run client
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Viewing Trees on Map
1. The main view shows an interactive map of Amboseli
2. Each tree is marked with a green tree icon
3. Click on any marker to see tree details in a popup

### Adding a New Tree
1. Click the "⚙️ Admin Dashboard" button
2. Fill in the tree information:
   - **Species**: Tree species name (required)
   - **Planted Date**: Date when tree was planted (required)
   - **Planter Name**: Name of person who planted (optional)
   - **Status**: Health status of the tree
   - **Coordinates**: 
     - Click "📍 Use My Location" for automatic detection, OR
     - Enter latitude and longitude manually
   - **Notes**: Additional information (optional)
3. Click "➕ Add Tree"

### Editing a Tree
1. Go to Admin Dashboard
2. Find the tree in the list
3. Click "✏️ Edit" button
4. Modify the information
5. Click "💾 Update Tree"

### Deleting a Tree
1. Go to Admin Dashboard
2. Find the tree in the list
3. Click "🗑️ Delete" button
4. Confirm the deletion

## API Endpoints

- `GET /api/trees` - Get all trees
- `GET /api/trees/:id` - Get single tree by ID
- `POST /api/trees` - Create new tree
- `PUT /api/trees/:id` - Update tree
- `DELETE /api/trees/:id` - Delete tree
- `GET /api/stats` - Get statistics

## Database

The application uses SQLite3 database stored in `server/trees.db`. The database is automatically created on first run.

## Tree Data Structure

```javascript
{
  id: number,
  species: string,
  latitude: number,
  longitude: number,
  planted_date: string (ISO date),
  planter_name: string (optional),
  notes: string (optional),
  status: 'healthy' | 'needs_attention',
  created_at: string (ISO datetime),
  updated_at: string (ISO datetime)
}
```

## Location Services

The application supports two methods for adding coordinates:

1. **Automatic Detection**: Uses browser's Geolocation API to detect your current location
   - Requires location permissions from the browser
   - Works best on mobile devices or devices with GPS

2. **Manual Entry**: Enter latitude and longitude coordinates manually
   - Amboseli coordinates are approximately: -2.6531, 37.2500
   - Use decimal degrees format

## Notes

- The map is centered on Amboseli National Park, Kenya
- All coordinates should be within the Amboseli region for accurate tracking
- The database persists data locally in SQLite format
- The application is responsive and works on desktop and mobile devices

## License

ISC


