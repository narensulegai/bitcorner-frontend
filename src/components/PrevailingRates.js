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
          <div>
            <table className="table medium-margin-top">
              <thead>
                <tr>
                  <td>Latest ask price</td>
                  <td>Latest bid price</td>
                  <td>Latest transaction price</td>
                  <td>Currency</td>
                </tr>
              </thead>
              <tbody>
                {reports.lastestPrices.map((p, i) => {
                  return (
                    <tr key={i}>
                      <td>{p.latestAskPrice}</td>
                      <td>{p.latestBidPrice}</td>
                      <td>{p.latestTransactionPrice}</td>
                      <td>{p.currency}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
        : <div>Showing latest price</div>}
      <hr />
      <h3>Current orders</h3>
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
