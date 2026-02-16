# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`claude-cost-statusline` is a Claude Code statusline plugin (npm package) that displays real-time session cost and token metrics in the Claude Code status bar. It reads session JSON from stdin and a JSONL transcript file, then outputs a formatted single-line summary showing input/output tokens, tool call count, cache read/write stats, and USD cost.

## Commands

- **Run tests:** `npm test` (uses Node.js built-in test runner: `node --test test/*.test.js`)
- **Run a single test file:** `node --test test/format.test.js`
- **Run the tool manually:** `echo '{"context_window":{"total_input_tokens":1000},"cost":{"total_cost_usd":0.5}}' | node bin/claude-cost-statusline.js`

## Architecture

The codebase is pure CommonJS JavaScript with zero runtime dependencies. Requires Node >= 18.

- **`bin/claude-cost-statusline.js`** — CLI entry point. Handles `--help`, `--version`, `--install` flags; otherwise delegates to `lib/statusline.js:run()`.
- **`lib/statusline.js`** — Main pipeline. Reads JSON from stdin (expects `context_window`, `cost`, and `transcript_path` fields), calls `parseTranscript` for cache/tool metrics, formats output via `formatTokens`, and writes a pipe-delimited status line to stdout.
- **`lib/transcript.js`** — Streams a JSONL transcript file line-by-line. Accumulates `cache_read_input_tokens`, `cache_creation_input_tokens`, and `tool_use` block counts from `assistant`-type entries only.
- **`lib/format.js`** — Formats token counts (raw number below 1000, `Xk` at/above 1000).
- **`lib/install.js`** — Writes `statusLine` config into `~/.claude/settings.json`, preserving existing settings.

## CI/CD

GitHub Actions workflow (`.github/workflows/publish.yml`) runs tests then publishes to npm with provenance on push to `main`.
