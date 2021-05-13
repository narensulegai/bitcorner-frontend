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
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="body">
      <h2>Current market price</h2>
      {reports
        ? (
          <div className="small-margin-top">
            <div>Current ask price</div>
            <div>
              {reports.askPrice.length === 0 && <div>No ask price to show</div>}
              {reports.askPrice.map((a) => {
                return <div>{a !== null ? `${a.currency} ${a.amount}` : null}</div>;
              })}
            </div>
            <div>
              <div>Current bid price</div>
              {reports.bidPrice.length === 0 && <div>No bid price to show</div>}
              {reports.bidPrice.map((a) => {
                return <div>{a !== null ? `${a.currency} ${a.amount}` : null}</div>;
              })}
            </div>
          </div>
        )
        : <div>Showing latest price</div>}
      <hr />
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
