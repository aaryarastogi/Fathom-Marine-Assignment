import mongoose from 'mongoose';

const safetyDrillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  shipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ship',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  completedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Missed'],
    default: 'Scheduled',
  },
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }]
}, {
  timestamps: true,
});

const SafetyDrill = mongoose.model('SafetyDrill', safetyDrillSchema);
export default SafetyDrill;
