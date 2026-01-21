# Frontend Features & Architecture

## Overview

The Agentic Research Frontend is a comprehensive dashboard for monitoring and managing bot performance across multiple agents. It provides real-time analytics, bot comparison tools, and threshold management capabilities.

## Core Features

### 1. Analytics Dashboard 📊

**Purpose:** Real-time performance metrics and compliance statistics

**Key Features:**
- Aggregate statistics from all simulation runs
- Filter by agent and time period (7, 30, 90 days)
- Pass rate calculation and visualization
- Status distribution breakdown
- Failed KPIs analysis with impact classification
- Performance summary with progress bars
- Color-coded status indicators

**Metrics Displayed:**
- Total number of runs
- Pass rate percentage
- On-target runs
- Below minimum threshold runs
- Above maximum threshold runs
- Off-target runs
- Failure impact (High/Medium/Low)

**Use Cases:**
- Monitor overall system compliance
- Identify underperforming agents
- Track trends over different time periods
- Prioritize KPI improvements

### 2. Comparison View ⚖️

**Purpose:** Compare simulated bot performance against real-world data

**Key Features:**
- Browse all available simulation runs
- Select a run to compare
- View side-by-side comparison of simulated vs real data
- Calculate variance (absolute and percentage)
- Status badges (close, off_target, below_min, above_max)
- Display current real-world data
- Color-coded variance indicators

**Metrics Compared:**
- Any KPI tracked by an agent
- Variance calculation (Simulated - Real)
- Variance percentage
- Status determination (automatic)

**Use Cases:**
- Validate simulation accuracy
- Identify where bots underperform vs reality
- Find systematic bias in simulations
- Validate bot decisions against real outcomes

### 3. Threshold Management ⚙️

**Purpose:** Create, update, and manage KPI thresholds for agents

**Key Features:**
- Create thresholds with min/target/max values
- Edit existing thresholds
- Delete thresholds (soft delete)
- Filter thresholds by agent
- View threshold details (agent, KPI, values, description)
- Track creation/update timestamps
- Form validation

**Threshold Properties:**
- Agent name
- KPI name
- Minimum acceptable value
- Target value
- Maximum acceptable value
- Description/notes

**Status Determination:**
- `on_target`: Within ±10% of target
- `below_min`: Below minimum threshold
- `above_max`: Above maximum threshold
- `off_target`: Outside acceptable range

**Use Cases:**
- Set performance expectations for each agent
- Define compliance boundaries
- Track against real-world targets
- Monitor KPI performance

## Architecture

### Component Hierarchy

```
App (Main container with tabs)
├── AnalyticsDashboard (Statistics view)
│   ├── Filter controls (agent, time period)
│   ├── Stat cards (metrics display)
│   ├── Failed KPIs table
│   └── Performance summary charts
│
├── ComparisonView (Simulation comparison)
│   ├── Run selector (card grid)
│   ├── Comparison results table
│   └── Real data display
│
└── ThresholdManager (CRUD operations)
    ├── Threshold form (create/edit)
    ├── Agent filter
    └── Thresholds table (view/edit/delete)
```

### State Management

Each component manages its own state using React hooks:
- `useState` for UI state (forms, filters, selections)
- `useEffect` for data fetching and updates
- `useCallback` for memoized event handlers

Custom API hooks (`useAPI.js`) handle:
- Data fetching
- Loading states
- Error handling
- CRUD operations

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Hook (useThresholds, useStatistics, etc.)
    ↓
Fetch from Backend API
    ↓
Update Local State
    ↓
Component Re-renders
    ↓
Updated UI
```

## Styling System

### CSS Modules

- Component-scoped styling (no naming conflicts)
- Each component has its own `.module.css` file
- Global styles in `index.css`
- App-level styles in `App.module.css`

### Color Scheme

**Dark Theme (Default):**
- Background: `#242424`
- Card Background: `#1a1a1a`
- Border: `#404040`
- Text: `rgba(255, 255, 255, 0.87)`
- Primary: `#646cff` (blue)
- Success: `#51cf66` (green)
- Warning: `#ffa94d` (orange)
- Danger: `#ff6b6b` (red)

**Light Theme:**
- Automatically applies with `prefers-color-scheme: light`
- Maintains accessibility and contrast ratios

### Responsive Design

- Mobile-first approach
- Grid layouts with `auto-fit` and `minmax()`
- Breakpoints at 768px and 1024px
- Stacked layout on mobile
- Side-by-side layout on desktop

## API Integration

### Hook: `useThresholds`

```javascript
const { 
  thresholds,           // Array of threshold objects
  loading,              // Boolean loading state
  error,                // Error message or null
  fetchThresholds,      // Function to fetch thresholds
  getThreshold,         // Function to get specific threshold
  createThreshold,      // Function to create threshold
  updateThreshold,      // Function to update threshold
  deleteThreshold       // Function to delete threshold
} = useThresholds();
```

### Hook: `useStatistics`

```javascript
const {
  statistics,           // Statistics object
  loading,              // Boolean loading state
  error,                // Error message or null
  fetchStatistics,      // Function to fetch with filters
  getThresholdHistory   // Function to get historical data
} = useStatistics();
```

### Hook: `useSimulations`

```javascript
const {
  runs,                 // Array of simulation runs
  realData,             // Real-world data object
  loading,              // Boolean loading state
  error,                // Error message or null
  fetchRuns,            // Function to fetch runs
  fetchRealData,        // Function to fetch real data
  compareSimulation     // Function to compare a run
} = useSimulations();
```

### Hook: `useBots`

```javascript
const {
  bots,                 // Array of bot objects
  loading,              // Boolean loading state
  error,                // Error message or null
  fetchBots             // Function to fetch bots
} = useBots();
```

## Performance Optimizations

1. **Code Splitting**: Vite automatically splits code
2. **Lazy Loading**: Components load on demand
3. **Memoization**: `useCallback` for event handlers
4. **CSS Modules**: No global style conflicts
5. **Efficient Renders**: Minimal re-renders through proper dependency arrays
6. **Production Build**: Minified and optimized (~51KB gzipped)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML (`<table>`, `<form>`, etc.)
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratios meet WCAG AA
- Focus indicators on buttons

## Error Handling

1. **Network Errors**: Display user-friendly messages
2. **API Errors**: Show backend error messages
3. **Validation**: Client-side form validation
4. **Fallbacks**: Show "No data available" states
5. **Health Check**: Backend connectivity verification

## Development Workflow

### Adding a New Feature

1. Create component file in `src/components/`
2. Create corresponding `.module.css` file
3. Implement component logic with React hooks
4. Use existing API hooks or create new ones in `src/hooks/useAPI.js`
5. Add component to App.jsx with routing
6. Test in development server
7. Build and verify

### Styling a Component

1. Create `.module.css` file
2. Use descriptive class names
3. Include dark theme styles
4. Add light theme support with `@media (prefers-color-scheme: light)`
5. Use CSS Grid/Flexbox for responsive layouts
6. Import in component: `import styles from './Component.module.css'`

### API Integration

1. Create custom hook in `useAPI.js`
2. Implement fetch logic with error handling
3. Return state variables and functions
4. Use in components with `useEffect` for side effects

## Configuration

### Environment Variables

`VITE_API_URL` - Backend API base URL
- Default: `http://localhost:5001`
- Used in all API hooks

### Vite Configuration

- Dev server port: 3000
- Proxy for `/api/*` to backend
- React plugin for JSX compilation
- Optimized build output

## Deployment

### Production Build

```bash
npm run build
```

Creates optimized files in `dist/`:
- HTML: 0.47 KB
- CSS: 13.91 KB (3.13 KB gzipped)
- JS: 163.29 KB (51.39 KB gzipped)

### Hosting Options

- Static hosting (Netlify, Vercel, GitHub Pages)
- Traditional web server (Apache, Nginx)
- Docker container
- Cloud platforms (AWS S3, Azure Static Web Apps, GCP)

### Pre-deployment Checklist

- [ ] Update `VITE_API_URL` in `.env` for production
- [ ] Run `npm run build` and verify output
- [ ] Test with production backend URL
- [ ] Check browser console for errors
- [ ] Test on different browsers
- [ ] Verify performance with dev tools

## Monitoring & Analytics

Potential enhancements:
- Error tracking (Sentry)
- Usage analytics (Google Analytics)
- Performance monitoring (Web Vitals)
- User session tracking

## Security Considerations

1. **CORS**: Frontend and backend must have matching origins
2. **API Keys**: Never commit `.env` files with keys
3. **Input Validation**: All form inputs validated client-side
4. **Error Messages**: Don't expose sensitive backend details
5. **HTTPS**: Use HTTPS in production

## Maintenance

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Monitoring Build Size

```bash
npm run build -- --stats
```

### Performance Profiling

- Use React DevTools Profiler
- Check Vite build analysis
- Monitor Network tab in DevTools

---

**Architecture Document** | Last Updated: January 20, 2026
