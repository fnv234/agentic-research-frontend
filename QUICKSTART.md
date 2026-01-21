# Quick Start Guide

Get the Agentic Research Frontend up and running in 5 minutes!

## Prerequisites

- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Backend API** - Running on `localhost:5001` (or your configured URL)

## Step 1: Install Dependencies

```bash
npm install
```

Expected output: `added 102 packages` ✓

## Step 2: Configure API URL (Optional)

If your backend is NOT on `localhost:5001`, update the environment:

```bash
cat > .env << EOF
VITE_API_URL=http://your-backend-url:5001
EOF
```

## Step 3: Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Open your browser to `http://localhost:3000/`

## Step 4: Verify Connection

You should see:
- ✅ "Backend Connected" message in top-right
- 📊 Analytics Dashboard with data
- ⚖️ Comparison View 
- ⚙️ Thresholds Manager

If you see "Backend Offline", ensure the backend API is running.

## Common Tasks

### View Analytics
1. Click **📊 Analytics** tab
2. Select an agent from the dropdown (optional)
3. Choose a time period (7, 30, or 90 days)
4. See performance metrics and statistics

### Compare Bots vs Real Data
1. Click **⚖️ Comparisons** tab
2. Browse available simulation runs
3. Click **Compare** on a run
4. View side-by-side metrics and variances

### Manage Thresholds
1. Click **⚙️ Thresholds** tab
2. Select an agent from dropdown
3. View existing thresholds in the table
4. Create new threshold using the form
5. Edit or delete thresholds from the table

## Building for Production

```bash
npm run build
```

Output files will be in `dist/` directory. Deploy to any static hosting:

```bash
# Preview before deploying
npm run preview
```

## Backend Requirements

The backend API must have these endpoints working:

```
✓ GET  /api/bots               → List agents
✓ GET  /api/thresholds         → Get thresholds
✓ POST /api/thresholds         → Create threshold
✓ GET  /api/statistics/thresholds → Get statistics
✓ GET  /api/runs               → Get simulation runs
✓ GET  /api/runs/real          → Get real data
✓ GET  /api/runs/compare       → Compare simulation vs real
```

See `integration.md` for full API specification.

## Troubleshooting

### Port 3000 Already in Use?
```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or just use a different port
npm run dev -- --port 3001
```

### Backend Connection Error?
1. Check backend is running: `curl http://localhost:5001/health`
2. Verify API URL in `.env`
3. Check CORS is enabled on backend
4. Look at browser console for details

### Module Not Found?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styling Looks Wrong?
```bash
# Clear Vite cache
rm -rf .vite dist
npm run dev
```

## Environment Variables

Create `.env.local` or `.env` with:

```env
# Required: Backend API base URL
VITE_API_URL=http://localhost:5001
```

## Development Tips

### Hot Module Replacement (HMR)
Vite automatically refreshes when you save files - no manual refresh needed!

### Browser DevTools
1. Open browser DevTools (F12)
2. Check Network tab for API calls
3. Check Console tab for errors
4. Use React DevTools extension for component debugging

### Debugging
Add `console.log()` statements in components - they'll appear in browser DevTools console.

```javascript
// In any component
useEffect(() => {
  console.log('Component mounted', thresholds);
}, [thresholds]);
```

## Project Structure at a Glance

```
src/
├── App.jsx                          # Main app with tabs
├── components/
│   ├── AnalyticsDashboard.jsx       # Stats & metrics
│   ├── ComparisonView.jsx           # Bot vs real data
│   └── ThresholdManager.jsx         # CRUD for thresholds
├── hooks/
│   └── useAPI.js                    # API integration
└── main.jsx                         # React entry point
```

## Next Steps

1. ✅ Backend running?
2. ✅ Frontend started (`npm run dev`)?
3. ✅ Can you see data in the dashboard?

If yes: **You're all set!** 🎉

Start by:
- Creating a threshold in the Thresholds tab
- Viewing comparisons in the Comparisons tab
- Analyzing metrics in the Analytics tab

## Need Help?

1. **API Issues?** → Check `integration.md`
2. **Component Code?** → Check `src/components/`
3. **Styling?** → Check `.module.css` files
4. **Environment?** → Check `.env` and `vite.config.js`

---

**Ready to explore?** Open http://localhost:3000 in your browser! 🚀
