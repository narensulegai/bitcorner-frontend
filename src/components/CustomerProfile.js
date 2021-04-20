import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CustomerProfile = () => {
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

  return currentUser
    ? (
      <div className="body">
        <div>
          Welcome {currentUser.displayName}
          <h6>{currentUser.email} ({currentUser.emailVerified ? 'Verified' : 'Not verified'})</h6>
        </div>
        <div>
          <h2>My bank account</h2>
        </div>
        <div>
          <div>
            Bank name <br /><input type="text" ref={bankNameRef} />
          </div>
          <div>
            Country <br /><input type="text" ref={countryNameRef} />
          </div>
          <div>
            Account number <br /><input type="text" ref={accountNumberRef} />
          </div>
          <div>
            Owners name <br /><input type="text" ref={ownersNameRef} />
          </div>
          <div>
            Primary currency <br /><input type="text" ref={primaryCurrencyRef} />
          </div>
        </div>

      </div>
    )
    : null;
};

export default CustomerProfile;
