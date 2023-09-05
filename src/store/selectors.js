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
const account = state => get(state, 'provider.account')
const tokens = state => get(state, 'tokens.contracts')
const allOrders = state => get(state, 'exchange.allOrders.data', [])
const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])

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

// ------------------------------------------------------------------------------------------------------
// My Open Orders
// ------------------------------------------------------------------------------------------------------

// Selector function to get the user's open orders
export const myOpenOrdersSelector = createSelector(
  account,
  tokens,
  openOrders,
  (account, tokens, orders) => {
    if (!tokens[0] || !tokens[1]) {
      return; // Return early if tokens are not available
    }

    // Filter orders created by the current account
    orders = orders.filter((o) => o.user === account);

    // Filter orders by token addresses
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address);
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address);

    // Decorate orders - add display attributes
    orders = decorateMyOpenOrders(orders, tokens);

    // Sort orders by date descending
    orders = orders.sort((a, b) => b.timestamp - a.timestamp);

    return orders;
  }
);

// Function to decorate the user's open orders with additional attributes
const decorateMyOpenOrders = (orders, tokens) => {
  return orders.map((order) => {
    order = decorateOrder(order, tokens);
    order = decorateMyOpenOrder(order, tokens);
    return order;
  });
};

// Function to decorate a single open order with order type and order type class
const decorateMyOpenOrder = (order, tokens) => {
  let orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell';

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED, 
  };
};

// Function to decorate a single order with token amounts, token price, and formatted timestamp
const decorateOrder = (order, tokens) => {
  let token0Amount, token1Amount;

  // Note: CADEX should be considered token0, USDC is considered token1
  // Example: Giving USDC in exchange for CADEX
  if (order.tokenGive === tokens[1].address) {
    token0Amount = order.amountGive; // The amount of CADEX we are giving
    token1Amount = order.amountGet; // The amount of USDC we want...
  } else {
    token0Amount = order.amountGet; // The amount of CADEX we want
    token1Amount = order.amountGive; // The amount of USDC we are giving...
  }

  // Calculate token price to 5 decimal places
  const precision = 100000;
  let tokenPrice = token1Amount / token0Amount;
  tokenPrice = Math.round(tokenPrice * precision) / precision;

  return {
    ...order,
    token1Amount: ethers.utils.formatUnits(token1Amount, 'ether'), 
    token0Amount: ethers.utils.formatUnits(token0Amount, 'ether'), 
    tokenPrice,
    formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D'), 
  };
};

// ------------------------------------------------------------------------------------------------------
// All Filled Orders
// ------------------------------------------------------------------------------------------------------

// Selector function to filter and decorate filled orders
export const filledOrdersSelector = createSelector(
  filledOrders,
  tokens,
  (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) {
      return; // Exit early if tokens are missing
    }

    // Filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address);
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address);

    // Sort orders by time ascending for price comparison
    orders = orders.sort((a, b) => a.timestamp - b.timestamp);

    // Decorate the orders
    orders = decorateFilledOrders(orders, tokens);

    // Sort orders by date descending for display
    orders = orders.sort((a, b) => b.timestamp - a.timestamp);

    return orders;
  }
);

// Function to decorate filled orders
const decorateFilledOrders = (orders, tokens) => {
  // Track previous order to compare history
  let previousOrder = orders[0];

  return orders.map((order) => {
    // Decorate each individual order
    order = decorateOrder(order, tokens);
    order = decorateFilledOrder(order, previousOrder);
    previousOrder = order; // Update the previous order once it's decorated
    return order;
  });
};

// Function to decorate a filled order
const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
  };
};

// Function to determine token price class (GREEN or RED)
const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
  // Show green price if only one order exists
  if (previousOrder.id === orderId) {
    return GREEN; 
  }

  // Show green price if order price is higher than previous order
  // Show red price if order price is lower than previous order
  if (previousOrder.tokenPrice <= tokenPrice) {
    return GREEN; // Success
  } else {
    return RED; // Danger
  }
};

// ------------------------------------------------------------------------------------------------------
// My Filled Orders
// ------------------------------------------------------------------------------------------------------

export const myFilledOrdersSelector = createSelector(
    account,
    tokens,
    filledOrders,
    (account, tokens, orders) => {
      if (!tokens[0] || !tokens[1]) { return }

      // Find our orders
      orders = orders.filter((o) => o.user === account || o.creator === account)
      // Filter orders for current trading pair
      orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
      orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

      // Sort by date descending
      orders = orders.sort((a, b) => b.timestamp - a.timestamp)

      // Decorate orders - add display attributes
      orders = decorateMyFilledOrders(orders, account, tokens)

      return orders
  }
)

const decorateMyFilledOrders = (orders, account, tokens) => {
  return(
    orders.map((order) => {
      order = decorateOrder(order, tokens)
      order = decorateMyFilledOrder(order, account, tokens)
      return(order)
    })
  )
}

const decorateMyFilledOrder = (order, account, tokens) => {
  const myOrder = order.creator === account

  let orderType
  if(myOrder) {
    orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'
  } else {
    orderType = order.tokenGive === tokens[1].address ? 'sell' : 'buy'
  }

  return({
    ...order,
    orderType,
    orderClass: (orderType === 'buy' ? GREEN : RED),
    orderSign: (orderType === 'buy' ? '+' : '-')
  })
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