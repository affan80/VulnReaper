import Vulnerability from "../models/Vulnerability.js";

export default {
  async getStats(req, res) {
    try {
      const totalVulnerabilities = await Vulnerability.countDocuments();
      const openVulnerabilities = await Vulnerability.countDocuments({ status: "Open" });
      const inProgressVulnerabilities = await Vulnerability.countDocuments({ status: "In Progress" });
      const resolvedVulnerabilities = await Vulnerability.countDocuments({ status: "Resolved" });

      const severityStats = await Vulnerability.aggregate([
        {
          $group: {
            _id: "$severity",
            count: { $sum: 1 },
          },
        },
      ]);

      res.json({
        success: true,
        data: {
          totalVulnerabilities,
          openVulnerabilities,
          inProgressVulnerabilities,
          resolvedVulnerabilities,
          severityStats,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};
