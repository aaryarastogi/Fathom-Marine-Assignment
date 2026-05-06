import express from 'express';
const router = express.Router();
import MaintenanceTask from '../models/MaintenanceTask';

router.get('/', async (req, res) => {
  try {
    const tasks = await MaintenanceTask.find().populate('shipId').populate('assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = new MaintenanceTask(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await MaintenanceTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
