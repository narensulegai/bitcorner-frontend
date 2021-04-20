import React, { useEffect, useState } from 'react';
import { } from '../util/fetch/api';

const PrevailingRates = () => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    (async () => {
    })();
  }, []);

  return (
    <div className="body">
      {customer ? (
        <>
          <h2>Prevailing rates</h2>
          <table className="table">
            <thead>
              <tr>
                <td>Currency</td>
                <td>Rate</td>
                <td>Updated at</td>
              </tr>
            </thead>
            <tbody>
              {[].map((t, i) => {
                return (
                  <tr key={i}>
                    <td>{t.currency}</td>
                    <td>{t.rate}</td>
                    <td>{new Date(t.createdAt).toDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </>
      ) : 'Loading your profile'}

    </div>
  );
};

export default PrevailingRates;
