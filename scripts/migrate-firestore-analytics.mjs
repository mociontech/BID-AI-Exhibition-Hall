import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const collections = {
  '01': 'BID_AI_01_AquaData', '02': 'BID_AI_02_BogotaTraffic',
  '03': 'BID_AI_03_SmartBorders', '04': 'BID_AI_04_Guatiguara',
  '05': 'BID_AI_05_ProfeGabi', '06': 'BID_AI_06_RegLAC',
  '07': 'BID_AI_07_MAIIA', '08': 'BID_AI_08_Teachy',
  '10': 'BID_AI_10_CountryIntelligence', '11': 'BID_AI_11_RISE'
};
const kinds = { visit: 'visits', click: 'clicks', duration: 'durations' };
const base = 'https://firestore.googleapis.com/v1/projects/f1-sap/databases/(default)/documents/';
const apply = process.argv.includes('--apply');
const removeLegacy = process.argv.includes('--delete-legacy');
if (removeLegacy && !apply) throw Error('--delete-legacy requiere --apply');

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok && response.status !== 409) throw Error(response.status + ' ' + url + ': ' + (await response.text()).slice(0, 300));
  return response;
}

async function list(collection) {
  const result = [];
  let token = '';
  do {
    const params = new URLSearchParams({ pageSize: '100' });
    if (token) params.set('pageToken', token);
    const response = await request(base + collection + '?' + params);
    const page = await response.json();
    result.push(...(page.documents || []));
    token = page.nextPageToken || '';
  } while (token);
  return result;
}

const all = {};
for (const collection of Object.values(collections)) all[collection] = await list(collection);
const backupPath = path.resolve(process.cwd(), '..', 'firestore-analytics-backup-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json');
fs.writeFileSync(backupPath, JSON.stringify(all, null, 2));
console.log('Respaldo:', backupPath);
for (const [collection, docs] of Object.entries(all)) {
  console.log(collection, 'eventos antiguos:', docs.filter(d => kinds[d.fields?.type?.stringValue]).length);
}
if (!apply) process.exit(0);

for (const [projectId, collection] of Object.entries(collections)) {
  for (const kind of Object.values(kinds)) {
    await request(base + collection + '?documentId=' + kind, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        kind: { stringValue: kind },
        projectId: { stringValue: projectId },
        name: { stringValue: collection }
      } })
    });
  }
}

let copied = 0, removed = 0;
for (const [collection, docs] of Object.entries(all)) {
  for (const doc of docs) {
    const oldId = doc.name.split('/').at(-1);
    const type = doc.fields?.type?.stringValue;
    if (!kinds[type] || !/^[A-Za-z0-9]{20}$/.test(oldId)) continue;
    const occurredAt = doc.createTime;
    const stamp = occurredAt.replace(/[-:.]/g, '').replace(/(\d{8}T\d{9})\d*Z$/, '$1Z');
    const hash = crypto.createHash('sha256').update(doc.name).digest('hex').slice(0, 8);
    const eventId = stamp + '_' + hash + '_0001';
    const fields = {
      visitId: doc.fields.visitId,
      station: doc.fields.station,
      occurredAt: { timestampValue: occurredAt }
    };
    if (type === 'click') fields.action = doc.fields.action;
    if (type === 'duration') fields.durationMs = doc.fields.durationMs;
    const target = base + collection + '/' + kinds[type] + '/entries/' + eventId;
    await request(base + collection + '/' + kinds[type] + '/entries?documentId=' + eventId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
    const verified = await request(target);
    const stored = await verified.json();
    if (Object.keys(stored.fields || {}).length !== Object.keys(fields).length ||
        Object.entries(fields).some(([key, value]) => JSON.stringify(stored.fields[key]) !== JSON.stringify(value))) {
      throw Error('Copia diferente: ' + doc.name);
    }
    copied++;
    if (removeLegacy) {
      await request('https://firestore.googleapis.com/v1/' + doc.name, { method: 'DELETE' });
      removed++;
    }
  }
}
if (removeLegacy) {
  for (const [collection, docs] of Object.entries(all)) {
    if (docs.some(d => d.name.endsWith('/catalog'))) {
      await request(base + collection + '/catalog', { method: 'DELETE' });
      removed++;
    }
  }
}
console.log('Copiados:', copied, 'Retirados:', removed);
