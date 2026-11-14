/* Anonymous, tablet-only event stream for the ten exhibition projects. */
(function () {
  'use strict';
  const projectId = window.ProjectModule?.id;
  const allowed = new Set(['01', '02', '03', '04', '05', '06', '07', '08', '10', '11']);
  if (!allowed.has(projectId) || !document.body.classList.contains('project-page')) return;
  if (!/^\/projects\/\d{2}-[^/]+\/index\.html$/.test(location.pathname)) return;
  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(location.hostname)) return;

  const root = 'https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/analytics/projects/' + projectId + '/events.json';
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

  function send(type, extra = {}, final = false) {
    const event = JSON.stringify({ type, visitId, ts: { '.sv': 'timestamp' }, station, ...extra });
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
