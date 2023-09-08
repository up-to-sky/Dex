// ------------------------------------------------------------------------------------------------------------
// Import Nececessary Hooks & Components
// ------------------------------------------------------------------------------------------------------------

import config from '../config.json';
import { useSelector } from 'react-redux';
import { myEventsSelector } from '../store/selectors';
import { useRef, useEffect } from 'react'

// ------------------------------------------------------------------------------------------------------------
// Define The Alert Components
// ------------------------------------------------------------------------------------------------------------

const Alert = () => {
  // Create a ref for the alert element
  const alertRef = useRef(null)

  // Get data from Redux store
  const network = useSelector(state => state.provider.network)
  const account = useSelector(state => state.provider.account)
  const isPending = useSelector(state => state.exchange.transaction.isPending)
  const isError = useSelector(state => state.exchange.transaction.isError)
  const events = useSelector(myEventsSelector)

// ------------------------------------------------------------------------------------------------------------
// Function To Handle Alert Removal
// ------------------------------------------------------------------------------------------------------------

  const removeHandler = async (e) => {
    alertRef.current.className = 'alert--remove'
  }

// ------------------------------------------------------------------------------------------------------------
// Use UseEffect To Update The Alert Class Based On Conditions
// ------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if((events[0] || isPending || isError) && account) {
      alertRef.current.className = 'alert'
    }
  }, [events, isPending, isError, account])

// ------------------------------------------------------------------------------------------------------------
// JSX For Rendering The Components
// ------------------------------------------------------------------------------------------------------------

  return (
    <div>
        {isPending ? (

          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
            <h1>Transaction Pending...</h1>
          </div>

        ) : isError ? (

          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
            <h1>Transaction Will Fail</h1>
          </div>

        ) : !isPending && events[0] ? (

          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
            <h1>Transaction Successful</h1>
              <a
                href={config[network] ? `${config[network].explorerURL}/tx/${events[0].transactionHash}` : '#'}
                target='_blank'
                rel='noreferrer'
              >
                {events[0].transactionHash.slice(0, 6) + '...' + events[0].transactionHash.slice(60, 66)}
              </a>
          </div>

        ) : (
          <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}></div>
        )}
    </div>
  );
}

export default Alert;