// Import Redux hook for accessing the store state
import { useSelector } from 'react-redux';

// Import ApexCharts component for rendering charts
import Chart from 'react-apexcharts';

// Import arrow images for indicating price change direction
import arrowDown from '../assets/downArrow.png';
import arrowUp from '../assets/upArrow.png';

// Import chart configuration options and default series data
import { options, defaultSeries } from './PriceChart.config';

// Import selector for fetching price chart data from the Redux store
import { priceChartSelector } from '../store/selectors';

// Import Banner component for displaying a message
import Banner from './Banner';

// Define the PriceChart component
const PriceChart = () => {
  // Retrieve data from the Redux store
  const account = useSelector(state => state.provider.account);
  const symbols = useSelector(state => state.tokens.symbols);
  const priceChart = useSelector(priceChartSelector);

  // JSX
  return (
    <div className="component exchange__chart">
      <div className='component__header flex-between'>
        <div className='flex'>
          {/* Display trading pair */}
          <h2>{symbols && `${symbols[0]} / ${symbols[1]}`}</h2> &nbsp; &nbsp;

          {priceChart && (
            <div className='flex'>
              {/* Display last price */}
              <span className='up'>{priceChart.lastPrice}</span>

              {/* Display arrow icon based on price change */} &nbsp; 
              {priceChart.lastPriceChange === '+' ? (
                <img src={arrowUp} alt="Arrow up" />
              ): (
                <img src={arrowDown} alt="Arrow down" /> 
              )}
            </div>
          )}
        </div>
      </div>

      {!account ? (
        // Display a banner if not connected to Metamask
        <Banner text={'Please connect with Metamask'} />
      ) : (
        // Display the price chart if connected to Metamask
        <Chart
          type="candlestick"
          options={options}
          series={priceChart ? priceChart.series : defaultSeries }
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
}

export default PriceChart;