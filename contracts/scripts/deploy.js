const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting ChainGuard contract deployment...");
  console.log("Network:", hre.network.name);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy AuditRegistry
  console.log("\n📝 Deploying AuditRegistry...");
  const AuditRegistry = await hre.ethers.getContractFactory("AuditRegistry");
  const auditRegistry = await AuditRegistry.deploy();
  await auditRegistry.waitForDeployment();
  const auditRegistryAddress = await auditRegistry.getAddress();
  console.log("✅ AuditRegistry deployed to:", auditRegistryAddress);

  // Deploy AuditVerifier
  console.log("\n🔐 Deploying AuditVerifier...");
  const AuditVerifier = await hre.ethers.getContractFactory("AuditVerifier");
  const auditVerifier = await AuditVerifier.deploy();
  await auditVerifier.waitForDeployment();
  const auditVerifierAddress = await auditVerifier.getAddress();
  console.log("✅ AuditVerifier deployed to:", auditVerifierAddress);

  // Deploy BountyManager
  console.log("\n💰 Deploying BountyManager...");
  const BountyManager = await hre.ethers.getContractFactory("BountyManager");
  const bountyManager = await BountyManager.deploy();
  await bountyManager.waitForDeployment();
  const bountyManagerAddress = await bountyManager.getAddress();
  console.log("✅ BountyManager deployed to:", bountyManagerAddress);

  // Save deployment addresses
  const deploymentData = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AuditRegistry: auditRegistryAddress,
      AuditVerifier: auditVerifierAddress,
      BountyManager: bountyManagerAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentData, null, 2));

  // Also save as latest
  const latestFilepath = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestFilepath, JSON.stringify(deploymentData, null, 2));

  console.log("\n📄 Deployment info saved to:", filename);

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);
  console.log("\nContract Addresses:");
  console.log("  AuditRegistry:", auditRegistryAddress);
  console.log("  AuditVerifier:", auditVerifierAddress);
  console.log("  BountyManager:", bountyManagerAddress);
  console.log("=".repeat(60));

  // Verification instructions
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n📋 To verify contracts on block explorer, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${auditRegistryAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${auditVerifierAddress}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${bountyManagerAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });