'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

// We test install by temporarily overriding HOME so it writes to a temp dir
describe('install', () => {
  let tmpDir;
  let originalHome;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claude-cost-test-'));
    originalHome = process.env.HOME;
    process.env.HOME = tmpDir;
  });

  afterEach(() => {
    process.env.HOME = originalHome;
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates settings.json when none exists', () => {
    // Need to re-require to pick up new HOME
    delete require.cache[require.resolve('../lib/install')];
    const { install } = require('../lib/install');

    fs.mkdirSync(path.join(tmpDir, '.claude'), { recursive: true });
    install();

    const settings = JSON.parse(
      fs.readFileSync(path.join(tmpDir, '.claude', 'settings.json'), 'utf8')
    );
    assert.deepEqual(settings.statusLine, {
      type: 'command',
      command: 'claude-cost-statusline',
    });
  });

  it('preserves existing settings', () => {
    const claudeDir = path.join(tmpDir, '.claude');
    fs.mkdirSync(claudeDir, { recursive: true });
    fs.writeFileSync(
      path.join(claudeDir, 'settings.json'),
      JSON.stringify({ theme: 'dark', verbose: true })
    );

    delete require.cache[require.resolve('../lib/install')];
    const { install } = require('../lib/install');
    install();

    const settings = JSON.parse(
      fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8')
    );
    assert.equal(settings.theme, 'dark');
    assert.equal(settings.verbose, true);
    assert.deepEqual(settings.statusLine, {
      type: 'command',
      command: 'claude-cost-statusline',
    });
  });

  it('is idempotent', () => {
    const claudeDir = path.join(tmpDir, '.claude');
    fs.mkdirSync(claudeDir, { recursive: true });

    delete require.cache[require.resolve('../lib/install')];
    const { install } = require('../lib/install');
    install();
    install();

    const settings = JSON.parse(
      fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8')
    );
    assert.deepEqual(settings.statusLine, {
      type: 'command',
      command: 'claude-cost-statusline',
    });
  });
});
