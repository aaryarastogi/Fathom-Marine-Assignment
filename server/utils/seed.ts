import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/User';
import Ship from '../models/Ship';
import MaintenanceTask from '../models/MaintenanceTask';
import SafetyDrill from '../models/SafetyDrill';

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB...');

    await User.deleteMany();
    await Ship.deleteMany();
    await MaintenanceTask.deleteMany();
    await SafetyDrill.deleteMany();

    const ship1 = await Ship.create({ name: 'Fathom Explorer', imoNumber: 'IMO1234567', status: 'Active' });
    const ship2 = await Ship.create({ name: 'Fathom Voyager', imoNumber: 'IMO7654321', status: 'Active' });

    const admin = await User.create({ name: 'Admin', email: 'admin@fathom.com', password: 'password', role: 'Admin' });
    const crew1 = await User.create({ name: 'John Crew', email: 'john@fathom.com', password: 'password', role: 'Crew', shipId: ship1._id });
    const crew2 = await User.create({ name: 'Jane Crew', email: 'jane@fathom.com', password: 'password', role: 'Crew', shipId: ship2._id });

    const now = new Date();
    
    await MaintenanceTask.create([
      { title: 'Engine Inspection', description: 'Routine check of main engine', shipId: ship1._id, assignedTo: crew1._id, dueDate: new Date(now.getTime() - 86400000), status: 'Pending' }, // Overdue
      { title: 'Lifeboat Check', description: 'Inspect lifeboat release mechanisms', shipId: ship2._id, assignedTo: crew2._id, dueDate: new Date(now.getTime() + 86400000 * 5), status: 'In Progress' },
      { title: 'Hull Cleaning', description: 'Clean hull and check for damage', shipId: ship1._id, assignedTo: crew1._id, dueDate: new Date(now.getTime() - 86400000 * 2), status: 'Completed', completedDate: new Date() }
    ]);

    await SafetyDrill.create([
      { title: 'Fire Drill', description: 'Standard fire drill procedure', shipId: ship1._id, scheduledDate: new Date(now.getTime() - 86400000 * 3), status: 'Missed' }, // Missed
      { title: 'Evacuation Drill', description: 'Abandon ship drill', shipId: ship2._id, scheduledDate: new Date(now.getTime() + 86400000 * 2), status: 'Scheduled' },
      { title: 'Man Overboard Drill', description: 'Practice man overboard rescue', shipId: ship1._id, scheduledDate: new Date(now.getTime() - 86400000 * 5), status: 'Completed', completedDate: new Date(), attendance: [crew1._id] }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
