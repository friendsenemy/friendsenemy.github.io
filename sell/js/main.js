/* =========================================================
   PropertyOptions — Main JavaScript
   ========================================================= */

// ---- Mobile nav toggle ----
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      const a = this.nextElementSibling;
      if (a) {
        a.style.display = a.style.display === 'block' ? 'none' : 'block';
        this.querySelector('.faq-icon').textContent =
          a.style.display === 'block' ? '−' : '+';
      }
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Form handling (Formspree AJAX) ----
  const forms = document.querySelectorAll('.lead-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const data = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          const success = form.nextElementSibling;
          if (success && success.classList.contains('success-msg')) {
            form.style.display = 'none';
            success.style.display = 'block';
          } else {
            form.innerHTML = '<div class="success-msg" style="display:block">✅ Thank you! We\'ll be in touch within 24 hours.</div>';
          }
        } else {
          btn.textContent = originalText;
          btn.disabled = false;
          alert('Something went wrong. Please try again or call us directly.');
        }
      })
      .catch(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Connection error. Please try again.');
      });
    });
  });

  // ---- Scroll to form on CTA click ----
  document.querySelectorAll('[data-scroll-to-form]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const form = document.querySelector('#lead-form, .lead-form, .hero-form-card');
      if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ---- Passive scroll watcher for nav shrink ----
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 40
        ? '0 4px 20px rgba(0,0,0,0.35)'
        : '0 2px 15px rgba(0,0,0,0.25)';
    }, { passive: true });
  }
});
