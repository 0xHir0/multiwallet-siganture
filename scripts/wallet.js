const { network } = require('hardhat')

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("network name -----_>" + network.name);
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Wallet = await ethers.getContractFactory("Wallet");
  const wallet = await Wallet.deploy([deployer.address], 1);

  console.log("Wallet address:", wallet.address);
   // We also save the contract's artifacts and address in the frontend directory
   saveFrontendFiles(wallet);
}

function saveFrontendFiles(wallet) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address_wallet.json",
    JSON.stringify({ Wallet: wallet.address }, undefined, 2)
  );

  const WalletArtifact = artifacts.readArtifactSync("Wallet");

  fs.writeFileSync(
    contractsDir + "/Wallet.json",
    JSON.stringify(WalletArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });