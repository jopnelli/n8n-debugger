# n8n Debugger

A command-line tool to manage n8n workflows and executions locally.

## AI Agent Mode

This tool can be used by AI agents to autonomously debug and fix n8n workflows. When you describe a workflow problem to an AI assistant, the agent can:

1. **Find** the workflow by searching for it by name
2. **Pull** workflow definition and recent error logs
3. **Analyze** execution data to understand what failed
4. **Fix** the issue by editing the workflow JSON
5. **Validate** and **push** the corrected workflow back to n8n

No coding required - describe the problem and the agent handles the technical work.

### Setup for AI Assistants

1. Clone this repo
2. Run `./setup.sh` and configure `.env` with your n8n credentials
3. Point your AI assistant to this directory

Works with: Claude Code, Cursor, or any AI assistant with file access.

### Important: Testing Workflow Fixes

**Limitation:** Workflows cannot be tested locally before pushing to n8n. The workflow must be pushed to n8n and manually executed to verify the fix works.

**Best practice for agents:**

1. Point out the issue found and explain the fix made
2. Validate the workflow structure with `./n8n validate`
3. Ask the user: _"Should I push this fix to n8n?"_
4. After pushing, inform user: _"Fix has been pushed. Please test the workflow manually in n8n to verify it works."_
5. Optionally: Ask user to report back if fix worked, then use `./n8n clean` to remove downloaded files

---

## Quick Setup

**One-line setup**:

```bash
./setup.sh
```

Then edit `.env` with your credentials:

```bash
# .env
N8N_BASE_URL=https://n8n.yourcompany.com
N8N_API_KEY=your-api-key-here
N8N_PROJECT_ID=your-project-id  # optional
```

Test it works:

```bash
./n8n list
```

## What's Included

Essential files:

- **`n8n`** - Main CLI tool
- **`setup.sh`** - One-command setup
- **`.env.example`** - Environment variables template
- **`.gitignore`** - Keeps credentials safe

The `workflows/` and `executions/` folders are created automatically when you use the tool.

## Requirements

- Node.js (built-in modules only, no npm install needed)
- n8n API key with appropriate permissions

## Usage

### Discovery & Search

```bash
# List all workflows
./n8n list

# Search workflows by name
./n8n search "Todoist"
```

### Debugging

```bash
# Show recent errors for a workflow
./n8n errors mp3KdoJFgCDT5ktt

# Compare successful vs failed executions
./n8n compare-executions mp3KdoJFgCDT5ktt 437776 440301
```

### Pull Workflows

```bash
# Pull all workflows
./n8n pull all

# Pull specific workflow
./n8n pull mp3KdoJFgCDT5ktt
```

### Pull Executions (with artifacts/node outputs)

```bash
# Pull last 10 executions
./n8n pull-executions mp3KdoJFgCDT5ktt

# Pull last 20 executions
./n8n pull-executions mp3KdoJFgCDT5ktt 20
```

### Push Workflow Changes

```bash
# Validate before pushing
./n8n validate workflows/mp3KdoJFgCDT5ktt_Workflow_Name.json

# Push changes
./n8n push workflows/mp3KdoJFgCDT5ktt_Workflow_Name.json
```

### Cleanup

```bash
# Remove all downloaded files
./n8n clean

# Remove only workflows
./n8n clean workflows

# Remove only executions
./n8n clean executions
```

**Note:** Only core workflow fields can be updated via push:

- `name` - Workflow name
- `nodes` - Workflow nodes and their configuration
- `connections` - Node connections
- `settings` - Workflow settings
- `staticData` - Static workflow data

Read-only fields (like `active`, `tags`, timestamps) are automatically filtered out and must be changed in the n8n UI.

## Directory Structure

```
n8n-debugger/
├── n8n                     # CLI executable
├── .env                    # API credentials (gitignored)
├── workflows/              # Pulled workflow JSON files
│   └── <id>_<name>.json
└── executions/             # Execution data with node outputs
    └── <workflow-id>/
        └── <execution-id>_<mode>_<status>.json
```

## Workflow Development

1. **Pull workflow**: `./n8n pull <workflow-id>`
2. **Edit locally**: Modify the JSON in `workflows/` directory
3. **Validate**: `./n8n validate workflows/<file>.json`
4. **Push changes**: `./n8n push workflows/<file>.json`
5. **Debug with executions**: `./n8n pull-executions <workflow-id>` to see actual node outputs

## For Developers

Manual workflow debugging commands:

```bash
./n8n search "My Workflow"     # Find the workflow
./n8n errors <workflow-id>      # See what's failing
./n8n pull <workflow-id>        # Get the workflow
# ... edit the JSON ...
./n8n validate <file>           # Check it's valid
./n8n push <file>              # Deploy the fix
```

## Tips

- Execution files contain full node data including inputs/outputs
- Use executions for debugging - see exactly what each node produced
- Workflow files can be version controlled (but keep `.env` private)
