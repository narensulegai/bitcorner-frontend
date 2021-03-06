import React, { useEffect, useState } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import BankAccount from './BankAccount';
import PrevailingRates from './PrevailingRates';
import Balance from './Balance';
import { useAuth } from '../contexts/AuthContext';
import TransactBitCoin from './TransactBitCoin';
import SendBill from './SendBill';
import PayBill from './PayBill';
import MarketStrategy from './MarketStrategy';
import TransactionProcessing from './TransactionProcessing';
import ServiceFee from './ServiceFee';
import Messaging from './Messaging';
import Reporting from './Reporting';
import { getBankAccount, getCustomer } from '../util/fetch/api';

const CustomerHome = ({ history }) => {

  history.listen(() => {
    window.message(null);
    window.error(null);
  });

  const { logout } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const r = window.appRoutes;

  useEffect(() => {
    (async () => {
      setCustomer(await getCustomer());
      setBankAccount(await getBankAccount());
    })();
  }, []);

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
    [r.customerTransactBitCoin, <TransactBitCoin />, true],
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
        {bankAccount && <Link to={r.customerBalance}>Balance</Link>}
        {bankAccount && <Link to={r.prevailingRates}>Market orders</Link>}
        {bankAccount && <Link to={r.customerTransactBitCoin}>Transact bitcoin</Link>}
        {bankAccount && <Link to={r.customerSendBill}>Send bill</Link>}
        {bankAccount && <Link to={r.customerPayBill}>Pay bill</Link>}
        {bankAccount && <Link to={r.customerReporting}>Reporting</Link>}
        <button className="button no-margin-top" onClick={onLogout}>Logout</button>
      </div>
      <div className="body">
        {customer && customer.isEmailVerified && customer.customer !== null
          ? routes.map((r) => {
            return (
              <Route path={r[0]} exact={r[2]} key={r[0]}>
                {r[1]}
              </Route>
            );
          })
          : <div className="center">Please complete your signup first!</div>}
      </div>
    </div>
  );
};

export default withRouter(CustomerHome);
