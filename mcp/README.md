# FADR-808 MCP server

Recommends a FADR-808 speaker from natural-language taste. Two ways to run it:

| Mode | File | Transport | Use |
|------|------|-----------|-----|
| **Public** | `worker.ts` | Streamable HTTP (`POST /mcp`) | Cloudflare Worker — anyone can connect |
| Local | `server.mjs` | stdio | your own Claude Desktop |

Both expose the same tools:

- `recommend(query)` — parse free-text taste → best id (P01–P27)
- `select_product(productId)` — pick a specific id
- `get_products()` — return the catalog

Product data is imported from `../src/data/products.json` (single source of truth).

---

## Deploy to Cloudflare Workers

```bash
cd mcp
npm install
npx wrangler login          # one-time
npm run deploy              # = wrangler deploy
```

`wrangler deploy` prints your URL, e.g.
`https://fadr-808-mcp.<your-subdomain>.workers.dev`

Endpoints:

- `POST /mcp` — MCP Streamable HTTP
- `GET /selection` — currently selected product id (for the website)
- `OPTIONS *` — CORS preflight (open CORS, `*`)

Smoke-test it:

```bash
curl -X POST https://fadr-808-mcp.<sub>.workers.dev/mcp \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call",
       "params":{"name":"recommend","arguments":{"query":"I like Techno and blue"}}}'
```

### (Optional) Persist the selection in KV

The tools run fine without it, but to let the **website** react to a
recommendation, store the choice in KV:

```bash
npx wrangler kv namespace create SELECTION   # prints an id
```

Paste the id into `wrangler.toml`, uncomment the `[[kv_namespaces]]` block,
then `npm run deploy` again. Now `recommend` / `select_product` write the id and
`GET /selection` returns it.

---

## Connect an MCP client

**Claude Desktop** (bridges stdio → remote HTTP via `mcp-remote`):

```json
{
  "mcpServers": {
    "fadr-808": {
      "command": "npx",
      "args": ["mcp-remote", "https://fadr-808-mcp.<sub>.workers.dev/mcp"]
    }
  }
}
```

Clients that speak Streamable HTTP natively can use the URL
`https://fadr-808-mcp.<sub>.workers.dev/mcp` directly.

---

## Wire the website to the public selection

The site currently polls same-origin `/selection.json`. To follow the deployed
Worker instead, point the poll at `https://fadr-808-mcp.<sub>.workers.dev/selection`
(CORS is already open). Local dev keeps using the stdio server + local file.

---

## Local stdio (unchanged)

```json
{ "mcpServers": { "fadr-808": {
  "command": "node",
  "args": ["/Users/gang-gayeon/FADR-808/mcp/server.mjs"] } } }
```
