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
      <h2>Bitcorner report</h2>
      {reports
        ? (
          <div>
            <h3>Account balance</h3>
            <hr />
            <div>
              {reports.bitcornerBalance.map((b) => {
                return <div>{b.currency} {b.balance}</div>;
              })}
            </div>
            <h3 className="small-margin-top">Stats</h3>
            <hr />
            <div>
              Orders fulfilled <b>{reports.noOfOrdersFulfilled}</b>
            </div>
            <div>
              Number of customers <b>{reports.totalCustomers}</b>
            </div>
            <div>
              Number of orders <b>{reports.totalOrdersCreated}</b>
            </div>
          </div>
        )
        : <div>Loading report</div>}
    </div>
  );
};

export default Reporting;
