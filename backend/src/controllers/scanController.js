// src/controllers/scanController.js
import nmapScanner from "../services/scan/nmapScanner.js";
import niktoScanner from "../services/scan/niktoScanner.js";
import masscanScanner from "../services/scan/masscanScanner.js";
import ScanHistory from "../models/ScamHistory.js";
import Vulnerability from "../models/Vulnerability.js";

export default {
  async scan(req, res) {
    try {
      const { target, scanners } = req.body;

      if (!target || !scanners || scanners.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Target and at least one scanner are required' 
        });
      }

      const history = await ScanHistory.create({
        target,
        scanner: scanners.join(","),
        status: "Running",
      });

      let allResults = [];
      let vulnerabilities = [];

      // Run Nmap scan
      if (scanners.includes("nmap")) {
        try {
          const nmapResults = await nmapScanner.scan(target);
          allResults = allResults.concat(nmapResults);

          for (const r of nmapResults) {
            const vuln = await Vulnerability.create({
              name: `Open Port ${r.port} - ${r.service || 'Unknown Service'}`,
              target,
              port: r.port,
              protocol: r.protocol || 'tcp',
              description: `${r.service || 'Unknown'} ${r.product || ''} ${r.version || ''} - ${r.description || 'Port is open'}`.trim(),
              severity: determineSeverity(r.port, r.service),
              status: 'Open',
              rawData: r,
            });
            vulnerabilities.push(vuln);
          }
        } catch (err) {
          console.error('Nmap scan error:', err.message);
        }
      }

      // Run Nikto scan
      if (scanners.includes("nikto")) {
        try {
          const niktoResults = await niktoScanner(target);
          allResults = allResults.concat(niktoResults);

          for (const r of niktoResults) {
            const vuln = await Vulnerability.create({
              name: r.name || 'Web Vulnerability',
              target,
              description: r.description || 'Web vulnerability detected',
              severity: r.severity || 'Medium',
              status: 'Open',
              rawData: r,
            });
            vulnerabilities.push(vuln);
          }
        } catch (err) {
          console.error('Nikto scan error:', err.message);
        }
      }

      // Run Masscan scan
      if (scanners.includes("masscan")) {
        try {
          const masscanResults = await masscanScanner.scan(target);
          allResults = allResults.concat(masscanResults);

          for (const r of masscanResults) {
            const vuln = await Vulnerability.create({
              name: `Open Port ${r.port}`,
              target,
              port: r.port,
              protocol: r.protocol || 'tcp',
              description: r.description || `Port ${r.port} is open`,
              severity: 'Low',
              status: 'Open',
              rawData: r,
            });
            vulnerabilities.push(vuln);
          }
        } catch (err) {
          console.error('Masscan scan error:', err.message);
        }
      }

      // Update scan history
      history.status = "Completed";
      history.results = allResults;
      await history.save();

      // Calculate statistics
      const stats = {
        total: vulnerabilities.length,
        critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
        high: vulnerabilities.filter(v => v.severity === 'High').length,
        medium: vulnerabilities.filter(v => v.severity === 'Medium').length,
        low: vulnerabilities.filter(v => v.severity === 'Low').length,
      };

      res.json({ 
        success: true, 
        data: {
          scan: history,
          vulnerabilities: vulnerabilities,
          stats: stats,
          summary: {
            target,
            scannersUsed: scanners,
            totalVulnerabilities: vulnerabilities.length,
            scanDate: new Date(),
            status: 'Completed'
          }
        }
      });
    } catch (err) {
      console.error('Scan error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

// Helper function to determine severity based on port and service
function determineSeverity(port, service) {
  const criticalPorts = [21, 23, 3389]; // FTP, Telnet, RDP
  const highPorts = [22, 445, 1433, 3306, 5432]; // SSH, SMB, SQL databases
  const mediumPorts = [80, 443, 8080, 8443]; // Web servers
  
  if (criticalPorts.includes(port)) return 'Critical';
  if (highPorts.includes(port)) return 'High';
  if (mediumPorts.includes(port)) return 'Medium';
  return 'Low';
}
