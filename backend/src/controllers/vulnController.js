import Vulnerability from "../models/Vulnerability.js";
import Asset from "../models/Asset.js";

export const getVulns = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort, severity, status, asset } = req.query;
    const q = {};

    if (severity) q.severity = severity;
    if (status) q.status = status;
    if (asset) q.asset = asset;

    let query = Vulnerability.find(q).populate("asset", "name ip owner");

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const total = await query.countDocuments();

    if (sort) {
      const sortObj = sort.split(",").join(" ");
      query = query.sort(sortObj);
    } else {
      query = query.sort("-discoveredAt");
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    const items = await query.exec();

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      items
    });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const getVulnById = async (req, res) => {
  try {
    const vuln = await Vulnerability.findById(req.params.id).populate("asset", "name ip owner");
    if (!vuln) return res.status(404).json({ message: "Vulnerability not found" });
    res.json(vuln);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const createVuln = async (req, res) => {
  try {
    const { title, description, severity, status, asset: assetId, metadata } = req.body;
    if (!title || !assetId) return res.status(400).json({ message: "title and asset required" });
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(400).json({ message: "Asset not found" });

    const created = await Vulnerability.create({ title, description, severity, status, asset: assetId, metadata });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const createVulnsBulk = async (req, res) => {
  try {
    const items = req.body.items || [];
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "items required" });
    const created = await Vulnerability.insertMany(items);
    res.status(201).json({ inserted: created.length, items: created });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const updateVuln = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Vulnerability.findByIdAndUpdate(req.params.id, updates, { new: true }).populate("asset", "name ip owner");
    if (!updated) return res.status(404).json({ message: "Vulnerability not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const updateVulnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Vulnerability.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("asset", "name ip owner");
    if (!updated) return res.status(404).json({ message: "Vulnerability not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const deleteVuln = async (req, res) => {
  try {
    const deleted = await Vulnerability.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Vulnerability not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const deleteManyVulns = async (req, res) => {
  try {
    const criteria = {};
    if (req.query.asset) criteria.asset = req.query.asset;
    if (req.query.status) criteria.status = req.query.status;
    if (req.query.severity) criteria.severity = req.query.severity;
    const result = await Vulnerability.deleteMany(criteria);
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};
