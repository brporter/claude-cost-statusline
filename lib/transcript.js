'use strict';

const fs = require('fs');
const readline = require('readline');

async function parseTranscript(transcriptPath) {
  let cacheRead = 0;
  let cacheWrite = 0;
  let toolCount = 0;

  if (!transcriptPath) {
    return { cacheRead, cacheWrite, toolCount };
  }

  try {
    const input = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({ input, crlfDelay: Infinity });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let entry;
      try {
        entry = JSON.parse(trimmed);
      } catch {
        continue;
      }

      if (entry.type !== 'assistant') continue;

      const msg = entry.message || {};
      const usage = msg.usage || {};
      cacheRead += usage.cache_read_input_tokens || 0;
      cacheWrite += usage.cache_creation_input_tokens || 0;

      for (const block of msg.content || []) {
        if (block && typeof block === 'object' && block.type === 'tool_use') {
          toolCount++;
        }
      }
    }
  } catch { }

  return { cacheRead, cacheWrite, toolCount };
}

module.exports = { parseTranscript };