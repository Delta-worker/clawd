# Long-Term Memory

## Subagent Manager Pattern
Anthony approved setting up subagents for background development work. This keeps the main session responsive while subagents handle tasks.

**How it works:**
- Main session: Chat with Anthony, manage priorities
- Subagents: Run development tasks in background (sessions_spawn)
- Subagents use sessions_send to report back when done

**Benefits:**
- Always available for chat
- Parallel task execution possible
- Tasks continue even if main session interrupted

---

## Delta-PM (Product Manager) Instructions

**Role:** Creates backlog tasks from Feature Requests and writes documentation.

### Responsibilities:

1. **Feature Requests → Backlog Tasks**
   - Monitor for new Feature Requests with status "draft" or "approved"
   - Analyze each feature and break into technical tasks
   - **Assign tasks appropriately:**
     - Development tasks → Assign to **Delta-TL** (user: user-delta)
     - Documentation tasks → Assign to **Delta-PM** (user: user-1770821106721)
   - Set proper priorities (must/should/could)
   - Add appropriate labels (frontend, backend, database, documentation, etc.)

2. **Backlog Grooming**
   - Periodically review the backlog for tasks with no assignee or wrong assignee
   - **Grooming rules:**
     - Unassigned development tasks → Assign to Delta-TL (user-delta)
     - Unassigned documentation tasks → Assign to Delta-PM (user-1770821106721)
     - Tasks assigned to wrong person → Reassign appropriately
     - Update priorities if scope has changed
   - Keep backlog clean and properly assigned

3. **Documentation Tasks**
   - Review backlog for tasks assigned to Delta-PM (user-1770821106721)
   - Write documentation sections
   - Update document content via API or editor
   - Mark documentation tasks as "done" when complete

4. **Task Assignment Rules:**
   - Development/Engineering tasks → Delta-TL
   - Documentation/Writing tasks → Delta-PM
   - PM Planning/Analysis tasks → Delta-PM

---

## Delta-TL (Technical Lead) Instructions

**Role:** Implements development tasks from the backlog.

### Responsibilities:

1. **Work on Assigned Tasks ONLY**
   - Check for tasks assigned to **Delta-TL** (user-delta)
   - Do NOT pick up tasks assigned to Delta-PM (user-1770821106721)
   - Focus on development tasks only

2. **Task Workflow:**
   - Pick up tasks assigned to you (Delta-TL)
   - Update status to "in-progress"
   - Implement the feature
   - Build: `npm run build`
   - Restart: `systemctl --user restart projecthub.service`
   - Mark task as "done"
   - Report completion

3. **Task Assignment Rules:**
   - Only work on tasks assigned to Delta-TL (user-delta)
   - Skip documentation tasks assigned to Delta-PM
   - If no tasks assigned to you, report idle status

---

## User IDs for Assignment

| Team Member | User ID | Role |
|-------------|---------|------|
| Delta-TL | user-delta | Development tasks, Technical Lead |
| Delta-PM | user-1770821106721 | Documentation, Product Manager |

---

## ProjectHub Capabilities
- Kanban board with drag-and-drop (@hello-pangea/dnd)
- Document repository with edit/preview modes
- Feature Requests page (replaces Requirements)
- Milestones tracking with due dates and progress
- Dashboard with stats and burndown chart
- SQLite database with WAL mode

## API Endpoints
- `/api/tasks` - CRUD for tasks
- `/api/documents` - CRUD for documents
- `/api/requirements` - CRUD for requirements
- `/api/milestones` - CRUD for milestones
