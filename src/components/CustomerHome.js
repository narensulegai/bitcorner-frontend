import React from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import BankAccount from './BankAccount';
import PrevailingRates from './PrevailingRates';
import Balance from './Balance';
import { useAuth } from '../contexts/AuthContext';
import SellBitCoin from './SellBitCoin';
import BuyBitCoin from './BuyBitCoin';
import SendBill from './SendBill';
import PayBill from './PayBill';
import MarketStrategy from './MarketStrategy';
import TransactionProcessing from './TransactionProcessing';
import ServiceFee from './ServiceFee';
import Messaging from './Messaging';
import Reporting from './Reporting';

const CustomerHome = ({ history }) => {
  const { logout, currentUser } = useAuth();
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
    [r.customerProfile, <BankAccount />, true],
    [r.prevailingRates, <PrevailingRates />, true],
    [r.customerBalance, <Balance />, true],
    [r.customerSellBitCoin, <SellBitCoin />, true],
    [r.customerBuyBitCoin, <BuyBitCoin />, true],
    [r.customerSendBill, <SendBill />, true],
    [r.customerPayBill, <PayBill />, true],
    [r.customerMarketStrategy, <MarketStrategy />, true],
    [r.customerTransactionProcessing, <TransactionProcessing />, true],
    [r.customerServiceFee, <ServiceFee />, true],
    [r.customerMessaging, <Messaging />, true],
    [r.customerReporting, <Reporting />, true],
  ];

  return (
    <div>
      <div className="header">
        <Link to={r.customerProfile}>Bank account</Link>
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
      <div className="body">
        {currentUser
          ? routes.map((r) => {
            return (
              <Route path={r[0]} exact={r[2]} key={r[0]}>
                {r[1]}
              </Route>
            );
          })
          : <div className="center">Please login</div>}
      </div>
    </div>
  );
};

export default withRouter(CustomerHome);
