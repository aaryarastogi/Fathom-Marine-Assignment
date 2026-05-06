import mongoose from 'mongoose';

const maintenanceTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completedDate: {
    type: Date,
  },
  notes: {
    type: String,
  }
}, {
  timestamps: true,
});

const MaintenanceTask = mongoose.model('MaintenanceTask', maintenanceTaskSchema);
export default MaintenanceTask;
