import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CustomerSignup({ history }) {
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const { signup } = useAuth();

  const handleOnSignup = async () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const r = await signup(email, password);
      await r.user.updateProfile({ displayName: name });
      window.message('Please click on the verification link in your email');
      history.push(window.appRoutes.customerLogin);
    } catch (e) {
      window.error(e.message);
    }
  };

  return (
    <div className="center">
      <h2>Signup with UnitedBank</h2>
      <div>
        <input type="text" name="name" placeholder="Name" ref={nameRef} />
      </div>
      <div>
        <input type="text" name="email" placeholder="Email" ref={emailRef} />
      </div>
      <div>
        <input type="password" name="password" placeholder="Password" ref={passwordRef} />
      </div>
      <div>
        <button className="button" onClick={handleOnSignup}>Sign up</button>
      </div>
      <div className="small-margin-top">
        Already have an account <Link to={window.appRoutes.customerLogin}>Login</Link>
      </div>
    </div>
  );
}

export default withRouter(CustomerSignup);
