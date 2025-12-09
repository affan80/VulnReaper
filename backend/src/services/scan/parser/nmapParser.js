const parse = (output) => {
  // Simple parsing logic for demonstration
  const lines = output.split("\n");
  const vulnerabilities = [];

  lines.forEach((line) => {
    if (line.includes("open")) {
      vulnerabilities.push({
        name: "Open Port",
        target: "target",
        port: line.split("/")[0],
        protocol: "tcp",
        severity: "Medium",
        description: line,
      });
    }
  });

  return vulnerabilities;
};

export default { parse };
