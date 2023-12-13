const Weeklist = require('../model/weeklist');

// Create a Weeklist
exports.createWeeklist = async (req, res) => {
  try {
    const { tasks, deadline } = req.body;
    const userId = req.user._id;

    const activeWeeklistsCount = await Weeklist.countDocuments({
      user: userId,
      status: 'active',
    });

    if (activeWeeklistsCount >= 2) {
      return res.status(400).json({ error: 'You can only have two active weeklists at a time' });
    }

    const newWeeklist = new Weeklist({ user: userId, tasks, deadline });
    await newWeeklist.save();

    res.status(201).json({ message: 'Weeklist created successfully', weeklist: newWeeklist });
  } catch (error) {
    console.error('Error creating weeklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a Weeklist
exports.updateWeeklist = async (req, res) => {
  try {
    const { tasks, deadline } = req.body;
    const weeklistId = req.params.id;

    const updatedWeeklist = await Weeklist.findOneAndUpdate(
      { _id: weeklistId, createdAt: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) } },
      { tasks, deadline },
      { new: true }
    );

    if (!updatedWeeklist) {
      return res.status(400).json({ error: 'Cannot update weeklist beyond 24 hours of creation' });
    }

    res.json({ message: 'Weeklist updated successfully', weeklist: updatedWeeklist });
  } catch (error) {
    console.error('Error updating weeklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a Weeklist
exports.deleteWeeklist = async (req, res) => {
  try {
    const weeklistId = req.params.id;

    const deletedWeeklist = await Weeklist.findOneAndDelete({
      _id: weeklistId,
      createdAt: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) },
    });

    if (!deletedWeeklist) {
      return res.status(400).json({ error: 'Cannot delete weeklist beyond 24 hours of creation' });
    }

    res.json({ message: 'Weeklist deleted successfully', weeklist: deletedWeeklist });
  } catch (error) {
    console.error('Error deleting weeklist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Mark/Unmark Task in Weeklist
exports.markUnmarkTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;
    const userId = req.user._id;

    const updatedWeeklist = await Weeklist.findOneAndUpdate(
      { 'tasks._id': taskId, user: userId },
      { $set: { 'tasks.$.isCompleted': isCompleted, 'tasks.$.completionTime': isCompleted ? new Date() : null } },
      { new: true }
    );

    if (!updatedWeeklist) {
      return res.status(404).json({ error: 'Task not found in the user\'s weeklist' });
    }

    res.json({ message: 'Task marked/unmarked successfully', weeklist: updatedWeeklist });
  } catch (error) {
    console.error('Error marking/unmarking task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get All Weeklists with Time Left
exports.getAllWeeklists = async (req, res) => {
  try {
    const userId = req.user._id;
    const weeklists = await Weeklist.find({ user: userId });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
