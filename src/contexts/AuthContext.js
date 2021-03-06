import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth } from '../firebase';

const provider = new firebase.auth.GoogleAuthProvider();

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, name) => {
    const r = await auth.createUserWithEmailAndPassword(email, password);
    await r.user.sendEmailVerification();
    return r;
  };

  const signInGoogle = async () => {
    const r = await auth.signInWithPopup(provider);
    return r;
  };

  const signUpWithGoogle = async () => {
    const r = await auth.signInWithPopup(provider);
    await r.user.sendEmailVerification();
    return r;
  };

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  const getToken = async () => {
    return currentUser.getIdToken(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateEmail,
    updatePassword,
    getToken,
    signInGoogle,
    signUpWithGoogle,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
