# Agentic Research Frontend

A modern React-based frontend dashboard for comparing bot behaviors, displaying analytics, and managing KPI thresholds. Built with Vite for fast development and optimized production builds.

## Features

✨ **Analytics Dashboard** - Real-time performance metrics and compliance statistics
⚖️ **Simulation Comparisons** - Compare simulated bot performance against real-world data
⚙️ **Threshold Management** - Create, update, and manage KPI thresholds for all agents
📊 **Comprehensive Visualizations** - Performance charts, distribution graphs, and status indicators
🔄 **Real-time Data** - Live updates from backend API

## Project Structure

```
src/
├── components/              # React components
│   ├── AnalyticsDashboard.jsx      # Analytics view with statistics
│   ├── AnalyticsDashboard.module.css
│   ├── ComparisonView.jsx          # Bot vs Real data comparison
│   ├── ComparisonView.module.css
│   ├── ThresholdManager.jsx        # Threshold CRUD operations
│   └── ThresholdManager.module.css
├── hooks/                   # Custom React hooks
│   └── useAPI.js           # API integration hooks
├── App.jsx                 # Main app component
├── App.module.css          # App styling
├── index.css               # Global styles
└── main.jsx                # Entry point

index.html                  # HTML template
vite.config.js              # Vite configuration
package.json                # Dependencies
.env.example                # Environment template
```

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm
- Backend API running on localhost:5001 (or configured URL)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env if your backend is on a different URL
```

3. **Start development server:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Configuration

### Environment Variables

Create a `.env.local` file (or edit `.env`) with:

```env
# Backend API URL (default: http://localhost:5001)
VITE_API_URL=http://localhost:5001
```

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Component Guide

### AnalyticsDashboard
Displays aggregate statistics and performance metrics:
- Total simulation runs
- Pass rate and success metrics
- Status distribution (On Target, Below Min, Above Max, Off Target)
- Failed KPIs with impact analysis
- Performance trends

**Features:**
- Filter by agent
- Time period selection (7, 30, 90 days)
- Color-coded status indicators
- Progress visualization

### ComparisonView
Compare simulation runs against real-world data:
- Browse available simulation runs
- Select a run to compare
- View side-by-side metrics
- See variance percentages and status
- Display current real-world data

**Features:**
- Timestamp display
- Variance calculation
- Status badges
- Run selection UI

### ThresholdManager
Manage KPI thresholds for agents:
- Create new thresholds
- Edit existing thresholds
- Delete thresholds
- Filter by agent
- View threshold history

**Form Fields:**
- Agent name (dropdown)
- KPI name
- Min/Target/Max values
- Description

## API Integration

The frontend uses custom hooks to interact with the backend API:

### useThresholds
```javascript
const { 
  thresholds, 
  loading, 
  error, 
  fetchThresholds, 
  createThreshold, 
  updateThreshold, 
  deleteThreshold 
} = useThresholds();
```

### useStatistics
```javascript
const { 
  statistics, 
  loading, 
  error, 
  fetchStatistics, 
  getThresholdHistory 
} = useStatistics();
```

### useSimulations
```javascript
const { 
  runs, 
  realData, 
  loading, 
  error, 
  fetchRuns, 
  fetchRealData, 
  compareSimulation 
} = useSimulations();
```

### useBots
```javascript
const { 
  bots, 
  loading, 
  error, 
  fetchBots 
} = useBots();
```

## API Endpoints

The frontend communicates with these backend endpoints:

- `GET /api/bots` - List all agents
- `GET /api/thresholds` - Get thresholds
- `POST /api/thresholds` - Create threshold
- `PUT /api/thresholds/{id}` - Update threshold
- `DELETE /api/thresholds/{id}` - Delete threshold
- `GET /api/statistics/thresholds` - Get statistics
- `GET /api/thresholds/{id}/history` - Get threshold history
- `GET /api/runs` - Get simulation runs
- `GET /api/runs/real` - Get real data
- `GET /api/runs/compare` - Compare simulation vs real

See `integration.md` for complete API documentation.

## Styling

The project uses CSS Modules for component-scoped styling:
- Dark theme by default
- Light theme support via `prefers-color-scheme`
- Responsive design with mobile-first approach
- Color scheme:
  - Primary: `#646cff` (blue)
  - Success: `#51cf66` (green)
  - Warning: `#ffa94d` (orange)
  - Danger: `#ff6b6b` (red)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend Connection Failed
- Ensure backend is running on the configured URL
- Check `VITE_API_URL` in `.env`
- Verify CORS is enabled on backend
- Check browser console for error details

### Data Not Loading
- Verify backend has data
- Check network tab in browser DevTools
- Ensure API endpoints are correct
- Look for CORS errors

### Styling Issues
- Clear browser cache
- Rebuild with `npm run build`
- Check that CSS modules are properly imported

## Performance Optimization

- Lazy loading with React.lazy()
- Code splitting via Vite
- Optimized re-renders with useCallback
- Efficient DOM updates
- Minimal dependencies

## Future Enhancements

- [ ] Export reports as PDF/CSV
- [ ] Real-time WebSocket updates
- [ ] Advanced filtering and search
- [ ] Custom visualizations
- [ ] User authentication
- [ ] Caching layer
- [ ] Historical trend analysis
- [ ] Alert notifications
- [ ] Dark/Light theme toggle
- [ ] Performance monitoring

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT - See LICENSE file for details

## Support

For issues or questions:
1. Check `integration.md` for API documentation
2. Review component examples
3. Check browser console for errors
4. Verify backend is running and accessible

---

**Last Updated:** January 20, 2026
**Frontend Version:** 0.1.0
**Status:** Production Ready ✅
