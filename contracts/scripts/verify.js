const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Starting contract verification...");
  console.log("Network:", hre.network.name);

  // Load latest deployment
  const deploymentPath = path.join(
    __dirname,
    `../deployments/${hre.network.name}-latest.json`
  );

  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ No deployment found for this network");
    console.error("Please deploy contracts first using: npm run deploy");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("Loaded deployment from:", deployment.timestamp);

  // Verify AuditRegistry
  console.log("\n📝 Verifying AuditRegistry...");
  try {
    await hre.run("verify:verify", {
      address: deployment.contracts.AuditRegistry,
      constructorArguments: [],
    });
    console.log("✅ AuditRegistry verified");
  } catch (error) {
    console.log("⚠️  AuditRegistry verification failed:", error.message);
  }

  // Verify AuditVerifier
  console.log("\n🔐 Verifying AuditVerifier...");
  try {
    await hre.run("verify:verify", {
      address: deployment.contracts.AuditVerifier,
      constructorArguments: [],
    });
    console.log("✅ AuditVerifier verified");
  } catch (error) {
    console.log("⚠️  AuditVerifier verification failed:", error.message);
  }

  // Verify BountyManager
  console.log("\n💰 Verifying BountyManager...");
  try {
    await hre.run("verify:verify", {
      address: deployment.contracts.BountyManager,
      constructorArguments: [],
    });
    console.log("✅ BountyManager verified");
  } catch (error) {
    console.log("⚠️  BountyManager verification failed:", error.message);
  }

  console.log("\n🎉 Verification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });