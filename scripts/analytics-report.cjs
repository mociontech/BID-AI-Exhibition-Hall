#!/usr/bin/env node
/* Summarize a Firebase Console export of aiExhibitionHall/analytics/projects. */
const fs = require('node:fs');
const path = require('node:path');

const names = {
  '01': 'AquaData',
  '02': 'Bogotá Traffic Prediction',
  '03': 'Costa Rica Smart Borders',
  '04': 'Parque Tecnológico Guatiguará',
  '05': 'Profe Gabi',
  '06': 'RegLAC',
  '07': 'MAIIA',
  '08': 'Teachy',
  '10': 'Country Intelligence',
  '11': 'RSM RISE'
};

function summarize(input) {
  const projects = input?.aiExhibitionHall?.analytics?.projects || input?.analytics?.projects || input?.projects || input;
  return Object.keys(names).sort().map(id => {
    const name = names[id];
    const events = Object.values(projects?.[id]?.events || {});
    const visits = new Set(events.filter(event => event?.type === 'visit').map(event => event.visitId));
    const durations = new Map();
    const actions = {};
    for (const event of events) {
      if (!event || !visits.has(event.visitId)) continue;
      if (event.type === 'duration' && Number.isFinite(event.durationMs)) {
        durations.set(event.visitId, Math.max(durations.get(event.visitId) || 0, event.durationMs));
      }
      if (event.type === 'click' && typeof event.action === 'string') {
        actions[event.action] = (actions[event.action] || 0) + 1;
      }
    }
    const totalMs = [...durations.values()].reduce((sum, ms) => sum + ms, 0);
    return {
      project: id,
      name,
      visits: visits.size,
      buttonClicks: Object.values(actions).reduce((sum, n) => sum + n, 0),
      totalMinutes: +(totalMs / 60000).toFixed(1),
      averageSeconds: visits.size ? +(totalMs / visits.size / 1000).toFixed(1) : 0,
      actions
    };
  });
}

if (require.main === module) {
  const file = process.argv[2];
  if (!file) {
    console.error('Uso: node scripts/analytics-report.cjs <exportación-json-de-firebase>');
    process.exitCode = 1;
  } else {
    const report = summarize(JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')));
    console.table(report.map(({ project, name, visits, buttonClicks, totalMinutes, averageSeconds }) => ({
      project, name, visits, buttonClicks, totalMinutes, averageSeconds
    })));
    for (const row of report) if (Object.keys(row.actions).length) {
      console.log('\n' + row.project + ' ' + row.name);
      console.table(row.actions);
    }
  }
}

module.exports = { summarize };
