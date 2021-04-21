import { auth } from '../../firebase';

export const apiUrl = `${process.env.REACT_APP_API_URL || 'localhost:3000'}`;

// eslint-disable-next-line no-async-promise-executor
const call = (method, api, data = null) => new Promise(async (res, rej) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = await auth.currentUser.getIdToken();
  if (token) {
    headers.authorization = token;
  }
  fetch(`http://${apiUrl}/${api}`,
    {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
      // CORS
      credentials: 'include',
      mode: 'cors',
    })
    .then((r) => {
      r.json()
        .then((d) => {
          if (r.status === 200) {
            window.error(null);
            res(d);
          } else {
            window.message(null);
            window.error(d.err);
            rej(d);
          }
        });
    });
});

export const put = (api, data) => call('PUT', api, data);
export const post = (api, data) => call('POST', api, data);
export const destroy = (api, data) => call('DELETE', api, data);
export const get = (api) => call('GET', api);
