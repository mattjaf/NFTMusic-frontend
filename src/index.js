import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
const APPID = process.env.REACT_APP_ID
const SERVER_URL = process.env.REACT_APP_SERVER_URL

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      initializeOnMount
      appId={APPID}
      serverUrl={SERVER_URL}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
