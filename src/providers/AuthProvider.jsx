import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import AuthContext from "./AuthContext";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from "../utils/firebase.config";

// export const AuthContext = createContext();

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const user = 'aburayhan'
  const [loading, setLoading] = useState(true);

  // google sign in

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };

  // Log out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);
  console.log(user);
  const allInfo = {
    googleSignIn,
    logOut,
    user,
    setUser,
    loading,
    setLoading,
  };

  return (
    <AuthContext.Provider value={allInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
