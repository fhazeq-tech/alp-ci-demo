const { test } = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

async function withServer(fn) {
  const server = createApp().listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { server.close(); }
}
const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

test('health endpoint responds ok', () =>
  withServer(async (b) => {
    const r = await fetch(`${b}/health`);
    assert.strictEqual(r.status, 200);
    assert.deepStrictEqual(await r.json(), { status: 'ok' });
  }));

test('creates and filters students by language', () =>
  withServer(async (b) => {
    await post(`${b}/students`, { name: 'A', language: 'Dari', level: 2 });
    await post(`${b}/students`, { name: 'B', language: 'Arabic', level: 1 });
    const list = await (await fetch(`${b}/students?language=Dari`)).json();
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].name, 'A');
  }));

test('rejects invalid student input', () =>
  withServer(async (b) => {
    assert.strictEqual((await post(`${b}/students`, { name: 'X', language: 'Klingon', level: 1 })).status, 400);
    assert.strictEqual((await post(`${b}/students`, { name: 'X', language: 'Dari', level: 9 })).status, 400);
  }));

test('computes attendance rate', () =>
  withServer(async (b) => {
    const s = await (await post(`${b}/students`, { name: 'C', language: 'Farsi', level: 3 })).json();
    await post(`${b}/students/${s.id}/attendance`, { date: '2026-10-01', present: true });
    await post(`${b}/students/${s.id}/attendance`, { date: '2026-10-08', present: false });
    const r = await (await fetch(`${b}/students/${s.id}/attendance-rate`)).json();
    assert.strictEqual(r.sessions, 2);
    assert.strictEqual(r.rate, 0.9);
  }));

test('attendance for unknown student is 404', () =>
  withServer(async (b) => {
    assert.strictEqual((await post(`${b}/students/99/attendance`, { date: '2026-10-01', present: true })).status, 404);
  }));
