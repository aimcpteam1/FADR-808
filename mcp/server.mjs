#!/usr/bin/env node
/**
 * FADR-808 MCP server.
 *
 * Lets Claude Desktop recommend a speaker from natural-language taste input.
 * Claude queries products.json and writes the chosen product id to
 * public/selection.json, which the website polls to swap the displayed image.
 *
 * Tools:
 *   - get_products       → returns products.json (so Claude can browse/match)
 *   - select_product     → writes a specific product id to selection.json
 *   - recommend          → parses a free-text query, picks the best id, writes it
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_PATH = join(__dirname, "..", "src", "data", "products.json");
const SELECTION_PATH = join(__dirname, "..", "public", "selection.json");

const loadProducts = () => JSON.parse(readFileSync(PRODUCTS_PATH, "utf8"));

const GENRES = ["House", "EDM", "Techno", "Trance", "DnB", "Garage"];

// color synonyms → canonical color name used in products.json
const COLOR_SYNONYMS = {
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

const GENRE_SYNONYMS = {
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

function parseQuery(q) {
  const s = q.toLowerCase();
  let genre = null;
  for (const [k, v] of Object.entries(GENRE_SYNONYMS)) {
    if (s.includes(k)) { genre = v; break; }
  }
  let color = null;
  for (const [k, v] of Object.entries(COLOR_SYNONYMS)) {
    if (new RegExp(`\\b${k}\\b`).test(s)) { color = v; break; }
  }
  return { genre, color };
}

/** Genre-weighted scoring; always returns a product. */
function bestMatch(products, genre, color) {
  let best = products[0];
  let bestScore = -1;
  for (const p of products) {
    const score = (genre && p.genre === genre ? 2 : 0) + (color && p.color === color ? 1 : 0);
    if (score > bestScore) { bestScore = score; best = p; }
  }
  return best;
}

function writeSelection(productId) {
  writeFileSync(SELECTION_PATH, JSON.stringify({ productId }) + "\n");
}

const server = new McpServer({ name: "fadr-808", version: "1.0.0" });

server.tool(
  "get_products",
  "Return the full FADR-808 product catalog (products.json: id, genre, color, image).",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(loadProducts(), null, 2) }],
  })
);

server.tool(
  "select_product",
  "Display a specific FADR-808 product on the website. Pass its id (P01–P27).",
  { productId: z.string().describe("Product id, e.g. P27") },
  async ({ productId }) => {
    const products = loadProducts();
    const p = products.find((x) => x.id === productId.toUpperCase());
    if (!p) {
      return { content: [{ type: "text", text: `Unknown product id: ${productId}` }], isError: true };
    }
    writeSelection(p.id);
    return { content: [{ type: "text", text: `Selected ${p.id} (${p.genre} · ${p.color}).` }] };
  }
);

server.tool(
  "recommend",
  'Recommend a FADR-808 from free-text taste, e.g. "I like House music and orange." Picks one product id and shows it on the website.',
  { query: z.string().describe("Natural-language music + color preference") },
  async ({ query }) => {
    const products = loadProducts();
    const { genre, color } = parseQuery(query);
    const p = bestMatch(products, genre, color);
    writeSelection(p.id);
    return {
      content: [
        {
          type: "text",
          text:
            `Recommended ${p.id} — ${p.genre} · ${p.color}.` +
            ` (parsed genre=${genre ?? "?"}, color=${color ?? "?"}). Now showing on the website.`,
        },
      ],
    };
  }
);

await server.connect(new StdioServerTransport());
