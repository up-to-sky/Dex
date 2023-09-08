// Import the useEffect hook from the 'react' library
import { useEffect } from 'react';

// Import the useDispatch function from 'react-redux' for managing Redux actions
import { useDispatch } from 'react-redux';

// Import configuration data from the 'config.json' file
import config from '../config.json';

// Import Redux actions and components
import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  loadAllOrders,
  subscribeToEvents
} from '../store/interactions';
import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance';
import Order from './Order';
import PriceChart from './PriceChart';
import Transactions from './Transactions';
import Trades from './Trades';
import OrderBook from './OrderBook';
import Alert from './Alert';

// Main App component
function App() {
  const dispatch = useDispatch();

  // Function to load blockchain data
  const loadBlockchainData = async () => {
    // Connect Ethers to the blockchain
    const provider = loadProvider(dispatch);

    // Fetch the current network's chainId
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when the network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch);
    });

    // Load token smart contracts
    const cadex = config[chainId].cadex;
    const usdc = config[chainId].usdc;
    const dai = config[chainId].dai;
    await loadTokens(provider, [cadex.address, usdc.address, dai.address], dispatch);

    // Load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch);

    // Fetch all orders: open, filled, cancelled
    loadAllOrders(provider, exchange, dispatch)

    // Listen to events
    subscribeToEvents(exchange, dispatch);
  };

  useEffect(() => {
    // Load blockchain data on component mount
    loadBlockchainData();
  });
  
  // JSX
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>
          
          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />

          <Transactions />

          <Trades />

          <OrderBook />

        </section>
      </main>

      <Alert />
    </div>
  );
}

export default App;
