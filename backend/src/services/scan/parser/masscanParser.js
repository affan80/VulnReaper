const parse = (output) => {
  // Simple parsing logic for demonstration
  const lines = output.split("\n");
  const vulnerabilities = [];

  lines.forEach((line) => {
    if (line.includes("open")) {
      const parts = line.split(/\s+/);
      const port = parts[2];
      const protocol = parts[3];
      vulnerabilities.push({
        name: "Open Port",
        target: "target",
        port: port,
        protocol: protocol,
        severity: "Low",
        description: line,
      });
    }
  });

  return vulnerabilities;
};

export default { parse };
