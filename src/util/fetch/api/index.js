import {
  get, post, destroy, put, apiUrl,
} from '..';

export const getBankAccount = () => get('bankAccount');
export const createBankAccount = (d) => post('bankAccount', d);

export const fileUrl = (fileId) => {
  return `${apiUrl}/file/${fileId}`;
};