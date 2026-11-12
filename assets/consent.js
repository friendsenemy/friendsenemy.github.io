/* Pages of Purpose: site measurement and advertising tags, with notice and opt-out.
   - Google Analytics loads on every page.
   - Microsoft Clarity and the Meta Pixel load after the visitor has been shown a notice and keeps using
     the site (scroll, click, key press, "Got it", or 8 seconds with the notice on screen).
     Ad landing pages marked <meta name="pp-tags" content="immediate"> load them when the page opens,
     with the notice still shown.
     Returning visitors who already saw the notice load them right away.
   - Global Privacy Control and Do Not Track signals are honored: Clarity and Meta never load.
   - "Your privacy choices" (footer) lets anyone opt out or back in. Choice is kept in localStorage.
   - Meta automatic configuration (button/form scraping) is turned off and no form contents,
     names, emails or phone numbers are ever sent to Meta. */
(function(){
  var PIXEL_ID = '1982419396051400';
  var CLARITY_ID = 'z7m35nfn7s';
  var GA_ID = 'G-1EYF11Z492';
  var KEY = 'pp_consent_v2';           /* 'ack' = notice seen, 'no' = opted out */
  var nav = navigator;
  var signal = nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1';

  function get(){ try { return localStorage.getItem(KEY) || (localStorage.getItem('pp_consent_v1') === 'no' ? 'no' : null); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  /* Google Analytics (every page) */
  if (!document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ dataLayer.push(arguments); };
    gtag('js', new Date()); gtag('config', GA_ID);
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(g);
  }

  var tagsOn = false;
  function loadTags(){
    if (tagsOn || signal || get() === 'no') return;
    tagsOn = true;
    /* Microsoft Clarity: heat maps and session recordings; form inputs are masked */
    if (!window.clarity) {
      (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",CLARITY_ID);
    }
    /* Meta Pixel: page views only, no automatic data collection, no advanced matching */
    if (/^\d{6,}$/.test(PIXEL_ID) && !window.fbq) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('set', 'autoConfig', false, PIXEL_ID);
      fbq('init', PIXEL_ID);
      fbq('track', 'PageView');
    }
  }

  /* Lead and phone-click events carry no personal data */
  document.addEventListener('submit', function(){
    if (window.fbq && tagsOn) { try { fbq('track', 'Lead'); } catch(e){} }
  }, true);
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="tel:"]');
    if (!a) return;
    if (window.gtag) { try { gtag('event', 'phone_click'); } catch(x){} }
    if (window.fbq && tagsOn) { try { fbq('track', 'Contact'); } catch(x){} }
  }, true);

  var css = '#pp-cb{position:fixed;left:10px;right:10px;bottom:10px;z-index:9999;max-width:760px;margin:0 auto;background:#14213A;color:#fff;border-top:2px solid #C9A44C;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.22);padding:10px 12px;font:14px/1.45 inherit;font-family:inherit;display:flex;align-items:center;gap:8px 14px;flex-wrap:wrap}'
    + '#pp-cb p{margin:0;color:#E6EAF0;flex:1 1 260px}#pp-cb a{color:#E9D59B;text-decoration:underline}'
    + '#pp-cb .pp-cb-b{display:flex;gap:6px;align-items:center;flex:0 0 auto}'
    + '#pp-cb button{font:inherit;font-weight:600;border-radius:4px;cursor:pointer;min-height:44px}'
    + '#pp-cb .pp-y{background:#C9A44C;color:#14213A;border:1px solid #C9A44C;padding:8px 22px}'
    + '#pp-cb .pp-n{background:transparent;color:#E6EAF0;border:0;padding:8px 10px;font-weight:500;text-decoration:underline}'
    + '#pp-cb.pp-panel{display:block;padding:14px 16px}#pp-cb.pp-panel p{margin:0 0 10px}'
    + '#pp-cb.pp-panel .pp-n{border:1px solid rgba(255,255,255,.45);text-decoration:none;padding:8px 16px}'
    + '#pp-cb button:focus-visible{outline:2px solid #fff;outline-offset:2px}';

  function addCss(){
    if (document.getElementById('pp-cb-css')) return;
    var st = document.createElement('style'); st.id = 'pp-cb-css'; st.textContent = css; document.head.appendChild(st);
  }

  function notice(){
    if (document.getElementById('pp-cb')) return;
    addCss();
    var d = document.createElement('div');
    d.id = 'pp-cb'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Privacy notice');
    d.innerHTML = '<p>We use cookies to measure visits and show our ads. By continuing, you agree to our <a href="/privacy-policy.html#tracking">Privacy Policy</a> and <a href="/terms.html">Terms</a>.</p>'
      + '<div class="pp-cb-b"><button type="button" class="pp-y">Got it</button><button type="button" class="pp-n">Opt out</button></div>';
    document.body.appendChild(d);
    d.querySelector('.pp-y').onclick = function(){ stop(); set('ack'); d.remove(); loadTags(); };
    d.querySelector('.pp-n').onclick = function(){ stop(); set('no'); d.remove(); if (tagsOn) location.reload(); };
    var go = function(e){
      if (e && e.target && e.target.closest && e.target.closest('#pp-cb')) return;  /* clicks on the notice itself decide via its buttons */
      stop(); if (get() !== 'no' && document.getElementById('pp-cb')) { set('ack'); loadTags(); }
    };
    var evs = ['scroll','click','keydown','touchstart'];
    function stop(){ evs.forEach(function(ev){ window.removeEventListener(ev, go, true); }); clearTimeout(timer); }
    evs.forEach(function(ev){ window.addEventListener(ev, go, { passive: true, capture: true }); });
    var timer = setTimeout(go, 8000);
  }

  function choices(){
    addCss();
    var old = document.getElementById('pp-cb'); if (old) old.remove();
    var d = document.createElement('div');
    d.id = 'pp-cb'; d.className = 'pp-panel'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Your privacy choices');
    var off = get() === 'no' || signal;
    d.innerHTML = '<p><strong>Your privacy choices.</strong> '
      + (signal ? 'Your browser is sending a privacy signal (Global Privacy Control or Do Not Track), so Microsoft Clarity and the Meta Pixel are already off for you. '
                : (off ? 'Microsoft Clarity and the Meta Pixel are off for you. ' : 'Microsoft Clarity (visit recordings) and the Meta Pixel (advertising) are on. '))
      + 'Google Analytics measures visits on every page. <a href="/privacy-policy.html#choices">More about your choices</a></p>'
      + '<div class="pp-cb-b">' + (signal ? '' : (off ? '<button type="button" class="pp-y">Turn back on</button>' : '<button type="button" class="pp-n">Opt out</button>'))
      + '<button type="button" class="pp-n pp-close">Close</button></div>';
    document.body.appendChild(d);
    var y = d.querySelector('.pp-y'), n = d.querySelector('.pp-n:not(.pp-close)');
    if (y) y.onclick = function(){ set('ack'); d.remove(); loadTags(); };
    if (n) n.onclick = function(){ set('no'); d.remove(); location.reload(); };
    d.querySelector('.pp-close').onclick = function(){ d.remove(); };
  }

  function footerLinks(){
    var ft = document.querySelector('footer');
    if (!ft || document.getElementById('pp-cb-link')) return;
    function mk(id, text, href){ var a = document.createElement('a'); a.id = id; a.textContent = text; a.href = href; return a; }
    var a = mk('pp-cb-link', 'Your privacy choices', '#');
    a.onclick = function(e){ e.preventDefault(); choices(); };
    var t = document.getElementById('pp-terms-link') ? null : mk('pp-terms-link', 'Terms of use', '/terms.html');
    var host = ft.querySelector('a[href*="privacy-policy"]');
    if (host && host.parentNode && host.parentNode.tagName === 'LI') {
      var ul = host.parentNode.parentNode, after = host.parentNode;
      [a, t].forEach(function(x){ if (!x) return; var li = document.createElement('li'); li.appendChild(x); ul.insertBefore(li, after.nextSibling); after = li; });
    } else {
      var p = document.createElement('p'); p.style.cssText = 'margin:12px 0 0;font-size:14px';
      a.style.cssText = 'color:inherit;text-decoration:underline'; p.appendChild(a);
      if (t) { t.style.cssText = 'color:inherit;text-decoration:underline;margin-left:16px'; p.appendChild(t); }
      ft.appendChild(p);
    }
  }

  function start(){
    footerLinks();
    if (signal) return;
    var c = get();
    if (c === 'no') return;
    if (c === 'ack' || c === 'yes') { loadTags(); return; }
    /* Pages marked <meta name="pp-notice" content="off"> show no cookie notice; tags load right away.
       "Your privacy choices" in the footer, GPC and DNT still turn them off. */
    var nn = document.querySelector('meta[name="pp-notice"]');
    if (nn && nn.getAttribute('content') === 'off') { loadTags(); return; }
    notice();
    /* Ad landing pages (<meta name="pp-tags" content="immediate">) load the tags while the notice is shown,
       so ad platforms can count short visits. "Opt out", GPC and DNT still stop them. */
    var m = document.querySelector('meta[name="pp-tags"]');
    if (m && m.getAttribute('content') === 'immediate') loadTags();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
