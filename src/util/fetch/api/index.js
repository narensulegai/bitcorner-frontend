import {
  get, post, destroy, put,
} from '..';

export const getBankAccount = () => get('bankAccount');
export const updateBankAccount = (d) => post('bankAccount', d);
export const updateCustomer = (d) => post('customer', d);
export const getCustomer = () => get('customer');
export const getTransactBitcoin = () => get('transactBitcoin');
export const setTransactBitcoin = (d) => post('transactBitcoin', d);
export const getSendBill = () => get('sendBill');
export const addSendBill = (d) => post('sendBill', d);
export const editSendBill = (d) => put('sendBill', d);

export const getBill = () => get('payBill');
export const getReports = () => get('reports');
export const settlePayBill = (d) => put('payBill', d);
export const getPrevailingRates = () => get('prevailingRates');

export const getBalance = () => get('balance');
export const getExchangeRates = () => get('balance/rates');
export const setBalance = (d) => post('balance', d);
export const fileUrl = (fileId) => {
  return `/file/${fileId}`;
};

export const currencyList = [
  { code: 'USD' },
  { code: 'GBP' },
  { code: 'INR' },
  { code: 'EUR' },
  { code: 'RMB' },
];

export const allCurrencyList = [...currencyList, { code: 'BITCOIN' }];
