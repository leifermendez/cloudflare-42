import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import chatApp from "./apps/chat";
import ingestApp from "./apps/ingest";

const app = new OpenAPIHono();

app.use("/*", cors());

app.route("/chat", chatApp);

app.route("/ingest", ingestApp);

export default app;
