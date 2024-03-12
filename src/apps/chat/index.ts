import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { buildLlamaChainQA } from "@src/chains/llama_chain_qa";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

/**
 * Ruta llama
 * [POST] http://localhost:PORT/chat/llama -d {question, name}
 */
app.post("/llama", async (c) => {
  const { question } = await c.req.json();

  if (!question) return c.json({ error: 'QUESTION' })

  console.log({ a: c.env })

  const chain = await buildLlamaChainQA({
    cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
    ai: c.env.AI,
    vectorize: c.env.VECTORIZE_INDEX
  });

  const result = await chain.invoke(question);
  return c.json(result, 201);
});



export default app;
