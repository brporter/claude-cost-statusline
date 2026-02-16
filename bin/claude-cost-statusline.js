#!/usr/bin/env node
'use strict';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`claude-cost-statusline — session metrics for the Claude Code status bar

Usage:
  claude-cost-statusline            Read session JSON from stdin, print status line
  claude-cost-statusline --install  Configure Claude Code to use this status line
  claude-cost-statusline --version  Print version
  claude-cost-statusline --help     Show this help`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  const { version } = require('../package.json');
  console.log(version);
  process.exit(0);
}

if (args.includes('--install')) {
  const { install } = require('../lib/install');
  install();
  process.exit(0);
}

const { run } = require('../lib/statusline');
run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
