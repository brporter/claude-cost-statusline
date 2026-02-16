'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatTokens } = require('../lib/format');

describe('formatTokens', () => {
  it('returns "0" for zero', () => {
    assert.equal(formatTokens(0), '0');
  });

  it('returns raw number below 1000', () => {
    assert.equal(formatTokens(999), '999');
  });

  it('formats 1000 as 1.0k', () => {
    assert.equal(formatTokens(1000), '1.0k');
  });

  it('formats 1500 as 1.5k', () => {
    assert.equal(formatTokens(1500), '1.5k');
  });

  it('formats 150000 as 150.0k', () => {
    assert.equal(formatTokens(150000), '150.0k');
  });
});
