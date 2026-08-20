import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-396b4849/health", (c) => {
  return c.json({ status: "ok" });
});

// --- Helpers ---

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Reads the app session token from the request body field "_session"
async function getSessionFromBody(body: Record<string, any>) {
  const token = body._session;
  if (!token) return null;
  const session = await kv.get(`session:${token}`);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    await kv.del(`session:${token}`);
    return null;
  }
  return { ...session, token };
}

// --- Auth routes ---

app.post("/make-server-396b4849/auth/signup", async (c) => {
  const body = await c.req.json();
  const { name, email, password } = body;
  if (!name || !email || !password) {
    return c.json({ error: "Name, email, and password are required." }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: "Password must be at least 6 characters." }, 400);
  }
  const key = `user:email:${email.toLowerCase()}`;
  const existing = await kv.get(key);
  if (existing) {
    return c.json({ error: "An account with this email already exists." }, 409);
  }
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await kv.set(key, { id: userId, name, email: email.toLowerCase(), passwordHash });
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  await kv.set(`session:${token}`, { userId, email: email.toLowerCase(), name, expiresAt });
  return c.json({ token, user: { id: userId, name, email: email.toLowerCase() } });
});

app.post("/make-server-396b4849/auth/login", async (c) => {
  const body = await c.req.json();
  const { email, password } = body;
  if (!email || !password) {
    return c.json({ error: "Email and password are required." }, 400);
  }
  const user = await kv.get(`user:email:${email.toLowerCase()}`);
  if (!user) {
    return c.json({ error: "Invalid email or password." }, 401);
  }
  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return c.json({ error: "Invalid email or password." }, 401);
  }
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  await kv.set(`session:${token}`, { userId: user.id, email: user.email, name: user.name, expiresAt });
  return c.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Session token passed in body as { _session }
app.post("/make-server-396b4849/auth/logout", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const session = await getSessionFromBody(body);
  if (session) {
    await kv.del(`session:${session.token}`);
  }
  return c.json({ ok: true });
});

app.post("/make-server-396b4849/auth/me", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const session = await getSessionFromBody(body);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ user: { id: session.userId, name: session.name, email: session.email } });
});

// --- User data routes (all POST, session in body) ---

app.post("/make-server-396b4849/user/cart", async (c) => {
  const body = await c.req.json();
  const session = await getSessionFromBody(body);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  const items = (await kv.get(`cart:${session.userId}`)) ?? [];
  return c.json({ items });
});

app.post("/make-server-396b4849/user/cart/save", async (c) => {
  const body = await c.req.json();
  const session = await getSessionFromBody(body);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  await kv.set(`cart:${session.userId}`, body.items ?? []);
  return c.json({ ok: true });
});

app.post("/make-server-396b4849/user/wishlist", async (c) => {
  const body = await c.req.json();
  const session = await getSessionFromBody(body);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  const items = (await kv.get(`wishlist:${session.userId}`)) ?? [];
  return c.json({ items });
});

app.post("/make-server-396b4849/user/wishlist/save", async (c) => {
  const body = await c.req.json();
  const session = await getSessionFromBody(body);
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  await kv.set(`wishlist:${session.userId}`, body.items ?? []);
  return c.json({ ok: true });
});

Deno.serve(app.fetch);
