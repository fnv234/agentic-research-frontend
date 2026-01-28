# architecture information

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│              USER INTERACTION                       │
│  (Click button, select filter, fill form)          │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│           REACT EVENT HANDLER                       │
│  (onClick, onChange, onSubmit)                      │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│         STATE UPDATE (useState)                     │
│  (Update component local state)                    │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│       API HOOK (useThresholds, etc.)               │
│  (Handle async API calls)                         │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│            FETCH FROM BACKEND                       │
│  GET /api/thresholds                               │
│  POST /api/thresholds                              │
│  PUT /api/thresholds/{id}                          │
│  DELETE /api/thresholds/{id}                       │
│  GET /api/statistics/thresholds                    │
│  etc.                                              │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│         API RESPONSE HANDLING                       │
│  (Parse JSON, check status)                        │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│       UPDATE COMPONENT STATE                        │
│  (setState with response data)                     │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│          COMPONENT RE-RENDER                        │
│  (React updates DOM)                               │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│            UPDATED UI                               │
│  (User sees changes)                               │
└─────────────────────────────────────────────────────┘
```

## API Integration Layer

```
┌────────────────────────────────────────────────────┐
│                  CUSTOM HOOKS                      │
├────────────────────────────────────────────────────┤
│                                                    │
│  useThresholds()                                  │
│  ├─ fetchThresholds(agent?)                       │
│  ├─ getThreshold(id)                              │
│  ├─ createThreshold(data)                         │
│  ├─ updateThreshold(id, data)                     │
│  └─ deleteThreshold(id)                           │
│                                                    │
│  useStatistics()                                  │
│  ├─ fetchStatistics(filters)                      │
│  └─ getThresholdHistory(id)                       │
│                                                    │
│  useSimulations()                                 │
│  ├─ fetchRuns(limit, offset)                      │
│  ├─ fetchRealData()                               │
│  └─ compareSimulation(id)                         │
│                                                    │
│  useBots()                                        │
│  └─ fetchBots()                                   │
│                                                    │
└────────────┬─────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│             FETCH API LAYER                        │
│                                                    │
│  - Handle HTTP requests                           │
│  - Manage loading states                          │
│  - Handle errors                                  │
│  - Parse JSON responses                           │
│                                                    │
└────────────┬─────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│          BACKEND API ENDPOINTS                     │
│                                                    │
│  Base URL: https://agentic-research-backend.onrender.com                  │
│                                                    │
│  /api/bots                                        │
│  /api/thresholds                                  │
│  /api/statistics/thresholds                       │
│  /api/runs                                        │
│  /api/runs/real                                   │
│  /api/runs/compare                                │
│                                                    │
└────────────────────────────────────────────────────┘
```

## State Management

```
Component Level State (useState):
├─ UI State
│  ├─ activeTab: 'analytics' | 'comparison' | 'thresholds'
│  ├─ selectedAgent: string
│  ├─ formData: object
│  └─ isLoading: boolean
│
├─ Data State
│  ├─ thresholds: Threshold[]
│  ├─ statistics: Statistics
│  ├─ runs: SimulationRun[]
│  ├─ realData: RealData
│  └─ bots: Bot[]
│
└─ Error State
   ├─ error: string | null
   └─ submitMessage: string | null

Effect Triggers (useEffect):
├─ On mount: fetch initial data
├─ On filter change: re-fetch with filters
├─ On form submit: create/update/delete
└─ On tab change: load tab-specific data
```


## Performance Optimizations

```
┌─────────────────────────────────────────────┐
│           CODE SPLITTING                    │
│                                             │
│ App.jsx (Router)                            │
│   │                                         │
│   ├─ AnalyticsDashboard.jsx                │
│   ├─ ComparisonView.jsx                    │
│   └─ ThresholdManager.jsx                  │
│                                             │
│ Loaded on demand / as needed                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        MEMOIZATION (useCallback)            │
│                                             │
│ - Event handlers                            │
│ - API fetch functions                       │
│ - Filter handlers                           │
│                                             │
│ Prevents unnecessary re-renders             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│       DEPENDENCY OPTIMIZATION               │
│                                             │
│ useEffect dependencies:                     │
│ - Only trigger when actual deps change      │
│ - Avoid infinite loops                      │
│ - Proper cleanup functions                  │
└─────────────────────────────────────────────┘

Production Build Output:
├─ index.html           0.47 KB
├─ index-CmwNeDgh.css  13.91 KB  (3.13 KB gz)
├─ index-DDPbwMM7.js  163.29 KB (51.39 KB gz)
└─ Total              ~54 KB gzipped
```

---

This architecture diagram shows the complete structure of the frontend application, data flow, component hierarchy, and styling system. Every component is built to be scalable, maintainable, and performant.
