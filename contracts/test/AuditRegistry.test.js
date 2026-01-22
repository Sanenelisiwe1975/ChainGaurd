const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuditRegistry", function () {
  let auditRegistry;
  let owner;
  let auditor;
  let user;

  const sampleAuditId = ethers.keccak256(ethers.toUtf8Bytes("audit1"));
  const sampleContractHash = ethers.keccak256(ethers.toUtf8Bytes("contract1"));
  const sampleIPFSCID = "QmX1234567890abcdef";

  beforeEach(async function () {
    [owner, auditor, user] = await ethers.getSigners();

    const AuditRegistry = await ethers.getContractFactory("AuditRegistry");
    auditRegistry = await AuditRegistry.deploy();
    await auditRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await auditRegistry.owner()).to.equal(owner.address);
    });

    it("Should authorize owner as auditor", async function () {
      expect(await auditRegistry.isAuthorizedAuditor(owner.address)).to.be.true;
    });

    it("Should start with zero audits", async function () {
      expect(await auditRegistry.totalAudits()).to.equal(0);
    });
  });

  describe("Auditor Authorization", function () {
    it("Should allow owner to authorize auditors", async function () {
      await auditRegistry.setAuditorAuthorization(auditor.address, true);
      expect(await auditRegistry.isAuthorizedAuditor(auditor.address)).to.be.true;
    });

    it("Should allow owner to deauthorize auditors", async function () {
      await auditRegistry.setAuditorAuthorization(auditor.address, true);
      await auditRegistry.setAuditorAuthorization(auditor.address, false);
      expect(await auditRegistry.authorizedAuditors(auditor.address)).to.be.false;
    });

    it("Should emit AuditorAuthorized event", async function () {
      await expect(auditRegistry.setAuditorAuthorization(auditor.address, true))
        .to.emit(auditRegistry, "AuditorAuthorized")
        .withArgs(auditor.address, true);
    });

    it("Should not allow non-owner to authorize auditors", async function () {
      await expect(
        auditRegistry.connect(user).setAuditorAuthorization(auditor.address, true)
      ).to.be.revertedWithCustomError(auditRegistry, "OwnableUnauthorizedAccount");
    });
  });

  describe("Audit Registration", function () {
    beforeEach(async function () {
      await auditRegistry.setAuditorAuthorization(auditor.address, true);
    });

    it("Should register a new audit", async function () {
      await expect(
        auditRegistry.connect(auditor).registerAudit(
          sampleAuditId,
          sampleContractHash,
          sampleIPFSCID,
          85,
          "MEDIUM",
          3
        )
      )
        .to.emit(auditRegistry, "AuditRegistered")
        .withArgs(sampleAuditId, sampleContractHash, sampleIPFSCID, auditor.address, 85);

      expect(await auditRegistry.totalAudits()).to.equal(1);
    });

    it("Should store audit details correctly", async function () {
      await auditRegistry.connect(auditor).registerAudit(
        sampleAuditId,
        sampleContractHash,
        sampleIPFSCID,
        85,
        "MEDIUM",
        3
      );

      const audit = await auditRegistry.getAudit(sampleAuditId);
      expect(audit.contractHash).to.equal(sampleContractHash);
      expect(audit.ipfsCID).to.equal(sampleIPFSCID);
      expect(audit.auditor).to.equal(auditor.address);
      expect(audit.securityScore).to.equal(85);
      expect(audit.overallRisk).to.equal("MEDIUM");
      expect(audit.vulnerabilityCount).to.equal(3);
      expect(audit.isVerified).to.be.false;
    });

    it("Should not allow duplicate audit IDs", async function () {
      await auditRegistry.connect(auditor).registerAudit(
        sampleAuditId,
        sampleContractHash,
        sampleIPFSCID,
        85,
        "MEDIUM",
        3
      );

      await expect(
        auditRegistry.connect(auditor).registerAudit(
          sampleAuditId,
          sampleContractHash,
          "QmDifferent",
          90,
          "LOW",
          1
        )
      ).to.be.revertedWith("Audit ID already exists");
    });

    it("Should reject invalid security scores", async function () {
      await expect(
        auditRegistry.connect(auditor).registerAudit(
          sampleAuditId,
          sampleContractHash,
          sampleIPFSCID,
          101,
          "MEDIUM",
          3
        )
      ).to.be.revertedWith("Invalid security score");
    });

    it("Should not allow unauthorized auditors", async function () {
      await expect(
        auditRegistry.connect(user).registerAudit(
          sampleAuditId,
          sampleContractHash,
          sampleIPFSCID,
          85,
          "MEDIUM",
          3
        )
      ).to.be.revertedWith("Not authorized auditor");
    });
  });

  describe("Audit Verification", function () {
    beforeEach(async function () {
      await auditRegistry.setAuditorAuthorization(auditor.address, true);
      await auditRegistry.connect(auditor).registerAudit(
        sampleAuditId,
        sampleContractHash,
        sampleIPFSCID,
        85,
        "MEDIUM",
        3
      );
    });

    it("Should allow authorized auditor to verify", async function () {
      await expect(auditRegistry.connect(owner).verifyAudit(sampleAuditId))
        .to.emit(auditRegistry, "AuditVerified")
        .withArgs(sampleAuditId, owner.address);

      const audit = await auditRegistry.getAudit(sampleAuditId);
      expect(audit.isVerified).to.be.true;
    });

    it("Should not allow double verification", async function () {
      await auditRegistry.connect(owner).verifyAudit(sampleAuditId);
      await expect(
        auditRegistry.connect(owner).verifyAudit(sampleAuditId)
      ).to.be.revertedWith("Already verified");
    });
  });

  describe("Contract Audit History", function () {
    const audit2Id = ethers.keccak256(ethers.toUtf8Bytes("audit2"));

    beforeEach(async function () {
      await auditRegistry.setAuditorAuthorization(auditor.address, true);
    });

    it("Should track multiple audits for a contract", async function () {
      await auditRegistry.connect(auditor).registerAudit(
        sampleAuditId,
        sampleContractHash,
        sampleIPFSCID,
        85,
        "MEDIUM",
        3
      );

      await auditRegistry.connect(auditor).registerAudit(
        audit2Id,
        sampleContractHash,
        "QmY5678",
        90,
        "LOW",
        1
      );

      const audits = await auditRegistry.getContractAudits(sampleContractHash);
      expect(audits.length).to.equal(2);
      expect(audits[0]).to.equal(sampleAuditId);
      expect(audits[1]).to.equal(audit2Id);
    });

    it("Should return latest audit for a contract", async function () {
      await auditRegistry.connect(auditor).registerAudit(
        sampleAuditId,
        sampleContractHash,
        sampleIPFSCID,
        85,
        "MEDIUM",
        3
      );

      await auditRegistry.connect(auditor).registerAudit(
        audit2Id,
        sampleContractHash,
        "QmY5678",
        90,
        "LOW",
        1
      );

      const latest = await auditRegistry.getLatestAudit(sampleContractHash);
      expect(latest.auditId).to.equal(audit2Id);
      expect(latest.securityScore).to.equal(90);
    });
  });
});