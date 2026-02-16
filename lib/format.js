'use strict';

function formatTokens(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

module.exports = { formatTokens };
