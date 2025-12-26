import Asset from "../models/Asset.js";

export const getAssets = async (req, res) => {
  t y {
    const { page = 1, limit = 10, search, sort, tag, owner } = req.query;
    const q = {};

    if (tag) q.tags = { $in: [tag] };
    if (owner) q.owner = owner;

    let query = Asset.find(q);

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const total = await query.countDocuments();

    if (sort) {
      const sortObj = sort.split(",").join(" ");
      query = query.sort(sortObj);
    } else {
      query = query.sort("-createdAt");
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

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const createAsset = async (req, res) => {
  try {
    const { name, ip, owner, tags } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    const created = await Asset.create({ name, ip, owner, tags });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const createAssetsBulk = async (req, res) => {
  try {
    const items = req.body.items || [];
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "items required" });
    const created = await Asset.insertMany(items);
    res.status(201).json({ inserted: created.length, items: created });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Asset.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Asset not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const updateAssetTags = async (req, res) => {
  try {
    const { tags } = req.body;
    const updated = await Asset.findByIdAndUpdate(req.params.id, { $set: { tags } }, { new: true });
    if (!updated) return res.status(404).json({ message: "Asset not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const deleted = await Asset.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Asset not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

export const deleteManyAssets = async (req, res) => {
  try {
    const q = {};
    if (req.query.owner) q.owner = req.query.owner;
    if (req.query.tag) q.tags = { $in: [req.query.tag] };
    const result = await Asset.deleteMany(q);
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};
