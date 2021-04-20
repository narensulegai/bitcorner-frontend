import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import CustomerProfile from './CustomerProfile';
import PrevailingRates from './PrevailingRates';
import CustomerBalance from './CustomerBalance';
import { useAuth } from '../contexts/AuthContext';

const CustomerHome = ({ history }) => {
  const { logout } = useAuth();
  const r = window.appRoutes;

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      window.error(e.message);
    }
    history.push(window.appRoutes.home);
  };

  const routes = [
    [r.customerProfile, <CustomerProfile />, true],
    [r.prevailingRates, <PrevailingRates />, true],
    [r.customerBalance, <CustomerBalance />, true],
  ];

  return (
    <div>
      <div className="header">
        <Link to={r.customerProfile}>My bank account</Link>
        <Link to={r.prevailingRates}>Prevailing rates</Link>
        <Link to={r.customerBalance}>Balance</Link>
        <Link to={r.customerSellBitCoin}>Sell bitcoin</Link>
        <Link to={r.customerBuyBitCoin}>Buy bitcoin</Link>
        <Link to={r.customerSendBill}>Send bill</Link>
        <Link to={r.customerPayBill}>Pay bill</Link>
        <Link to={r.customerMarketStrategy}>Market strategy</Link>
        <Link to={r.customerTransactionProcessing}>Transaction processing</Link>
        <Link to={r.customerServiceFee}>Service fee</Link>
        <Link to={r.customerMessaging}>Messaging</Link>
        <Link to={r.customerReporting}>Reporting</Link>
        <button className="button no-margin-top" onClick={onLogout}>Logout</button>
      </div>
      <div>
        {routes.map((r) => {
          return (
            <Route path={r[0]} exact={r[2]} key={r[0]}>
              {r[1]}
            </Route>
          );
        })}
      </div>
    </div>
  );
};

export default withRouter(CustomerHome);
