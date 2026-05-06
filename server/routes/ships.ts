import express from 'express';
const router = express.Router();
import Ship from '../models/Ship';

router.get('/', async (req, res) => {
  try {
    const ships = await Ship.find();
    res.json(ships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const ship = new Ship(req.body);
    await ship.save();
    res.json(ship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
