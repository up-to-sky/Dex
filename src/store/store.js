// Import necessary Redux functions and libraries
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';  // Middleware for handling asynchronous actions
import { composeWithDevTools } from 'redux-devtools-extension';  // Redux DevTools extension for development
import { provider, tokens, exchange } from './reducers'; // Import Reducers 

// Combine all reducers into a single reducer
const reducer = combineReducers({
  provider,
  tokens,
  exchange
});

// Define initial state for the store
const initialState = {};

// Set up middleware for the store
const middleware = [thunk];

// Create the Redux store
const store = createStore(
  reducer,                     // Combined reducer
  initialState,                // Initial state
  composeWithDevTools(         // Enhance with Redux DevTools extension
    applyMiddleware(...middleware)  // Apply middleware
  )
);

export default store;
