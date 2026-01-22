// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BountyManager
 * @dev Manages bug bounties for audited contracts
 * @notice Contract owners can create bounties, security researchers can claim them
 */
contract BountyManager is Ownable, ReentrancyGuard {
    
    enum BountyStatus { Active, Claimed, Cancelled }
    enum Severity { LOW, MEDIUM, HIGH, CRITICAL }

    struct Bounty {
        bytes32 contractHash;       // Hash of the contract with bounty
        address creator;            // Who created the bounty
        uint256 totalReward;        // Total reward pool
        uint256 remainingReward;    // Remaining unclaimed rewards
        BountyStatus status;        // Current status
        uint256 createdAt;          // Creation timestamp
        uint256 expiresAt;          // Expiration timestamp
        mapping(Severity => uint256) severityRewards; // Rewards per severity
    }

    struct Claim {
        bytes32 bountyId;           // Associated bounty
        address researcher;         // Who found the bug
        string ipfsCID;             // IPFS CID of vulnerability report
        Severity severity;          // Severity of the bug
        uint256 reward;             // Reward amount
        uint256 claimedAt;          // When it was claimed
        bool verified;              // Whether claim is verified
    }

    // Bounty storage
    mapping(bytes32 => Bounty) public bounties;
    mapping(bytes32 => Claim) public claims;
    
    // Track bounties by contract
    mapping(bytes32 => bytes32[]) public contractBounties;
    
    // Track claims by researcher
    mapping(address => bytes32[]) public researcherClaims;
    
    uint256 public totalBounties;
    uint256 public totalClaims;
    
    // Minimum bounty amount
    uint256 public constant MIN_BOUNTY = 0.01 ether;
    
    // Events
    event BountyCreated(
        bytes32 indexed bountyId,
        bytes32 indexed contractHash,
        address indexed creator,
        uint256 totalReward
    );
    
    event BountyClaimed(
        bytes32 indexed claimId,
        bytes32 indexed bountyId,
        address indexed researcher,
        uint256 reward,
        Severity severity
    );
    
    event ClaimVerified(
        bytes32 indexed claimId,
        address indexed verifier
    );
    
    event BountyCancelled(
        bytes32 indexed bountyId,
        address indexed creator
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new bug bounty
     * @param _contractHash Hash of the contract
     * @param _duration Duration in seconds
     * @param _lowReward Reward for LOW severity bugs
     * @param _mediumReward Reward for MEDIUM severity bugs
     * @param _highReward Reward for HIGH severity bugs
     * @param _criticalReward Reward for CRITICAL severity bugs
     */
    function createBounty(
        bytes32 _contractHash,
        uint256 _duration,
        uint256 _lowReward,
        uint256 _mediumReward,
        uint256 _highReward,
        uint256 _criticalReward
    ) external payable nonReentrant {
        uint256 totalReward = _lowReward + _mediumReward + _highReward + _criticalReward;
        require(msg.value >= totalReward, "Insufficient funds");
        require(totalReward >= MIN_BOUNTY, "Bounty too small");
        require(_duration > 0, "Invalid duration");
        
        bytes32 bountyId = keccak256(
            abi.encodePacked(_contractHash, msg.sender, block.timestamp)
        );
        
        Bounty storage bounty = bounties[bountyId];
        bounty.contractHash = _contractHash;
        bounty.creator = msg.sender;
        bounty.totalReward = totalReward;
        bounty.remainingReward = totalReward;
        bounty.status = BountyStatus.Active;
        bounty.createdAt = block.timestamp;
        bounty.expiresAt = block.timestamp + _duration;
        bounty.severityRewards[Severity.LOW] = _lowReward;
        bounty.severityRewards[Severity.MEDIUM] = _mediumReward;
        bounty.severityRewards[Severity.HIGH] = _highReward;
        bounty.severityRewards[Severity.CRITICAL] = _criticalReward;
        
        contractBounties[_contractHash].push(bountyId);
        totalBounties++;
        
        // Refund excess
        if (msg.value > totalReward) {
            payable(msg.sender).transfer(msg.value - totalReward);
        }
        
        emit BountyCreated(bountyId, _contractHash, msg.sender, totalReward);
    }

    /**
     * @dev Claim a bounty by submitting vulnerability report
     * @param _bountyId ID of the bounty to claim
     * @param _ipfsCID IPFS CID of the vulnerability report
     * @param _severity Severity of the vulnerability
     */
    function claimBounty(
        bytes32 _bountyId,
        string memory _ipfsCID,
        Severity _severity
    ) external nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.status == BountyStatus.Active, "Bounty not active");
        require(block.timestamp < bounty.expiresAt, "Bounty expired");
        require(bytes(_ipfsCID).length > 0, "IPFS CID required");
        
        uint256 reward = bounty.severityRewards[_severity];
        require(reward > 0, "No reward for this severity");
        require(bounty.remainingReward >= reward, "Insufficient bounty funds");
        
        bytes32 claimId = keccak256(
            abi.encodePacked(_bountyId, msg.sender, block.timestamp)
        );
        
        claims[claimId] = Claim({
            bountyId: _bountyId,
            researcher: msg.sender,
            ipfsCID: _ipfsCID,
            severity: _severity,
            reward: reward,
            claimedAt: block.timestamp,
            verified: false
        });
        
        researcherClaims[msg.sender].push(claimId);
        totalClaims++;
        
        emit BountyClaimed(claimId, _bountyId, msg.sender, reward, _severity);
    }

    /**
     * @dev Verify a claim and release funds (owner or bounty creator only)
     * @param _claimId ID of the claim to verify
     */
    function verifyClaim(bytes32 _claimId) external nonReentrant {
        Claim storage claim = claims[_claimId];
        require(claim.claimedAt > 0, "Claim does not exist");
        require(!claim.verified, "Already verified");
        
        Bounty storage bounty = bounties[claim.bountyId];
        require(
            msg.sender == owner() || msg.sender == bounty.creator,
            "Not authorized"
        );
        
        claim.verified = true;
        bounty.remainingReward -= claim.reward;
        
        // Transfer reward to researcher
        payable(claim.researcher).transfer(claim.reward);
        
        emit ClaimVerified(_claimId, msg.sender);
    }

    /**
     * @dev Cancel a bounty and refund remaining funds (creator only)
     * @param _bountyId ID of the bounty to cancel
     */
    function cancelBounty(bytes32 _bountyId) external nonReentrant {
        Bounty storage bounty = bounties[_bountyId];
        require(bounty.creator == msg.sender, "Not bounty creator");
        require(bounty.status == BountyStatus.Active, "Bounty not active");
        
        bounty.status = BountyStatus.Cancelled;
        
        // Refund remaining funds
        uint256 refund = bounty.remainingReward;
        bounty.remainingReward = 0;
        
        payable(msg.sender).transfer(refund);
        
        emit BountyCancelled(_bountyId, msg.sender);
    }

    /**
     * @dev Get bounty severity rewards
     * @param _bountyId ID of the bounty
     */
    function getBountySeverityRewards(bytes32 _bountyId)
        external
        view
        returns (
            uint256 low,
            uint256 medium,
            uint256 high,
            uint256 critical
        )
    {
        Bounty storage bounty = bounties[_bountyId];
        return (
            bounty.severityRewards[Severity.LOW],
            bounty.severityRewards[Severity.MEDIUM],
            bounty.severityRewards[Severity.HIGH],
            bounty.severityRewards[Severity.CRITICAL]
        );
    }

    /**
     * @dev Get all bounties for a contract
     * @param _contractHash Hash of the contract
     */
    function getContractBounties(bytes32 _contractHash)
        external
        view
        returns (bytes32[] memory)
    {
        return contractBounties[_contractHash];
    }

    /**
     * @dev Get all claims by a researcher
     * @param _researcher Address of the researcher
     */
    function getResearcherClaims(address _researcher)
        external
        view
        returns (bytes32[] memory)
    {
        return researcherClaims[_researcher];
    }
}