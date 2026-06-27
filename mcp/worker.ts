/**
 * FADR-808 MCP server — Cloudflare Workers (public, Streamable HTTP).
 *
 * Endpoints:
 *   POST /mcp        → MCP Streamable HTTP (JSON-RPC). Stateless.
 *   GET  /selection  → the currently selected product id (for the website).
 *   OPTIONS *        → CORS preflight.
 *
 * The MCP SDK's StreamableHTTPServerTransport targets Node's http req/res,
 * which Workers don't provide. Since these three tools need no streaming or
 * server-initiated messages, we implement the Streamable HTTP contract
 * directly over fetch (single JSON response per request) — fully compatible
 * with MCP clients, and trivially deployable to Workers.
 *
 * Tools are byte-for-byte the same as the stdio server (get_products,
 * select_product, recommend); only persistence moved from a local file to KV.
 */
import productsData from "../src/data/products.json";

interface Product {
  id: string;
  name: string;
  genre: string;
  color: string;
  colorHex: string;
  image: string;
}

const PRODUCTS = productsData as Product[];

interface Env {
  // Optional: bind a KV namespace named SELECTION to persist the choice so the
  // website can read it via GET /selection. See wrangler.toml.
  SELECTION?: KVNamespace;
}

// ─── Matching (identical to the stdio server) ──────────────────────────
const GENRE_SYNONYMS: Record<string, string> = {
  house: "House",
  edm: "EDM",
  techno: "Techno",
  trance: "Trance",
  dnb: "DnB",
  "drum and bass": "DnB",
  "drum & bass": "DnB",
  "drum n bass": "DnB",
  garage: "Garage",
};

const COLOR_SYNONYMS: Record<string, string> = {
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue",
  purple: "Purple",
  violet: "Purple",
  pink: "Pink",
  magenta: "Pink",
  white: "White",
  silver: "White",
  mono: "Mono",
  monochrome: "Mono",
  black: "Mono",
  grey: "Mono",
  gray: "Mono",
  dots: "Mono",
};

function parseQuery(q: string) {
  const s = q.toLowerCase();
  let genre: string | null = null;
  for (const [k, v] of Object.entries(GENRE_SYNONYMS)) {
    if (s.includes(k)) {
      genre = v;
      break;
    }
  }
  let color: string | null = null;
  for (const [k, v] of Object.entries(COLOR_SYNONYMS)) {
    if (new RegExp(`\\b${k}\\b`).test(s)) {
      color = v;
      break;
    }
  }
  return { genre, color };
}

function bestMatch(genre: string | null, color: string | null): Product {
  let best = PRODUCTS[0];
  let bestScore = -1;
  for (const p of PRODUCTS) {
    const score = (genre && p.genre === genre ? 2 : 0) + (color && p.color === color ? 1 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

// ─── Tool catalog ──────────────────────────────────────────────────────
const TOOLS = [
  {
    name: "get_products",
    description:
      "Return the full FADR-808 product catalog (products.json: id, genre, color, image).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "select_product",
    description: "Display a specific FADR-808 product on the website. Pass its id (P01–P27).",
    inputSchema: {
      type: "object",
      properties: { productId: { type: "string", description: "Product id, e.g. P27" } },
      required: ["productId"],
      additionalProperties: false,
    },
  },
  {
    name: "recommend",
    description:
      'Recommend a FADR-808 from free-text taste, e.g. "I like House music and orange." Picks one product id and shows it on the website.',
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Natural-language music + color preference" },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
];

async function writeSelection(env: Env, productId: string) {
  if (env.SELECTION) await env.SELECTION.put("current", JSON.stringify({ productId }));
}

function textResult(text: string, isError = false) {
  return { content: [{ type: "text", text }], ...(isError ? { isError: true } : {}) };
}

async function callTool(name: string, args: Record<string, unknown>, env: Env) {
  if (name === "get_products") {
    return textResult(JSON.stringify(PRODUCTS, null, 2));
  }
  if (name === "select_product") {
    const id = String(args?.productId ?? "").toUpperCase();
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return textResult(`Unknown product id: ${String(args?.productId)}`, true);
    await writeSelection(env, p.id);
    return textResult(`Selected ${p.id} (${p.genre} · ${p.color}).`);
  }
  if (name === "recommend") {
    const { genre, color } = parseQuery(String(args?.query ?? ""));
    const p = bestMatch(genre, color);
    await writeSelection(env, p.id);
    return textResult(
      `Recommended ${p.id} — ${p.genre} · ${p.color}. (parsed genre=${genre ?? "?"}, color=${color ?? "?"}). Now showing on the website.`
    );
  }
  return textResult(`Unknown tool: ${name}`, true);
}

// ─── JSON-RPC / MCP ────────────────────────────────────────────────────
const ok = (id: unknown, result: unknown) => ({ jsonrpc: "2.0", id, result });
const err = (id: unknown, code: number, message: string) => ({
  jsonrpc: "2.0",
  id,
  error: { code, message },
});

async function handleRpc(msg: any, env: Env): Promise<object | null> {
  switch (msg?.method) {
    case "initialize":
      return ok(msg.id, {
        protocolVersion: msg.params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "fadr-808", version: "1.0.0" },
      });
    case "notifications/initialized":
    case "notifications/cancelled":
      return null; // notification — no response
    case "ping":
      return ok(msg.id, {});
    case "tools/list":
      return ok(msg.id, { tools: TOOLS });
    case "tools/call":
      try {
        const r = await callTool(msg.params?.name, msg.params?.arguments ?? {}, env);
        return ok(msg.id, r);
      } catch (e: any) {
        return err(msg.id, -32603, `Tool error: ${e?.message ?? e}`);
      }
    default:
      return msg?.id !== undefined && msg?.id !== null
        ? err(msg.id, -32601, `Method not found: ${msg?.method}`)
        : null;
  }
}

// ─── CORS ──────────────────────────────────────────────────────────────
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, mcp-session-id, mcp-protocol-version",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Access-Control-Max-Age": "86400",
};

const json = (obj: unknown, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { ...CORS, "content-type": "application/json" },
  });

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    // Current selection for the website to poll.
    if (url.pathname === "/selection" && req.method === "GET") {
      const cur = env.SELECTION ? await env.SELECTION.get("current") : null;
      return new Response(cur || JSON.stringify({ productId: "P01" }), {
        headers: { ...CORS, "content-type": "application/json", "cache-control": "no-store" },
      });
    }

    // MCP Streamable HTTP endpoint.
    if (url.pathname === "/mcp") {
      if (req.method === "DELETE") return new Response(null, { status: 204, headers: CORS });
      if (req.method === "GET")
        return new Response("Method Not Allowed — use POST for Streamable HTTP.", {
          status: 405,
          headers: CORS,
        });
      if (req.method === "POST") {
        let body: any;
        try {
          body = await req.json();
        } catch {
          return json(err(null, -32700, "Parse error"), 400);
        }
        if (Array.isArray(body)) {
          const out: object[] = [];
          for (const m of body) {
            const r = await handleRpc(m, env);
            if (r) out.push(r);
          }
          return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
        }
        const r = await handleRpc(body, env);
        if (r === null) return new Response(null, { status: 202, headers: CORS });
        return json(r);
      }
    }

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        "FADR-808 MCP — Streamable HTTP at POST /mcp · selection at GET /selection",
        { headers: { ...CORS, "content-type": "text/plain" } }
      );
    }
    return new Response("Not found", { status: 404, headers: CORS });
  },
};
