// Import the React library for building UI components
import React from 'react';

// Import the useSelector and useDispatch hooks from react-redux for accessing and dispatching Redux actions
import { useSelector, useDispatch } from 'react-redux';

// Import the configuration data from the config.json file
import config from '../config.json';

// Import the loadTokens function from the store interactions module
import { loadTokens } from '../store/interactions';


const Markets = () => {
  // Select data from Redux store
  const provider = useSelector(state => state.provider.connection);
  const chainId = useSelector(state => state.provider.chainId);

  const dispatch = useDispatch();

  const marketHandler = async (e) => {
    // Call the loadTokens function with selected tokens
    loadTokens(provider, e.target.value.split(','), dispatch);
  };
  
  // JSX
  return (
    <div className='component exchange__markets'>
      <div className='component__header'>
        <h2>Select Trading Pairs</h2>
      </div>

      {/* Check if chainId is available and corresponds to config */}
      {chainId && config[chainId] ? (
        <select name="markets" id="markets" onChange={marketHandler}>
          <option value={`${config[chainId].cadex.address},${config[chainId].usdc.address}`}>CADEX / USDC</option>
          <option value={`${config[chainId].cadex.address},${config[chainId].dai.address}`}>CADEX / DAI</option>
        </select>
      ) : (
        <div>
          <p>Not Deployed to Network</p>
        </div>
      )}

      <hr />
    </div>
  );
};

export default Markets;
