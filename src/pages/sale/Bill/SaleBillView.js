import React, { useState, useEffect } from 'react';
import AddProduct from '../../../components/AddProduct';
import AddCustomer from '../../../components/AddCustomer';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { fetchDataFromDb, fetchDataWithMultipleWhere, fetchDataWithMultipleWheree, fetchDataWithWhere } from '../../../services';
import { collections, tableFields } from '../../../config';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ViewCustDetails from '../../../components/ViewCustDetails';
import ViewProdDetails from '../../../components/ViewProdDetails';
import { Query, where } from 'firebase/firestore';
import { query } from 'firebase/database';


function SaleBillView() {
  const { dispatch, state } = useGlobalState();
  const [fetch, setFetch] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const { myCollection } = useAuth();
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const billNo = parts[parts.length - 1];

  const matchField = "BILL_NO";

  useEffect(() => {
    dispatch({type: 'RESET_MODIFY'})
    dispatch({type: 'SYNC', payload: false})
    dispatch({ type: 'SAVE_CUSTOMER', payload: [] })
    dispatch({ type: 'SET_PRODUCTS', payload: [] })
    dispatch({ type: 'SET_CUSTOMERS', payload: [] })
    setIsLoading(true)
    fetchDataWithWhere(myCollection(collections.BILL), matchField, billNo)
      .then(async(servicefetch) => {
        // console.log('SET_Bill', servicefetch[0]);
        dispatch({ type: 'SET_Bill', payload: servicefetch[0] });
        const ref = myCollection(collections.CUSTOMERS);
        await fetchDataWithMultipleWheree(ref, 'CUSTCODE', servicefetch[0].CUSTCODE, 'CUST_VEND', 'C' )
          .then((customerFetch) => {
            // console.log('customerFetch', customerFetch[0]);
            dispatch({ type: 'SAVE_CUSTOMER', payload: customerFetch[0] });
          })
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
    fetchDataFromDb([], '', myCollection(collections.PRODUCTS))
      .then((servicefetch) => {
        dispatch({ type: 'SET_PRODUCTS', payload: servicefetch });
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
    fetchDataWithWhere(myCollection(collections.CUSTOMERS), 'CUST_VEND', 'C' )
    .then((servicefetch) => {
      dispatch({ type: 'SET_CUSTOMERS', payload: servicefetch });
    })
    .catch((error) => {
      console.error('Error fetching customers:', error);
    });
    fetchDataWithWhere(myCollection(collections.BILLDET), matchField, billNo)
      .then((servicefetch) => {
        // console.log('SAVE_PRODUCTS', servicefetch);
        dispatch({ type: 'SAVE_PRODUCTS', payload: servicefetch });
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });

  }, []);

  const handleEditChange = () => {
    dispatch({type: 'TOGGLE_MODIFY'})
  }

  const handleProcced = () => {
    dispatch({type: 'SYNC', payload: true})
  }

  return (
    <div className="container p-2">
      <Row className='flex justify-between w-full'>
        <Col sm={12} md={12} lg={6}><h2 className="text-xl font-bold mx-2">Sale Bill</h2></Col>
      </Row>
      {isLoading ?
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div> : (
          <div className='w-min max-w-full mx-auto'>
            <div className='flex justify-end my-2'>
            <Button
              onClick={handleEditChange}
              variant="primary"
              className=''>
              {state.modify ? 'Cancel' : 'Modify'}
            </Button>
            </div>
            <div className='w-full mx-auto bg-white rounded-xl'>
              <ViewCustDetails />
              <ViewProdDetails modelFor="/sale/bill/update" />
            </div>
            {state.modify &&
              <div className='flex justify-end my-2'>
                <Button
                  onClick={handleProcced}
                  variant="primary"
                  className=''>
                  Procced
                </Button>
              </div>}
          </div>
        )}
    </div>
  );
}

export default SaleBillView;
