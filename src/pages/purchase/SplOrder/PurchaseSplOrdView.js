import React, { useState, useEffect } from 'react';
import AddProduct from '../../../components/AddProduct';
import AddCustomer from '../../../components/AddCustomer';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { fetchDataFromDb, fetchDataWithMultipleWheree, fetchDataWithWhere } from '../../../services';
import { collections, tableFields } from '../../../config';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import ViewCustDetails from '../../../components/ViewCustDetails';
import ViewProdDetails from '../../../components/ViewProdDetails';
import ViewSplOrder from '../../../components/ViewSplOrder';
import AddSpecialMenu from '../../../components/AddSpecialMenu';
import EditSpecialMenu from '../../../components/EditSpecialMenu';


function PurchaseSplOrdView() {
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
    setIsLoading(true)
    fetchDataWithWhere(myCollection(collections.SPLORDER), matchField, billNo)
      .then(async (servicefetch) => {
        dispatch({ type: 'SET_Bill', payload: servicefetch[0] });
        
        const ref = myCollection(collections.CUSTOMERS);
        await fetchDataWithMultipleWheree(ref, 'CUSTCODE', servicefetch[0].CUSTCODE, 'CUST_VEND', 'C')
          .then((customerFetch) => {
            // console.log('customerFetch-------->', customerFetch);
            dispatch({ type: 'SAVE_CUSTOMER', payload: customerFetch[0] });
            setIsLoading(false)
          })
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });

  }, []);

  const handleEditChange = () => {
    dispatch({ type: 'TOGGLE_MODIFY' })
  }

  const handleProceed = () => {
    dispatch({ type: 'SYNC', payload: true })

  }

  return (
    <div className="container p-2">
      <Row className='flex justify-between w-full'>
        <Col sm={12} md={12} lg={6}><h2 className="text-xl font-bold mx-2">Special Order</h2></Col>
      </Row>
      {isLoading ?
        <div className='w-full h-60 flex justify-center items-center'>
            <Spinner animation="border" variant="secondary" />
          </div> : (
            <div className=' max-w-full mx-auto'>
            <div className='flex justify-end my-2'>
                <Button
                  onClick={handleEditChange}
                  variant="primary"
                  className=''>
                  {state.modify ? 'Cancel' : 'Modify'}
                </Button>
            </div>
            {state.modify ? 
            <>
              <ViewCustDetails/>
              <EditSpecialMenu modelFor='/purchase/special/order/update'/>
              {/* <Button onClick={()=>{setAddProduct(!addProduct)}}>{!addProduct? 'add' : 'remove'} Products Menu</Button> */}
              <div className='w-full flex flex-end'>
                <Button onClick={handleProceed}>procceed</Button>
              </div>
            </> 
            : <ViewSplOrder />}
          </div>
        )}
    </div>
  );
}

export default PurchaseSplOrdView;
