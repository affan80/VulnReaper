import Vulnerability from "../models/Vulnerability.js";

export default {
  async getAll(req, res) {
    try {
      const vulns = await Vulnerability.find();
      res.json({ success: true, data: vulns });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getOne(req, res) {
    try {
      const vuln = await Vulnerability.findById(req.params.id);
      if (!vuln)
        return res.status(404).json({ success: false, message: "Vulnerability not found" });
      res.json({ success: true, data: vuln });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const vuln = new Vulnerability(req.body);
      await vuln.save();
      res.status(201).json({ success: true, data: vuln });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const vuln = await Vulnerability.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!vuln)
        return res.status(404).json({ success: false, message: "Vulnerability not found" });
      res.json({ success: true, data: vuln });
    } catch (err) {
      res.status(400).json({ success: false, error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const vuln = await Vulnerability.findByIdAndDelete(req.params.id);
      if (!vuln)
        return res.status(404).json({ success: false, message: "Vulnerability not found" });
      res.json({ success: true, message: "Vulnerability deleted" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
