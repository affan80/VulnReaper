import ActivityLog from "../models/ActivityLog.js";

export default {
  async getAll(req, res) {
    try {
      const activities = await ActivityLog.find().sort({ createdAt: -1 });
      res.json({ success: true, data: activities });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const activity = new ActivityLog(req.body);
      await activity.save();
      res.status(201).json({ success: true, data: activity });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const activity = await ActivityLog.findByIdAndDelete(req.params.id);
      if (!activity) {
        return res.status(404).json({ success: false, error: 'Activity not found' });
      }
      res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
