import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Badge, Col, Row } from 'react-bootstrap';
import { formatFirestoreTimestamp } from '../services';
import { formatDateTimestamp } from '../services/utils';

function ViewSplOrder() {
  const { state } = useGlobalState();
  const [billData, setBillData] = useState(state.bill || []);
  const [customersData, setCustomersData] = useState(state.customerDetails[0] || []);

  useEffect(() => {
    setCustomersData(state.customerDetails[0]);
    setBillData(state.bill);
    // console.log('state.bill[0]', state.bill);
  }, [state.addedcustomer]);
  const getRequestStatusColor = () => {
    switch (billData?.STATUS) {
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      case 'ACCEPTED':
        return 'success';
      default:
        return 'light'; // default color
    }
  };
  useEffect(()=> {
    // console.log('billData.CUSTCODE', billData.BILL_NO);
  }, [billData])
  return (
    <div className=' w-full mx-auto'>
      {billData.BILL_NO &&
        <div className='bg-white p-4 rounded-xl'>
          <Row className='p-2 rounded-xl drop-shadow'>
            <Col xs={12}>
              <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Bill Date:</label>
              <p>{formatDateTimestamp(billData.BILL_DATE)}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Customer Code:</label>
              <p>{billData.CUSTCODE}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Customer Name:</label>
              <p>{billData.CUSTNAME}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Phone Number:</label>
              <p>{billData.MOBPHONE}</p>
            </Col>
          </Row>
          <Row className='p-2 rounded-xl my-2 drop-shadow'>
            <div className='flex'>
              <p className='font-semibold'>Order Status : </p>
              <Badge bg={getRequestStatusColor()} className="mb-2 py-2 mx-4 ">
                {billData?.STATUS}
              </Badge>
            </div>
          </Row>
          <Row className="p-2 rounded-xl drop-shadow">
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Delivery Date:</label>
              <p>{formatDateTimestamp(billData.DLVDATE)}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Cake Type:</label>
              <p>{billData.CAKETYPE}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Category:</label>
              <p>{billData.CATEGORY}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Flavour:</label>
              <p>{billData.CFLAVOUR}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Message on Cake:</label>
              <p>{billData.CMESSAGE}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Weight:</label>
              <p>{billData.WEIGHT}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Peices:</label>
              <p>{billData.PCS}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Rate:</label>
              <p>{billData.RATE}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Amount:</label>
              <p>{billData.AMOUNT}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2">
              <label className='block text-gray-700 font-bold'>Advance:</label>
              <p>{billData.ADVANCE}</p>
            </Col>
            <Col sm={12} lg={4} md={6} className="mb-2 w-1/2">
              <img src={billData?.CIMAGEURL} alt='preview Image'/>
            </Col>
          </Row>
        </div>}
    </div>
  );
}

export default ViewSplOrder;
