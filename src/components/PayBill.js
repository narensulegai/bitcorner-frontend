import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import {
  editSendBill, getBalance, getBill, getExchangeRates, currencyList, setBalance, settlePayBill,
} from '../util/fetch/api';

const PayBill = () => {
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [serviceFee, setServiceFee] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const currencyRef = useRef(null);
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

  const updateRates = async (currencyVal) => {
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
    const selectedCurrency = balances.filter((b) => b.currency === currencyVal);
    if (currencyVal === 'BITCOIN') {
      // bitcoin exchange logic
    } else if (currencyVal !== currentBill.currency) {
      lExchangeRate = exchangeRates[currentBill.currency].rates[currencyVal];
      lServiceFee = currentBill.amount * lExchangeRate * exchangeRates.ServiceRate;
    }

    setBillCurrency(currencyVal);
    setTotalBalance(selectedCurrency[0].balance);
    setBillAmount(currentBill.amount * lExchangeRate);
    setExchangeRate(lExchangeRate.toFixed(9));
    setServiceFee(lServiceFee.toFixed(9));
  };

  const handleOnBillChange = (e) => {
    const bill = bills.filter((b) => {
      return b.id === parseInt(e.target.value);
    });
    setCurrentBill(bill[0]);
    setBillCurrency(bill[0].currency);
    updateRates(bill[0].currency);
  };

  const handleBalance = async (e) => {
    updateRates(e.target.value);
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

  const payBill = async () => {
    if (currentBill.status === 'PAID' || currentBill.status === 'REJECTED' || currentBill.status === 'CANCELLED') {
      window.error('Bill status cannot be changed after settling');
    } else if (totalBalance < billAmount) {
      window.error('Insufficient balance for bill payment');
    } else {
      const billData = {
        ...currentBill,
        currency: billCurrency,
        amount: billAmount,
        status: 'PAID',
      };
      await settlePayBill(billData);
      window.message('Bill was paid');
      await loadBalance();
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
                <select value={billCurrency} ref={currencyRef} defaultValue={currentBill.currency} onChange={handleBalance}>
                  {currencyList.map((c, i) => {
                    return <option key={i} value={c.code}>{c.code}</option>;
                  })}
                </select>
              </div>
              <div className="small-margin-top">
                Total Charge: {billAmount.toFixed(9)} <span />
                Available Balance:
                {totalBalance}
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
