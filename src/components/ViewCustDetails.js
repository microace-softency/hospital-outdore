import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Button, Col, Row } from 'react-bootstrap';
import { formatFirestoreTimestamp } from '../services';
import { useNavigate } from 'react-router-dom';

function ViewCustDetails() {
  const { state, dispatch } = useGlobalState();
  const [billData, setBillData] = useState();
  const [customerDetails, setCustomerDetails] = useState();
  const [customersData, setCustomersData] = useState();

  const initialCustomer = { MOBPHONE: '', NAME: '', GSTIn: '', CUSTCODE : '' };
  const [customer, setCustomer] = useState(initialCustomer);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    setBillData(state.bill);
    setCustomerDetails(state.customerDetails);
    setCustomersData(state.customers);
    // console.log('state.bill', state.customerDetails);
    // console.log('bill------>', state.bill);
    // console.log('customerDetails------>', state.customerDetails);
    // console.log('customers------>', state.customers);
  }, [state]);
  const handleCustomerNumberChange = (e) => {
    const value = e.target.value;
    // console.log('customers=>', customerList );
    setCustomerDetails({ ...customerDetails, MOBPHONE: value });
    const filteredCustomers = customersData.filter((customer) =>
      customer.MOBPHONE.toString().includes(value.toString().toLowerCase())
    );
    setSuggestions(filteredCustomers);
  };

  const handleSuggestionClick = (selectedCustomer) => {
    // Set the entire customer object
    setCustomerDetails(selectedCustomer);
    // console.log(selectedCustomer);
    setSuggestions([]);
  // if (selectedCustomer.NAME && selectedCustomer.MOBPHONE) {
  //     dispatch({ type: 'SAVE_CUSTOMER', payload: selectedCustomer });
  // }
};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Selected Customer:', customer);
  };
  useEffect(() => {
    if (state.sync) {
      dispatch({ type: 'SAVE_CUSTOMER', payload: customerDetails });
    }
  }, [state.sync])

  return (
    <div className='w-full mx-auto'>
      <div id='customer_details' className='p-2 min-h-48 overflow-hidden'>
        <h2 className="text-xl font-bold m-2 text-slate-600">Customer Details</h2>
        {billData && 
        <div className='px-4 w-full'>
          <Row>
            <Col md={6} className='p-1'>
              <label className='block text-gray-700 font-bold'>Bill No:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={billData?.BILL_NO}
                disabled
              />
            </Col>
            {billData?.RBILL_NO && 
            <Col md={6} className='p-1'>
              <label className='block text-gray-700 font-bold'>RBill No:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={billData?.RBILL_NO}
                disabled
              />
            </Col>}
            <Col md={6} className='p-1'>
              <label className='block text-gray-700 font-bold'>Bill Date:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={formatFirestoreTimestamp(billData?.BILL_DATE)}
                disabled
              />
            </Col>
            {billData?.RBILL_DATE && 
            <Col md={6} className='p-1'>
              <label className='block text-gray-700 font-bold'>RBill Date:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={formatFirestoreTimestamp(billData?.RBILL_DATE)}
                disabled
              />
            </Col>}
            {billData?.PAY_MODE && <Col md={6} className='p-1'>
              <label className='block text-gray-700 font-bold'>Payment Mode:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={billData?.PAY_MODE}
                disabled
              />
            </Col>}
            <Col md={6} className='p-1'>
              <div className="w-full mb-2 rounded-xl">
                <div className="mb-4">
                  <label htmlFor="customerCode" className="'block text-gray-700 font-bold">
                    Contact Number:
                  </label>
                  <input
                    type="number"
                    id="customerNumber"
                    value={customerDetails.MOBPHONE}
                    onChange={handleCustomerNumberChange}
                    disabled={!state.modify}
                    className={`font-bold text-slate-500 p-1 ${state.modify && 'border-2'}`}
                  />
                </div>
                {suggestions[0] && 
                <div className='overflow-hidden'>
                  <div className="mb-1 max-h-40 p-2 overflow-y-scroll -me-3">
                    {suggestions.map((customer, i) => (
                      <p
                        key={i}
                        className="cursor-pointer hover:bg-slate-300 border-b-[3px] border-slate-300  p-2 w-full bg-sky-300 m-0"
                        onClick={() => handleSuggestionClick(customer)}
                      >
                        {customer.NAME} ({customer.MOBPHONE})
                      </p>
                    ))}
                  </div>
                </div>}
                {!suggestions[0] && customer.MOBPHONE && !customer.CUSTCODE &&
                <div className='py-2 w-full'>
                  <Button variant='primary' className='mx-12 bg-slate-500 drop-shadow' onClick={()=>{navigate(`/master/`)}}>
                    Add 
                  </Button>
                </div>}
              </div>
            </Col>
            <Col md={6} className='p-1' >
              <label className='block text-gray-700 font-bold'>Customer Code:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={customerDetails?.CUSTCODE}
                disabled
              />
            </Col>
            <Col md={6} className='p-1' >
              <label className='block text-gray-700 font-bold'>Customer Name:</label>
              <input
                type="text"
                className="font-bold text-slate-500 p-1"
                value={customerDetails?.NAME}
                disabled={!state.modify}
              />
            </Col>
          </Row>
        </div>}
      </div>
    </div>
  );
}

export default ViewCustDetails;