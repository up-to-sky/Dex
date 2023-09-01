// Import necessary modules and components
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import images for different tokens
import cadex from '../assets/cadex.png';
import usdc from '../assets/usdc.png';
import dai from '../assets/dai.png';

// Import interaction functions from the store
import { loadBalances, transferTokens } from '../store/interactions';

// Define the Balance component
const Balance = () => {
  // State variables for managing UI state
  const [isDeposit, setIsDeposit] = useState(true);
  const [token1TransferAmount, setToken1TransferAmount] = useState(0);
  const [token2TransferAmount, setToken2TransferAmount] = useState(0);

  // Redux hooks for accessing state from the store
  const dispatch = useDispatch();
  const provider = useSelector(state => state.provider.connection);
  const account = useSelector(state => state.provider.account);
  const exchange = useSelector(state => state.exchange.contract);
  const exchangeBalances = useSelector(state => state.exchange.balances);
  const transferInProgress = useSelector(state => state.exchange.transferInProgress);
  const tokens = useSelector(state => state.tokens.contracts);
  const symbols = useSelector(state => state.tokens.symbols);
  const tokenBalances = useSelector(state => state.tokens.balances);

  // Refs for managing DOM elements
  const depositRef = useRef(null);
  const withdrawRef = useRef(null);

  // Handle tab switching
  const tabHandler = (e) => {
    if (e.target.className !== depositRef.current.className) {
      e.target.className = 'tab tab--active';
      depositRef.current.className = 'tab';
      setIsDeposit(false);
    } else {
      e.target.className = 'tab tab--active';
      withdrawRef.current.className = 'tab';
      setIsDeposit(true);
    }
  };

  // Handle amount changes
  const amountHandler = (e, token) => {
    if (token.address === tokens[0].address) {
      setToken1TransferAmount(e.target.value);
    } else {
      setToken2TransferAmount(e.target.value);
    }
  };

  // Handle deposit actions
  const depositHandler = (e, token) => {
    e.preventDefault();
    if (token.address === tokens[0].address) {
      transferTokens(provider, exchange, 'Deposit', token, token1TransferAmount, dispatch)
      setToken1TransferAmount(0)
    } else {
      transferTokens(provider, exchange, 'Deposit', token, token2TransferAmount, dispatch)
      setToken2TransferAmount(0)
    }
  };

  // Handle withdraw actions
  const withdrawHandler = (e, token) => {
    e.preventDefault();
    if (token.address === tokens[0].address) {
      transferTokens(provider, exchange, 'Withdraw', token, token1TransferAmount, dispatch)
      setToken1TransferAmount(0)
    } else {
      transferTokens(provider, exchange, 'Withdraw', token, token2TransferAmount, dispatch)
      setToken2TransferAmount(0)
    }
  };

  // Load balances and tokens when necessary data changes
  useEffect(() => {
    if (exchange && tokens[0] && tokens[1] && account) {
      loadBalances(exchange, tokens, account, dispatch);
    }
  }, [exchange, tokens, account, transferInProgress, dispatch]);
  
  // JSX
  return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Tokens Balances</h2>
        <div className='tabs'>
          <button onClick={tabHandler} ref={depositRef} className='tab tab--active'>Deposit</button>
          <button onClick={tabHandler} ref={withdrawRef} className='tab'>Withdraw</button>
        </div>
      </div>

  {/* Deposit/Withdraw Component 1 (CADEX) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br /><img src={cadex} alt="Token Logo" />CADEX</p>
          <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>
          <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>
        </div>

        <form onSubmit={isDeposit ? (e) => depositHandler(e, tokens[0]) : (e) => withdrawHandler(e, tokens[0])}>
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input
            type="text"
            id='token0'
            placeholder='0.0000'
            value={token1TransferAmount === 0 ? '' : token1TransferAmount}
            onChange={(e) => amountHandler(e, tokens[0])}/>

          <button className='button' type='submit'>
            {isDeposit ? (
                <span>Deposit</span>
            ) : (
                <span>Withdraw</span>
            )}
          </button>
        </form>
      </div>

      <hr />
      
      {/* Deposit/Withdraw Component 2 (USDC or DAI based on the selected market) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
          <p><small>Token</small><br /><img src={symbols[1] === 'USDC' ? usdc : dai} alt="Token Logo" />{symbols && symbols[1]}</p>
          <p><small>Wallet</small><br />{tokenBalances && tokenBalances[1]}</p>
          <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[1]}</p>
        </div>

        <form onSubmit={isDeposit ? (e) => depositHandler(e, tokens[1]) : (e) => withdrawHandler(e, tokens[1])}>
          <label htmlFor="token0">{symbols && symbols[1]} Amount</label>
          <input
            type="text"
            id='token1'
            placeholder='0.0000'
            value={token2TransferAmount === 0 ? '' : token2TransferAmount}
            onChange={(e) => amountHandler(e, tokens[1])}
          />

          <button className='button' type='submit'>
            {isDeposit ? (
                <span>Deposit</span>
            ) : (
                <span>Withdraw</span>
            )}
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
}

export default Balance;