import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import {
  editSendBill,
  getBalance,
  getBill,
  getExchangeRates,
  allCurrencyList,
  settlePayBill,
} from '../util/fetch/api';

const PayBill = () => {
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [serviceFee, setServiceFee] = useState(0);
  const [billAmount, setBillAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const currencyRef = useRef(null);
  const [billCurrency, setBillCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [balance, setBalances] = useState({
    USD: 0,
    EUR: 0,
    GBP: 0,
    INR: 0,
    RMB: 0,
    BITCOIN: 0,
  });

  const updateRates = async (
    currencyVal,
    bill = null,
    exchangeRatesValue = null,
    balancesValue = null,
  ) => {
    const balancesData = balancesValue || balance;
    const balances = [
      { currency: 'USD', balance: balancesData.USD },
      { currency: 'EUR', balance: balancesData.EUR },
      { currency: 'GBP', balance: balancesData.GBP },
      { currency: 'INR', balance: balancesData.INR },
      { currency: 'RMB', balance: balancesData.RMB },
      { currency: 'BITCOIN', balance: balancesData.BITCOIN },
    ];

    const temp = bill || currentBill;
    let lExchangeRate = 1;
    let lServiceFee = 0;

    const exchangeRatesData = exchangeRatesValue || exchangeRates;

    lExchangeRate = exchangeRatesData[temp.currency].rates[currencyVal];
    if (currencyVal !== temp.currency) {
      lServiceFee = temp.amount * lExchangeRate * exchangeRatesData.ServiceRate;
    }

    setBillCurrency(currencyVal);

    const totalBalance = balances.filter(
      (balance) => balance.currency === currencyVal,
    );
    setTotalBalance(totalBalance[0].balance);
    setBillAmount(temp.amount * lExchangeRate);
    setExchangeRate(lExchangeRate.toFixed(9));
    setServiceFee(lServiceFee.toFixed(9));
  };

  const loadBalance = async (currency, bills = null, exchangeRates = null) => {
    const balances = await getBalance();
    if (balances.length) {
      const b = _.keyBy(balances, 'currency');

      const temp = {
        USD: b.USD.balance,
        EUR: b.EUR.balance,
        GBP: b.GBP.balance,
        INR: b.INR.balance,
        RMB: b.RMB.balance,
        BITCOIN: b.BITCOIN.balance,
      };
      setBalances(temp);
      await updateRates(currency, bills, exchangeRates, temp);
    }
  };

  const loadInitialData = async (exchangeRates = null) => {
    setBills([]);
    setCurrentBill(null);
    let billsValue = await getBill();
    if (billsValue.length > 0) {
      billsValue = billsValue.filter((bill) => bill.status === 'WAITING');
      if (billsValue.length > 0) {
        setBills(billsValue);
        setCurrentBill(billsValue[0]);
        setBillAmount(billsValue[0].amount);
        await loadBalance(billsValue[0].currency, billsValue[0], exchangeRates);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const exchangeRates = await getExchangeRates();
      setExchangeRates(exchangeRates);
      await loadInitialData(exchangeRates);
    })();
  }, []);

  const handleOnBillChange = async (e) => {
    const bill = bills.filter((b) => {
      return b.id === parseInt(e.target.value);
    });
    setCurrentBill(bill[0]);
    setBillCurrency(bill[0].currency);
    await updateRates(bill[0].currency, bill[0]);
  };

  const handleBalance = async (e) => {
    await updateRates(e.target.value);
  };

  const rejectBill = async () => {
    if (
      currentBill.status === 'PAID'
            || currentBill.status === 'REJECTED'
            || currentBill.status === 'CANCELLED'
    ) {
      window.error('Bill status cannot be changed after settling');
    } else {
      const rejectedBill = { ...currentBill, status: 'REJECTED' };
      await editSendBill(rejectedBill);
      await loadInitialData(exchangeRates);
      window.message('Bill was rejected');
    }
  };

  const payBill = async () => {
    if (
      currentBill.status === 'PAID'
            || currentBill.status === 'REJECTED'
            || currentBill.status === 'CANCELLED'
    ) {
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
      await loadInitialData(exchangeRates);
      window.message('Bill was paid');
    }
  };
  return (
    <div className="body">
      {bills.length ? (
        <>
          Select a bill to pay&nbsp;
          <select onChange={handleOnBillChange}>
            {bills.map((b) => {
              return (
                <option value={b.id} key={b.id}>
                  Bill #{b.id} from {b.customer.name}
                </option>
              );
            })}
          </select>
          {currentBill == null ? (
            <div>Please select a bill to view</div>
          ) : (
            <div>
              <div>
                <div className="small-margin-top">
                  Pay with currency&nbsp;&nbsp;
                  <select value={billCurrency} ref={currencyRef} onChange={handleBalance}
                    className="no-margin-top">
                    {allCurrencyList.map((c, i) => {
                      return (
                        <option key={i} value={c.code}>
                          {c.code}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="small-margin-top">
                  Total to pay: <b>{billAmount.toFixed(9)}</b>
                </div>
                <div>
                  Available balance: <b>{totalBalance}</b>
                </div>
                <div>
                  Exchange rate: <b>{exchangeRate}</b>
                </div>
                <div>
                  Service Fee: <b>{serviceFee}</b>
                </div>
                <hr />
                <div>
                  Pay to <b>{currentBill.customer.name}</b>
                  &nbsp;({currentBill.customer.bankAccount.bankName})
                </div>
                <div>
                  <b>{currentBill.currency}{currentBill.amount}</b> (Status : {currentBill.status})
                </div>
              </div>
              <div className="flex-justify-content-space-between">
                <button className="button" onClick={rejectBill}>
                  Reject
                </button>
                <button className="button small-margin-left" onClick={payBill}>
                  Pay
                </button>
              </div>
            </div>
          )}
        </>
      ) : <span>No bills to pay</span>}
      <hr />

    </div>
  );
};

export default PayBill;
