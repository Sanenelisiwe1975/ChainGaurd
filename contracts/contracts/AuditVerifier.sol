// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title AuditVerifier
 * @dev Verifies cryptographic proofs and signatures for audit reports
 * @notice This contract validates that audit reports are authentic and unmodified
 */
contract AuditVerifier {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // Mapping of report hash to verification status
    mapping(bytes32 => bool) public verifiedReports;
    
    // Mapping of trusted verifier addresses
    mapping(address => bool) public trustedVerifiers;
    
    // Contract owner
    address public owner;
    
    // Events
    event ReportVerified(
        bytes32 indexed reportHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    event VerifierTrusted(
        address indexed verifier,
        bool trusted
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        trustedVerifiers[msg.sender] = true;
    }

    /**
     * @dev Verify a report using ECDSA signature
     * @param _reportHash Hash of the audit report
     * @param _signature Signature from the auditor
     * @param _auditorAddress Expected auditor address
     */
    function verifyReport(
        bytes32 _reportHash,
        bytes memory _signature,
        address _auditorAddress
    ) external returns (bool) {
        require(_auditorAddress != address(0), "Invalid auditor address");
        
        // Recover signer from signature
        bytes32 ethSignedMessageHash = _reportHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedMessageHash.recover(_signature);
        
        // Check if recovered signer matches expected auditor
        bool isValid = (recoveredSigner == _auditorAddress);
        
        if (isValid) {
            verifiedReports[_reportHash] = true;
            emit ReportVerified(_reportHash, msg.sender, block.timestamp);
        }
        
        return isValid;
    }

    /**
     * @dev Verify report hash matches IPFS content
     * @param _reportHash Expected hash of the report
     * @param _ipfsCID IPFS CID of the report
     * @param _signature Signature proving the hash-CID relationship
     */
    function verifyReportHash(
        bytes32 _reportHash,
        string memory _ipfsCID,
        bytes memory _signature
    ) external view returns (bool) {
        // Create message hash from report hash and IPFS CID
        bytes32 messageHash = keccak256(
            abi.encodePacked(_reportHash, _ipfsCID)
        );
        
        // Verify signature
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(_signature);
        
        // Check if signer is trusted
        return trustedVerifiers[signer];
    }

    /**
     * @dev Batch verify multiple reports
     * @param _reportHashes Array of report hashes
     * @param _signatures Array of signatures
     * @param _auditorAddresses Array of expected auditor addresses
     */
    function batchVerifyReports(
        bytes32[] memory _reportHashes,
        bytes[] memory _signatures,
        address[] memory _auditorAddresses
    ) external returns (bool[] memory) {
        require(
            _reportHashes.length == _signatures.length &&
            _signatures.length == _auditorAddresses.length,
            "Array length mismatch"
        );
        
        bool[] memory results = new bool[](_reportHashes.length);
        
        for (uint256 i = 0; i < _reportHashes.length; i++) {
            bytes32 ethSignedMessageHash = _reportHashes[i].toEthSignedMessageHash();
            address recoveredSigner = ethSignedMessageHash.recover(_signatures[i]);
            
            results[i] = (recoveredSigner == _auditorAddresses[i]);
            
            if (results[i]) {
                verifiedReports[_reportHashes[i]] = true;
            }
        }
        
        return results;
    }

    /**
     * @dev Check if a report has been verified
     * @param _reportHash Hash of the report to check
     */
    function isReportVerified(bytes32 _reportHash) 
        external 
        view 
        returns (bool) 
    {
        return verifiedReports[_reportHash];
    }

    /**
     * @dev Add or remove trusted verifier
     * @param _verifier Address of the verifier
     * @param _trusted Whether to trust or untrust
     */
    function setTrustedVerifier(
        address _verifier,
        bool _trusted
    ) external onlyOwner {
        require(_verifier != address(0), "Invalid verifier address");
        trustedVerifiers[_verifier] = _trusted;
        
        emit VerifierTrusted(_verifier, _trusted);
    }

    /**
     * @dev Check if an address is a trusted verifier
     * @param _verifier Address to check
     */
    function isTrustedVerifier(address _verifier) 
        external 
        view 
        returns (bool) 
    {
        return trustedVerifiers[_verifier];
    }

    /**
     * @dev Generate hash for a report (helper function)
     * @param _auditId Audit identifier
     * @param _contractHash Hash of audited contract
     * @param _ipfsCID IPFS CID
     * @param _timestamp Timestamp of the audit
     */
    function generateReportHash(
        bytes32 _auditId,
        bytes32 _contractHash,
        string memory _ipfsCID,
        uint256 _timestamp
    ) external pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _auditId,
                _contractHash,
                _ipfsCID,
                _timestamp
            )
        );
    }

    /**
     * @dev Transfer ownership
     * @param _newOwner New owner address
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }
}