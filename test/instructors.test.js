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

test('creates an instructor', () =>
  withServer(async (b) => {
    const r = await post(`${b}/instructors`, { name: 'Sara', languages: ['Dari', 'English'], available: ['Mon', 'Wed'] });
    assert.strictEqual(r.status, 201);
    assert.strictEqual((await r.json()).name, 'Sara');
  }));

test('filters instructors by language and by day', () =>
  withServer(async (b) => {
    await post(`${b}/instructors`, { name: 'Sara', languages: ['Dari'], available: ['Mon'] });
    await post(`${b}/instructors`, { name: 'Huda', languages: ['Arabic'], available: ['Mon', 'Tue'] });
    const dari = await (await fetch(`${b}/instructors?language=Dari`)).json();
    assert.deepStrictEqual(dari.map((i) => i.name), ['Sara']);
    const tue = await (await fetch(`${b}/instructors?day=Tue`)).json();
    assert.deepStrictEqual(tue.map((i) => i.name), ['Huda']);
  }));

test('rejects invalid instructor input', () =>
  withServer(async (b) => {
    assert.strictEqual((await post(`${b}/instructors`, { name: 'X', languages: [], available: ['Mon'] })).status, 400);
    assert.strictEqual((await post(`${b}/instructors`, { name: 'X', languages: ['Dari'], available: ['Someday'] })).status, 400);
    assert.strictEqual((await post(`${b}/instructors`, { languages: ['Dari'], available: [] })).status, 400);
  }));

test('deletes an instructor, 404 when missing', () =>
  withServer(async (b) => {
    const i = await (await post(`${b}/instructors`, { name: 'Sara', languages: ['Dari'], available: [] })).json();
    assert.strictEqual((await fetch(`${b}/instructors/${i.id}`, { method: 'DELETE' })).status, 204);
    assert.strictEqual((await fetch(`${b}/instructors/${i.id}`, { method: 'DELETE' })).status, 404);
  }));
