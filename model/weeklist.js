const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completionTime: {
    type: Date,
  },
});

const weeklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tasks: [taskSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
});

const Weeklist = mongoose.model('Weeklist', weeklistSchema);

module.exports = Weeklist;
