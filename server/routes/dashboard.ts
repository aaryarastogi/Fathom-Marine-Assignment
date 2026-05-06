import express from 'express';
const router = express.Router();
import MaintenanceTask from '../models/MaintenanceTask';
import SafetyDrill from '../models/SafetyDrill';

router.get('/metrics', async (req, res) => {
  try {
    const now = new Date();

    const tasks = await MaintenanceTask.find();
    const drills = await SafetyDrill.find();

    const pendingTasks = tasks.filter(t => t.status !== 'Completed').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length;

    const missedDrills = drills.filter(d => d.status === 'Missed' || (d.status !== 'Completed' && new Date(d.scheduledDate) < now)).length;
    const completedDrills = drills.filter(d => d.status === 'Completed').length;

    const taskCompliance = tasks.length ? (completedTasks / tasks.length) * 100 : 100;
    const drillCompliance = drills.length ? (completedDrills / drills.length) * 100 : 100;
    
    // Overall compliance logic
    const overallCompliance = (taskCompliance + drillCompliance) / 2;

    res.json({
      maintenance: { total: tasks.length, pending: pendingTasks, completed: completedTasks, overdue: overdueTasks },
      drills: { total: drills.length, missed: missedDrills, completed: completedDrills },
      compliance: {
        overall: overallCompliance,
        tasks: taskCompliance,
        drills: drillCompliance
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
