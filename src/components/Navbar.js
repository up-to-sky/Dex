// Import the necessary React library to create components
import React from 'react';

// Import hooks from the react-redux library for accessing state and dispatching actions
import { useSelector, useDispatch } from 'react-redux';

// Import the Blockies component for generating identicon avatars
import Blockies from 'react-blockies';

// Import the logo and eth assets for displaying images
import logo from '../assets/logo.png';
import eth from '../assets/eth.svg';

// Import the loadAccount function from the specified location
import { loadAccount } from '../store/interactions';

// Import the configuration data from the config.json file
import config from '../config.json';


const Navbar = () => {
  // Redux state variables
  const provider = useSelector(state => state.provider.connection);
  const chainId = useSelector(state => state.provider.chainId);
  const account = useSelector(state => state.provider.account);
  const balance = useSelector(state => state.provider.balance);

  const dispatch = useDispatch();

  // Handler to connect user's wallet
  const connectHandler = async () => {
    await loadAccount(provider, dispatch);
  };

  // Handler for switching Ethereum network
  const networkHandler = async (e) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.target.value }],
      });
    } catch (error) {
      if (error.code === 4902) {
        console.log("User canceled network switch.");
        // Handle the case where the user canceled the network switch.
      } else {
        console.error("Error while switching network:", error);
      }
    }
  };
  
  // JSX
  return (
    <div className='exchange__header grid'>
      {/* Brand section */}
      <div className='exchange__header--brand flex'>
        <img src={logo} className="logo" alt="Cadex Logo" />
        <h1>Canada Digital Assets Exchange</h1>
      </div>

      {/* Network selection section */}
      <div className='exchange__header--networks flex'>
        <img src={eth} alt="ETH Logo" className='Eth Logo' />
        {chainId && (
          <select name="networks" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : `0`} onChange={networkHandler}>
            <option value="0" disabled>Select network</option>
            <option value="0x7A69">Localhost</option>
            <option value="0xaa36a7">Sepolia</option>
            <option value="0x5">Goerli</option>
          </select>
        )}
      </div>

      {/* Account section */}
      <div className='exchange__header--account flex'>
        {account && (
          <p>
            <small>My Balance</small>
            {Number(balance).toFixed(2)} ETH
          </p>
        )}
        {account ? (
          <a 
            href={config[chainId] ? `${config[chainId].explorerURL}/address/${account}` : `#`}
            target='_blank'
            rel='noreferrer'
          >
            {account.slice(0, 5) + '...' + account.slice(38, 42)}
            <Blockies
              account={account}
              size={10}
              scale={3}
              color='#FF0000' 
              bgColor='#FFFFFF' 
              spotColor='#0000FF' 
              className='identicon'
            />
          </a>
        ) : (
          <button className='button' onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
