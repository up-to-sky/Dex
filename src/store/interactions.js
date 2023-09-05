// Import necessary libraries and ABIs
import { ethers } from 'ethers';
import TOKEN_ABI from '../abis/Token.json';
import EXCHANGE_ABI from '../abis/Exchange.json';

// ---------------------------------------------------------------------
// Connection and Network 
// ---------------------------------------------------------------------

// Load the Ethereum provider and dispatch the connection
export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: 'PROVIDER_LOADED', connection });

  return connection;
};

// Load the Ethereum network chain ID and dispatch it
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: 'NETWORK_LOADED', chainId });

  return chainId;
};

// ---------------------------------------------------------------------------------
// Account 
// ---------------------------------------------------------------------------------

// Load the user's Ethereum account and dispatch it, along with the ether balance
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = ethers.utils.getAddress(accounts[0]);

  dispatch({ type: 'ACCOUNT_LOADED', account });

  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);

  dispatch({ type: 'ETHER_BALANCE_LOADED', balance });

  return account;
};

// ------------------------------------------------------------------------------------------------
// Token and Exchange Loading 
// ------------------------------------------------------------------------------------------------

// Load ERC20 tokens and dispatch their information
export const loadTokens = async (provider, addresses, dispatch) => {
  let token, symbol;

  token = new ethers.Contract(addresses[0], TOKEN_ABI, provider);
  symbol = await token.symbol();
  dispatch({ type: 'TOKEN_1_LOADED', token, symbol });

  token = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
  symbol = await token.symbol();
  dispatch({ type: 'TOKEN_2_LOADED', token, symbol });

  return token;
};

// Load the Exchange contract and dispatch it
export const loadExchange = async (provider, address, dispatch) => {
  const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
  dispatch({ type: 'EXCHANGE_LOADED', exchange });

  return exchange;
};

// Subscribe to events emitted by the Exchange contract and dispatch relevant actions
export const subscribeToEvents = (exchange, dispatch) => {
  exchange.on('Cancel', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
    const order = event.args;
    dispatch({ type: 'ORDER_CANCEL_SUCCESS', order, event });
  });

  exchange.on('Deposit', (token, user, amount, balance, event) => {
    dispatch({ type: 'TRANSFER_SUCCESS', event });
  });

  exchange.on('Withdraw', (token, user, amount, balance, event) => {
    dispatch({ type: 'WITHDRAW_SUCCESS', event });
  });

  exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
    const order = event.args;
    dispatch({ type: 'NEW_ORDER_SUCCESS', order, event });
  });
};

// ---------------------------------------------------------------------------------------------------
// Balance Loading and Transfer 
// ---------------------------------------------------------------------------------------------------

// Load user balances (wallet and exchange) and dispatch them
export const loadBalances = async (exchange, tokens, account, dispatch) => {
  // Load balances for Token 1
  let balance = ethers.utils.formatUnits(await tokens[0].balanceOf(account), 18);
  dispatch({ type: 'TOKEN_1_BALANCE_LOADED', balance });

  balance = ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account), 18);
  dispatch({ type: 'EXCHANGE_TOKEN_1_BALANCE_LOADED', balance });

  // Load balances for Token 2
  balance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), 18);
  dispatch({ type: 'TOKEN_2_BALANCE_LOADED', balance });

  balance = ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account), 18);
  dispatch({ type: 'EXCHANGE_TOKEN_2_BALANCE_LOADED', balance });
};

// Transfer tokens (deposit or withdraw) and dispatch relevant actions
export const transferTokens = async (provider, exchange, transferType, token, amount, dispatch) => {
  let transaction;

  dispatch({ type: 'TRANSFER_REQUEST' });

  try {
    const signer = await provider.getSigner();
    const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

    if (transferType === 'Deposit') {
      transaction = await token.connect(signer).approve(exchange.address, amountToTransfer);
      await transaction.wait();
      transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer);
    } else {
      transaction = await exchange.connect(signer).withdrawToken(token.address, amountToTransfer);
      await transaction.wait();
    }
  } catch (error) {
    dispatch({ type: 'TRANSFER_FAIL' });
  }
};

// -------------------------------------------------------------------
// Load all orders
// -------------------------------------------------------------------

// This function loads all orders asynchronously.
export const loadAllOrders = async (provider, exchange, dispatch) => {
  // Get the current block number from the provider.
  const block = await provider.getBlockNumber();

  // Fetch canceled orders
  const cancelStream = await exchange.queryFilter('Cancel', 0, block);
  const cancelledOrders = cancelStream.map(event => event.args);

  dispatch({ type: 'CANCELLED_ORDERS_LOADED', cancelledOrders });

  // Fetch filled orders
  const tradeStream = await exchange.queryFilter('Trade', 0, block);
  const filledOrders = tradeStream.map(event => event.args);

  dispatch({ type: 'FILLED_ORDERS_LOADED', filledOrders });

  // Fetch all orders
  const orderStream = await exchange.queryFilter('Order', 0, block);
  const allOrders = orderStream.map(event => event.args);

  dispatch({ type: 'ALL_ORDERS_LOADED', allOrders });
}

// ----------------------------------------------------------------------------------------------------------
// Orders (Buy & Sell) 
// ----------------------------------------------------------------------------------------------------------

// Create a buy order and dispatch relevant actions
export const makeBuyOrder = async (provider, exchange, tokens, order, dispatch) => {
  const tokenGet = tokens[0].address;
  const amountGet = ethers.utils.parseUnits(order.amount, 18);
  const tokenGive = tokens[1].address;
  const amountGive = ethers.utils.parseUnits((order.amount * order.price).toString(), 18);

  dispatch({ type: 'NEW_ORDER_REQUEST' });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: 'NEW_ORDER_FAIL' });
  }
};

// Create a sell order and dispatch relevant actions
export const makeSellOrder = async (provider, exchange, tokens, order, dispatch) => {
  const tokenGet = tokens[1].address;
  const amountGet = ethers.utils.parseUnits((order.amount * order.price).toString(), 18);
  const tokenGive = tokens[0].address;
  const amountGive = ethers.utils.parseUnits(order.amount, 18);

  dispatch({ type: 'NEW_ORDER_REQUEST' });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: 'NEW_ORDER_FAIL' });
  }
};

// -----------------------------------------------------------------------
// Cancel Order 
// ------------------------------------------------------------------------

// Cancel an existing order and dispatch relevant actions
export const cancelOrder = async (provider, exchange, order, dispatch) => {
  dispatch({ type: 'ORDER_CANCEL_REQUEST' });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).cancelOrder(order.id);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: 'ORDER_CANCEL_FAIL' });
  }
}