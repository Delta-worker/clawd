# Clawd Kanban

A simple kanban board for tracking Clawd's projects and requests.

## Usage

Open `index.html` in a browser. That's it.

## Features

- **Three columns:** Backlog → In Progress → Done
- **Drag and drop:** Move cards between columns
- **Two task types:** Request (from Anthony) / Project (ongoing work)
- **Persistence:** Saves to browser localStorage
- **Export/Import:** Backup and restore as JSON

## Keyboard Shortcuts

- `N` - New task
- `Esc` - Close modal

## Data

Data is stored in browser localStorage under key `clawd-kanban`.

Use Export/Import buttons to backup or transfer data between browsers.

## Files

```
projects/kanban/
├── index.html      # The board (single file, self-contained)
├── data/           # JSON backups (manual exports)
└── README.md       # This file
```
