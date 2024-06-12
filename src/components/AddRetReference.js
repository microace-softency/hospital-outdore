import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useGlobalState } from '../context/GlobalStateContext';

function AddRetReference(props) {
  const { state, dispatch } = useGlobalState();
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnType, setReturnType] = useState('GRM');

  useEffect(() => {
    // Update the global context when the component mounts
    dispatch({
      type: 'SET_RETREF',
      payload: {
        RBILL_NO: props?.refId,
        SretType: returnType,
        RBILL_DATE: billDate,
      },
    });
  }, [dispatch, props?.refId, returnType, billDate, state.sync]);

  const handleInputChange = (field, value) => {
    // Update the local state and the global context when an input field changes
    if (field === 'returnType') {
      setReturnType(value);
    } else if (field === 'billDate') {
      setBillDate(value);
    }

    dispatch({
      type: 'SET_RETREF',
      payload: {
        BILL_NO: props?.refId,
        SretType: field === 'returnType' ? value : returnType,
        RBILL_DATE: field === 'billDate' ? value : billDate,
      },
    });
  };

  return (
    <div className="container">
      <p className='font-bold m-2'> Details</p>
      <Row>
        <Col lg={4}>
          <div className="pb-2">
            <label htmlFor="customerCode" className="block text-gray-700 font-bold mb-2">
              Ref No:
            </label>
            <div className='flex h-10'>
              <input
                type="number"
                id="billNumber"
                value={props?.refId}
                className="w-full h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
              />
            </div>
          </div>
        </Col>
        <Col lg={2}>
          <div className="flex flex-col">
            <label htmlFor="reportType" className="text-gray-700 font-bold me-4 mb-2">
              Report Type:
            </label>
            <select
              id="reportType"
              className="px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 drop-shadow"
              value={returnType}
              onChange={(e) => handleInputChange('returnType', e.target.value)}
            >
              <option value="GRM">GRM</option>
              <option value="GVN">GVN</option>
            </select>
          </div>
        </Col>
        <Col lg={2}>
          <label htmlFor="endDate" className='text-gray-700 font-bold me-4 mb-2'>Date :</label> <br/>
          <input
            type="date"
            id="endDate"
            className='px-4 h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow'
            value={billDate}
            onChange={(e) => handleInputChange('billDate', e.target.value)}
          />
        </Col>
      </Row>
    </div>
  );
}

export default AddRetReference;
