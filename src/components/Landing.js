import React, { useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCustomer } from '../util/fetch/api';

const Landing = ({ history }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { login, signInGoogle } = useAuth();

  const verifyAndRedirect = async () => {
    const { isEmailVerified, customer } = await getCustomer();
    if (isEmailVerified && customer !== null) {
      history.push(window.appRoutes.customerProfile);
    } else {
      window.message('Please signup / verify your email first');
    }
  };

  const handleOnLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      await login(email, password);
      await verifyAndRedirect();
    } catch (e) {
      window.error(e.message);
    }
  };

  const handleOnGoogleLogin = async () => {
    try {
      await signInGoogle();
      await verifyAndRedirect();
    } catch (e) {
      window.error(e.message);
    }
  };

  return (
    <div className="full">
      <div className="header">
        <div className="center">
          Welcome to BitCorner
        </div>
      </div>
      <div className="medium-margin-top">
        <div className="center">
          <h2>Customer login</h2>
          <div>
            <input type="text" placeholder="Email" ref={emailRef} />
          </div>
          <div>
            <input type="password" placeholder="Password" ref={passwordRef} />
          </div>
          <div>
            <button className="button" onClick={handleOnLogin}>Log in</button>
          </div>
          <div className="small-margin-top">
            Or
          </div>
          <div>
            <button className="button" onClick={handleOnGoogleLogin}>Log in with Google</button>
          </div>
        </div>
        <div className="center medium-margin-top">
          <h3>Dont have an account?</h3>
          <Link to={window.appRoutes.customerSignup}>Signup here</Link>
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {};

export default withRouter(Landing);
