const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecord", function () {
    let MedicalRecord;
    let medicalRecord;
    let owner;
    let doctor;
    let patient;

    beforeEach(async function () {
        [owner, doctor, patient] = await ethers.getSigners();
        MedicalRecord = await ethers.getContractFactory("MedicalRecord");
        medicalRecord = await MedicalRecord.deploy();
        await medicalRecord.deployed();
    });

    describe("Patient Registration", function () {
        it("Should allow patient registration", async function () {
            await medicalRecord.connect(patient).registerPatient("John Doe", 946684800, "A+");
            const patientData = await medicalRecord.patients(patient.address);
            expect(patientData.name).to.equal("John Doe");
            expect(patientData.exists).to.equal(true);
        });

        it("Should not allow duplicate registration", async function () {
            await medicalRecord.connect(patient).registerPatient("John Doe", 946684800, "A+");
            await expect(
                medicalRecord.connect(patient).registerPatient("John Doe", 946684800, "A+")
            ).to.be.revertedWith("Patient already registered");
        });
    });

    describe("Doctor Authorization", function () {
        it("Should allow owner to authorize doctor", async function () {
            await medicalRecord.authorizeDoctor(doctor.address);
            expect(await medicalRecord.authorizedDoctors(doctor.address)).to.equal(true);
        });

        it("Should allow owner to revoke doctor", async function () {
            await medicalRecord.authorizeDoctor(doctor.address);
            await medicalRecord.revokeDoctor(doctor.address);
            expect(await medicalRecord.authorizedDoctors(doctor.address)).to.equal(false);
        });
    });
});