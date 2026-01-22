// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AuditRegistry
 * @dev Stores audit metadata on-chain with IPFS references
 * @notice This contract maintains an immutable record of all security audits
 */
contract AuditRegistry is Ownable, ReentrancyGuard {
    
    // Struct to store audit information
    struct Audit {
        bytes32 contractHash;      // Hash of the audited contract code
        string ipfsCID;            // IPFS CID where full report is stored
        address auditor;           // Address that submitted the audit
        uint256 timestamp;         // When the audit was registered
        uint8 securityScore;       // Security score (0-100)
        string overallRisk;        // Risk level: LOW, MEDIUM, HIGH, CRITICAL
        uint16 vulnerabilityCount; // Number of vulnerabilities found
        bool isVerified;           // Whether audit has been verified
    }

    // Mapping from audit ID to Audit struct
    mapping(bytes32 => Audit) public audits;
    
    // Mapping from contract hash to array of audit IDs (version history)
    mapping(bytes32 => bytes32[]) public contractAudits;
    
    // Mapping of authorized auditors
    mapping(address => bool) public authorizedAuditors;
    
    // Total number of audits registered
    uint256 public totalAudits;
    
    // Events
    event AuditRegistered(
        bytes32 indexed auditId,
        bytes32 indexed contractHash,
        string ipfsCID,
        address indexed auditor,
        uint8 securityScore
    );
    
    event AuditVerified(
        bytes32 indexed auditId,
        address indexed verifier
    );
    
    event AuditorAuthorized(
        address indexed auditor,
        bool authorized
    );

    constructor() Ownable(msg.sender) {
        // Contract deployer is automatically an authorized auditor
        authorizedAuditors[msg.sender] = true;
    }

    /**
     * @dev Modifier to check if caller is an authorized auditor
     */
    modifier onlyAuthorizedAuditor() {
        require(
            authorizedAuditors[msg.sender] || msg.sender == owner(),
            "Not authorized auditor"
        );
        _;
    }

    /**
     * @dev Register a new audit report
     * @param _auditId Unique identifier for the audit
     * @param _contractHash Hash of the contract code that was audited
     * @param _ipfsCID IPFS CID where the full report is stored
     * @param _securityScore Security score from 0-100
     * @param _overallRisk Risk level string
     * @param _vulnerabilityCount Number of vulnerabilities found
     */
    function registerAudit(
        bytes32 _auditId,
        bytes32 _contractHash,
        string memory _ipfsCID,
        uint8 _securityScore,
        string memory _overallRisk,
        uint16 _vulnerabilityCount
    ) external onlyAuthorizedAuditor nonReentrant {
        require(audits[_auditId].timestamp == 0, "Audit ID already exists");
        require(_securityScore <= 100, "Invalid security score");
        require(bytes(_ipfsCID).length > 0, "IPFS CID required");
        
        // Create new audit record
        audits[_auditId] = Audit({
            contractHash: _contractHash,
            ipfsCID: _ipfsCID,
            auditor: msg.sender,
            timestamp: block.timestamp,
            securityScore: _securityScore,
            overallRisk: _overallRisk,
            vulnerabilityCount: _vulnerabilityCount,
            isVerified: false
        });
        
        // Add to contract's audit history
        contractAudits[_contractHash].push(_auditId);
        
        totalAudits++;
        
        emit AuditRegistered(
            _auditId,
            _contractHash,
            _ipfsCID,
            msg.sender,
            _securityScore
        );
    }

    /**
     * @dev Verify an audit (can be called by owner or another auditor)
     * @param _auditId The audit ID to verify
     */
    function verifyAudit(bytes32 _auditId) external onlyAuthorizedAuditor {
        require(audits[_auditId].timestamp != 0, "Audit does not exist");
        require(!audits[_auditId].isVerified, "Already verified");
        
        audits[_auditId].isVerified = true;
        
        emit AuditVerified(_auditId, msg.sender);
    }

    /**
     * @dev Authorize or deauthorize an auditor
     * @param _auditor Address of the auditor
     * @param _authorized Whether to authorize or deauthorize
     */
    function setAuditorAuthorization(
        address _auditor,
        bool _authorized
    ) external onlyOwner {
        require(_auditor != address(0), "Invalid auditor address");
        authorizedAuditors[_auditor] = _authorized;
        
        emit AuditorAuthorized(_auditor, _authorized);
    }

    /**
     * @dev Get audit details by audit ID
     * @param _auditId The audit ID to query
     */
    function getAudit(bytes32 _auditId) 
        external 
        view 
        returns (
            bytes32 contractHash,
            string memory ipfsCID,
            address auditor,
            uint256 timestamp,
            uint8 securityScore,
            string memory overallRisk,
            uint16 vulnerabilityCount,
            bool isVerified
        ) 
    {
        Audit memory audit = audits[_auditId];
        require(audit.timestamp != 0, "Audit does not exist");
        
        return (
            audit.contractHash,
            audit.ipfsCID,
            audit.auditor,
            audit.timestamp,
            audit.securityScore,
            audit.overallRisk,
            audit.vulnerabilityCount,
            audit.isVerified
        );
    }

    /**
     * @dev Get all audit IDs for a specific contract
     * @param _contractHash Hash of the contract
     */
    function getContractAudits(bytes32 _contractHash) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return contractAudits[_contractHash];
    }

    /**
     * @dev Get the latest audit for a contract
     * @param _contractHash Hash of the contract
     */
    function getLatestAudit(bytes32 _contractHash)
        external
        view
        returns (
            bytes32 auditId,
            string memory ipfsCID,
            uint8 securityScore,
            string memory overallRisk,
            uint256 timestamp
        )
    {
        bytes32[] memory auditIds = contractAudits[_contractHash];
        require(auditIds.length > 0, "No audits for this contract");
        
        bytes32 latestAuditId = auditIds[auditIds.length - 1];
        Audit memory audit = audits[latestAuditId];
        
        return (
            latestAuditId,
            audit.ipfsCID,
            audit.securityScore,
            audit.overallRisk,
            audit.timestamp
        );
    }

    /**
     * @dev Check if an auditor is authorized
     * @param _auditor Address to check
     */
    function isAuthorizedAuditor(address _auditor) 
        external 
        view 
        returns (bool) 
    {
        return authorizedAuditors[_auditor] || _auditor == owner();
    }
}