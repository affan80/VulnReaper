import Report from "../models/Report.js";
import Vulnerability from "../models/Vulnerability.js";
import reportService from "../services/reportService.js";

export default {
  async getAll(req, res) {
    try {
      const reports = await Report.find().populate("createdBy");
      res.json({ success: true, data: reports });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const report = await Report.findById(req.params.id).populate("createdBy");
      if (!report)
        return res.status(404).json({ success: false, message: "Report not found" });
      res.json({ success: true, data: report });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const vulnerabilities = await Vulnerability.find({ _id: { $in: req.body.vulnerabilities } });
      const report = await reportService.generateReport(req.user.id, vulnerabilities);
      res.status(201).json({ success: true, data: report });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!report)
        return res.status(404).json({ success: false, message: "Report not found" });
      res.json({ success: true, data: report });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const report = await Report.findByIdAndDelete(req.params.id);
      if (!report)
        return res.status(404).json({ success: false, message: "Report not found" });
      res.json({ success: true, message: "Report deleted" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
