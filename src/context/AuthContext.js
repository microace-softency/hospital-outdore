// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth'
// import { auth, db } from '../firebase'
// import { collections } from '../config';
// import { collection, collectionGroup, doc, getDoc, getDocs, query, where } from "firebase/firestore";

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem('tenant')) || null);
//   const [company, setCompany] = useState(JSON.parse(localStorage.getItem('company')) || null);
//   const [authRole, setAuthRole ] = useState(sessionStorage.getItem('authRole') || null);
//   const [ token, setToken ] = useState(sessionStorage.getItem('token') || null)

//   const clearState = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   }

//   const getUserRefByEmail = async (email) => {
//     const userRef = collection(db, myCollection(collections.USERS));
//     const q = query(userRef, where("email", "==", email));
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       return doc.data();
//     });
//     if (!querySnapshot.empty) {
//       setAuthRole(JSON.stringify(querySnapshot.docs[0].data()));
//       return querySnapshot.docs[0].data();
//     } else {
//       return;
//     }
//   };
//   const getAdminByEmail = async (email) => {
//     const userRef = collection(db, collections.ADMIN);
//     const queryReference = query(userRef, where("email", "==", email));
//     const fetchData = await getDocs(queryReference);
//     const results = [];
//     fetchData.forEach((doc) => {
//       const abc = { id: doc.id, ...doc.data() };
//       results.push(abc);
//     });

//     if (results[0]) {
//       const t = results;
//       setTenant(...t);
//       localStorage.setItem('tenant', JSON.stringify(...t))
//       return results;
//     } else {
//       logout()
//       return false
//     }
//   };

//   const signIn = async (data) => {
//     try {
//       const signInResult = await signInWithEmailAndPassword(auth, data.email, data.password);
//       console.log('signInResult', signInResult);
//       return signInResult
//     } catch (error) {
//       console.error('Error signing in:', error.message);
//       throw error;
//     }
//   };

//   const logout = () => {
//     clearState()
//     return signOut(auth)
//   };
  
//   useEffect(() => {
//     const unsubsribe = onAuthStateChanged(auth, (currentUser) => {
//       currentUser?.accessToken ? sessionStorage.setItem('token', currentUser.accessToken) : sessionStorage.removeItem('token');
//       setToken(currentUser?.accessToken || null)
//     });
//     return unsubsribe;
//   }, []);

//   const myCollection = (cname) => {
//     const tenantId = tenant?.tenant_id || 'ERR';
//     const tenantsCollection = collectionGroup(db, cname);
//     if (tenantsCollection) {
//       return tenantsCollection;
//     } else {
//       console.error('Invalid tenant ID');
//       return null;
//     }
//   };

//   const value = {
//     user,
//     token,
//     authRole,
//     tenant,
//     myCollection,
//     company,
//     signIn,
//     logout,
//   };

//   return (
//   <AuthContext.Provider value={value}>
//     {children}
//   </AuthContext.Provider>);
// }





import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const [email, setEmail] = useState(localStorage.getItem('email') || null);
  const [location, setLocation] = useState(localStorage.getItem('location') || null);

  const signIn = (data) => {
    setToken(data.token);
    setUsername(data.username);
    setEmail(data.email);
    setLocation(data.location);

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
    localStorage.setItem('location', data.location);
  };

  const signOut = () => {
    setToken(null);
    setUsername(null);
    setEmail(null);
    setLocation(null);

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('location');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    const savedEmail = localStorage.getItem('email');
    const savedLocation = localStorage.getItem('location');
    if (savedToken && savedUsername && savedEmail && savedLocation) {
      setToken(savedToken);
      setUsername(savedUsername);
      setEmail(savedEmail);
      setLocation(savedLocation);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, username, email, location, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
