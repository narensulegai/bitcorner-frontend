import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import {
  editSendBill, getBalance, getBill, getExchangeRates, currencyList,
} from '../util/fetch/api';

const PayBill = () => {
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const currRef = useRef(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [serviceFee, setServiceFee] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
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
    console.log(currentBill);
  };

  const handleBalance = () => {
    const balances = [
      { currency: 'USD', balance: balance.USD },
      { currency: 'EUR', balance: balance.EUR },
      { currency: 'GBP', balance: balance.GBP },
      { currency: 'INR', balance: balance.INR },
      { currency: 'RMB', balance: balance.RMB },
      { currency: 'BITCOIN', balance: balance.BITCOIN },
    ];
    const selectedCurrency = balances.filter((b) => b.currency === currRef.current.value);
    let totalBalance = selectedCurrency['balance'];
    setBillAmount();
    if (currRef.current.value === 'BITCOIN') {
      // bitcoin logic
    } else if (currRef.current.value !== currentBill.currency) {
      setExchangeRate(exchangeRates[currentBill.currency].rates[currRef.current.value]);
      setServiceFee(billAmount * 0.0001);

      totalBalance *= exchangeRate;
      totalBalance += serviceFee;
    } else {
      setExchangeRate(1);
      setServiceFee(0);
    }
    setBillAmount(currentBill.amount * exchangeRate + serviceFee);
    console.log(exchangeRate + ' ' + billAmount + ' ' + serviceFee);
    if (totalBalance < billAmount) {
      alert('Not enough funds, pick different currency');
    }
  };
  const rejectBill = async () => {
    const rejectedBill = { ...currentBill, status: 'REJECTED' };
    await editSendBill(rejectedBill);
    window.message('Bill was rejected');
  };

  const payBill = async () => {
    const paidBill = { ...currentBill, status: 'PAID' };
    await editSendBill(paidBill);
    window.message('Bill was paid');
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
                <select ref={currRef} defaultValue={currentBill.currency} onChange={handleBalance}>
                  {currencyList.map((c, i) => {
                    return <option key={i} value={c.code}>{c.code}</option>;
                  })}
                </select>
              </div>
              <div>
                ExchangeRate: {exchangeRate} Service Fee: {serviceFee} Total Charge: {billAmount}
              </div>
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
