# Canada-DigitalAssets-Exchange - Decentralized Exchange

Welcome to the Canada-DigitalAssets-Exchange repository. This project represents a decentralized exchange designed to operate on the ERC-20 token standard. The core objective of this endeavor is to establish a transparent and secure platform for the seamless trading of digital assets leveraging blockchain technology. As staunch advocates of open-source principles, we have chosen to make our codebase accessible to the public, enabling thorough review and active contribution.

## Verification and Security

Each modification to this project undergoes a meticulous verification process and subsequent signing. This stringent approach guarantees the authenticity and integrity of our codebase. In case you encounter any modifications that lack appropriate verification, we strongly advise against cloning or utilizing them, as they might harbor malicious code.

## Commented Code

**Please take note:** Our codebase is meticulously documented with comprehensive comments, aimed at providing a clear understanding of the functionality of individual components.

## Getting Started

To initiate the decentralized exchange interface, kindly adhere to the subsequent steps:

1. Clone this repository onto your local workstation.

2. Confirm the presence of Node.js and npm within your environment.

3. Proceed to install the requisite dependencies by executing the following command:

```bash
npm install
```

A listing of project dependencies can be found within the `package.json` file.

4. Commence operation of the development server through the command:

```bash
npm start
```

Upon successful execution, the application will be accessible via your browser at [http://localhost:3000](http://localhost:3000).

## Deployment

Should you aspire to deploy the decentralized exchange to a production environment, execute the ensuing command to generate a production-ready build within the `build` directory:

```bash
npm run build
```

**Note:** The `npm run eject` command constitutes an irreversible operation and should be approached with caution. It grants the ability to customize build tools and configuration choices but lacks the option to revert these changes.

## Further Insights

For a more profound comprehension of Create React App and React, we direct your attention to the subsequent resources:

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)

## Testing

For the testing of specific functions inherent to the exchange, we recommend the utilization of Hardhat in tandem with the provided test script. To test Exchange contract functions, for instance, execute the following:

```bash
npx hardhat test test/Exchange.js
```

To initiate tests for the entire project, execute the ensuing command:

```bash
npx hardhat test
```

## Smart Contracts

This project encompasses two principal contracts:

1. Exchange Token Contract: An ERC-20 compliant token contract pivotal to trading within the exchange.

2. Exchange Contract: Serving as the nucleus of exchange functionality, this contract facilitates the seamless trading of tokens.

## Scripts

Two pivotal scripts grace this project:

1. `1_deploy.js`: Orchestrates the deployment of smart contracts.
2. `2_seed-exchange.js`: Establishes the foundational elements of exchange functionality.

## Deploying Smart Contracts

To embark on the deployment of smart contracts onto the blockchain, adhere to the ensuing protocol:

1. Initiate the Hardhat node via the subsequent command:

```bash
npx hardhat node
```

2. With the node operational, deploy the smart contracts using the script provided:

```bash
npx hardhat run --network localhost scripts/1_deploy.js
```

## Configuration

The `config.json` file in the repository contains the following components:

### Local Blockchain (31337):

- **Exchange:** Ethereum address for the exchange contract: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- **CADex:** Ethereum address for CADex contract: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **DAI:** Ethereum address for DAI contract: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **USDC:** Ethereum address for USDC contract: `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`
- **Explorer URL:** Local explorer URL: `#`

### Ethereum Mainnet (11155111):

- **Explorer URL:** Sepolia testnet explorer URL: `https://sepolia.etherscan.io/`

### Goerli Testnet (5):

- **Explorer URL:** Goerli testnet explorer URL: `https://goerli.etherscan.io/`

## Contribution

Community contributions are enthusiastically welcomed. Should you identify bugs, possess feature requests, or harbor intentions of enhancing the project, we extend an invitation to open an issue or submit a pull request.

We extend our gratitude for exploring our project. Your interest is sincerely appreciated.