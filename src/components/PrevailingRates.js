import React, { useEffect, useState } from 'react';
import { getPrevailingRates, getReports } from '../util/fetch/api';

const PrevailingRates = () => {
  const [prevailingRates, setPrevailingRates] = useState([]);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    (async () => {
      setPrevailingRates(await getPrevailingRates());
      setReports(await getReports());
    })();
    const interval = setInterval(async () => {
      setPrevailingRates(await getPrevailingRates());
      setReports(await getReports());
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="body">
      <h2>Current market price</h2>
      <div><i>Prices are updated every 5 seconds</i></div>
      {reports
        ? (
          <div className="small-margin-top">
            <div>
              Latest ask price {reports.lastestPrices.latestAskPrice}
            </div>
            <div>
              Latest bid price {reports.lastestPrices.latestBidPrice}
            </div>
            <div>
              Latest transaction price {reports.lastestPrices.latestTransactionPrice}
            </div>
          </div>
        )
        : <div>Showing latest price</div>}
      <table className="table medium-margin-top">
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
