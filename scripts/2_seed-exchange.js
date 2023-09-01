const config = require('../src/config.json');  // Import configuration file

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');  // Function to convert a value to token units
};

const wait = (seconds) => {
  const milliseconds = seconds * 1000;  // Convert seconds to milliseconds
  return new Promise(resolve => setTimeout(resolve, milliseconds));  // Return a promise that resolves after the specified time
};

async function main() {
  // Fetch network
  const { chainId } = await ethers.provider.getNetwork();  // Get the network chain ID
  console.log('Using chainId:', chainId);

  // Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners();  // Get the Ethereum accounts

  // Fetch deployed tokens
  const cadex = await ethers.getContractAt('Token', config[chainId].cadex.address);  // Get CADEX token contract instance
  console.log(`CADEX Token fetched: ${cadex.address}\n`);

  const usdc = await ethers.getContractAt('Token', config[chainId].usdc.address);  // Get USDC token contract instance
  console.log(`USD Coin fetched: ${usdc.address}\n`);

  const dai = await ethers.getContractAt('Token', config[chainId].dai.address);  // Get DAI token contract instance
  console.log(`DAI Token fetched: ${dai.address}\n`);

  // Fetch the deployed exchange
  const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address);  // Get exchange contract instance
  console.log(`Exchange fetched: ${exchange.address}\n`);

  // Give tokens to account[1]
  const sender = accounts[0];
  const receiver = accounts[1];
  let amount = tokens(10000);  // Convert 10000 to token units

  // User1 transfers 10,000 USDC...
  let transaction, result;
  transaction = await usdc.connect(sender).transfer(receiver.address, amount);  // Transfer tokens from sender to receiver
  
  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`);
  // User1 transfers 10,000 DAI...
  transaction = await dai.connect(sender).transfer(receiver.address, amount);
  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`);

  // Set up exchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000);  // Reset the amount to 10000 token units

  // User1 approves 10,000 CADEX
  transaction = await cadex.connect(user1).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}`);

  // User1 deposits 10,000 CADEX
  transaction = await exchange.connect(user1).depositToken(cadex.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} tokens from ${user1.address}\n`);

  // User2 approves USDC
  transaction = await usdc.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}`);

  // User2 deposits USDC
  transaction = await exchange.connect(user2).depositToken(usdc.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} tokens from ${user2.address}\n`);
  
  // User2 approves DAI
  transaction = await dai.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}`);
  
  // User2 deposits DAI
  transaction = await exchange.connect(user2).depositToken(dai.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} tokens from ${user2.address}\n`);

  // ... (approval and deposit operations for CADEX, USDC, and DAI for user1 and user2 omitted for brevity)

// ----------------------------------------------------------------------------------------------------------
// Seed a cancelled order
// ----------------------------------------------------------------------------------------------------------

  // User1 makes order to get tokens
  let orderId
  transaction = await exchange.connect(user1).makeOrder(usdc.address, tokens(100), cadex.address, tokens(5))
  result = await transaction.wait()
  console.log(`Order made from ${user1.address}`)

  // User1 cancels order 
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user1).cancelOrder(orderId)
  result = await transaction.wait()
  console.log(`Order cancelled from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // ... (cancellation operation omitted for brevity)

// -----------------------------------------------------------------------------------------------------------
// Seed filled orders
// -----------------------------------------------------------------------------------------------------------

  // User 1 makes order
  transaction = await exchange.connect(user1).makeOrder(usdc.address, tokens(100), cadex.address, tokens(10))
  result = await transaction.wait()
  console.log(`Order made from ${user1.address}`)

  // User 2 fills order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Order filled from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // ... (order and filling operations omitted for brevity)

  // User 1 makes another order
  transaction = await exchange.makeOrder(usdc.address, tokens(50), cadex.address, tokens(15))
  result = await transaction.wait()
  console.log(`Order made from ${user1.address}`)

  // User 2 fills another order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Order filled from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // ... (more order and filling operations omitted for brevity)

  // User 1 makes final order
  transaction = await exchange.connect(user1).makeOrder(usdc.address, tokens(200), cadex.address, tokens(20))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // User 2 fills final order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // ... (more order and filling operations omitted for brevity)

// --------------------------------------------------------------------------------------------------------------
// Seed Open orders
// --------------------------------------------------------------------------------------------------------------

  // User1 makes 10 orders 
  for (let i = 1; i <= 10; i++) {
  transaction = await exchange.connect(user1).makeOrder(usdc.address, tokens(10), cadex.address, tokens(10 * i));
  result = await transaction.wait();
  console.log(`Order made from ${user1.address}`);

  // Wait 1 second
  await wait(1);
}

// User2 makes 10 orders 
for (let i = 1; i <= 10; i++) {
  transaction = await exchange.connect(user2).makeOrder(cadex.address, tokens(10), usdc.address, tokens(10 * i));
  result = await transaction.wait();
  console.log(`Order made from ${user2.address}`);

  // Wait 1 second
  await wait(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
