// -----------------------------------------------------------------------------------------------------
// Import Nececessary Hooks & Components
// -----------------------------------------------------------------------------------------------------

import sort from '../assets/sort.svg';
import Banner from './Banner';
import { cancelOrder } from '../store/interactions';
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { myOpenOrdersSelector, myFilledOrdersSelector } from '../store/selectors';

// ----------------------------------------------------------------------------------------------------
// Define The Transactions Components
// ----------------------------------------------------------------------------------------------------

const Transactions = () => {
  // State to determine whether to show open orders or my transactions
  const [showMyOrders, setShowMyOrders] = useState(true);

  // Retrieve the 'provider' from the Redux state using the 'useSelector' hook.
  const provider = useSelector((state) => state.provider.connection);

   // Retrieve the 'exchange' from the Redux state using the 'useSelector' hook.
  const exchange = useSelector((state) => state.exchange.contract);

  // Get the symbols from the Redux state
  const symbols = useSelector((state) => state.tokens.symbols);

  // Get the user's open orders using a selector
  const myOpenOrders = useSelector(myOpenOrdersSelector);
  const myFilledOrders = useSelector(myFilledOrdersSelector);

  const dispatch = useDispatch();

// -----------------------------------------------------------------------------------------------------
// Define A Function To Handle Tab Button Clicks
// -----------------------------------------------------------------------------------------------------

  // Refs for tab buttons
  const tradeRef = useRef(null);
  const orderRef = useRef(null);

  // Handler for switching between Order and Trade tabs
  const tabHandler = (e) => {
    if (e.target.className !== orderRef.current.className) {
      e.target.className = 'tab tab--active';
      orderRef.current.className = 'tab';
      setShowMyOrders(false);
    } else {
      e.target.className = 'tab tab--active';
      tradeRef.current.className = 'tab';
      setShowMyOrders(true);
    }
  };

// ------------------------------------------------------------------------------------------------------
// Define A Function CancelHandler' That Takes An 'Order' As An Argument.
// ------------------------------------------------------------------------------------------------------

  const cancelHandler = (order) => {
    // Call the 'cancelOrder' function with 'provider', 'exchange', 'order', and 'dispatch' as arguments.
    cancelOrder(provider, exchange, order, dispatch);
  };

// ------------------------------------------------------------------------------------------------------
// JSX For Rendering The Components
// ------------------------------------------------------------------------------------------------------

  return (
    <div className="component exchange__transactions">
      {showMyOrders ? (
        <div>
          <div className="component__header flex-between">
            <h2>Open Orders</h2>

            <div className="tabs">
              <button onClick={tabHandler} ref={orderRef} className="tab tab--active">
                Orders
              </button>
              <button onClick={tabHandler} ref={tradeRef} className="tab">
                Trades
              </button>
            </div>
          </div>

          {!myOpenOrders || myOpenOrders.length === 0 ? (
            <Banner text="No Open Orders" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    {symbols && symbols[0]}
                    <img src={sort} alt="Sort" />
                  </th>
                  <th>
                    Price
                    <img src={sort} alt="Sort" />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {myOpenOrders &&
                  myOpenOrders.map((order, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ color: `${order.orderTypeClass}` }}>
                          {order.token0Amount}
                        </td>
                        <td>{order.tokenPrice}</td>
                        <td>
                          <button className="button--sm" onClick={() => cancelHandler(order)}>
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          <div className="component__header flex-between">
            <h2>Filled Orders</h2>

            <div className="tabs">
              <button onClick={tabHandler} ref={orderRef} className="tab tab--active">
                Orders
              </button>
              <button onClick={tabHandler} ref={tradeRef} className="tab">
                Trades
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>
                  {symbols && symbols[0]}
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  Price
                  <img src={sort} alt="Sort" />
                </th>
                <th>
                  Time
                  <img src={sort} alt="Sort" />
                </th>
              </tr>
            </thead>
            <tbody>
              {myFilledOrders &&
                myFilledOrders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ color: `${order.orderClass}` }}>
                        {order.orderSign}
                        {order.token0Amount}
                      </td>
                      <td>{order.tokenPrice}</td>
                      <td>{order.formattedTimestamp}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
