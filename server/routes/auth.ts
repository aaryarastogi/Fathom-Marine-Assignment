import express from 'express';
const router = express.Router();
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

router.post('/signup', async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Crew'
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ user: userObj, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ user: userObj, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req: any, res: any) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
