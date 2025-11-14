#!/bin/bash

echo "🚀 n8n CLI Setup"
echo ""

# Check if config already exists
if [ -f ".n8n-config.json" ]; then
    echo "⚠️  .n8n-config.json already exists. Skipping setup."
    echo ""
    exit 0
fi

# Copy template
cp .n8n-config.json.example .n8n-config.json

echo "✅ Created .n8n-config.json from template"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .n8n-config.json with your credentials"
echo "   2. Get your API key from: n8n Settings → API"
echo "   3. Run: ./n8n list"
echo ""
echo "Example .n8n-config.json:"
cat .n8n-config.json
echo ""
