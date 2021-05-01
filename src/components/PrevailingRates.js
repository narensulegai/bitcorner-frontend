import React, { useEffect, useState } from 'react';
import { getPrevailingRates } from '../util/fetch/api';

const PrevailingRates = () => {
  const [prevailingRates, setPrevailingRates] = useState([]);

  useEffect(() => {
    (async () => {
      setPrevailingRates(await getPrevailingRates());
    })();
    const interval = setInterval(async () => {
      setPrevailingRates(await getPrevailingRates());
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="body">
      <h2>Prevailing rates</h2>
      <table className="table">
        <thead>
          <tr>
            <td>Order Id</td>
            <td>Transaction type</td>
            <td>Currency</td>
            <td>Amount</td>
            <td>Bitcoins</td>
            <td>Price type</td>
            <td>Minimum price</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {prevailingRates.reverse().map((b) => {
            return (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.buy ? 'Buy' : 'Sell'}</td>
                <td>{b.currency}</td>
                <td>{b.amount}</td>
                <td>{b.bitcoins}</td>
                <td>{b.marketOrder ? 'Market order' : 'Limit order'} </td>
                <td>{b.minPrice}</td>
                <td>{b.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PrevailingRates;
