// Importing the `useSelector` hook from the 'react-redux' library.
import { useSelector } from 'react-redux';

// Importing the 'sort' image from the '../assets' directory.
import sort from '../assets/sort.svg';

// Importing the `filledOrdersSelector` function from the '../store/selectors' module.
import { filledOrdersSelector } from '../store/selectors';

// Importing the 'Banner' component from the './Banner' module.
import Banner from './Banner';

const Trades = () => {
  // Get symbols from the Redux store
  const symbols = useSelector(state => state.tokens.symbols);

  // Get filledOrders using the filledOrdersSelector
  const filledOrders = useSelector(filledOrdersSelector);

  // JSX
  return (
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2>Filled Trades</h2>
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