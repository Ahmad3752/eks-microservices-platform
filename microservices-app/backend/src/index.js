import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

const items = [
  { id: 1, name: 'Learn Kubernetes', done: false },
  { id: 2, name: 'Set up EKS cluster', done: false },
  { id: 3, name: 'Deploy microservices', done: false },
];

let nextId = items.length + 1;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'name is required' });
  }
  const item = { id: nextId++, name: name.trim(), done: false };
  items.push(item);
  res.status(201).json(item);
});

app.patch('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  if (req.body.name !== undefined) {
    if (typeof req.body.name !== 'string' || req.body.name.trim() === '') {
      return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    item.name = req.body.name.trim();
  }
  if (req.body.done !== undefined) {
    item.done = Boolean(req.body.done);
  }
  res.json(item);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  items.splice(index, 1);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
