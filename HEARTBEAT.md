# HEARTBE.md

## Team Management (Every Heartbeat ~30 min)

With the subagent team structure, the heartbeat now focuses on team coordination:

### 1. Check Team Status & Spawn Needed Subagents
```bash
# List all sessions
sessions_list
```

**Auto-spawn subagents if needed (no manual intervention):**
- **Delta-PM** - If draft/approved Feature Requests exist OR unassigned tasks exist
- **Delta-TL** - If tasks assigned to Delta-TL (user-delta) exist
- **Delta-PA** - Cron jobs handle morning/eviary briefings (automatic)

**Check for work:**
1. Check Feature Requests: `curl -s http://localhost:3000/api/requirements | grep -E '"status":"(draft|approved)"'`
2. Check unassigned tasks: `curl -s http://localhost:3000/api/tasks | grep -o '"assignee":null' | wc -l`
3. Check Delta-TL tasks: `curl -s http://localhost:3000/api/tasks | grep '"assignee":"user-delta"'`

**If any check finds work → Spawn appropriate subagent immediately**

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

**Count draft/approved Feature Requests:**
```bash
curl -s http://localhost:3000/api/requirements | grep -E '"status":"(draft|approved)"' | wc -l
```

**If backlog is EMPTY (count = 0) AND no draft/approved FRs:**
1. Send WhatsApp notification to Anthony:
   ```
   🎉 **Backlog Empty!**
   
   All tasks have been completed. Team is awaiting new work.
   ```
2. Continue checking for new Feature Requests
3. If no Feature Requests either, report: "Team is idle and ready for new work"

**If backlog has work OR draft FRs exist:**
- Subagents are already spawned (per step 1)
- No WhatsApp notification needed - team is working

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
