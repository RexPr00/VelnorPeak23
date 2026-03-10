const body = document.body;
const lockScroll = (lock) => { body.style.overflow = lock ? 'hidden' : ''; };

const trapFocus = (container, closeFn) => {
  const selectors = 'a[href], button, input, summary, [tabindex]:not([tabindex="-1"])';
  const focusables = [...container.querySelectorAll(selectors)].filter(el => !el.disabled);
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFn();
    if (e.key !== 'Tab' || focusables.length === 0) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  first?.focus();
};

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});
document.addEventListener('click', (e) => {
  document.querySelectorAll('.lang').forEach((wrap) => {
    if (!wrap.contains(e.target)) wrap.classList.remove('open');
  });
});

const drawer = document.getElementById('mobileDrawer');
const openBtn = document.getElementById('drawerOpen');
const closeBtn = document.getElementById('drawerClose');
const closeDrawer = () => { drawer.classList.remove('open'); lockScroll(false); openBtn.focus(); };
openBtn?.addEventListener('click', () => {
  drawer.classList.add('open');
  lockScroll(true);
  trapFocus(drawer.querySelector('.mobile-panel'), closeDrawer);
});
closeBtn?.addEventListener('click', closeDrawer);
drawer?.querySelector('.mobile-backdrop')?.addEventListener('click', closeDrawer);

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  item.querySelector('summary')?.addEventListener('click', () => {
    faqItems.forEach((other) => { if (other !== item) other.removeAttribute('open'); });
  });
});

const modal = document.getElementById('privacyModal');
const openPrivacy = document.querySelectorAll('[data-open-privacy]');
const closePrivacy = () => { modal.classList.remove('open'); lockScroll(false); };
openPrivacy.forEach((el) => el.addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.add('open');
  lockScroll(true);
  trapFocus(modal.querySelector('.modal-panel'), closePrivacy);
}));
modal?.addEventListener('click', (e) => { if (e.target === modal) closePrivacy(); });
document.querySelectorAll('[data-close-privacy]').forEach((el) => el.addEventListener('click', closePrivacy));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closePrivacy(); });

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
