'use strict';

const { formatTokens } = require('./format');
const { parseTranscript } = require('./transcript');

async function run() {
  let data;
  try {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    data = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    data = {};
  }

  const ctx = data.context_window || {};
  const inTokens = ctx.total_input_tokens || 0;
  const outTokens = ctx.total_output_tokens || 0;

  const costData = data.cost || {};
  const cost = costData.total_cost_usd || 0;

  const transcriptPath = data.transcript_path;
  const { cacheRead, cacheWrite, toolCount } = await parseTranscript(transcriptPath);

  const parts = [
    `In: ${formatTokens(inTokens)}`,
    `Out: ${formatTokens(outTokens)}`,
    `Tools: ${toolCount}`,
    `Cache R: ${formatTokens(cacheRead)} W: ${formatTokens(cacheWrite)}`,
    `$${cost.toFixed(2)}`,
  ];
  process.stdout.write(parts.join(' | ') + '\n');
}

module.exports = { run };