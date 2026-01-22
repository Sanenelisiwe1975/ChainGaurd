const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuditVerifier", function () {
  let auditVerifier;
  let owner;
  let auditor;
  let user;

  beforeEach(async function () {
    [owner, auditor, user] = await ethers.getSigners();

    const AuditVerifier = await ethers.getContractFactory("AuditVerifier");
    auditVerifier = await AuditVerifier.deploy();
    await auditVerifier.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await auditVerifier.owner()).to.equal(owner.address);
    });

    it("Should trust owner by default", async function () {
      expect(await auditVerifier.isTrustedVerifier(owner.address)).to.be.true;
    });
  });

  describe("Trusted Verifier Management", function () {
    it("Should allow owner to add trusted verifier", async function () {
      await expect(auditVerifier.setTrustedVerifier(auditor.address, true))
        .to.emit(auditVerifier, "VerifierTrusted")
        .withArgs(auditor.address, true);

      expect(await auditVerifier.isTrustedVerifier(auditor.address)).to.be.true;
    });

    it("Should allow owner to remove trusted verifier", async function () {
      await auditVerifier.setTrustedVerifier(auditor.address, true);
      await auditVerifier.setTrustedVerifier(auditor.address, false);

      expect(await auditVerifier.trustedVerifiers(auditor.address)).to.be.false;
    });

    it("Should not allow non-owner to manage verifiers", async function () {
      await expect(
        auditVerifier.connect(user).setTrustedVerifier(auditor.address, true)
      ).to.be.revertedWith("Not owner");
    });
  });

  describe("Report Verification", function () {
    let reportHash;
    let signature;

    beforeEach(async function () {
      // Create a sample report hash
      reportHash = ethers.keccak256(ethers.toUtf8Bytes("sample report"));
      
      // Sign the message
      const messageHashBytes = ethers.getBytes(reportHash);
      signature = await auditor.signMessage(messageHashBytes);
    });

    it("Should verify valid signature", async function () {
      await expect(
        auditVerifier.verifyReport(reportHash, signature, auditor.address)
      )
        .to.emit(auditVerifier, "ReportVerified")
        .withArgs(reportHash, owner.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

      expect(await auditVerifier.isReportVerified(reportHash)).to.be.true;
    });

    it("Should reject invalid signature", async function () {
      const result = await auditVerifier.verifyReport(
        reportHash,
        signature,
        user.address // Wrong address
      );
      
      // Transaction should succeed but verification fails
      expect(await auditVerifier.isReportVerified(reportHash)).to.be.false;
    });

    it("Should generate report hash correctly", async function () {
      const auditId = ethers.keccak256(ethers.toUtf8Bytes("audit1"));
      const contractHash = ethers.keccak256(ethers.toUtf8Bytes("contract1"));
      const ipfsCID = "QmTest";
      const timestamp = Math.floor(Date.now() / 1000);

      const hash = await auditVerifier.generateReportHash(
        auditId,
        contractHash,
        ipfsCID,
        timestamp
      );

      expect(hash).to.be.properHex(66); // 0x + 64 hex chars
    });
  });

  describe("Batch Verification", function () {
    it("Should verify multiple reports", async function () {
      const hash1 = ethers.keccak256(ethers.toUtf8Bytes("report1"));
      const hash2 = ethers.keccak256(ethers.toUtf8Bytes("report2"));
      
      const sig1 = await auditor.signMessage(ethers.getBytes(hash1));
      const sig2 = await user.signMessage(ethers.getBytes(hash2));

      const results = await auditVerifier.batchVerifyReports(
        [hash1, hash2],
        [sig1, sig2],
        [auditor.address, user.address]
      );

      expect(results[0]).to.be.true;
      expect(results[1]).to.be.true;
    });

    it("Should reject mismatched array lengths", async function () {
      await expect(
        auditVerifier.batchVerifyReports([reportHash], [], [])
      ).to.be.revertedWith("Array length mismatch");
    });
  });

  describe("Ownership Transfer", function () {
    it("Should allow owner to transfer ownership", async function () {
      await auditVerifier.transferOwnership(auditor.address);
      expect(await auditVerifier.owner()).to.equal(auditor.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(
        auditVerifier.connect(user).transferOwnership(user.address)
      ).to.be.revertedWith("Not owner");
    });

    it("Should reject zero address", async function () {
      await expect(
        auditVerifier.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid new owner");
    });
  });
});