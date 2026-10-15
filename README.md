# Quickstart: company data for your AI agent in 5 minutes

1. Get a free key (50 calls/month, no card): https://score.get-scala.com/api/free-key
2. Try it:
```bash
export SCORE_API_KEY=sk_score_...
curl -H "X-API-Key: $SCORE_API_KEY" "https://score.get-scala.com/api/v1/search?tax_id=IT00159560366&limit=1"
curl -H "X-API-Key: $SCORE_API_KEY" "https://score.get-scala.com/api/v1/usage"
```
3. Know what you get: call `/api/v1/company/{id}` and read `revenue_type` (`reported` = filed accounts, `estimated` = model estimate) and `revenue_confidence`. Search results alone don't carry it.
4. Give it to your agent (MCP, stdio):
```bash
npm i @modelcontextprotocol/sdk zod
SCORE_API_KEY=sk_score_... node mcp-score.mjs
```
Claude Desktop / Claude Code config: `{"mcpServers":{"score":{"command":"node","args":["/path/mcp-score.mjs"],"env":{"SCORE_API_KEY":"sk_score_..."}}}}`
Tools: `search_companies` (name or tax id, optional country), `get_company`, `get_usage`.
Each call = 1 credit. Free key: 50/month. Paid packs: one-time credits (500 = €15, 2,000 = €39), no subscription. Redistribution: keep the `data_licences` attribution.

Data licences: responses include a `data_licences` block; keep the attribution when you redistribute data. Financials are returned only for FR, NO, LT, EE, LV, CO.
