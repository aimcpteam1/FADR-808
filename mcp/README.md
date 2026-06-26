# FADR-808 MCP server

Lets **Claude Desktop** recommend a speaker from natural language and push the
result to the website.

## How it works

```
You (Claude Desktop):  "I like House music and orange."
        │
        ▼
  recommend tool  ──reads──▶  src/data/products.json
        │
        └──writes──▶  public/selection.json   { "productId": "P25" }
                              │
                              ▼
        Website polls selection.json → swaps the product image
```

The recommendation is always a single product id (P01–P27).

## Tools

- `recommend(query)` — parse free-text taste, pick the best id, show it.
- `select_product(productId)` — show a specific id.
- `get_products()` — return the full catalog so Claude can match itself.

## Setup (Claude Desktop)

Add to `claude_desktop_config.json`
(macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "fadr-808": {
      "command": "node",
      "args": ["/Users/gang-gayeon/FADR-808/mcp/server.mjs"]
    }
  }
}
```

Restart Claude Desktop, then run the website locally (`npm run dev`). Ask Claude
something like *"I like Techno and blue"* — the displayed FADR-808 updates within
~2s.

> Note: the live update needs the site running locally (the MCP server writes a
> local file). On the static GitHub Pages build it shows the last committed
> `selection.json`.
