# Agentic Research Frontend

A modern React-based frontend dashboard for comparing bot behaviors, displaying analytics, and managing KPI thresholds. Built with Vite for fast development and optimized production builds.

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

## License

MIT
