# Agent Instructions for n8n Workflow Management

This guide is for AI agents helping debug and fix n8n workflows.

## Overview

This repository provides CLI tools to:
- Pull n8n workflows and execution data locally
- Analyze errors and debug issues
- Edit workflows as code (JSON)
- Validate and push fixes back to n8n

## Typical Agent Workflow

### 1. **User Reports an Issue**

User says: *"My Todoist Notion Sync workflow is failing"*

### 2. **Find the Workflow**

```bash
# Search by name (partial match)
./n8n search "Todoist"

# Result:
# ✅ Lne3piooo2l4CJ2e - Todoist Notion Sync
```

### 3. **Investigate Errors**

```bash
# Get recent failed executions with error details
./n8n errors Lne3piooo2l4CJ2e

# This shows:
# - Execution IDs
# - Which nodes failed
# - Error messages
# - Last executed node
```

### 4. **Pull Workflow & Execution Data**

```bash
# Pull the workflow definition
./n8n pull Lne3piooo2l4CJ2e

# Pull recent executions (including failed ones)
./n8n pull-executions Lne3piooo2l4CJ2e 10
```

**Files created:**
- `workflows/Lne3piooo2l4CJ2e_Todoist_Notion_Sync.json` - Workflow definition
- `executions/Lne3piooo2l4CJ2e/*.json` - Execution data with node outputs

### 5. **Analyze Node Data**

```bash
# List all nodes in a specific execution
./extract-node-data.js executions/Lne3piooo2l4CJ2e/440301_manual_failed.json

# Extract specific node output to see what data it received
./extract-node-data.js executions/Lne3piooo2l4CJ2e/440301_manual_failed.json "Get many tasks"
```

### 6. **Compare Success vs Failure** (Optional)

If you have both successful and failed executions:

```bash
./n8n compare-executions Lne3piooo2l4CJ2e 437776 440301
```

This shows:
- Which nodes behaved differently
- Data count differences
- Errors in failed run

### 7. **Edit the Workflow**

Open and edit the workflow JSON:

```bash
workflows/Lne3piooo2l4CJ2e_Todoist_Notion_Sync.json
```

**Common fixes:**
- Update node parameters
- Fix credential references
- Adjust data mappings
- Update expressions

**Editable fields:**
- `name` - Workflow name
- `nodes` - Array of nodes with parameters
- `connections` - Node connections
- `settings` - Workflow settings
- `staticData` - Static data

**Read-only fields (automatically filtered):**
- `id`, `createdAt`, `updatedAt`, `active`, `tags`, etc.

### 8. **Validate Before Pushing**

```bash
./n8n validate workflows/Lne3piooo2l4CJ2e_Todoist_Notion_Sync.json
```

This checks:
- JSON is valid
- Required fields present
- Node structure correct
- No duplicate node names

### 9. **Push the Fix**

```bash
./n8n push workflows/Lne3piooo2l4CJ2e_Todoist_Notion_Sync.json
```

## Command Reference

### Discovery
```bash
./n8n list                    # List all workflows
./n8n search "keyword"        # Search by name
```

### Investigation
```bash
./n8n errors <workflow-id>              # Show recent errors
./n8n pull <workflow-id>                # Pull workflow JSON
./n8n pull-executions <workflow-id> 20  # Pull execution data
```

### Analysis
```bash
./extract-node-data.js <execution-file>              # List nodes
./extract-node-data.js <execution-file> "Node Name"  # Extract node data
./n8n compare-executions <wf-id> <ok-id> <fail-id>  # Compare executions
```

### Fixing
```bash
./n8n validate <workflow-file>  # Check before push
./n8n push <workflow-file>      # Push fix to n8n
```

## Tips for Agents

### Understanding n8n Workflows

- **Workflows** are directed graphs of **nodes**
- Each **node** performs an operation (API call, data transform, etc.)
- **Connections** define data flow between nodes
- **Executions** show what actually happened when the workflow ran

### Common Issues

1. **Authentication errors** - Check credential IDs in nodes
2. **Data mapping errors** - Check node parameters and expressions
3. **Missing data** - Previous node didn't output expected data
4. **API changes** - External API changed, node config outdated

### Reading Execution Data

```json
{
  "id": "440301",
  "status": "error",
  "data": {
    "resultData": {
      "runData": {
        "Get many tasks": [{
          "executionStatus": "success",
          "data": { "main": [[{ "json": {...} }]] }
        }],
        "Create page": [{
          "executionStatus": "error",
          "error": {
            "message": "Invalid property: database_id"
          }
        }]
      },
      "lastNodeExecuted": "Create page"
    }
  }
}
```

Key fields:
- `status` - Overall execution status
- `runData` - Each node's input/output data
- `executionStatus` - Per-node success/error
- `error` - Error details if node failed
- `lastNodeExecuted` - Last node that ran

### Debugging Strategy

1. **Find the failing node** - Check `lastNodeExecuted` and look for `error` in runData
2. **Check input data** - Use extract-node-data to see what data the node received
3. **Compare with success** - If available, compare with successful execution
4. **Check node config** - Look at parameters in workflow JSON
5. **Test the fix** - Validate before pushing

## Example: Full Debug Session

```bash
# 1. User says: "Todoist sync is broken"
./n8n search "Todoist"
# Found: Lne3piooo2l4CJ2e

# 2. Check errors
./n8n errors Lne3piooo2l4CJ2e
# Error in "Create page" node: "Invalid property: database_id"

# 3. Pull everything
./n8n pull Lne3piooo2l4CJ2e
./n8n pull-executions Lne3piooo2l4CJ2e 5

# 4. Analyze the failed execution
./extract-node-data.js executions/Lne3piooo2l4CJ2e/440301_manual_failed.json
# Node "Create page" failed

# 5. Check what data it received
./extract-node-data.js executions/Lne3piooo2l4CJ2e/440301_manual_failed.json "Get many tasks"
# Data looks good, has all expected fields

# 6. Open workflow and check "Create page" node config
# Found: parameters.database_id uses wrong expression

# 7. Edit workflow JSON, fix the expression

# 8. Validate
./n8n validate workflows/Lne3piooo2l4CJ2e_Todoist_Notion_Sync.json
# ✅ Valid

# 9. Push fix
./n8n push workflows/Lne3piooo2l4CJ2e_Todoist_Notion_Sync.json
# ✅ Updated
```

## File Structure

```
n8n-scripts/
├── workflows/                    # Pulled workflow definitions
│   └── <id>_<name>.json
├── executions/                   # Pulled execution data
│   └── <workflow-id>/
│       ├── <id>_manual_success.json
│       └── <id>_manual_failed.json
├── n8n                          # Main CLI
├── extract-node-data.js         # Helper for execution analysis
└── AGENT.md                     # This file
```

## Security Notes

- Never commit `.env` or `.n8n-config.json` (already in .gitignore)
- Workflow JSON may contain sensitive data (credentials, API keys)
- Be careful when sharing execution data

## Additional Resources

- n8n API: https://docs.n8n.io/api/
- n8n Workflow Structure: https://docs.n8n.io/workflows/
- This README.md for setup and usage details
