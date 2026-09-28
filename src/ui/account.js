import { openDialog } from './dialogs.js';
import {
  authConfigured,
  authPreviewOnly,
  initAuth,
  getAuthState,
  subscribeAuth,
  sendSignInEmail,
  verifyCode,
  signOut,
  accountId,
} from '../lib/auth.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_SECONDS = 60;

/**
 * "Iniciar sesión": email → code from the email (or the link in it) → account.
 * Buttons with [data-account-open] anywhere on the page open it.
 */
export function setupAccount() {
  const dialog = document.querySelector('[data-account]');
  const steps = [...dialog.querySelectorAll('[data-step]')];
  const emailForm = dialog.querySelector('[data-email-form]');
  const codeForm = dialog.querySelector('[data-code-form]');
  const emailInput = dialog.querySelector('#account-email');
  const codeInput = dialog.querySelector('#account-code');
  const emailMsg = dialog.querySelector('[data-email-msg]');
  const codeMsg = dialog.querySelector('[data-code-msg]');
  const sentTo = dialog.querySelector('[data-sent-to]');
  const resend = dialog.querySelector('[data-resend]');
  let email = '';
  let timer = 0;

  const show = (name) => {
    steps.forEach((s) => (s.hidden = s.dataset.step !== name));
    const focus = dialog.querySelector(`[data-step="${name}"] input, [data-step="${name}"] .btn`);
    requestAnimationFrame(() => focus?.focus());
  };

  const busy = (form, on, label) => {
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = on;
    btn.querySelector('span').textContent = label;
  };

  const say = (el, text, isError = true) => {
    el.textContent = text;
    el.classList.toggle('is-error', isError && !!text);
  };

  function startCooldown() {
    let left = RESEND_SECONDS;
    clearInterval(timer);
    resend.disabled = true;
    resend.textContent = `Reenviar correo (${left} s)`;
    timer = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearInterval(timer);
        resend.disabled = false;
        resend.textContent = 'Reenviar correo';
      } else {
        resend.textContent = `Reenviar correo (${left} s)`;
      }
    }, 1000);
  }

  function renderSignedIn(user) {
    dialog.querySelector('[data-user-email]').textContent = user.email;
    dialog.querySelector('[data-user-id]').textContent = accountId(user);
  }

  function open() {
    const { user } = getAuthState();
    if (!authConfigured) {
      if (authPreviewOnly) {
        dialog.querySelector('[data-setup-title]').textContent = 'Inicia sesión en la tienda publicada';
        dialog.querySelector('[data-setup-text]').textContent =
          'Esta es una vista previa y no puede enviar correos. En la página publicada en internet, aquí escribes tu correo y te llega un enlace para entrar.';
      }
      show('setup');
    }
    else if (user) {
      renderSignedIn(user);
      show('account');
    } else show('email');
    openDialog(dialog);
  }

  // Header buttons reflect the session.
  function syncButtons({ user }) {
    document.querySelectorAll('[data-account-open]').forEach((b) => {
      b.setAttribute('aria-label', user ? `Mi cuenta, ${user.email}` : 'Iniciar sesión');
      b.classList.toggle('is-signed-in', !!user);
      const label = b.querySelector('[data-account-label]');
      if (label) label.textContent = user ? 'Mi cuenta' : 'Iniciar sesión';
    });
    if (user && dialog.open) {
      renderSignedIn(user);
      show('account');
    }
  }
  subscribeAuth(syncButtons);
  syncButtons(getAuthState());

  emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    email = emailInput.value.trim().toLowerCase();
    if (!EMAIL.test(email)) {
      say(emailMsg, 'Escribe un correo válido, por ejemplo nombre@correo.com.');
      emailInput.focus();
      return;
    }
    say(emailMsg, '');
    busy(emailForm, true, 'Enviando…');
    const { error } = await sendSignInEmail(email);
    busy(emailForm, false, 'Enviar enlace');
    if (error) {
      say(emailMsg, error);
      return;
    }
    sentTo.textContent = email;
    codeInput.value = '';
    say(codeMsg, '');
    show('code');
    startCooldown();
  });

  codeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = codeInput.value.replace(/\D/g, '');
    if (code.length < 6) {
      say(codeMsg, 'El código tiene 6 dígitos. Si tu correo solo trae un enlace, tócalo para entrar.');
      codeInput.focus();
      return;
    }
    busy(codeForm, true, 'Verificando…');
    const { error } = await verifyCode(email, code);
    busy(codeForm, false, 'Entrar');
    if (error) say(codeMsg, error);
    // On success the auth listener switches to the account step.
  });

  resend.addEventListener('click', async () => {
    const { error } = await sendSignInEmail(email);
    say(codeMsg, error || 'Te enviamos un correo nuevo.', !!error);
    if (!error) startCooldown();
  });

  dialog.querySelector('[data-change-email]').addEventListener('click', () => {
    clearInterval(timer);
    show('email');
  });

  dialog.querySelector('[data-sign-out]').addEventListener('click', async () => {
    await signOut();
    emailInput.value = '';
    show('email');
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-account-open]')) open();
  });

  // Read before Supabase consumes the URL: did they arrive from the email link?
  const back = location.hash + location.search;
  const cameFromLink = /access_token|type=magiclink|[?&]code=/.test(back);
  const linkError = /error_code=/.test(back);

  initAuth().then(() => {
    if (cameFromLink || linkError) history.replaceState(null, '', location.pathname);
    if (getAuthState().user && cameFromLink) open();
    else if (linkError) {
      open();
      say(emailMsg, 'Ese enlace ya venció o ya se usó. Escribe tu correo y te enviamos uno nuevo.');
    }
  });

  return { open };
}
