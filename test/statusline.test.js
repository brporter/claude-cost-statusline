'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execFile } = require('child_process');
const path = require('path');

const BIN = path.join(__dirname, '..', 'bin', 'claude-cost-statusline.js');
const TRANSCRIPT = path.join(__dirname, 'fixtures', 'sample-transcript.jsonl');

function runWithStdin(input) {
  return new Promise((resolve, reject) => {
    const child = execFile('node', [BIN], (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout.trim());
    });
    child.stdin.write(input);
    child.stdin.end();
  });
}

describe('statusline (full pipeline)', () => {
  it('outputs formatted status line without transcript', async () => {
    const input = JSON.stringify({
      context_window: { total_input_tokens: 15000, total_output_tokens: 3200 },
      cost: { total_cost_usd: 0.45 },
    });
    const output = await runWithStdin(input);
    assert.equal(output, 'In: 15.0k | Out: 3.2k | Tools: 0 | Cache R: 0 W: 0 | $0.45');
  });

  it('outputs formatted status line with transcript', async () => {
    const input = JSON.stringify({
      context_window: { total_input_tokens: 1500, total_output_tokens: 800 },
      cost: { total_cost_usd: 1.23 },
      transcript_path: TRANSCRIPT,
    });
    const output = await runWithStdin(input);
    assert.equal(output, 'In: 1.5k | Out: 800 | Tools: 3 | Cache R: 8.0k W: 2.5k | $1.23');
  });

  it('handles empty stdin gracefully', async () => {
    const output = await runWithStdin('');
    assert.equal(output, 'In: 0 | Out: 0 | Tools: 0 | Cache R: 0 W: 0 | $0.00');
  });

  it('handles invalid JSON gracefully', async () => {
    const output = await runWithStdin('not json');
    assert.equal(output, 'In: 0 | Out: 0 | Tools: 0 | Cache R: 0 W: 0 | $0.00');
  });
});

describe('CLI flags', () => {
  it('--version prints version', async () => {
    const output = await new Promise((resolve, reject) => {
      execFile('node', [BIN, '--version'], (err, stdout) => {
        if (err) return reject(err);
        resolve(stdout.trim());
      });
    });
    const { version } = require('../package.json');
    assert.equal(output, version);
  });

  it('--help prints usage', async () => {
    const output = await new Promise((resolve, reject) => {
      execFile('node', [BIN, '--help'], (err, stdout) => {
        if (err) return reject(err);
        resolve(stdout);
      });
    });
    assert.ok(output.includes('claude-cost-statusline'));
    assert.ok(output.includes('--install'));
  });
});
