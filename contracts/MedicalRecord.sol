// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MedicalRecord is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _recordIds;

    struct Patient {
        string name;
        uint256 dateOfBirth;
        string bloodType;
        bool exists;
        string encryptionKey; // Public key for encryption
        mapping(address => bool) authorizedDoctors;
    }
    
    struct Record {
        uint256 id;
        string ipfsHash;
        string encryptedData;
        string metadata;
        address doctor;
        uint256 timestamp;
        bool exists;
    }
    
    struct Doctor {
        string name;
        string specialization;
        string license;
        bool exists;
    }
    
    mapping(address => Patient) public patients;
    mapping(address => Record[]) private medicalRecords;
    mapping(address => Doctor) public doctors;
    mapping(address => mapping(address => bool)) public accessPermissions;
    
    event PatientRegistered(address indexed patientAddress, string name);
    event RecordAdded(address indexed patientAddress, uint256 indexed recordId, string ipfsHash);
    event DoctorRegistered(address indexed doctorAddress, string name);
    event AccessGranted(address indexed patientAddress, address indexed doctorAddress);
    event AccessRevoked(address indexed patientAddress, address indexed doctorAddress);
    
    modifier onlyDoctor() {
        require(doctors[msg.sender].exists, "Not authorized as doctor");
        _;
    }
    
    modifier onlyAuthorized(address patientAddress) {
        require(
            msg.sender == patientAddress || 
            accessPermissions[patientAddress][msg.sender],
            "Not authorized"
        );
        _;
    }
    
    function registerPatient(
        string memory _name, 
        uint256 _dateOfBirth, 
        string memory _bloodType,
        string memory _encryptionKey
    ) external {
        require(!patients[msg.sender].exists, "Patient already registered");
        
        Patient storage newPatient = patients[msg.sender];
        newPatient.name = _name;
        newPatient.dateOfBirth = _dateOfBirth;
        newPatient.bloodType = _bloodType;
        newPatient.encryptionKey = _encryptionKey;
        newPatient.exists = true;
        
        emit PatientRegistered(msg.sender, _name);
    }
    
    function registerDoctor(
        string memory _name,
        string memory _specialization,
        string memory _license
    ) external {
        require(!doctors[msg.sender].exists, "Doctor already registered");
        
        doctors[msg.sender] = Doctor({
            name: _name,
            specialization: _specialization,
            license: _license,
            exists: true
        });
        
        emit DoctorRegistered(msg.sender, _name);
    }
    
    function grantAccess(address _doctor) external {
        require(patients[msg.sender].exists, "Patient not registered");
        require(doctors[_doctor].exists, "Doctor not registered");
        accessPermissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }
    
    function revokeAccess(address _doctor) external {
        require(patients[msg.sender].exists, "Patient not registered");
        accessPermissions[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }
    
    function addMedicalRecord(
        address _patientAddress,
        string memory _ipfsHash,
        string memory _encryptedData,
        string memory _metadata
    ) external onlyDoctor onlyAuthorized(_patientAddress) {
        require(patients[_patientAddress].exists, "Patient does not exist");
        
        _recordIds.increment();
        uint256 newRecordId = _recordIds.current();
        
        medicalRecords[_patientAddress].push(Record({
            id: newRecordId,
            ipfsHash: _ipfsHash,
            encryptedData: _encryptedData,
            metadata: _metadata,
            doctor: msg.sender,
            timestamp: block.timestamp,
            exists: true
        }));
        
        emit RecordAdded(_patientAddress, newRecordId, _ipfsHash);
    }
    
    function getPatientRecords(address _patientAddress) 
        external 
        view 
        onlyAuthorized(_patientAddress) 
        returns (Record[] memory) 
    {
        return medicalRecords[_patientAddress];
    }
    
    function getPatientEncryptionKey(address _patientAddress)
        external
        view
        onlyAuthorized(_patientAddress)
        returns (string memory)
    {
        return patients[_patientAddress].encryptionKey;
    }
}