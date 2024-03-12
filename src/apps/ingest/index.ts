import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { ingestLlama } from "@src/chains/llama_ingest";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

/**
 * [POST] http://localhost:PORT/ingest/data
 */
app.post("/data", async (c) => {
  const body = await c.req.parseBody()
  const file = (body['file'] ?? undefined) as File
  if (!file) return c.json({ error: 'File' })
  await ingestLlama({ AI: c.env.AI, VECTORIZE_INDEX: c.env.VECTORIZE_INDEX }, file);
  return c.json({ status: true }, 201);
});

export default app;