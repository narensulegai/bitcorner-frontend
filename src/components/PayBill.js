import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  editSendBill, getBalance, getBill, getExchangeRates, currencyList, setBalance,
} from '../util/fetch/api';

const PayBill = () => {
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [serviceFee, setServiceFee] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [billCurrency, setBillCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
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
      const bills = await getBill();
      if (bills.length) {
        setBills(bills);
        setCurrentBill(bills[0]);
        setBillAmount(bills[0].amount);
      }
      setExchangeRates(await getExchangeRates());
      await loadBalance();
    })();
  }, []);

  const handleOnBillChange = (e) => {
    const bill = bills.filter((b) => {
      return b.id === parseInt(e.target.value);
    });
    setCurrentBill(bill[0]);
  };

  const handleBalance = async (e) => {
    const balances = [
      { currency: 'USD', balance: balance.USD },
      { currency: 'EUR', balance: balance.EUR },
      { currency: 'GBP', balance: balance.GBP },
      { currency: 'INR', balance: balance.INR },
      { currency: 'RMB', balance: balance.RMB },
      { currency: 'BITCOIN', balance: balance.BITCOIN },
    ];

    let lExchangeRate = 1;
    let lServiceFee = 0;
    const selectedCurrency = balances.filter((b) => b.currency === e.target.value);
    if (e.target.value === 'BITCOIN') {
      // bitcoin exchange logic
    } else if (e.target.value !== currentBill.currency) {
      lExchangeRate = exchangeRates[currentBill.currency].rates[e.target.value];
      lServiceFee = currentBill.amount * lExchangeRate * 0.0001;
    }

    setBillCurrency(e.target.value);
    setTotalBalance(selectedCurrency[0].balance);
    setBillAmount(currentBill.amount * lExchangeRate + lServiceFee);
    setExchangeRate(lExchangeRate.toFixed(9));
    setServiceFee(lServiceFee.toFixed(9));
  };
  const rejectBill = async () => {
    if (currentBill.status === 'PAID' || currentBill.status === 'REJECTED' || currentBill.status === 'CANCELLED') {
      window.error('Bill status cannot be changed after settling');
    } else {
      const rejectedBill = { ...currentBill, status: 'REJECTED' };
      await editSendBill(rejectedBill);
      window.message('Bill was rejected');
    }
  };

  const completeTransaction = async () => {
    const curBalance = totalBalance - billAmount;
    const bs = await getBalance();
    const d = [
      { currency: 'USD', balance: balance.USD },
      { currency: 'EUR', balance: balance.EUR },
      { currency: 'GBP', balance: balance.GBP },
      { currency: 'INR', balance: balance.INR },
      { currency: 'RMB', balance: balance.RMB },
      { currency: 'BITCOIN', balance: balance.BITCOIN },
    ];
    const selectedCurrency = d.filter((b) => b.currency === billCurrency);
    selectedCurrency[0].balance = curBalance.toFixed(9);
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
  };

  const payBill = async () => {
    if (currentBill.status === 'PAID' || currentBill.status === 'REJECTED' || currentBill.status === 'CANCELLED') {
      window.error('Bill status cannot be changed after settling');
    } else if (totalBalance < billAmount) {
      window.error('Insufficient balance for bill payment');
    } else {
      await completeTransaction();
      const paidBill = { ...currentBill, status: 'PAID' };
      await editSendBill(paidBill);
      window.message('Bill was paid');
    }
  };
  return (
    <div className="body">
      Select a bill to pay&nbsp;<select onChange={handleOnBillChange}>
        {bills.map((b) => {
          return <option value={b.id} key={b.id}>#{b.id} from {b.customer.name}</option>;
        })}
      </select>
      {currentBill == null
        ? <div>Please select a bill to view</div>
        : (
          <div>
            <div>
              <div>
                Currency to pay bill
                <select defaultValue={currentBill.currency} onChange={handleBalance}>
                  {currencyList.map((c, i) => {
                    return <option key={i} value={c.code}>{c.code}</option>;
                  })}
                </select>
              </div>
              <div className="small-margin-top">
                Total Charge: {billAmount.toFixed(9)} <span />
                Available Balance: {totalBalance}
              </div>
              <div>
                ExchangeRate: {exchangeRate} <span />
                Service Fee: {serviceFee}
              </div>
              <hr />
              <div>
                Pay to {currentBill.customer.name} ({currentBill.customer.bankAccount.bankName})
              </div>
              <div>
                {currentBill.currency} {currentBill.amount} {currentBill.status}
              </div>
            </div>
            <div className="flex-justify-content-space-between">
              <button className="button" onClick={rejectBill}>Reject</button>
              <button className="button small-margin-left" onClick={payBill}>Pay</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default PayBill;
