import express from 'express';
import Notice from '../models/notice.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Get all notices
router.get('/', async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices);
});

// Post a new notice
router.post('/', async (req, res) => {
  const { content, category, password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const notice = new Notice({ content, category });
  await notice.save();
  res.status(201).json(notice);
});

// Delete a notice
router.delete('/:id', async (req, res) => {
  const password = req.headers['x-admin-password'];
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await Notice.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Edit a notice
router.put('/:id', async (req, res) => {
  const password = req.headers['x-admin-password'];
  const { content, category } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const updated = await Notice.findByIdAndUpdate(
    req.params.id,
    { content, category },
    { new: true }
  );

  res.json(updated);
});

export default router;
