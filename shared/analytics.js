/* Anonymous Firestore metrics for the ten exhibition project tablets. */
(function () {
  'use strict';
  const projectId = window.ProjectModule?.id;
  const allowed = new Set(['01', '02', '03', '04', '05', '06', '07', '08', '10', '11']);
  if (!allowed.has(projectId) || !document.body.classList.contains('project-page')) return;
  if (!/^\/projects\/\d{2}-[^/]+\/index\.html$/.test(location.pathname)) return;
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname)) return;

  const collections = {
    '01': 'BID_AI_01_AquaData',
    '02': 'BID_AI_02_BogotaTraffic',
    '03': 'BID_AI_03_SmartBorders',
    '04': 'BID_AI_04_Guatiguara',
    '05': 'BID_AI_05_ProfeGabi',
    '06': 'BID_AI_06_RegLAC',
    '07': 'BID_AI_07_MAIIA',
    '08': 'BID_AI_08_Teachy',
    '10': 'BID_AI_10_CountryIntelligence',
    '11': 'BID_AI_11_RISE'
  };
  const base = 'https://firestore.googleapis.com/v1/projects/f1-sap/databases/(default)/documents/';
  const root = base + collections[projectId];
  const visitId = Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
  const station = Number(window.AI_SYNC?.station) || 1;
  let activeSince = document.visibilityState === 'visible' ? performance.now() : null;
  let activeMs = 0;
  let lastSnapshot = -1;
  const observedFrames = new WeakSet();
  const observedDocuments = new WeakSet();

  function duration() {
    return Math.min(86400000, Math.round(activeMs + (activeSince === null ? 0 : performance.now() - activeSince)));
  }

  function encode(data) {
    return { fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [
      key, typeof value === 'number' ? { integerValue: String(value) } : { stringValue: value }
    ])) };
  }

  function seedCollections() {
    try {
      if (sessionStorage.getItem('bid-ai-firestore-seeded') === '1') return;
    } catch { /* Private browsing can disable storage. */ }
    Promise.all(Object.entries(collections).map(([id, collection]) =>
      fetch(base + collection + '?documentId=catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encode({ type: 'catalog', projectId: id, name: collection }))
      }).then(response => response.ok || response.status === 409).catch(() => false)
    )).then(results => {
      if (results.every(Boolean)) {
        try { sessionStorage.setItem('bid-ai-firestore-seeded', '1'); } catch {}
      }
    });
  }

  function send(type, extra = {}, final = false) {
    const event = JSON.stringify(encode({ type, visitId, station, ...extra }));
    if (final && navigator.sendBeacon) {
      const body = new Blob([event], { type: 'application/json' });
      if (navigator.sendBeacon(root, body)) return;
    }
    fetch(root, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event,
      keepalive: final
    }).catch(() => {});
  }

  function snapshot(final = false) {
    const ms = duration();
    if (!final && ms === lastSnapshot) return;
    lastSnapshot = ms;
    send('duration', { durationMs: ms }, final);
  }

  // Never send button text, form values, URL parameters or room tokens.
  function actionFor(el) {
    for (const attr of ['data-analytics', 'data-action', 'data-section', 'data-step', 'id']) {
      const raw = el.getAttribute(attr);
      if (raw && /^[a-zA-Z0-9_:-]{1,64}$/.test(raw)) return attr.replace('data-', '') + ':' + raw;
    }
    const classes = Array.from(el.classList || []).filter(c => /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(c)).slice(0, 2);
    const tag = el.tagName.toLowerCase();
    const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(x => x.tagName === el.tagName) : [];
    return [tag, ...classes, siblings.length > 1 ? String(siblings.indexOf(el) + 1) : ''].filter(Boolean).join('.').slice(0, 80);
  }

  function listen(doc) {
    if (observedDocuments.has(doc)) return;
    observedDocuments.add(doc);
    doc.addEventListener('click', e => {
      const target = e.target instanceof Element ? e.target.closest('button, a, [role="button"]') : null;
      if (!target || target.matches(':disabled, [aria-disabled="true"]')) return;
      send('click', { action: actionFor(target) });
    }, true);
  }

  function watchFrames() {
    for (const frame of document.querySelectorAll('iframe')) {
      if (observedFrames.has(frame)) continue;
      observedFrames.add(frame);
      const attach = () => {
        try {
          if (frame.contentDocument) listen(frame.contentDocument);
        } catch { /* Cross-origin frames are outside the project analytics scope. */ }
      };
      frame.addEventListener('load', attach);
      attach();
    }
  }

  seedCollections();
  send('visit');
  listen(document);
  watchFrames();
  new MutationObserver(watchFrames).observe(document.body, { childList: true, subtree: true });
  setInterval(() => { if (document.visibilityState === 'visible') snapshot(); }, 15000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (activeSince !== null) {
        activeMs += performance.now() - activeSince;
        activeSince = null;
      }
      snapshot(true);
    } else if (activeSince === null) {
      activeSince = performance.now();
    }
  });
  window.addEventListener('pagehide', () => snapshot(true));
})();
