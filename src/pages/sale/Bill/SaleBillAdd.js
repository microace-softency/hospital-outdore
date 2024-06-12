import React, { useState, useEffect } from 'react';
import AddProduct from '../../../components/AddProduct';
import AddCustomer from '../../../components/AddCustomer';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { fetchDataFromDb, fetchDataWithQuery } from '../../../services';
import { collections, tableFields } from '../../../config';
import { Col, Row, Spinner } from 'react-bootstrap';
import { collection, query, where } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import RunningSales from '../../../components/RunningSales';
import { db } from '../../../firebase';


function SaleBillAdd() {
  const { state, dispatch } = useGlobalState();
  const [isLoading, setIsLoading] = useState(false);
  const [storedCustomers, setStoredCustomers] = useState([]);
  const [storedProducts, setStoredProducts] = useState([]);

  const products = state.products;
  const [entryDetails, setEntryDetails] = useState({
    customerDetails: '', // You can set the customer details automatically here
    additionalInfo: '',
  });

  const [noCustomerProducts, setNoCustomerProducts] = useState(false);
  const whereQuery = where("CUST_VEND", "==",  'C' );

  const { myCollection } = useAuth();
  
  const salesCollectoin = myCollection(collections.BILL)

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

  return (
    <div className="container p-2">
        <Row className=''>
          <h2 className="text-xl font-bold mx-2">Sale Bill Entry</h2>
           
        </Row>
        <div className='w-full flex justify-end -mt-10'>
          <RunningSales salesCollectoin={salesCollectoin} /> 
        </div>
      {isLoading  ?
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div> : (
        <>
          <AddCustomer modelFor='customer'/>
          <AddProduct modelFor="/sale/bill/payment"/>
        </>
      )}
    </div>
  );
}

export default SaleBillAdd;
