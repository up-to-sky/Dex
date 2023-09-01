// Import necessary modules from external libraries
import React from 'react'; // Import the main React library
import ReactDOM from 'react-dom/client'; // Import the ReactDOM client
import './App.css'; // Import the CSS file for styling
import App from './components/App'; // Import the main App component
import reportWebVitals from './reportWebVitals'; // Import the function for reporting web vitals

// Import components from the Redux library
import { Provider } from 'react-redux'; // Import the Provider component for Redux state management
import store from './store/store'; // Import the Redux store configuration


// Create a root element for rendering the app
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the app wrapped in the Redux Provider
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
