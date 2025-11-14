#!/bin/bash

# Compare local workflow with remote version
# Usage: ./diff-workflow.sh <workflow-id>

if [ -z "$1" ]; then
  echo "Usage: ./diff-workflow.sh <workflow-id>"
  echo "Example: ./diff-workflow.sh mp3KdoJFgCDT5ktt"
  exit 1
fi

WORKFLOW_ID="$1"
WORKFLOWS_DIR="./workflows"
TEMP_FILE="/tmp/n8n-remote-$WORKFLOW_ID.json"

# Find local file
LOCAL_FILE=$(find "$WORKFLOWS_DIR" -name "${WORKFLOW_ID}_*.json" | head -1)

if [ -z "$LOCAL_FILE" ]; then
  echo "Error: No local workflow found for ID $WORKFLOW_ID"
  echo "Run: ./n8n pull $WORKFLOW_ID"
  exit 1
fi

echo "📥 Fetching remote version..."
./n8n pull "$WORKFLOW_ID" > /dev/null 2>&1

REMOTE_FILE=$(find "$WORKFLOWS_DIR" -name "${WORKFLOW_ID}_*.json" | head -1)

echo ""
echo "🔍 Comparing local workflow with remote..."
echo ""

if command -v jq &> /dev/null; then
  # Pretty diff with jq if available
  diff -u <(jq -S . "$REMOTE_FILE") <(jq -S . "$LOCAL_FILE") || true
else
  # Plain diff otherwise
  diff -u "$REMOTE_FILE" "$LOCAL_FILE" || true
fi

echo ""
echo "Local:  $LOCAL_FILE"
echo "Remote: (just fetched)"
echo ""
