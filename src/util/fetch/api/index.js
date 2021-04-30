import {
  get, post, destroy, put, apiUrl,
} from '..';

export const getBankAccount = () => get('bankAccount');
export const updateBankAccount = (d) => post('bankAccount', d);
export const updateCustomer = (d) => post('customer', d);
export const getCustomer = () => get('customer');
export const getSellBitcoins = () => get('sellBitcoin');
export const addSellBitcoins = (d) => post('sellBitcoin', d);
export const getBuyBitcoins = () => get('buyBitcoin');
export const addBuyBitcoins = (d) => post('buyBitcoin', d);
export const getSendBill = () => get('sendBill');
export const addSendBill = (d) => post('sendBill', d);
export const editSendBill = (d) => put('sendBill', d);
export const getBalance = () => get('balance');
export const setBalance = (d) => post('balance', d);
export const fileUrl = (fileId) => {
  return `${apiUrl}/file/${fileId}`;
};
