# n8n CLI Tool

A command-line tool to manage n8n workflows and executions locally.

## Quick Setup

**One-line setup**:
```bash
./setup.sh
```

Then edit `.n8n-config.json` with your credentials and run:
```bash
./n8n list
```

<details>
<summary>Manual setup (click to expand)</summary>

1. **Copy the config template**:
   ```bash
   cp .n8n-config.json.example .n8n-config.json
   ```

2. **Add your n8n credentials** to `.n8n-config.json`:
   - `baseUrl`: Your n8n instance URL (e.g., `https://n8n.yourcompany.com`)
   - `apiKey`: Generate from n8n Settings → API
   - `projectId`: (Optional) Filter to specific project

3. **Test it works**:
   ```bash
   ./n8n list
   ```

</details>

## What's Included

Essential files (always needed):
- **`n8n`** - Main CLI tool
- **`setup.sh`** - One-command setup
- **`.n8n-config.json.example`** - Config template
- **`.gitignore`** - Keeps credentials safe

Helper scripts:
- **`extract-node-data.js`** - Analyze execution node outputs
- **`diff-workflow.sh`** - Compare local vs remote workflows

Documentation:
- **`README.md`** - This file

The `workflows/` and `executions/` folders are created automatically when you use the tool.

## Requirements

- Node.js (built-in modules only, no npm install needed)
- n8n API key with appropriate permissions

## Usage

### List Workflows
```bash
./n8n list
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
# Edit workflow JSON locally, then push
./n8n push workflows/mp3KdoJFgCDT5ktt_Workflow_Name.json
```

## Directory Structure

```
n8n-scripts/
├── n8n                      # CLI executable
├── .n8n-config.json        # API credentials (gitignored)
├── workflows/              # Pulled workflow JSON files
│   └── <id>_<name>.json
└── executions/             # Execution data with node outputs
    └── <workflow-id>/
        └── <execution-id>_<mode>_<status>.json
```

## Workflow Development

1. **Pull workflow**: `./n8n pull <workflow-id>`
2. **Edit locally**: Modify the JSON in `workflows/` directory
3. **Push changes**: `./n8n push workflows/<file>.json`
4. **Debug with executions**: `./n8n pull-executions <workflow-id>` to see actual node outputs

## Analyzing Execution Data

Use the helper script to inspect node outputs from executions:

```bash
# List all nodes in an execution
./extract-node-data.js executions/<workflow-id>/<execution-id>.json

# Extract specific node output
./extract-node-data.js executions/<workflow-id>/<execution-id>.json "Node Name"
```

Example:
```bash
./extract-node-data.js executions/mp3KdoJFgCDT5ktt/437776_manual_success.json
./extract-node-data.js executions/mp3KdoJFgCDT5ktt/437776_manual_success.json "Get many rows Katalog"
```

## Tips

- Execution files contain full node data including inputs/outputs
- Use executions for debugging - see exactly what each node produced
- Workflow files can be version controlled (but exclude `.n8n-config.json`)
- Use `extract-node-data.js` to quickly inspect what data flows through each node
