const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const MedicalRecord = await hre.ethers.getContractFactory("MedicalRecord");
  
  // Deploy the contract
  const medicalRecord = await MedicalRecord.deploy();
  await medicalRecord.deployed();

  console.log("MedicalRecord deployed to:", medicalRecord.address);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });