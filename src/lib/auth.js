// Customer accounts with passwordless email sign-in (Supabase Auth).
// The person types their email, Supabase emails them a 6-digit code and a
// sign-in link, and either one opens the session.
//
// TEOCORS project. The publishable key is public by design (it only allows
// what the project's Auth and RLS rules allow), so it can live in the code.
// .env can override both (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
const url = import.meta.env.VITE_SUPABASE_URL || 'https://spvuebicjfoslhmnogcb.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FNji7dPeyFp4_b91FXyISg_sKW6X6D7';

/**
 * The single-file build is opened from disk or inside a preview that blocks
 * connections to other sites, so sign-in stays off there and says why.
 */
export const authPreviewOnly = import.meta.env.MODE === 'single';

/** False when sign-in can't run here; the UI explains it instead of failing. */
export const authConfigured = Boolean(url && key) && !authPreviewOnly;

let client = null;
let state = { user: null, ready: !authConfigured };
const listeners = new Set();

function set(next) {
  state = { ...state, ...next };
  listeners.forEach((fn) => fn(state));
}

async function getClient() {
  if (!authConfigured) return null;
  if (!client) {
    // Loaded on demand so visitors who never sign in don't download it.
    const { createClient } = await import('@supabase/supabase-js');
    client = createClient(url, key, { auth: { persistSession: true, detectSessionInUrl: true } });
    client.auth.onAuthStateChange((_event, session) => set({ user: session?.user ?? null, ready: true }));
  }
  return client;
}

/** Starts the session check (also finishes a sign-in link the person opened). */
export async function initAuth() {
  const c = await getClient();
  if (!c) return;
  const { data } = await c.auth.getSession();
  set({ user: data.session?.user ?? null, ready: true });
}

export const getAuthState = () => state;

export function subscribeAuth(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Supabase error codes → messages a customer can act on.
function friendly(error) {
  const msg = (error?.message || '').toLowerCase();
  if (error?.status === 429 || msg.includes('rate limit') || msg.includes('security purposes'))
    return 'Ya te enviamos un correo hace poco. Espera un minuto y vuelve a intentarlo.';
  if (msg.includes('expired') || msg.includes('invalid')) return 'El código no es válido o ya venció. Pide uno nuevo.';
  if (msg.includes('email')) return 'Revisa que el correo esté bien escrito.';
  if (msg.includes('fetch') || msg.includes('network')) return 'No hay conexión. Revisa tu internet y vuelve a intentarlo.';
  return 'No pudimos completar el inicio de sesión. Intenta de nuevo en un momento.';
}

/** Emails the person a 6-digit code and a sign-in link. */
export async function sendSignInEmail(email) {
  const c = await getClient();
  if (!c) return { error: 'El inicio de sesión aún no está conectado.' };
  const { error } = await c.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname },
  });
  return { error: error ? friendly(error) : null };
}

/** Checks the 6-digit code from the email. */
export async function verifyCode(email, token) {
  const c = await getClient();
  if (!c) return { error: 'El inicio de sesión aún no está conectado.' };
  const { error } = await c.auth.verifyOtp({ email, token, type: 'email' });
  return { error: error ? friendly(error) : null };
}

export async function signOut() {
  const c = await getClient();
  await c?.auth.signOut();
  set({ user: null });
}

/** Short account number shown in the header, e.g. "003.201", stable per user. */
export function accountId(user) {
  if (!user) return '';
  let h = 0;
  for (const ch of user.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const n = String(h % 1000000).padStart(6, '0');
  return `${n.slice(0, 3)}.${n.slice(3)}`;
}
