import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateCustomer } from '../util/fetch/api';

function CustomerSignup({ history }) {
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const { signup, signUpWithGoogle } = useAuth();

  const handleOnSignup = async () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let r = null;
    try {
      r = await signup(email, password, name);
    } catch (e) {
      window.error(e.message);
    }
    if (r) {
      try {
        await updateCustomer({ email, name });
        history.push(window.appRoutes.customerLogin);
        window.message('Please click on the verification link in your email');
      } catch (e) {
        r.user.delete();
      }
    }
  };

  const handleOnSignupWithGoogle = async () => {
    const name = nameRef.current.value;
    let r = null;
    try {
      r = await signUpWithGoogle();
    } catch (e) {
      window.error(e.message);
    }
    if (r) {
      try {
        await updateCustomer({ email: r.user.email, name });
        history.push(window.appRoutes.customerLogin);
        window.message('Please click on the verification link in your email');
      } catch (e) {
        r.user.delete();
      }
    }
  };

  return (
    <div className="center">
      <h2>Signup with BitCorner</h2>
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
      <div>
        <button className="button" onClick={handleOnSignupWithGoogle}>Sign up with google</button>
      </div>
      <div className="small-margin-top">
        Already have an account <Link to="/">Login</Link>
      </div>
    </div>
  );
}

export default withRouter(CustomerSignup);
