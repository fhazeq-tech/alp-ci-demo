const express = require('express');
const { createStore } = require('./store');

const LANGUAGES = ['Dari', 'Arabic', 'Farsi', 'English'];

function createApp(store = createStore()) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/students', (req, res) => {
    const { name, language, level } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name is required' });
    if (!LANGUAGES.includes(language)) return res.status(400).json({ error: 'unsupported language' });
    if (!Number.isInteger(level) || level < 1 || level > 5)
      return res.status(400).json({ error: 'level must be 1-5' });
    res.status(201).json(store.addStudent({ name, language, level }));
  });

  app.get('/students', (req, res) => {
    const level = req.query.level ? Number(req.query.level) : undefined;
    res.json(store.listStudents({ language: req.query.language, level }));
  });

  app.delete('/students/:id', (req, res) => {
    const ok = store.removeStudent(Number(req.params.id));
    res.status(ok ? 204 : 404).end();
  });

  app.post('/students/:id/attendance', (req, res) => {
    const id = Number(req.params.id);
    if (!store.getStudent(id)) return res.status(404).json({ error: 'student not found' });
    const { date, present } = req.body || {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '') || typeof present !== 'boolean')
      return res.status(400).json({ error: 'date (YYYY-MM-DD) and present (boolean) required' });
    res.status(201).json(store.logAttendance(id, date, present));
  });

  app.get('/students/:id/attendance-rate', (req, res) => {
    const id = Number(req.params.id);
    if (!store.getStudent(id)) return res.status(404).json({ error: 'student not found' });
    const recs = store.attendanceFor(id);
    const rate = recs.length ? recs.filter((r) => r.present).length / recs.length : null;
    res.json({ studentId: id, sessions: recs.length, rate });
  });

  return app;
}
module.exports = { createApp };
