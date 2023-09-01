// Importing createSelector from the 'reselect' library for creating memoized selectors
import { createSelector } from 'reselect';

// Importing specific functions from the 'lodash' library for various utility operations
import { get, groupBy, reject, maxBy, minBy } from 'lodash';

// Importing the 'moment' library for working with dates and times
import moment from 'moment';

// Importing the 'ethers' module from the 'ethers' library for Ethereum-related operations
import { ethers } from 'ethers';


// Colors for order types
const GREEN = '#25CE8F'
const RED = '#F45353'

// Selectors for retrieving data from the state
const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
const filledOrders = state => get(state, 'exchange.filledOrders.data', [])

// Select open orders that are neither filled nor cancelled
const openOrders = state => {
  const all = allOrders(state)
  const filled = filledOrders(state)
  const cancelled = cancelledOrders(state)

  const openOrders = reject(all, (order) => {
    const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
    const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
    return (orderFilled || orderCancelled)
  })

  return openOrders
}

// Decorate an order with additional information
const decorateOrder = (order, tokens) => {
  let token0Amount, token1Amount

  // Determine token amounts based on order type
  if (order.tokenGive === tokens[1].address) {
    token0Amount = order.amountGive
    token1Amount = order.amountGet
  } else {
    token0Amount = order.amountGet
    token1Amount = order.amountGive
  }

  // Calculate token price
  const precision = 100000
  let tokenPrice = token1Amount / token0Amount
  tokenPrice = Math.round(tokenPrice * precision) / precision

  return {
    ...order,
    token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
    token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
    tokenPrice,
    formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa D MMM')
  }
}

// ------------------------------------------------------------------------------------------------------
// Order Book
// ------------------------------------------------------------------------------------------------------

export const orderBookSelector = createSelector(
  openOrders,
  tokens,
  (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) { return }

    // Filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // Decorate orders
    orders = decorateOrderBookOrders(orders, tokens)

    // Group orders by "orderType"
    orders = groupBy(orders, 'orderType')

    // Fetch buy orders
    const buyOrders = get(orders, 'buy', [])

    // Sort buy orders by token price
     orders = {
        ...orders,
        buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
      }

    // Fetch sell orders
    const sellOrders = get(orders, 'sell', [])

    // Sort sell orders by token price
    orders = {
      ...orders,
      sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }

    return orders
  }
)

const decorateOrderBookOrders = (orders, tokens) => {
  return(
    orders.map((order) => {
      order = decorateOrder(order, tokens)
      order = decorateOrderBookOrder(order, tokens)
      return(order)
    })
  )
}

const decorateOrderBookOrder = (order, tokens) => {
  const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'

  return({
    ...order,
    orderType,
    orderTypeClass: (orderType === 'buy' ? GREEN : RED),
    orderFillAction: (orderType === 'buy' ? 'sell' : 'buy')
  })
}

// ------------------------------------------------------------------------------------------------------
// Price Chart
// ------------------------------------------------------------------------------------------------------

export const priceChartSelector = createSelector(
  filledOrders,
  tokens,
  (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) { return }

    // Filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // Sort orders by date ascending to compare history
    orders = orders.sort((a, b) => a.timestamp - b.timestamp)

    // Decorate orders - add display attributes
    orders = orders.map((o) => decorateOrder(o, tokens))

    // Get last 2 order for final price & price change
    let secondLastOrder, lastOrder
    [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

    // get last order price
    const lastPrice = get(lastOrder, 'tokenPrice', 0)

    // get second last order price
    const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

    return ({
      lastPrice,
      lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
      series: [{
        data: buildGraphData(orders)
      }]
    })

  }
)

const buildGraphData = (orders) => {
  // Group the orders by hour for the graph
  orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())

  // Get each hour where data exists
  const hours = Object.keys(orders)

  // Build the graph series
  const graphData = hours.map((hour) => {
    // Fetch all orders from current hour
    const group = orders[hour]

    // Calculate price values: open, high, low, close
    const open = group[0] // first order
    const high = maxBy(group, 'tokenPrice') // high price
    const low = minBy(group, 'tokenPrice') // low price
    const close = group[group.length - 1] // last order

    return({
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
    })
  })

  return graphData
}