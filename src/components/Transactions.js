// Import the `useSelector` hook from the 'react-redux' library.
import { useSelector } from 'react-redux';

// Import the `myOpenOrdersSelector` selector from the '../store/selectors' module.
import { myOpenOrdersSelector } from '../store/selectors';

// Import the 'sort.svg' file from the '../assets' directory.
import sort from '../assets/sort.svg';

// Import the `Banner` component from the './Banner' module.
import Banner from './Banner';

// Define the Transactions component
const Transactions = () => {
  // Get the symbols from the Redux state
  const symbols = useSelector((state) => state.tokens.symbols);

  // Get the user's open orders using a selector
  const myOpenOrders = useSelector(myOpenOrdersSelector);

  // JSX
  return (
    <div className="component exchange__transactions">
      <div>
        <div className='component__header flex-between'>
          <h2>Open Trades</h2>

          <div className='tabs'>
            <button className='tab tab--active'>Orders</button>
            <button className='tab'>Trades</button>
          </div>
        </div>

        {!myOpenOrders || myOpenOrders.length === 0 ? (
          <Banner text='No Open Orders'/>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                <th>Price<img src={sort} alt="Sort" /></th>
                <th></th>
              </tr>
            </thead>
            <tbody>

              {myOpenOrders && myOpenOrders.map((order, index) => {
                return(
                  <tr key={index}>
                    <td style={{ color: `${order.orderTypeClass}` }}>{order.token0Amount}</td>
                    <td>{order.tokenPrice}</td>
                    <td>{/* Cancel order */}</td>
                  </tr>
                )
              })}

            </tbody>
          </table>
        )}



      </div>

      {/* <div> */}
        {/* <div className='component__header flex-between'> */}
          {/* <h2>My Transactions</h2> */}

          {/* <div className='tabs'> */}
            {/* <button className='tab tab--active'>Orders</button> */}
            {/* <button className='tab'>Trades</button> */}
          {/* </div> */}
        {/* </div> */}

        {/* <table> */}
          {/* <thead> */}
            {/* <tr> */}
              {/* <th></th> */}
              {/* <th></th> */}
              {/* <th></th> */}
            {/* </tr> */}
          {/* </thead> */}
          {/* <tbody> */}

            {/* <tr> */}
              {/* <td></td> */}
              {/* <td></td> */}
              {/* <td></td> */}
            {/* </tr> */}

          {/* </tbody> */}
        {/* </table> */}

      {/* </div> */}
    </div>
  )
}

export default Transactions;