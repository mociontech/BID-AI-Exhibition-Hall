const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { summarize } = require('../scripts/analytics-report.cjs');

const code = fs.readFileSync(path.join(__dirname, '../shared/analytics.js'), 'utf8');
const projectFolders = [
  '01-aquadata', '02-bogota-traffic-prediction', '03-costa-rica-smart-borders',
  '04-parque-tecnologico-guatiguara', '05-profe-gabi', '06-reglac',
  '07-csd-maiia', '08-teachy', '10-vpc-country-intelligence', '11-rsm-rise'
];

test('all ten tablet entries load analytics before the project controller', () => {
  for (const folder of projectFolders) {
    const html = fs.readFileSync(path.join(__dirname, '..', 'projects', folder, 'index.html'), 'utf8');
    const analytics = html.indexOf('shared/analytics.js');
    const controller = html.indexOf('shared/project-page.js');
    assert.ok(analytics >= 0 && controller > analytics, folder);
  }
});

function client({ projectId = '01', pathname = '/projects/01-aquadata/index.html', hostname = 'example.netlify.app' } = {}) {
  const requests = [], beacons = [], handlers = {}, intervals = [];
  let now = 0;
  class Element {}
  const document = {
    body: { classList: { contains: name => name === 'project-page' } },
    visibilityState: 'visible',
    querySelectorAll: () => [],
    addEventListener: (name, fn) => { handlers[name] = fn; }
  };
  const window = {
    ProjectModule: { id: projectId },
    AI_SYNC: { station: 3 },
    addEventListener: (name, fn) => { handlers[name] = fn; }
  };
  const context = {
    window, document, location: { pathname, hostname },
    performance: { now: () => now },
    Date: { now: () => 100000 + now },
    crypto: { getRandomValues: array => array.fill(1) },
    navigator: { sendBeacon: (url, body) => { beacons.push({ url, body }); return true; } },
    fetch: (url, options) => { requests.push({ url, event: JSON.parse(options.body) }); return Promise.resolve({ ok: true }); },
    MutationObserver: class { observe() {} },
    Element,
    Blob,
    setInterval: fn => intervals.push(fn),
    Uint8Array, Set, Map
  };
  vm.runInNewContext(code, context);
  return { requests, beacons, handlers, intervals, document, Element, advance: ms => { now += ms; } };
}

test('tablet records one visit, button action and visible time', () => {
  const c = client();
  assert.equal(c.requests.length, 1);
  assert.equal(c.requests[0].event.type, 'visit');
  assert.match(c.requests[0].url, /analytics\/projects\/01\/events\.json$/);
  const button = {
    getAttribute: name => name === 'data-action' ? 'information' : null,
    matches: () => false
  };
  const element = new c.Element();
  element.closest = () => button;
  c.handlers.click({ target: element });
  assert.equal(c.requests[1].event.type, 'click');
  assert.equal(c.requests[1].event.action, 'action:information');
  c.advance(20000);
  c.intervals[0]();
  assert.equal(c.requests[2].event.type, 'duration');
  assert.equal(c.requests[2].event.durationMs, 20000);
  c.document.visibilityState = 'hidden';
  c.handlers.visibilitychange();
  assert.equal(c.beacons.length, 1);
});

test('TV and local development do not write analytics', () => {
  assert.equal(client({ pathname: '/display.html' }).requests.length, 0);
  assert.equal(client({ hostname: 'localhost' }).requests.length, 0);
});

test('report counts distinct visits and maximum duration per visit', () => {
  const report = summarize({ '01': { events: {
    a: { type: 'visit', visitId: 'a' },
    b: { type: 'click', visitId: 'a', action: 'action:information' },
    c: { type: 'duration', visitId: 'a', durationMs: 20000 },
    d: { type: 'duration', visitId: 'a', durationMs: 30000 }
  } } });
  assert.equal(report.length, 10);
  assert.equal(report[0].visits, 1);
  assert.equal(report[0].buttonClicks, 1);
  assert.equal(report[0].averageSeconds, 30);
});
