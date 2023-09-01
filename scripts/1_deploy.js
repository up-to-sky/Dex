async function main() {
  console.log(`Preparing deployment...\n`);

  // Fetch contract factories for Token and Exchange contracts
  const Token = await ethers.getContractFactory('Token');
  const Exchange = await ethers.getContractFactory('Exchange');

  // Fetch Ethereum accounts (signers)
  const accounts = await ethers.getSigners();

  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`);

  // Deploy Token contracts
  const cadex = await Token.deploy('Canada DigitalAssets Exchange', 'CADEX', '1000000');
  await cadex.deployed();
  console.log(`CADEX Deployed to: ${cadex.address}`);

  const dai = await Token.deploy('Dai Stablecoin', 'DAI', '1000000');
  await dai.deployed();
  console.log(`DAI Deployed to: ${dai.address}`);

  const usdc = await Token.deploy('USD Coin', 'USDC', '1000000');
  await usdc.deployed();
  console.log(`USDC Deployed to: ${usdc.address}`);

  // Deploy Exchange contract with a specific account and parameter
  const exchange = await Exchange.deploy(accounts[1].address, 3);
  await exchange.deployed();
  console.log(`Exchange Deployed to: ${exchange.address}`);
}

// Execute the main deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

