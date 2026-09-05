(() => {
  const body = document.body;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('.nav-links');

  try {
    if (localStorage.getItem('rw-theme') === 'dark') body.classList.add('dark');
  } catch (_) {}

  themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    try { localStorage.setItem('rw-theme', body.classList.contains('dark') ? 'dark' : 'light'); } catch (_) {}
  });

  menuBtn?.addEventListener('click', () => {
    nav?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', nav?.classList.contains('open') ? 'true' : 'false');
  });

  document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => nav?.classList.remove('open')));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('[data-count]').forEach(el => {
    const end = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    let done = false;
    const countObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || done) return;
      done = true;
      const start = performance.now();
      const duration = 1100;
      const step = now => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(end * eased).toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.disconnect();
    }, { threshold: .5 });
    countObserver.observe(el);
  });

  const form = document.querySelector('[data-contact-form]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const batch = (data.get('batch') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    const text = `Hello, I'm ${name || 'a student/parent'}${batch ? ` (${batch})` : ''}. ${message || 'I would like to know more about Raj Wijesinghe\'s Combined Mathematics classes.'}`;
    window.open(`https://wa.me/94715588448?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
