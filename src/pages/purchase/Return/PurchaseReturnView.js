import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { collectionByTenant, fetchDataFromDb, fetchDataWithMultipleWheree, fetchDataWithWhere } from '../../../services';
import { collections, tableFields } from '../../../config';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import FetchPurchaseBillDataModify from '../../../components/FetchPurchaseBillDataModify';


function PurchaseReturnView() {
  const { dispatch, state } = useGlobalState();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const tenantId = parts[parts.length - 2];
  const billNo = parts[parts.length - 1];

  const matchField = "RBILL_NO";

  const fetchData = async () => {
    dispatch({ type: 'RESET_MODIFY' })
    dispatch({ type: 'SYNC', payload: false })
    dispatch({ type: 'SAVE_CUSTOMER', payload: [] })
    dispatch({ type: 'SET_PRODUCTS', payload: [] })
    dispatch({ type: 'SET_CUSTOMERS', payload: [] })
    setIsLoading(true)

    fetchDataWithWhere(await collectionByTenant(collections.DBNOTE, tenantId), matchField, billNo)
      .then(async (servicefetch) => {
        console.log('SET_Bill---->', servicefetch);
        dispatch({ type: 'SET_Bill', payload: servicefetch[0]});
        const ref = await collectionByTenant(collections.CUSTOMERS, tenantId);
        await fetchDataWithMultipleWheree(ref, 'CUSTCODE', servicefetch[0].CUSTCODE, 'CUST_VEND', 'V')
          .then((customerFetch) => {
            dispatch({ type: 'SAVE_CUSTOMER', payload: customerFetch[0] });
          })
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
    fetchDataFromDb('', [], await collectionByTenant(collections.PRODUCTS, tenantId))
      .then((servicefetch) => {
        dispatch({ type: 'SET_PRODUCTS', payload: servicefetch });
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
    fetchDataWithWhere(await collectionByTenant(collections.CUSTOMERS, tenantId), 'CUST_VEND', 'V' )
      .then((servicefetch) => {
        console.log('SET_CUSTOMERS', servicefetch);
        dispatch({ type: 'SET_CUSTOMERS', payload: servicefetch });
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
    fetchDataWithWhere(await collectionByTenant(collections.PRETDET, tenantId), matchField, billNo)
      .then((servicefetch) => {
        console.log('SAVE_PRODUCTS111', servicefetch);
        dispatch({ type: 'SAVE_PRODUCTS', payload: servicefetch });
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });

  }
  useEffect(() => {
    fetchData()
  }, []);
  
  const handleEditChange = () => {
    dispatch({ type: 'TOGGLE_MODIFY' })
  }

  const handleProcced = () => {
    dispatch({ type: 'SYNC', payload: true })
  }
  console.log('tenantId->', tenantId);
  console.log('billNo->', billNo);
  
  return (
    <div className="container p-2">
      <Row className='flex justify-between w-full'>
        <Col sm={12} md={12} lg={6}><h2 className="text-xl font-bold mx-2">Purchase Return</h2></Col>
      </Row>
      {isLoading ?
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div> : (
          <div className='w-max max-w-full mx-auto'>
          <div className='flex justify-end my-2'>
          {/* <Button
            onClick={handleEditChange}
            variant="primary"
            className=''>
            {state.modify ? 'Cancel' : 'Modify'}
          </Button> */}
          </div>
          <div className='w-full mx-auto bg-white rounded-xl'>
            <FetchPurchaseBillDataModify />
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

export default PurchaseReturnView;
