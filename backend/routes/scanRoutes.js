import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authmiddleware.js";
import nmap from "node-nmap";

const prisma = new PrismaClient();
const router = express.Router();
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const vulnerabilities = await prisma.vulnerability.findMany({
      where: {
        scan: {
          userId: userId
        }
      }
    });

    const summary = {
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };

    vulnerabilities.forEach(vuln => {
      const severity = vuln.severity.toLowerCase();
      if (summary.hasOwnProperty(severity)) {
        summary[severity]++;
      }
    });

    res.json(summary);
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/start", authMiddleware, async (req, res) => {
  try {
    const { target } = req.body;
    const userId = req.user.id;

    if (!target) {
      return res.status(400).json({ message: "Target is required" });
    }
    const scan = await prisma.scan.create({
      data: {
        target: target,
        status: "running",
        userId: userId
      }
    });


    setTimeout(async () => {
      try {
        const vulnerabilities = [
          {
            title: "Sample High Severity Vulnerability",
            description: "This is a sample high severity vulnerability for demonstration",
            severity: "high",
            cvssScore: 8.5,
            cveId: "CVE-2024-12345",
            scanId: scan.id
          },
          {
            title: "Sample Medium Severity Vulnerability",
            description: "This is a sample medium severity vulnerability for demonstration",
            severity: "medium",
            cvssScore: 5.5,
            cveId: "CVE-2024-67890",
            scanId: scan.id
          },
          {
            title: "Sample Low Severity Vulnerability",
            description: "This is a sample low severity vulnerability for demonstration",
            severity: "low",
            cvssScore: 2.1,
            cveId: "CVE-2024-99999",
            scanId: scan.id
          },
          {
            title: "Sample Info Vulnerability",
            description: "This is a sample info vulnerability for demonstration",
            severity: "info",
            cvssScore: 0.0,
            cveId: "CVE-2024-00000",
            scanId: scan.id
          }
        ];

        if (vulnerabilities.length > 0) {
          await prisma.vulnerability.createMany({
            data: vulnerabilities
          });
        }


        await prisma.scan.update({
          where: { id: scan.id },
          data: {
            status: "completed",
            completedAt: new Date()
          }
        });

        console.log(`Scan ${scan.id} completed successfully`);
      } catch (error) {
        console.error("Scan processing error:", error);
        await prisma.scan.update({
          where: { id: scan.id },
          data: { status: "failed" }
        });
      }
    }, 3000);

    res.json({
      message: "Scan started successfully",
      scanId: scan.id
    });

  } catch (error) {
    console.error("Start scan error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


function getSeverityForPort(port) {
  const highRiskPorts = [21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 3389];
  const mediumRiskPorts = [135, 137, 138, 139, 445, 1433, 3306, 5432];

  if (highRiskPorts.includes(port)) return "high";
  if (mediumRiskPorts.includes(port)) return "medium";
  return "low";
}


router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const scans = await prisma.scan.findMany({
      where: { userId: userId },
      include: {
        vulnerabilities: true,
        _count: {
          select: { vulnerabilities: true }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    res.json(scans);
  } catch (error) {
    console.error("Get scans error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const scan = await prisma.scan.findFirst({
      where: {
        id: id,
        userId: userId
      },
      include: {
        vulnerabilities: true
      }
    });

    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }

    res.json(scan);
  } catch (error) {
    console.error("Get scan error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
