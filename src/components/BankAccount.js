import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BankAccount = () => {
  const { currentUser, getToken } = useAuth();
  const bankNameRef = useRef(null);
  const countryNameRef = useRef(null);
  const accountNumberRef = useRef(null);
  const ownersNameRef = useRef(null);
  const primaryCurrencyRef = useRef(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      console.log(t);
    })();
  }, []);

  const handleOnSave = () => {
    const bankDetails = {
      bankName: bankNameRef.current.value,
      country: countryNameRef.current.value,
      accountNumber: accountNumberRef.current.value,
      ownerName: ownersNameRef.current.value,
      primaryCurrency: primaryCurrencyRef.current.value,
    };
    console.log(bankDetails);
  };

  return (
    <div>
      <div>
        Welcome {currentUser.displayName}
        <h6>{currentUser.email} ({currentUser.emailVerified ? 'Verified' : 'Not verified'})</h6>
      </div>
      <div>
        <h2>My bank account</h2>
      </div>
      <div>
        <div className="small-margin-top">
          Bank name <br /><input type="text" ref={bankNameRef} />
        </div>
        <div className="small-margin-top">
          Country <br /><input type="text" ref={countryNameRef} />
        </div>
        <div className="small-margin-top">
          Account number <br /><input type="text" ref={accountNumberRef} />
        </div>
        <div className="small-margin-top">
          Owners name <br /><input type="text" ref={ownersNameRef} />
        </div>
        <div className="small-margin-top">
          Primary currency <br /><input type="text" ref={primaryCurrencyRef} />
        </div>
        <div className="small-margin-top">
          <button className="small-margin-top button" onClick={handleOnSave}>Save</button>
        </div>
      </div>

    </div>
  );
};

export default BankAccount;
