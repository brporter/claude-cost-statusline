'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

function install() {
  const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

  let settings;
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch {
    settings = {};
  }

  const hadExisting = settings.statusLine != null;

  settings.statusLine = {
    type: 'command',
    command: 'claude-cost-statusline',
  };

  const dir = path.dirname(settingsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');

  if (hadExisting) {
    console.log('Warning: replaced existing statusLine configuration.');
  }
  console.log('Installed claude-cost-statusline into ' + settingsPath);
}

module.exports = { install };
