# HEARTBE.md

## Team Management (Every Heartbeat ~30 min)

With the subagent team structure, the heartbeat now focuses on team coordination:

### 1. Check Team Status
```bash
# List all sessions
sessions_list
```

**If any subagent is not running:**
- **Delta-PM** (Product Manager) - Check for new Feature Requests, backlog grooming, documentation tasks
- **Delta-TL** (Technical Lead) - Check for development tasks assigned to Delta
- **Delta-PA** (Personal Assistant) - Cron jobs handle morning/eviary briefings

Spawn the missing subagent if needed.

### 2. Check for Work

**Feature Requests → Backlog Tasks (Delta-PM's role):**
```bash
curl -s http://localhost:3000/api/requirements
```
- Look for features with status="draft" or "approved" needing tasks
- Assign development tasks → Delta-TL (user-delta)
- Assign documentation tasks → Delta-PM (user-1770821106721)
- Spawn Delta-PM if new features exist

**Backlog Grooming (Delta-PM's role):**
```bash
curl -s http://localhost:3000/api/tasks | grep -o '"assignee":null' | wc -l
```
- Review backlog for unassigned tasks
- Assign development tasks → Delta-TL (user-delta)
- Assign documentation tasks → Delta-PM (user-1770821106721)
- Fix any wrong assignments
- Update priorities if scope changed

**Backlog → Development (Delta-TL's role):**
```bash
curl -s http://localhost:3000/api/tasks | grep '"assignee":"user-delta"'
```
- Look for tasks assigned to Delta-TL (user-delta) with status="backlog"
- Only pick up tasks assigned to YOU (Delta-TL)
- Do NOT work on tasks assigned to Delta-PM
- Spawn Delta-TL if you have assigned tasks

**Documentation → Delta-PM:**
```bash
curl -s http://localhost:3000/api/tasks | grep '"assignee":"user-1770821106721"'
```
- Look for tasks assigned to Delta-PM (user-1770821106721)
- These are documentation tasks for Delta-PM to work on

**3. Check ProjectHub Service**
```bash
systemctl --user status projecthub.service
```
- Restart if down
- URL: http://localhost:3000

### 4. Check for Empty Backlog

**Count backlog tasks:**
```bash
curl -s http://localhost:3000/api/tasks | grep -o '"status":"backlog"' | wc -l
```

**If backlog is EMPTY (count = 0):**
1. Send WhatsApp notification to Anthony:
   ```
   🎉 **Backlog Empty!**
   
   All tasks have been completed. Team is awaiting new work.
   
   Feature Requests: [count] in progress
   ```
2. Continue checking for new Feature Requests
3. If no Feature Requests either, report: "Team is idle and ready for new work"

### 5. Reply Format

**If team is working:** Report what the subagents are accomplishing (no "HEARTBEAT_OK")

**If NOTHING needs attention:**
- All subagents running
- No new Feature Requests
- No backlog tasks
- ProjectHub is healthy

Reply: `HEARTBEAT_OK`

---

## Team Commands

| Team Member | User ID | Role | Triggers |
|-------------|---------|------|----------|
| Delta-PM | user-1770821106721 | Feature Requests → Backlog Tasks, Documentation | New FRs, Tasks assigned to PM |
| Delta-TL | user-delta | Builds Development Tasks | Tasks assigned to Delta |
| Delta-PA | - | Morning/Evening Briefs | Cron jobs at 8AM/6PM |

## Subagent Spawn Commands

**Delta-PM (Product Manager):**
```bash
sessions_spawn label:"Delta-PM" task:"You are Delta-PM... [use current task from MEMORY.md]"
```
- Creates tasks from Feature Requests
- Assigns development tasks → Delta-TL (user-delta)
- Assigns documentation tasks → Delta-PM (user-1770821106721)
- Reviews and works on tasks assigned to itself

**Delta-TL (Technical Lead):**
```bash
sessions_spawn label:"Delta-TL" task:"You are Delta-TL... [use current task from MEMORY.md]"
```
- ONLY works on tasks assigned to Delta-TL (user-delta)
- Does NOT work on documentation tasks (assigned to Delta-PM)
- Implements features, builds, deploys, marks complete

## Dashboard & API

**URL:** http://localhost:3000

**API Endpoints:**
- Tasks: `/api/tasks`
- Requirements: `/api/requirements`
- Documents: `/api/documents`
- Milestones: `/api/milestones`
