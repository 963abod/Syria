// ui.js — the slide-in fullscreen menu

const menu = document.getElementById('menu');
const backdrop = document.getElementById('menu-backdrop');
const openBtn = document.getElementById('menu-open');
const closeBtn = document.getElementById('menu-close');

let isOpen = false;
let lastFocused = null;

function focusableElements() {
  return Array.from(
    menu.querySelectorAll('a[href], button:not([disabled])')
  );
}

function setMenu(open) {
  isOpen = open;

  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');

  document.body.style.overflow = open ? 'hidden' : '';

  if (open) {
    lastFocused = document.activeElement;
    const focusables = focusableElements();
    if (focusables.length) focusables[0].focus();
  } else if (lastFocused) {
    lastFocused.focus();
    lastFocused = null;
  }
}

openBtn.addEventListener('click', () => setMenu(true));
closeBtn.addEventListener('click', () => setMenu(false));
backdrop.addEventListener('click', () => setMenu(false));

document.addEventListener('keydown', (event) => {
  if (!isOpen) return;

  if (event.key === 'Escape') {
    setMenu(false);
    return;
  }

  if (event.key === 'Tab') {
    const focusables = focusableElements();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
