# Team Memory - Shared Across Delta-PM, Delta-TL, Delta-PA

## Current Sprint Status

**Last Updated:** 2026-02-11

### Active Work
- Delta-TL just completed: "Add archived_at column to feature_requests table"
- Delta-PM last action: Created 8 backlog tasks from 3 Feature Requests
- Delta-PA last action: Delivered morning brief

### Pending Tasks (Backlog)
Priority "must":
1. ~~Create archive feature request API endpoint~~ (DONE)
2. ~~Add Archive section to feature requests UI~~ (DONE)
3. ~~Add Archive button to feature request cards~~ (DONE)

Priority "should":
1. ~~Ensure tasks have date tracking fields~~ (DONE - already implemented)
2. ~~Create burndown chart API endpoint~~ (DONE - chart computes client-side)
3. ~~Add burndown chart component to dashboard~~ (DONE - already exists)
4. ~~Fix Add Feature button visibility~~ (DONE - already fixed)
5. ~~Remove Filter by label control bar from Kanban~~ (DONE)
6. ~~Add In Review kanban lane before Done~~ (DONE)

### Completed This Sprint
- ✅ Add archived_at column to feature_requests table
- ✅ Milestones tracking (dashboard widget, API, database)
- ✅ Feature Request drag-and-drop interaction
- ✅ Back button on Feature Requests page

### Recent Decisions
- Team structure established: Delta-PM (PM), Delta-TL (TL), Delta-PA (PA)
- Subagents spawn fresh for each task, reading TEAM.md for context

### Feature Requests Status
1. **Archive Feature requests** - Tasks created, in-progress
2. **Add Feature button always visible** - Task created, awaiting build
3. **Dashboard burndown chart** - Tasks created, awaiting build

---

## How to Use This File

**When spawning a subagent:**
1. Read TEAM.md to get current context
2. Read MEMORY.md for long-term preferences
3. Append your completion summary to TEAM.md
4. Mark task as done in the API

**Format for updates:**
```markdown
### [Date] - Task Completion
- **Task:** [Title]
- **Completed by:** [Delta-PM/Delta-TL]
- **Outcome:** Brief summary
- **Files changed:** List of files
```

## API Quick Reference

| Resource | Endpoint | Description |
|----------|----------|-------------|
| Tasks | /api/tasks | CRUD for backlog |
| Requirements | /api/requirements | Feature Requests |
| Milestones | /api/milestones | Project milestones |
| Documents | /api/documents | Documentation |

### 2026-02-11 - Add Feature Button Visibility Already Fixed
- **Task:** Fix Add Feature button visibility
- **Status:** ✓ Already implemented
- **Outcome:** Add Feature button is located in the Header action area (src/app/requirements/page.tsx lines 340-343), which is always visible regardless of how many features are in the list.

### 2026-02-11 - Burndown Chart Component Already Exists
- **Task:** Add burndown chart component to dashboard
- **Status:** ✓ Already implemented
- **Outcome:** Burndown chart component already exists in src/app/page.tsx (lines 143-226) using Recharts. Shows tasks added vs completed over time with interactive visualization.
- **API Enhancement:** Created /api/dashboard/burndown endpoint to provide burndown data server-side (can be used for future optimization)

### 2026-02-11 - Burndown Chart API Complete
- **Task:** Create burndown chart API endpoint
- **Completed by:** Delta-TL
- **Outcome:** Created GET /api/dashboard/burndown endpoint that returns daily tasks added/completed, cumulative totals, and ideal burndown line for chart visualization.
- **Files changed:** src/app/api/dashboard/burndown/route.ts
- **Build:** ✓ Success
- **Service:** ✓ Restarted
- **API Test:** ✓ Returns dates, daily stats, cumulative data, totalTasks, totalCompleted, totalRemaining, idealBurndown

### 2026-02-11 - Remove Testing Lane Complete
- **Task:** Remove Testing lane from Kanban board
- **Completed by:** Delta-TL
- **Outcome:** Removed 'testing' from COLUMN_ORDER and STATUS_LABELS in kanban/page.tsx. The Testing lane column is no longer rendered in the Kanban board UI.
- **Files changed:** src/app/kanban/page.tsx
- **Build:** ✓ Success
- **Service:** ✓ Restarted

### 2026-02-11 - Remove Development Lane Complete
- **Task:** Remove Development lane from Kanban board
- **Completed by:** Delta-TL
- **Outcome:** Removed 'development' from COLUMN_ORDER and STATUS_LABELS in kanban/page.tsx. The Development lane column is no longer rendered in the Kanban board UI.
- **Files changed:** src/app/kanban/page.tsx
- **Build:** ✓ Success
- **Service:** ✓ Restarted

### 2026-02-11 - Remove Dev/Testing Lanes Feature Progress
- **Action:** Feature Request audit & task creation
- **Completed by:** Delta-PM
- **Outcome:** Found draft feature "Remove Development and Testing Lanes", created 2 backlog tasks, updated status to in-progress
- **Tasks created:** task-1770798928448, task-1770798928464
- **Action:** Feature Request audit
- **Status:** All 3 features have tasks in backlog, nothing pending
- **Next:** Await Delta-TL task completion

### 2026-02-11 - Archive API Endpoint Complete
- **Task:** Create archive feature request API endpoint
- **Completed by:** Delta-TL
- **Outcome:** Created PUT /api/feature-requests/archive endpoint that sets status to 'archived' and records timestamp
- **Files changed:** src/app/api/feature-requests/archive/route.ts

### 2026-02-11 - Archive UI Features Complete
- **Task:** Add Archive button to feature request cards
- **Completed by:** Delta-TL
- **Outcome:** Added Archive button to New Requests and Actioned card lists. Added Restore button to archived cards. Archive section already existed in UI.
- **Files changed:** src/app/requirements/page.tsx

### 2026-02-11 - Kanban Filter Removed
- **Task:** Remove Filter by label control bar from Kanban
- **Completed by:** Delta-TL
- **Outcome:** Removed the label filter control bar from the Kanban board UI and associated filtering logic
- **Files changed:** src/app/kanban/page.tsx

### 2026-02-11 - In Review Lane Added
- **Task:** Add In Review kanban lane before Done
- **Completed by:** Delta-TL
- **Outcome:** Added "In Review" lane between "Testing" and "Done" in the Kanban board
- **Files changed:** src/app/kanban/page.tsx

### 2026-02-11 - Back Button Color Fixes Complete
- **Tasks:** Update back button text color to white, Update back button background to blue
- **Completed by:** Delta-TL
- **Outcome:** Changed document back button text color from blue to white, added blue background color for better contrast and consistency with the UI theme
- **Files changed:** src/app/documents/page.tsx
