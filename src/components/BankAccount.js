import React, { useEffect, useRef, useState } from 'react';
import {
  currencyList, getBankAccount, getCustomer, updateBankAccount,
} from '../util/fetch/api';

const BankAccount = () => {
  const bankNameRef = useRef(null);
  const countryNameRef = useRef(null);
  const accountNumberRef = useRef(null);
  const ownersNameRef = useRef(null);
  const addressRef = useRef(null);
  const currencyRef = useRef(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    (async () => {
      const bankAccount = await getBankAccount();
      const { customer } = await getCustomer();
      setCustomer(customer);
      if (bankAccount === null) {
        window.message('You dont have a bank account yet, please add one');
      } else {
        setBankAccount(bankAccount);
      }
    })();
  }, []);

  const handleOnSave = async () => {
    const bankDetails = {
      bankName: bankNameRef.current.value,
      country: countryNameRef.current.value,
      accountNumber: accountNumberRef.current.value,
      ownerName: ownersNameRef.current.value,
      address: addressRef.current.value,
      primaryCurrency: currencyRef.current.value,
    };

    await updateBankAccount(bankDetails);
    const bankAccount = await getBankAccount();
    setBankAccount(bankAccount);
    window.message('Updated your bank details');
  };

  return bankAccount ? (
    <div>
      <div>
        Welcome {customer.name}
        <h6>{customer.email}</h6>
      </div>
      <div>
        <h2>Bank account</h2>
      </div>
      <div>
        <div className="small-margin-top">
          Bank name <br /><input type="text" ref={bankNameRef} defaultValue={bankAccount.bankName} />
        </div>
        <div className="small-margin-top">
          Country <br /><input type="text" ref={countryNameRef} defaultValue={bankAccount.country} />
        </div>
        <div className="small-margin-top">
          Account number <br /><input type="text" ref={accountNumberRef}
            defaultValue={bankAccount.accountNumber} />
        </div>
        <div className="small-margin-top">
          Owners name <br /><input type="text" ref={ownersNameRef} defaultValue={bankAccount.ownerName} />
        </div>
        <div className="small-margin-top">
          Address <br /><input type="text" ref={addressRef} defaultValue={bankAccount.address} />
        </div>
        <div className="small-margin-top">
          Primary currency <br />
          <select ref={currencyRef} defaultValue={bankAccount.primaryCurrency}>
            {currencyList.map((c, i) => {
              return <option key={i} value={c.code}>{c.code}</option>;
            })}
          </select>
        </div>
        <div className="small-margin-top">
          <button className="small-margin-top button" onClick={handleOnSave}>Save</button>
        </div>
      </div>

    </div>
  ) : <div>Loading bank account</div>;
};

export default BankAccount;
