import React, { useEffect, useState } from 'react';
import { editSendBill, getBill } from '../util/fetch/api';

const PayBill = () => {
  const [bills, setBills] = useState([]);
  const [currentBill, setCurrentBill] = useState(null);

  useEffect(() => {
    (async () => {
      const bills = await getBill();
      if (bills.length) {
        setBills(bills);
        setCurrentBill(bills[0]);
      }
    })();
  }, []);

  const handleOnBillChange = (e) => {
    const bill = bills.filter((b) => {
      return b.id === parseInt(e.target.value);
    });
    setCurrentBill(bill[0]);
  };
  const rejectBill = async () => {
    const rejectedBill = { ...currentBill, status: 'REJECTED' };
    await editSendBill(rejectedBill);
    window.message('Bill was rejected');
  };

  const payBill = async () => {
    const rejectedBill = { ...currentBill, status: 'PAID' };
    await editSendBill(rejectedBill);
    window.message('Bill was paid');
  };
  return (
    <div className="body">
      Select a bill to pay&nbsp;<select onChange={handleOnBillChange}>
        {bills.map((b) => {
          return <option value={b.id} key={b.id}>#{b.id} from {b.customer.name}</option>;
        })}
      </select>
      {currentBill == null
        ? <div>Please select a bill to view</div>
        : (
          <div>
            <div>
              <div>
                Pay to {currentBill.customer.name} ({currentBill.customer.bankAccount.bankName})
              </div>
              <div>
                {currentBill.currency} {currentBill.amount} {currentBill.status}
              </div>
            </div>
            <div className="flex-justify-content-space-between">
              <button className="button" onClick={rejectBill}>Reject</button>
              <button className="button small-margin-left" onClick={payBill}>Pay</button>
            </div>
          </div>
        )}
    </div>
  );
};

export default PayBill;
