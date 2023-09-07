// -----------------------------------------------------------------------
// Import Necessary Hooks & Components
// -----------------------------------------------------------------------

import { useSelector } from 'react-redux';
import { priceChartSelector } from '../store/selectors'; 
import { options, defaultSeries } from './PriceChart.config'; 
import Chart from 'react-apexcharts'; 
import Banner from './Banner'; 
import arrowUp from '../assets/upArrow.png';
import arrowDown from '../assets/downArrow.png'; 

// -----------------------------------------------------------------------
// Define The PriceChart Components
// -----------------------------------------------------------------------

const PriceChart = () => {
  // Retrieve data from the Redux store
  const account = useSelector((state) => state.provider.account);
  const symbols = useSelector((state) => state.tokens.symbols);
  const priceChart = useSelector(priceChartSelector);

// -----------------------------------------------------------------------
// JSX For Rendering The Components
// -----------------------------------------------------------------------

  return (
    <div className="component exchange__chart">
      <div className='component__header flex-between'>
        <div className='flex'>
          {/* Display trading pair */}
          <h2>{symbols && `${symbols[0]}/${symbols[1]}`}</h2>&nbsp;&nbsp;
          {priceChart && (
            <div className='flex'>
              {/* Display arrow icon based on price change */}
              {priceChart.lastPriceChange === '+' ? (
                <img src={arrowUp} alt="Arrow up" />
              ) : (
                <img src={arrowDown} alt="Arrow down" />
              )}&nbsp;
              {/* Display last price */}
              <span className='up'>{priceChart.lastPrice}</span>
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
          series={priceChart ? priceChart.series : defaultSeries}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

export default PriceChart;
