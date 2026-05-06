import express from 'express';
const router = express.Router();
import SafetyDrill from '../models/SafetyDrill';

router.get('/', async (req, res) => {
  try {
    const drills = await SafetyDrill.find().populate('shipId').populate('attendance');
    res.json(drills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const drill = new SafetyDrill(req.body);
    await drill.save();
    res.json(drill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const drill = await SafetyDrill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(drill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/attendance', async (req, res) => {
  try {
    const drill = await SafetyDrill.findById(req.params.id);
    if (!drill) return res.status(404).json({ error: 'Drill not found' });
    
    const { userId } = req.body;
    if (!drill.attendance.includes(userId)) {
      drill.attendance.push(userId);
      await drill.save();
    }
    res.json(drill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
