// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MedicalRecord is Ownable, ReentrancyGuard {
    struct Patient {
        string name;
        uint256 dateOfBirth;
        string bloodType;
        bool exists;
    }
    
    struct Record {
        string diagnosis;
        string prescription;
        string doctorName;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(address => Patient) public patients;
    mapping(address => Record[]) public medicalRecords;
    mapping(address => bool) public authorizedDoctors;
    
    event PatientRegistered(address indexed patientAddress, string name);
    event RecordAdded(address indexed patientAddress, string diagnosis, uint256 timestamp);
    event DoctorAuthorized(address indexed doctorAddress);
    event DoctorRevoked(address indexed doctorAddress);
    
    modifier onlyDoctor() {
        require(authorizedDoctors[msg.sender], "Not authorized as doctor");
        _;
    }
    
    function registerPatient(string memory _name, uint256 _dateOfBirth, string memory _bloodType) external {
        require(!patients[msg.sender].exists, "Patient already registered");
        
        patients[msg.sender] = Patient({
            name: _name,
            dateOfBirth: _dateOfBirth,
            bloodType: _bloodType,
            exists: true
        });
        
        emit PatientRegistered(msg.sender, _name);
    }
    
    function authorizeDoctor(address _doctor) external onlyOwner {
        require(!authorizedDoctors[_doctor], "Doctor already authorized");
        authorizedDoctors[_doctor] = true;
        emit DoctorAuthorized(_doctor);
    }
    
    function revokeDoctor(address _doctor) external onlyOwner {
        require(authorizedDoctors[_doctor], "Doctor not authorized");
        authorizedDoctors[_doctor] = false;
        emit DoctorRevoked(_doctor);
    }
    
    function addMedicalRecord(
        address _patientAddress,
        string memory _diagnosis,
        string memory _prescription,
        string memory _doctorName
    ) external onlyDoctor nonReentrant {
        require(patients[_patientAddress].exists, "Patient does not exist");
        
        medicalRecords[_patientAddress].push(Record({
            diagnosis: _diagnosis,
            prescription: _prescription,
            doctorName: _doctorName,
            timestamp: block.timestamp,
            exists: true
        }));
        
        emit RecordAdded(_patientAddress, _diagnosis, block.timestamp);
    }
    
    function getPatientRecords(address _patientAddress) external view returns (Record[] memory) {
        require(
            msg.sender == _patientAddress || authorizedDoctors[msg.sender],
            "Not authorized to view records"
        );
        return medicalRecords[_patientAddress];
    }
}