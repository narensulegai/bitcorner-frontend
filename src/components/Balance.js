import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { getBalance, setBalance, getCustomer } from '../util/fetch/api';

const Balance = () => {
  const [customer, setCustomer] = useState(null);
  const [balance, setBalances] = useState({
    USD: 0,
    EUR: 0,
    GBP: 0,
    INR: 0,
    RMB: 0,
    BITCOIN: 0,
  });

  const loadBalance = async () => {
    const balances = await getBalance();
    if (balances.length) {
      const b = _.keyBy(balances, 'currency');
      setBalances({
        USD: b.USD.balance,
        EUR: b.EUR.balance,
        GBP: b.GBP.balance,
        INR: b.INR.balance,
        RMB: b.RMB.balance,
        BITCOIN: b.BITCOIN.balance,
      });
    }
  };

  useEffect(() => {
    (async () => {
      setCustomer(await getCustomer());
      await loadBalance();
    })();
  }, []);

  const handleOnBalanceChange = (currency, b) => {
    const newBalance = { ...balance, [currency]: b };
    setBalances(newBalance);
  };
  const handleOnSave = async () => {
    const f = (n) => (Number.isNaN(parseFloat(n)) ? 0 : parseFloat(n));
    const bs = await getBalance();
    const d = [
      { currency: 'USD', balance: f(balance.USD) },
      { currency: 'EUR', balance: f(balance.EUR) },
      { currency: 'GBP', balance: f(balance.GBP) },
      { currency: 'INR', balance: f(balance.INR) },
      { currency: 'RMB', balance: f(balance.RMB) },
      { currency: 'BITCOIN', balance: f(balance.BITCOIN) },
    ];
    if (bs.length) {
      const b = _.keyBy(bs, 'currency');
      d[0].id = b.USD.id;
      d[1].id = b.EUR.id;
      d[2].id = b.GBP.id;
      d[3].id = b.INR.id;
      d[4].id = b.RMB.id;
      d[5].id = b.BITCOIN.id;
    }
    await setBalance(d);
    window.message('Balance updated.');
    await loadBalance();
  };

  return (
    <div className="body">
      <h2>Update balance</h2>
      {customer ? (
        <div>
          <div>
            Account number: <b>{customer.customer.bankAccount.accountNumber}</b>
            ({customer.customer.bankAccount.bankName})
            <br />
            Primary currency {customer.customer.bankAccount.primaryCurrency}
          </div>
          <div>
            <div className="small-margin-top">
              USD <br /><input type="number" value={balance.USD}
                onChange={(e) => handleOnBalanceChange('USD', e.target.value)} />
            </div>
            <div className="small-margin-top">
              EUR <br /><input type="number" value={balance.EUR}
                onChange={(e) => handleOnBalanceChange('EUR', e.target.value)} />
            </div>
            <div className="small-margin-top">
              GBP <br /><input type="number" value={balance.GBP}
                onChange={(e) => handleOnBalanceChange('GBP', e.target.value)} />
            </div>
            <div className="small-margin-top">
              INR <br /><input type="number" value={balance.INR}
                onChange={(e) => handleOnBalanceChange('INR', e.target.value)} />
            </div>
            <div className="small-margin-top">
              RMB <br /><input type="number" value={balance.RMB}
                onChange={(e) => handleOnBalanceChange('RMB', e.target.value)} />
            </div>
            <div className="small-margin-top">
              Bitcoins <br /><input type="number" value={balance.BITCOIN}
                onChange={(e) => handleOnBalanceChange('BITCOIN', e.target.value)} />
            </div>
          </div>
          <button className="button" onClick={handleOnSave}>Save</button>
        </div>
      ) : 'Loading your profile'}

    </div>
  );
};

export default Balance;
