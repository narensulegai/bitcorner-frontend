import React, { useEffect, useState } from 'react';

const Balance = () => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    (async () => {
    })();
  }, []);

  return (
    <div className="body">
      <h2>Balance</h2>
      {customer ? (
        <div>
          Customer
        </div>
      ) : 'Loading your profile'}

    </div>
  );
};

export default Balance;