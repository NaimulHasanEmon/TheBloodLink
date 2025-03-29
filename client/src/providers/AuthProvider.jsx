import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import auth from "../firebase/firebase.config";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Providers for social login
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const twitterProvider = new TwitterAuthProvider();

  // Create user with email and password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in with email and password
  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Sign in with Facebook
  const signInWithFacebook = () => {
    setLoading(true);
    return signInWithPopup(auth, facebookProvider);
  };

  // Sign in with Twitter (X)
  const signInWithTwitter = () => {
    setLoading(true);
    return signInWithPopup(auth, twitterProvider);
  };

  // Update user profile
  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL
    });
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Sign out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user && user.email) {
        try {
          // First check locally with the hardcoded emails
          const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
          const userIsAdmin = adminEmails.includes(user.email);
          
          if (userIsAdmin) {
            setIsAdmin(true);
            return;
          }
          
          // If not a hardcoded admin, verify with the server
          console.log("Checking admin status with server for:", user.email);
          const response = await axios.get(`${API_URL}/donors/is-admin?email=${user.email}`);
          console.log("Server admin check response:", response.data);
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          // Fall back to the hardcoded check
          const adminEmails = ['mustakimemon1272000@gmail.com', 'thebloodlink01@gmail.com'];
          setIsAdmin(adminEmails.includes(user.email));
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    isAdmin,
    createUser,
    logIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    updateUserProfile,
    resetPassword,
    logOut
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider; 