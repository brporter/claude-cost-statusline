'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { parseTranscript } = require('../lib/transcript');

const FIXTURE = path.join(__dirname, 'fixtures', 'sample-transcript.jsonl');

describe('parseTranscript', () => {
  it('parses cache and tool counts from fixture', async () => {
    const result = await parseTranscript(FIXTURE);
    assert.equal(result.cacheRead, 8000);    // 5000 + 3000
    assert.equal(result.cacheWrite, 2500);   // 2000 + 500
    assert.equal(result.toolCount, 3);       // tool_1, tool_2, tool_3
  });

  it('returns zeros for missing file', async () => {
    const result = await parseTranscript('/nonexistent/path.jsonl');
    assert.equal(result.cacheRead, 0);
    assert.equal(result.cacheWrite, 0);
    assert.equal(result.toolCount, 0);
  });

  it('returns zeros for null path', async () => {
    const result = await parseTranscript(null);
    assert.equal(result.cacheRead, 0);
    assert.equal(result.cacheWrite, 0);
    assert.equal(result.toolCount, 0);
  });
});
