/* Pages of Purpose: Meta Pixel, loaded only after the visitor clicks Allow.
   Honors Global Privacy Control and Do Not Track (no banner, no pixel).
   Choice is remembered in localStorage; "Your privacy choices" link in the footer reopens it. */
(function(){
  var PIXEL_ID = '1982419396051400';
  var KEY = 'pp_consent_v1';
  var nav = navigator;
  var optedOut = nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1';

  function get(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  var loaded = false;
  function loadPixel(){
    if (loaded || !/^\d{6,}$/.test(PIXEL_ID)) return;
    loaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  // Lead event on any form submit (fires only if the pixel was allowed)
  document.addEventListener('submit', function(){
    if (loaded && window.fbq) { try { fbq('track', 'Lead'); } catch(e){} }
  }, true);

  var css = '#pp-cb{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#14213A;color:#fff;border-top:3px solid #C9A44C;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.25);padding:16px 18px;font:15px/1.5 inherit;font-family:inherit}'
    + '#pp-cb p{margin:0 0 12px;color:#E6EAF0}#pp-cb a{color:#C9A44C;text-decoration:underline}'
    + '#pp-cb .pp-cb-b{display:flex;gap:10px;flex-wrap:wrap}'
    + '#pp-cb button{font:inherit;font-weight:600;border-radius:4px;padding:9px 18px;cursor:pointer;min-height:44px}'
    + '#pp-cb .pp-y{background:#C9A44C;color:#14213A;border:1px solid #C9A44C}'
    + '#pp-cb .pp-n{background:transparent;color:#fff;border:1px solid #566173}'
    + '#pp-cb button:focus-visible{outline:2px solid #fff;outline-offset:2px}';

  function banner(){
    if (document.getElementById('pp-cb')) return;
    if (!document.getElementById('pp-cb-css')) {
      var st = document.createElement('style'); st.id = 'pp-cb-css'; st.textContent = css; document.head.appendChild(st);
    }
    var d = document.createElement('div');
    d.id = 'pp-cb'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Privacy choices');
    d.innerHTML = '<p>Can we use a Meta (Facebook) cookie to measure visits and show you our ads later? It never sees what you type in our forms. <a href="/privacy-policy.html#cookies">Privacy policy</a></p>'
      + '<div class="pp-cb-b"><button type="button" class="pp-y">Allow</button><button type="button" class="pp-n">No thanks</button></div>';
    document.body.appendChild(d);
    d.querySelector('.pp-y').onclick = function(){ set('yes'); d.remove(); loadPixel(); };
    d.querySelector('.pp-n').onclick = function(){ set('no'); d.remove(); if (loaded) location.reload(); };
  }

  function footerLink(){
    var ft = document.querySelector('footer');
    if (!ft || document.getElementById('pp-cb-link')) return;
    var a = document.createElement('a');
    a.href = '#'; a.id = 'pp-cb-link'; a.textContent = 'Your privacy choices';
    a.style.cssText = 'display:inline-block;margin:12px 0 0;font-size:14px;color:inherit;text-decoration:underline';
    a.onclick = function(e){ e.preventDefault(); if (optedOut) { alertNote(); return; } banner(); };
    var host = ft.querySelector('a[href*="privacy-policy"]');
    if (host && host.parentNode && host.parentNode.tagName === 'LI') {
      var li = document.createElement('li'); li.appendChild(a); a.style.marginTop = '0';
      host.parentNode.parentNode.insertBefore(li, host.parentNode.nextSibling);
    } else { ft.appendChild(a); }
  }
  function alertNote(){
    var p = document.createElement('p');
    p.textContent = 'Your browser is sending a privacy signal, so we do not load the Meta cookie.';
    p.style.cssText = 'font-size:14px;margin:8px 0 0';
    document.getElementById('pp-cb-link').after(p);
  }

  function start(){
    footerLink();
    if (optedOut) return;
    var c = get();
    if (c === 'yes') loadPixel();
    else if (c !== 'no') banner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
