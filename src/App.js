import './App.css';
import {
  HashRouter as Router, Switch, Route, withRouter,
} from 'react-router-dom';
import React from 'react';

import Landing from './components/Landing';
import CustomerSignup from './components/CustomerSignup';
import CustomerLogin from './components/CustomerLogin';
import CustomerHome from './components/CustomerHome';
import { AuthProvider } from './contexts/AuthContext';

const r = {
  home: '/',
  customerLogin: '/customerLogin',
  customerHome: '/customerHome',
  customerSignup: '/customerSignup',
  customerProfile: '/customerHome/profile',
  prevailingRates: '/customerHome/prevailingRates',
  customerBalance: '/customerHome/balance',
  customerSellBitCoin: '/customerHome/sellBitCoin',
  customerBuyBitCoin: '/customerHome/buyBitCoin',
  customerSendBill: '/customerHome/sendBill',
  customerPayBill: '/customerHome/payBill',
  customerMarketStrategy: '/customerHome/marketStrategy',
  customerTransactionProcessing: '/customerHome/transactionProcessing',
  customerServiceFee: '/customerHome/serviceFee',
  customerMessaging: '/customerHome/messaging',
  customerReporting: '/customerHome/reporting',
};

window.appRoutes = r;

export default function App() {
  const routes = [
    [r.home, <Landing />, true],
    [r.customerLogin, <CustomerLogin />, true],
    [r.customerHome, <CustomerHome />, false],
    [r.customerSignup, <CustomerSignup />, true],
  ];

  return (
    <Router>
      <Switch>
        <AuthProvider>
          {routes.map((r) => {
            return (
              <Route path={r[0]} exact={r[2]} key={r[0]}>
                {r[1]}
              </Route>
            );
          })}
        </AuthProvider>
      </Switch>
    </Router>
  );
}
