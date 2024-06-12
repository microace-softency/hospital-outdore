import React, { useState, useEffect } from 'react';
import AddProduct from '../../../components/AddProduct';
import AddCustomer from '../../../components/AddCustomer';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { fetchDataFromDb } from '../../../services';
import { collections, tableFields } from '../../../config';
import { Spinner } from 'react-bootstrap';
import { where } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

function PurchaseBillAdd() {
  const { state, dispatch } = useGlobalState();
  const [isLoading, setIsLoading] = useState(false);
  const [storedCustomers, setStoredCustomers] = useState([]);
  const [storedProducts, setStoredProducts] = useState([]);
  const products = state.products;
  const [entryDetails, setEntryDetails] = useState({
    customerDetails: '', // You can set the customer details automatically here
    additionalInfo: '',
  });
  const { myCollection } = useAuth()
  const [noCustomerProducts, setNoCustomerProducts] = useState(false);
  const whereQuery = where("CUST_VEND", "==", 'V');

    
    useEffect(() => {
      fetchDataFromDb([], whereQuery, myCollection(collections.CUSTOMERS))
        .then((servicefetch) => {
          setStoredCustomers(servicefetch);
          dispatch({ type: 'SET_CUSTOMERS', payload: servicefetch });
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
        });
      fetchDataFromDb([], '', myCollection(collections.PRODUCTS))
        .then((servicefetch) => {
          setStoredProducts(servicefetch);
          dispatch({ type: 'SET_PRODUCTS', payload: servicefetch });
        })
        .catch((error) => {
          console.error('Error fetching customers:', error);
        });
  
  
    }, []);
    
  useEffect(() => {
    if (storedCustomers.length === 0 && storedProducts.length === 0) {
      setNoCustomerProducts(true);
    } else {
      setNoCustomerProducts(false);
    }
  }, [state])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntryDetails({ ...entryDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle the submission of the entry details here
    console.log('Entry Details Submitted:', entryDetails);
    // Reset the form fields if needed
    setEntryDetails({
      customerDetails: '',
      additionalInfo: '',
    });
  };

  return (
    <div className="container p-2">
      <h2 className="text-xl font-bold mx-2">Purchase Bill Entry</h2>
      {isLoading  ?
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div> : (
        <>
          <AddCustomer modelFor='vendor'/>
          <AddProduct modelFor='/purchase/bill/payment'/>
        </>
      )}
    </div>
  );
}

export default PurchaseBillAdd;
