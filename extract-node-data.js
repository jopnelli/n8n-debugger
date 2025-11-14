#!/usr/bin/env node

// Helper script to extract specific node data from execution files
// Usage: ./extract-node-data.js <execution-file> [node-name]

const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const nodeName = process.argv[3];

if (!file) {
  console.log(`
Extract Node Data - Get outputs from specific nodes in execution files

Usage:
  ./extract-node-data.js <execution-file> [node-name]

Examples:
  # List all nodes in an execution
  ./extract-node-data.js executions/mp3KdoJFgCDT5ktt/437776_manual_success.json

  # Extract specific node output
  ./extract-node-data.js executions/mp3KdoJFgCDT5ktt/437776_manual_success.json "Get many rows Katalog"
  `);
  process.exit(0);
}

if (!fs.existsSync(file)) {
  console.error(`Error: File not found: ${file}`);
  process.exit(1);
}

let execution;
try {
  execution = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`Error: Invalid JSON in file: ${error.message}`);
  process.exit(1);
}

const runData = execution.data?.resultData?.runData;

if (!runData) {
  console.error('No node execution data found in this file');
  process.exit(1);
}

const nodeNames = Object.keys(runData);

if (!nodeName) {
  console.log(`\n📊 Execution ${execution.id} - ${execution.status}\n`);
  console.log(`Nodes executed (${nodeNames.length}):\n`);

  nodeNames.forEach(name => {
    const node = runData[name][0];
    const status = node.executionStatus === 'success' ? '✅' : '❌';
    const items = node.data?.main?.[0]?.length || 0;
    const time = node.executionTime || 0;

    console.log(`${status} ${name}`);
    console.log(`   Items: ${items}, Time: ${time}ms`);
  });

  console.log(`\nUse: ./extract-node-data.js ${file} "<node-name>" to see node output\n`);
} else {
  if (!runData[nodeName]) {
    console.error(`\nNode "${nodeName}" not found in execution.`);
    console.log(`\nAvailable nodes: ${nodeNames.join(', ')}\n`);
    process.exit(1);
  }

  const node = runData[nodeName][0];
  const items = node.data?.main?.[0] || [];

  console.log(`\n📦 Node: ${nodeName}`);
  console.log(`Status: ${node.executionStatus}`);
  console.log(`Execution time: ${node.executionTime}ms`);
  console.log(`Items: ${items.length}\n`);

  if (items.length > 0) {
    console.log('Output data:\n');
    console.log(JSON.stringify(items, null, 2));
  } else {
    console.log('No output data');
  }

  console.log('');
}
