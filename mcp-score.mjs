// Minimal MCP server: company data for your AI agent via the S.C.A.L.A. Score API.
// Run: SCORE_API_KEY=sk_... node mcp-score.mjs   (deps: npm i @modelcontextprotocol/sdk zod)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE = "https://score.get-scala.com/api/v1";
const KEY = process.env.SCORE_API_KEY;
if (!KEY) { console.error("Set SCORE_API_KEY (free key: https://score.get-scala.com/api/free-key)"); process.exit(1); }

async function call(path, params = {}) {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  const res = await fetch(url, { headers: { "X-API-Key": KEY } });
  const text = await res.text();
  return { content: [{ type: "text", text: res.ok ? text : `HTTP ${res.status}: ${text}` }], isError: !res.ok };
}

const server = new McpServer({ name: "score-company-data", version: "0.1.0" });

server.registerTool("search_companies", {
  description: "Search companies by name (prefix match) or by tax/VAT id. 1 credit per call. Check revenue_type: 'reported' = filed accounts, 'estimated' = model estimate.",
  inputSchema: { q: z.string().optional(), tax_id: z.string().optional(), country: z.string().length(2).optional(), limit: z.number().int().min(1).max(100).optional() },
}, (a) => call("/search", a));

server.registerTool("get_company", {
  description: "Full profile for a company id returned by search_companies (includes revenue_type, revenue_confidence, source). 1 credit.",
  inputSchema: { id: z.string() },
}, ({ id }) => call("/company/" + encodeURIComponent(id)));

server.registerTool("get_usage", { description: "Remaining credits for this key (free).", inputSchema: {} }, () => call("/usage"));

await server.connect(new StdioServerTransport());
