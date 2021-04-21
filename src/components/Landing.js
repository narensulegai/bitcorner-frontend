import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Landing = ({ history }) => {

  const { signInGoogle } = useAuth();
  const handleOnGoogleLogin = async () => {
    try {
      const r = await signInGoogle();
      if (r.user.emailVerified) {
        history.push(window.appRoutes.customerProfile);
      } else {
        window.message('Please verify your email first');
      }
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
      <div className="flex flex-align-center medium-margin-top">
        <div className="flex-full center">
          <div>Do you have an account?</div>
          <Link to={window.appRoutes.customerLogin}>Login here</Link>
          <div>
            <button className="button" onClick={handleOnGoogleLogin}>Google log in</button>
          </div>
        </div>
        <div className="flex-full center">
          <div>Do you want to create an account?</div>
          <Link to={window.appRoutes.customerSignup}>Signup here</Link>
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {};

export default withRouter(Landing);
