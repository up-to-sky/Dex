// --------------------------------------------------------------------------------------------
// Import Nececessary Hooks & Components
// --------------------------------------------------------------------------------------------

import sort from '../assets/sort.svg'; 
import { fillOrder } from '../store/interactions'; 
import { orderBookSelector } from '../store/selectors'; 
import { useDispatch, useSelector } from 'react-redux'; 

// --------------------------------------------------------------------------------------------
// Define The OrderBook Components
// --------------------------------------------------------------------------------------------

const OrderBook = () => {
  // Access data from the Redux store using useSelector
  const provider = useSelector(state => state.provider.connection);
  const exchange = useSelector(state => state.exchange.contract);
  const symbols = useSelector(state => state.tokens.symbols);
  const orderBook = useSelector(orderBookSelector);

  const dispatch = useDispatch(); // Get the dispatch function

// --------------------------------------------------------------------------------------------
// Handler Function For Filling An Order
// --------------------------------------------------------------------------------------------

  const fillOrderHandler = (order) => {
    fillOrder(provider, exchange, order, dispatch);
  }  

// --------------------------------------------------------------------------------------------
// JSX For Rendering The Components
// --------------------------------------------------------------------------------------------

  return (
    <div className="component exchange__orderbook">
      <div className='component__header flex-between'>
        <h2>Order Book</h2>
      </div>

      <div className="flex">

        {/* Display Buy Orders */}
        {!orderBook || orderBook.buyOrders.length === 0 ? (
          <p className='flex-center'>No Buy Orders</p>
        ) : (
          <table className='exchange__orderbook--buy'>
            <caption>Buying</caption>
            <thead>
              <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                <th>Buy Price<img src={sort} alt="Sort" /></th>
                <th>{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>
              </tr>
            </thead>
            <tbody>

              {/* Map Buy Orders */}
              {orderBook && orderBook.buyOrders.map((order, index) => {
                return (
                  <tr key={index} onClick={() => fillOrderHandler(order)}>
                    <td>{order.token0Amount}</td>
                    <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                    <td>{order.token1Amount}</td>
                  </tr>
                  )
                })}

            </tbody>
          </table>
        )}

        <div className='divider'></div>

        {/* Display Sell Orders */}
        {!orderBook || orderBook.sellOrders.length === 0 ? (
          <p className='flex-center'>No Sell Orders</p>
        ) : (
          <table className='exchange__orderbook--sell'>
            <caption>Selling</caption>
            <thead>
              <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                <th>Sell Price<img src={sort} alt="Sort" /></th>
                <th>{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>
              </tr>
            </thead>
            <tbody>

              {/* Map Sell Orders */}
              {orderBook && orderBook.sellOrders.map((order, index) => {
                return(
                <tr key={index} onClick={() => fillOrderHandler(order)}>
                  <td>{order.token0Amount}</td>
                  <td style={{ color: `${order.orderTypeClass}` }}>{order.tokenPrice}</td>
                  <td>{order.token1Amount}</td>
                </tr>
                )
              })}

            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default OrderBook;
