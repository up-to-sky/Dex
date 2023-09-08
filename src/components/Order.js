// ------------------------------------------------------------------------------------------
// Import Nececessary Hooks & Components
// ------------------------------------------------------------------------------------------

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeBuyOrder, makeSellOrder } from '../store/interactions';

// ------------------------------------------------------------------------------------------
// Define The Order Components
// ------------------------------------------------------------------------------------------

const Order = () => {
  // State variables
  const [isBuy, setIsBuy] = useState(true);
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  // Redux state selectors
  const provider = useSelector(state => state.provider.connection);
  const tokens = useSelector(state => state.tokens.contracts);
  const exchange = useSelector(state => state.exchange.contract);

  const dispatch = useDispatch();

// ------------------------------------------------------------------------------------------
// Define A Function To Handle Tab Button Clicks
// ------------------------------------------------------------------------------------------

  // Refs for tabs
  const buyRef = useRef(null);
  const sellRef = useRef(null);

  // Handler for switching between Buy and Sell tabs
  const tabHandler = (e) => {
    if (e.target.className !== buyRef.current.className) {
      e.target.className = 'tab tab--active';
      buyRef.current.className = 'tab';
      setIsBuy(false);
    } else {
      e.target.className = 'tab tab--active';
      sellRef.current.className = 'tab';
      setIsBuy(true);
    }
  };

// ------------------------------------------------------------------------------------------
// Handler for Buy & Sell Order Submission
// ------------------------------------------------------------------------------------------

  const buyHandler = (e) => {
    e.preventDefault();
    makeBuyOrder(provider, exchange, tokens, { amount, price }, dispatch);
    setAmount(0);
    setPrice(0);
  };

  const sellHandler = (e) => {
    e.preventDefault();
    makeSellOrder(provider, exchange, tokens, { amount, price }, dispatch);
    setAmount(0);
    setPrice(0);
  };
  
// ------------------------------------------------------------------------------------------
// JSX For Rendering The Components
// ------------------------------------------------------------------------------------------

  return (
    <div className="component exchange__orders">
      <div className='component__header flex-between'>
        <h2>Make Orders</h2>
        <div className='tabs'>
          <button onClick={tabHandler} ref={buyRef} className='tab tab--active'>Buy</button>
          <button onClick={tabHandler} ref={sellRef} className='tab'>Sell</button>
        </div>
      </div>

      <form onSubmit={isBuy ? buyHandler : sellHandler}>

        {/* Conditionally render labels based on Buy/Sell */}
        <label htmlFor="amount">{isBuy ? 'Buy Amount' : 'Sell Amount'}</label>
        <input
          type="text"
          id='amount'
          placeholder='0.0000'
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="price">{isBuy ? 'Buy Price' : 'Sell Price'}</label>
        <input
          type="text"
          id='price'
          placeholder='0.0000'
          value={price === 0 ? '' : price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Conditionally render button text based on Buy/Sell */}
        <button className='button button--filled' type='submit'>
          {isBuy ? <span>Buy Order</span> : <span>Sell Order</span>}
        </button>
      </form>
    </div>
  );
}

export default Order;
