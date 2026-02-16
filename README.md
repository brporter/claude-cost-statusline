# Cost Tracking Statusline
Claude is an amazing unlock, but it's not free. Cache reads in a session accumulate at a rate that appears roughly quadratic; to get an understanding of the cost of the project output you are getting, we really need to track the accumulated tool call, cache reads, writes, and token usages.

The great news is the wonderful people at Anthropic make this super simple. This is a very simple statusline plugin that reads this data and displays it in your Claude statusline. There are others that do this, too, I just like mine better.

## Installation
Install globally with:

`npm install -g claude-cost-statusline`

## Feedback?
Feel free to open an issue, or submit a PR.

# License
MIT licensed.