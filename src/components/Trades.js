// --------------------------------------------------------------------------------------------
// Import Nececessary Hooks & Components
// --------------------------------------------------------------------------------------------

import sort from '../assets/sort.svg';
import Banner from './Banner';
import { useSelector } from 'react-redux';
import { filledOrdersSelector } from '../store/selectors';

// --------------------------------------------------------------------------------------------
// Define The Trades Components
// --------------------------------------------------------------------------------------------

const Trades = () => {
  // Get symbols from the Redux store
  const symbols = useSelector(state => state.tokens.symbols);

  // Get filledOrders using the filledOrdersSelector
  const filledOrders = useSelector(filledOrdersSelector);

// --------------------------------------------------------------------------------------------
// JSX For Rendering The Components
// --------------------------------------------------------------------------------------------
  
  return (
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2>Trades</h2>
      </div>

      {!filledOrders || filledOrders.length === 0 ? (
        // Display a banner when there are no transactions
        <Banner text='No Transactions' />
      ) : (
        <table>
          <thead>
            <tr>
              <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
              <th>Price<img src={sort} alt="Sort" /></th>
              <th>Time<img src={sort} alt="Sort" /></th>
            </tr>
          </thead>
          <tbody>
          
            {/* Map through filledOrders and render each order */}
            {filledOrders && filledOrders.map((order, index) => {
              return (
                <tr key={index}>
                  <td style={{ color: `${order.tokenPriceClass}` }}>{order.token0Amount}</td>
                  <td>{order.tokenPrice}</td>
                  <td>{order.formattedTimestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Trades;