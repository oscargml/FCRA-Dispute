/* Cookie consent + Google Consent Mode v2. Load BEFORE any gtag.js / AdSense script. */
(function () {
  var script = document.currentScript;
  var privacyUrl = script ? script.getAttribute('data-privacy-url') : '/privacy.html';
  var KEY = 'cookie_consent_v1';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  function apply(granted) {
    var v = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v
    });
  }

  if (stored === 'granted') apply(true);
  else if (stored === 'denied') apply(false);

  var LANGS = {
    en: { msg: 'We use cookies for analytics and advertising.', link: 'Privacy Policy', accept: 'Accept all', reject: 'Reject non-essential' },
    es: { msg: 'Usamos cookies para analítica y publicidad.', link: 'Política de Privacidad', accept: 'Aceptar todo', reject: 'Rechazar no esenciales' },
    fr: { msg: 'Nous utilisons des cookies à des fins d’analyse et de publicité.', link: 'Politique de confidentialité', accept: 'Tout accepter', reject: 'Refuser les non essentiels' },
    it: { msg: 'Utilizziamo cookie per analisi e pubblicità.', link: 'Informativa sulla privacy', accept: 'Accetta tutto', reject: 'Rifiuta non essenziali' }
  };

  function choose(granted) {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (e) {}
    apply(granted);
    var el = document.getElementById('cc-banner');
    if (el) el.parentNode.removeChild(el);
  }

  function show() {
    if (document.getElementById('cc-banner')) return;
    var lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
    var t = LANGS[lang] || LANGS.en;
    var div = document.createElement('div');
    div.id = 'cc-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-live', 'polite');
    div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:2147483647;background:#1f2430;color:#f2f2f2;padding:14px 16px;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;box-shadow:0 -2px 12px rgba(0,0,0,.35)';
    var msg = document.createElement('span');
    msg.textContent = t.msg + ' ';
    if (privacyUrl) {
      var a = document.createElement('a');
      a.href = privacyUrl;
      a.textContent = t.link;
      a.style.cssText = 'color:#8ab4f8;text-decoration:underline';
      msg.appendChild(a);
    }
    var btnStyle = 'border:0;border-radius:6px;padding:9px 18px;font-weight:600;cursor:pointer;font-size:14px';
    var reject = document.createElement('button');
    reject.textContent = t.reject;
    reject.style.cssText = btnStyle + ';background:#3a4152;color:#f2f2f2';
    reject.onclick = function () { choose(false); };
    var accept = document.createElement('button');
    accept.textContent = t.accept;
    accept.style.cssText = btnStyle + ';background:#4caf50;color:#fff';
    accept.onclick = function () { choose(true); };
    div.appendChild(msg);
    div.appendChild(reject);
    div.appendChild(accept);
    document.body.appendChild(div);
  }

  if (stored !== 'granted' && stored !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }
  window.showConsentBanner = show;
})();
