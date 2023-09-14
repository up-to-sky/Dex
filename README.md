# Decentralized-Exchange

Welcome to the `Decentralized-Exchange` repository. This project represents a decentralized exchange designed to operate on the ERC-20 token standard. The core objective of this endeavor is to establish a transparent and secure platform for the seamless trading of digital assets leveraging blockchain technology. As staunch advocates of open-source principles, we have chosen to make our codebase accessible to the public, enabling thorough review and active contribution.

## Table of Contents
- [Verification and Security](#verification-and-security)
- [Commented Code](#commented-code)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Testing](#testing)
- [Smart Contracts](#smart-contracts)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Contribution](#contribution)
- [License](#license)
- [Project Updates](#project-updates)
- [Further Insights](#further-insights)
- [Donations](#donations)


## Verification and Security

Each modification to this project undergoes a meticulous verification process and subsequent signing. This stringent approach guarantees the authenticity and integrity of our codebase. In case you encounter any modifications that lack appropriate verification, we strongly advise against cloning or utilizing them, as they might harbor malicious code.

## Commented Code

**Please take note:** Our codebase is meticulously documented with comprehensive comments, aimed at providing a clear understanding of the functionality of individual components.

## Getting Started

To initiate the decentralized exchange interface, kindly adhere to the subsequent steps:

1. Clone this repository onto your local workstation.

```bash
git clone https://github.com/Innovation-Web-3-0-Blockchain/Decentralized-Exchange.git
```

2. Ensure you have `node.js` and `npm` installed in your environment.

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

## Configuration

For an example on what the **config.json** file should included please visti the [Configuration File](./src/store/config.json)

**Note** if you create a different tokens you need to modified the tokens adresses 

## Deploying Smart Contracts Testnet

To embark on the deployment of smart contracts onto the testnet blockchain, adhere to the ensuing protocol:

1. Create and Setup **.env** File and sett your deployment environment by adding the network you want to use for the Hardhat node. We recommend using your own RPC URL for better reliability. You can create your own Web3 API keys on the Infura website: [Infura](https://www.infura.io/)

   ```env
   API_KEY=""        // Insert your Web3 API key between the quotation marks
   PRIVATE_KEY=""    // Insert your wallets private key between the quotation marks
```

2. Initiate the Hardhat node via the subsequent command:

```bash
npx hardhat node
```
3. With the node operational, deploy the smart contracts using the script provided:

```bash
npx hardhat run --network goerli scripts/1_deploy.js
```

## Contribution

Community contributions are enthusiastically welcomed. Should you identify bugs, possess feature requests, or harbor intentions of enhancing the project, we extend an invitation to open an issue or submit a pull request.

We extend our gratitude for exploring our project. Your interest is sincerely appreciated.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Updates

As a dynamic project operating in the ever-evolving ecosystem of blockchain technology and the cryptospace, we are committed to continuous learning and improvement. We will regularly update this project to modernize and moderate it in line with the latest developments and best practices. Stay tuned for updates and improvements!

## Further Insights

For a more profound comprehension of Create React, React, and Fleek we direct your attention to the subsequent resources:

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Fleek's Documentation](https://docs.fleek.co/)

## Donations

### Our Values

We do not use any form of social media or engage in marketing activities. Our principles are rooted in open source and privacy, and we do not receive compensation for our contributions to GitHub. Furthermore, we do not endorse or have affiliations with any other projects.

### Supporting Us

While we remain committed to providing valuable resources for aspiring blockchain developers, any donations are greatly appreciated. Your support will help us offset the time and effort we invest in these projects to facilitate access to accessible information.

### Donation Options

We welcome contributions in Bitcoin and Monero, and you can send contributions by scanning one of the addresses in the QR codes at the following link: [Donate to Innovation Web 3.0](https://innovationweb3.github.io/)

Thank you for your support and for being part of our community!