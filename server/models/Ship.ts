import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imoNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Maintenance', 'Inactive'],
    default: 'Active',
  }
}, {
  timestamps: true,
});

const Ship = mongoose.model('Ship', shipSchema);
export default Ship;
