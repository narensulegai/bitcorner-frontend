import React, { useEffect, useState } from 'react';
import { getReports } from '../util/fetch/api';

const Reporting = () => {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    (async () => {
      const reports = await getReports();
      setReports(reports);
    })();
  }, []);

  return (
    <div className="body">
      {reports
        ? (
          <div>
            <h2>Bitcorner report</h2>
            <h3>Bitcorner balance</h3>
            <div className="small-margin-top">
              {reports.bitcornerBalance ? reports.bitcornerBalance.map((b) => {
                return <div key={b.id}>{b.currency} {b.balance}</div>;
              }) : <div>No balance to show</div>}
            </div>
            <hr />
            <h3>Account balance</h3>
            <div className="small-margin-top">
              {reports.balances ? reports.balances.map((b) => {
                return <div key={b.id}>{b.currency} {b.balance}</div>;
              }) : <div>No balance to show</div>}
            </div>
            <hr />
            <h3>Stats</h3>
            <div className="small-margin-top">
              Orders fulfilled <b>{reports.noOfOrdersFulfilled}</b>
            </div>
            <div>
              Number of customers <b>{reports.totalCustomers}</b>
            </div>
            <div>
              Number of orders <b>{reports.totalOrdersCreated}</b>
            </div>
            <hr />
            <div>
              <h3>Transactions</h3>
              <table className="table small-margin-top">
                <thead>
                  <tr>
                    <td>Order Id</td>
                    <td>Transaction type</td>
                    <td>Currency</td>
                    <td>Amount</td>
                    <td>Bitcoins</td>
                    <td>Price type</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  {reports.transactions.map((b) => {
                    return (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.buy ? 'Buy' : 'Sell'}</td>
                        <td>{b.currency}</td>
                        <td>{b.amount}</td>
                        <td>{b.bitcoins}</td>
                        <td>{b.marketOrder ? 'Market order' : 'Limit order'} </td>
                        <td>{b.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <hr />
              <h3>Bills</h3>
              <table className="table small-margin-top">
                <thead>
                  <tr>
                    <td>Amount</td>
                    <td>Currency</td>
                    <td>Description</td>
                    <td>Due</td>
                    <td>Email</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  {reports.bills.map((b) => {
                    return (
                      <tr key={b.id}>
                        <td>{b.amount}</td>
                        <td>{b.currency}</td>
                        <td>{b.description}</td>
                        <td>{new Date(b.due).toDateString()}</td>
                        <td>{b.email}</td>
                        <td>{b.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
        : <div>Loading report</div>}
    </div>
  );
};

export default Reporting;
