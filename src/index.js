import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.error = (msg) => {
  const e = window.document.getElementById('err');
  e.innerText = msg;
};
window.message = (msg) => {
  const e = window.document.getElementById('msg');
  e.innerText = msg;
};
window.showLoading = () => {
  const e = window.document.getElementById('loading');
  e.style.display = 'block';
};
window.hideLoading = () => {
  const e = window.document.getElementById('loading');
  e.style.display = 'none';
};

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
