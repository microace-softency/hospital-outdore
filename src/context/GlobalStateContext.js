// GlobalStateContext.js
import React, { createContext, useContext, useReducer } from 'react';

const GlobalStateContext = createContext();
const initialState = {
  customers: [],
  products: [],
  bill: [],
  billDet: [],
  billTerm: [],
  retRef: [],
  addedProducts: [],
  customerDetails: [],
  sidebarOpen : false,
  modify : false,
  sync: false,
  splOrd: [],
};

const globalStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CUSTOMERS':
      // Add the product to the addedProducts array
      return { ...state, customers: action.payload };
    case 'SET_PRODUCTS':
      // Add the product to the addedProducts array
      return { ...state, products: action.payload };
    case 'SET_Bill':
      // Add the product to the addedProducts array
      return { ...state, bill: action.payload };
    case 'SET_BillDET':
      // Add the product to the addedProducts array
      return { ...state, billDet: action.payload };
    case 'SET_BillTERM':
      // Add the product to the addedProducts array
      return { ...state, billTerm: action.payload };
    case 'SET_RETREF':
      // Add the product to the addedProducts array
      return { ...state, retRef: action.payload };
    case 'SET_RETREF':
      // Add the product to the addedProducts array
      return { ...state, retRef: action.payload };
    case 'SET_SPLORD':
      // Add the product to the addedProducts array
      return { ...state, splOrd: action.payload };
    case 'SYNC':
      // Add the product to the addedProducts array
      return { ...state, sync: action.payload };

    case 'SAVE_PRODUCTS':
      // Add the product to the addedProducts array
      return { ...state, addedProducts: action.payload };
    case 'SAVE_CUSTOMER':
      // Set the customer details in the state
      return { ...state, customerDetails: action.payload };
    case 'REMOVE_CUSTOMER':
      // Add the product to the addedProducts array
      return { ...state, customerDetails: [] };
    case 'REMOVE_PRODUCTS':
      // Remove the product from the addedProducts array
      return { ...state, addedProducts: [] };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
      case 'TOGGLE_MODIFY':
      return {
        ...state,
        modify: !state.modify,
      };
      case 'RESET_MODIFY':
      return {
        ...state,
        modify: false,
      };
    default:
      return state;
  }
};
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalStateReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return useContext(GlobalStateContext);
};
