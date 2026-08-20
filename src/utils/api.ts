// Full localStorage-based auth and persistence.
// Same async API surface as the server-backed version so App.tsx needs no changes.
// Works in sandboxed iframes with no network calls whatsoever.

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

// ─── Storage keys ────────────────────────────────────────────────────────────

const USERS_KEY = "grocers_users";
const SESSION_KEY = "grocers_session";
const cartKey = (userId: string) => `grocers_cart_${userId}`;
const wishlistKey = (userId: string) => `grocers_wishlist_${userId}`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface StoredSession {
  token: string;
  userId: string;
  name: string;
  email: string;
  expiresAt: number;
}

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s: StoredSession = JSON.parse(raw);
    if (s.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function writeSession(s: StoredSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function makeToken(): string {
  return crypto.randomUUID();
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function signup(name: string, email: string, password: string): Promise<AuthUser> {
  const users = readUsers();
  const normalised = email.toLowerCase().trim();
  if (users.find((u) => u.email === normalised)) {
    throw new Error("An account with this email already exists.");
  }
  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();
  const newUser: StoredUser = { id, name: name.trim(), email: normalised, passwordHash };
  writeUsers([...users, newUser]);
  const session: StoredSession = {
    token: makeToken(),
    userId: id,
    name: name.trim(),
    email: normalised,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  writeSession(session);
  return { id, name: name.trim(), email: normalised };
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const normalised = email.toLowerCase().trim();
  const users = readUsers();
  const user = users.find((u) => u.email === normalised);
  if (!user) throw new Error("Invalid email or password.");
  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) throw new Error("Invalid email or password.");
  const session: StoredSession = {
    token: makeToken(),
    userId: user.id,
    name: user.name,
    email: user.email,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  writeSession(session);
  return { id: user.id, name: user.name, email: user.email };
}

export async function logout(): Promise<void> {
  clearSession();
}

export async function getMe(): Promise<AuthUser | null> {
  const s = readSession();
  if (!s) return null;
  return { id: s.userId, name: s.name, email: s.email };
}

// ─── Cart API ─────────────────────────────────────────────────────────────────

export async function getCart(): Promise<CartItem[]> {
  const s = readSession();
  if (!s) return [];
  try {
    return JSON.parse(localStorage.getItem(cartKey(s.userId)) || "[]");
  } catch {
    return [];
  }
}

export async function saveCart(items: CartItem[]): Promise<void> {
  const s = readSession();
  if (!s) return;
  localStorage.setItem(cartKey(s.userId), JSON.stringify(items));
}

// ─── Wishlist API ─────────────────────────────────────────────────────────────

export async function getWishlist(): Promise<WishlistItem[]> {
  const s = readSession();
  if (!s) return [];
  try {
    return JSON.parse(localStorage.getItem(wishlistKey(s.userId)) || "[]");
  } catch {
    return [];
  }
}

export async function saveWishlist(items: WishlistItem[]): Promise<void> {
  const s = readSession();
  if (!s) return;
  localStorage.setItem(wishlistKey(s.userId), JSON.stringify(items));
}
