/* Property review form for /sell/. Progressive enhancement: without JS the form posts normally to Formspree. */
(function () {
  var form = document.getElementById('sl-form');
  if (!form) return;
  var card = form.closest('.sl-form-card');
  var steps = [].slice.call(form.querySelectorAll('.sl-step'));
  var prog = card.querySelector('.sl-progress');
  var progItems = prog ? [].slice.call(prog.querySelectorAll('li')) : [];
  var btnBack = form.querySelector('.sl-back');
  var btnNext = form.querySelector('.sl-next');
  var btnSubmit = form.querySelector('.sl-submit');
  var errBox = form.querySelector('.sl-error');
  var done = card.querySelector('.sl-done');
  var loadedAt = Date.now();
  var cur = 0;
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  function $(id) { return document.getElementById(id); }
  function val(id) { var el = $(id); return el && !el.disabled ? (el.value || '').trim() : ''; }

  /* ---------- conditional fields ---------- */
  function showIf(key, on) {
    var box = form.querySelector('[data-show="' + key + '"]');
    if (!box) return;
    box.hidden = !on;
    box.querySelectorAll('input,select,textarea').forEach(function (el) { el.disabled = !on; });
  }
  function updateConditions() {
    var reason = val('f-reason'), rel = val('f-rel'), occ = val('f-occ'), mort = val('f-mort');
    var heirish = /^(Heir|Estate representative|Authorized agent|Other)/.test(rel);
    showIf('decision', heirish || occ === 'Another family member or co-owner' || /^(Inheritance|Title)/.test(reason));
    showIf('probate', /^(Inheritance|Title)/.test(reason) || /^(Heir|Estate representative)/.test(rel));
    showIf('debt', mort === 'Low balance' || mort === 'Substantial balance' || /^Unpaid/.test(reason));
    var unknown = $('f-noaddr').checked;
    form.querySelectorAll('[data-addr]').forEach(function (box) {
      box.hidden = unknown;
      box.querySelectorAll('input').forEach(function (el) { el.disabled = unknown; });
    });
    var opt = form.querySelector('[data-city-opt]');
    if (opt) opt.hidden = !unknown;
  }

  /* ---------- validation ---------- */
  function clearErr() {
    errBox.hidden = true; errBox.textContent = '';
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
  }
  function labelOf(el) {
    var l = el.id && form.querySelector('label[for="' + el.id + '"]');
    return l ? l.textContent.replace(/\(.*?\)/g, '').trim() : el.name;
  }
  function fail(el, msg) {
    el.setAttribute('aria-invalid', 'true');
    errBox.textContent = msg; errBox.hidden = false;
    el.focus();
    return false;
  }
  function validateStep(i) {
    clearErr();
    var step = steps[i];
    var addrKnown = !$('f-noaddr').checked;
    var fields = [].slice.call(step.querySelectorAll('input,select,textarea')).filter(function (el) {
      return !el.disabled && !el.closest('[hidden]') && el.type !== 'hidden' && el.type !== 'checkbox';
    });
    for (var k = 0; k < fields.length; k++) {
      var el = fields[k], v = (el.value || '').trim();
      var need = el.required || (addrKnown && (el.id === 'f-street' || el.id === 'f-zip'));
      if (need && !v) return fail(el, 'Please fill in: ' + labelOf(el) + (el.id === 'f-street' ? '. If you\'re not sure of it, tick "I don\'t know the exact address."' : '.'));
      if (v && el.id === 'f-zip' && !/^\d{5}(-\d{4})?$/.test(v)) return fail(el, 'Please enter a 5-digit ZIP code, or tick "I don\'t know the exact address."');
    }
    if (step.dataset.step === '3') {
      var ph = val('f-phone'), em = val('f-email');
      if (!ph && !em) return fail($('f-phone'), 'Please give us a phone number or an email address, whichever you prefer.');
      if (ph && ph.replace(/\D/g, '').length < 10) return fail($('f-phone'), 'Please check the phone number, including the area code.');
      if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return fail($('f-email'), 'Please check the email address.');
    }
    return true;
  }

  /* ---------- steps ---------- */
  function go(i, focus) {
    cur = i;
    steps.forEach(function (s, n) { s.classList.toggle('is-on', n === i); });
    progItems.forEach(function (li, n) {
      li.classList.toggle('is-on', n === i);
      li.classList.toggle('is-done', n < i);
      if (n === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    btnBack.hidden = i === 0;
    btnNext.hidden = i === steps.length - 1;
    btnSubmit.hidden = i !== steps.length - 1;
    if (focus) {
      var first = steps[i].querySelector('legend');
      card.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      var f = steps[i].querySelector('select:not([disabled]),input:not([type=hidden]):not([disabled])');
      if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 250);
    }
  }

  /* ---------- draft (so nothing is lost on a refresh or failed send) ---------- */
  var DRAFT = 'sl_draft';
  function saveDraft() {
    var d = {};
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      if (!el.name || el.type === 'hidden' || el.name === '_gotcha') return;
      d[el.name] = el.type === 'checkbox' ? el.checked : el.value;
    });
    store.set(DRAFT, JSON.stringify(d));
  }
  function loadDraft() {
    var d; try { d = JSON.parse(store.get(DRAFT) || 'null'); } catch (e) { d = null; }
    if (!d) return;
    Object.keys(d).forEach(function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      if (!el || el.type === 'hidden') return;
      if (el.type === 'checkbox') el.checked = !!d[n]; else el.value = d[n];
    });
  }

  /* ---------- internal priority (sent with the lead, never shown on the page) ---------- */
  function priority() {
    var t = val('f-time'), occ = val('f-occ'), rel = val('f-rel'), dec = val('f-dec'), prob = val('f-prob'), mort = val('f-mort');
    var notes = [], complex = false;
    if (dec === 'No') { complex = true; notes.push('not all decision-makers willing'); }
    if (/^Later/.test(t)) { complex = true; notes.push('researching, no current plan to sell'); }
    if (occ === 'Another family member or co-owner') notes.push('occupied by family/co-owner');
    if (occ === 'A tenant') notes.push('tenant-occupied');
    if (occ === 'Not sure') notes.push('occupancy unknown');
    if (mort === 'Substantial balance') notes.push('substantial mortgage: equity unverified');
    if (!mort || mort === 'Not sure') notes.push('mortgage unknown');
    if (prob === 'No') notes.push('probate not opened');
    if (prob === 'Not sure') notes.push('probate status unknown');
    if (dec === 'Not sure') notes.push('cooperation unclear');
    if (/^Within 1/.test(t)) notes.push('1-3 month timeline');
    if ($('f-noaddr').checked) notes.push('address not known');
    if (complex) return ['COMPLEX', notes];
    var soon = t === 'Immediately' || t === 'Within 30 days';
    var deliverable = occ === 'Vacant' || occ === 'I live there';
    var authority = /^(Owner|Estate representative|Authorized agent)/.test(rel) || dec === 'Yes';
    var cooperative = dec === '' || dec === 'Yes' || dec === 'Not applicable';
    var equity = mort === 'No mortgage / paid off' || mort === 'Low balance';
    var manageable = prob !== 'Not sure';
    if (soon && deliverable && authority && cooperative && equity && manageable) return ['HIGH', notes];
    return ['REVIEW', notes];
  }

  /* ---------- duplicate guard ---------- */
  function fingerprint() {
    return [val('f-name'), val('f-phone').replace(/\D/g, ''), val('f-email').toLowerCase(), val('f-street').toLowerCase(), val('f-city').toLowerCase(), val('f-state')].join('|');
  }

  /* ---------- conversion (success only; no personal data) ---------- */
  function conversion(p, done) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form_id: 'sell-property-review', lead_priority: p, transport_type: 'beacon', event_callback: done || function () {}, event_timeout: 1000 });
      (window.ppLeadConversionHooks || []).forEach(function (fn) { try { fn({ form: 'sell-property-review' }); } catch (e) {} });
      document.dispatchEvent(new CustomEvent('pp:lead', { detail: { form: 'sell-property-review' } }));
    } catch (e) {}
  }

  function showDone(already) {
    form.hidden = true;
    if (prog) prog.hidden = true;
    card.querySelector('.sl-form-h').hidden = true;
    card.querySelector('.sl-form-intro').hidden = true;
    if (already) done.querySelector('h2').textContent = 'We already have your request.';
    done.hidden = false;
    done.focus();
  }

  var sending = false, baseSubject = null;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    for (var i = 0; i < steps.length; i++) { if (!validateStep(i)) { go(i, false); validateStep(i); return; } }
    if (form.querySelector('[name="_gotcha"]').value || Date.now() - loadedAt < 3000) { showDone(false); return; }
    var fp = fingerprint(), prev = store.get('sl_sent');
    if (prev) { try { prev = JSON.parse(prev); } catch (x) { prev = null; } }
    if (prev && prev.fp === fp && Date.now() - prev.t < 30 * 60 * 1000) { showDone(true); return; }

    var pr = priority();
    form.querySelector('[name="lead_priority"]').value = pr[0] === 'HIGH' ? 'HIGH PRIORITY' : pr[0] === 'COMPLEX' ? 'COMPLEX / LOWER PRIORITY' : 'NEEDS REVIEW';
    form.querySelector('[name="priority_notes"]').value = pr[1].join('; ');
    var subj = form.querySelector('[name="_subject"]');
    if (baseSubject === null) baseSubject = subj.value;
    var tag = (baseSubject.match(/^(\[[^\]]*\]\s*)+/) || [''])[0];
    subj.value = '[' + pr[0] + '] ' + tag + 'Property review: ' + (val('f-state') || 'state?') + ', ' + (val('f-reason') || 'reason?') + ', ' + (val('f-time') || 'timeline?');

    /* Formspree reCAPTCHA is on (it blocks spam bots that post straight to Formspree), so send the normal way.
       Set data-ajax="on" on the form only if reCAPTCHA is ever turned off. */
    if (!window.fetch || !window.FormData || form.dataset.ajax !== 'on') {
      sending = true; btnSubmit.setAttribute('aria-disabled', 'true'); btnSubmit.textContent = 'Sending…';
      nativeSubmit(); return;
    }
    sending = true;
    btnSubmit.setAttribute('aria-disabled', 'true');
    var label = 'Request My Property Review';
    btnSubmit.textContent = 'Sending…';
    function nativeSubmit() {
      /* Free Formspree plan: reCAPTCHA is on and visitors end on Formspree's own "Thanks" page, never ours,
         so the lead is counted here, once the completed form is actually being sent. */
      store.set('sl_sent', JSON.stringify({ fp: fp, t: Date.now() }));
      store.del(DRAFT);
      var sent = false;
      function go() { if (sent) return; sent = true; HTMLFormElement.prototype.submit.call(form); }
      conversion(pr[0], go);
      setTimeout(go, 1200);
    }
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) { var e = new Error('status ' + r.status); e.http = r.status; throw e; } return r; })
      .then(function () {
        store.set('sl_sent', JSON.stringify({ fp: fp, t: Date.now() }));
        store.del(DRAFT);
        conversion(pr[0]);
        showDone(false);
      })
      .catch(function (err) {
        if (err && err.http) { nativeSubmit(); return; }
        sending = false;
        btnSubmit.removeAttribute('aria-disabled');
        btnSubmit.textContent = label;
        errBox.textContent = 'Sorry, your request didn\'t go through. Your answers are still here, so please try again. If it keeps happening, call (227) 235-9530 or email pagesofpurposellc@gmail.com.';
        errBox.hidden = false;
        errBox.focus && errBox.setAttribute('tabindex', '-1');
        errBox.focus();
      });
  });

  /* ---------- init ---------- */
  form.noValidate = true;
  card.classList.add('sl-js');
  if (prog) prog.hidden = false;
  loadDraft();
  updateConditions();
  form.addEventListener('change', function () { updateConditions(); saveDraft(); });
  form.addEventListener('input', saveDraft);
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && cur < steps.length - 1) { e.preventDefault(); btnNext.click(); }
  });
  btnNext.addEventListener('click', function () { if (validateStep(cur)) go(cur + 1, true); });
  btnBack.addEventListener('click', function () { clearErr(); go(cur - 1, true); });
  go(0, false);
})();
