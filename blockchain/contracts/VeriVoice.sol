// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VeriVoice {
    struct ComplaintRecord {
        string complaintId;
        string hash;
        uint256 timestamp;
        address submittedBy;
    }

    mapping(string => ComplaintRecord) private complaints;
    mapping(string => bool) private complaintExists;
    uint256 public totalComplaints;

    event ComplaintAnchored(string indexed complaintId, string hash, uint256 timestamp);

    function anchorComplaint(string calldata complaintId, string calldata hash) external {
        require(!complaintExists[complaintId], "Complaint already anchored");
        require(bytes(hash).length == 64, "Invalid SHA-256 hash length");

        complaints[complaintId] = ComplaintRecord({
            complaintId: complaintId,
            hash: hash,
            timestamp: block.timestamp,
            submittedBy: msg.sender
        });

        complaintExists[complaintId] = true;
        totalComplaints++;

        emit ComplaintAnchored(complaintId, hash, block.timestamp);
    }

    function getComplaint(string calldata complaintId) external view returns (string memory hash, uint256 timestamp, address submittedBy) {
        require(complaintExists[complaintId], "Complaint not found");
        ComplaintRecord memory record = complaints[complaintId];
        return (record.hash, record.timestamp, record.submittedBy);
    }

    function verifyHash(string calldata complaintId, string calldata hash) external view returns (bool) {
        if (!complaintExists[complaintId]) return false;
        
        // Return true if strings match
        return keccak256(abi.encodePacked(complaints[complaintId].hash)) == keccak256(abi.encodePacked(hash));
    }

    function complaintAnchored(string calldata complaintId) external view returns (bool) {
        return complaintExists[complaintId];
    }
}
