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
export const fileUrl = (fileId) => {
  return `${apiUrl}/file/${fileId}`;
};
