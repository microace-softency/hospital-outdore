import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { collectionByTenant, fetchDataWithWhere, formatFirestoreTimestamp } from '../services';
import { collections } from '../config';
import { useAuth } from '../context/AuthContext';
import BillsTableModal from './BillTableModal';

function FetchPurchaseBillDataModify() {
  const { state, dispatch } = useGlobalState();
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [retNo, setRetNo] = useState('');
  const [billData, setBillData] = useState(state.bill);
  const [billDetData, setBillDetData] = useState(state.addedProducts);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [returnType, setReturnType] = useState('GRM');
  const [newRefId, setNewRefId] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const tenantId = parts[parts.length - 2];
  const billNo = parts[parts.length - 1];
  const { myCollection } = useAuth();

  // useEffect(() => {
  //   fetchdetails();
  // }, [billNo]);

  // const fetchdetails = async () => {
  //   setIsLoading(true);
  //   const matchField = 'RBILL_NO';
  //   fetchDataWithWhere(collectionByTenant(collections.DBNOTE, tenantId), matchField, billNo)
  //     .then((servicefetch) => {
  //       console.log(servicefetch);
  //       setBillData(...servicefetch);
  //     })
  //     .catch((error) => {
  //       setBillData([]);
  //       setBillDetData([]);
  //     });
  //   fetchDataWithWhere(collectionByTenant(collections.PRETDET, tenantId), matchField, billNo)
  //     .then((servicefetch) => {
  //       setBillDetData([...servicefetch]);
  //     })
  //     .catch((error) => {
  //       // Handle error fetching data
  //     });
  //   setIsLoading(false);
  // };

  const handleAddItem = (item) => {
    const productInBill = billDetData.find((product) => product.id === item.id);

    if (!productInBill) {
      return;
    }

    const selectedItem = billDetData.find((selectedItem) => selectedItem.id === item.id);

    if (selectedItem) {
      // Item already exists, so update the quantity (up to product quantity)
      const newQuantity = selectedItem.ACCEPT_QTY + 1 || 1;
      const updatedQuantity = Math.min(newQuantity, productInBill.QUANTITY); // Ensure it doesn't exceed available quantity

      const updatedItems = billDetData.map((selected) => {
        if (selected.id === item.id) {
          return {
            ...selected,
            ACCEPT_QTY: updatedQuantity,
          };
        }
        return selected;
      });

      setBillDetData(updatedItems);
    } else {
      // Item is not in the list, so add it with a quantity of 1 (up to product quantity)
      setBillDetData([
        ...billDetData,
        {
          ...item,
          ACCEPT_QTY: Math.min(1, productInBill.QUANTITY), // Ensure it doesn't exceed available quantity
        },
      ]);
    }
  };

  const handleRemoveItem = (item) => {
    const selectedItem = billDetData.find((selectedItem) => selectedItem.id === item.id);
    if (!selectedItem) {
      return;
    }

    const updatedItems = billDetData.map((selected) => {
      if (selected.id === item.id) {
        const updatedQuantity = Math.max(selectedItem.ACCEPT_QTY - 1, 0);
          return {
            ...selected,
            ACCEPT_QTY: updatedQuantity,
        }
      }
      return selected;
    })

    setBillDetData(updatedItems);
  };

  const handleManualQuantityChange = (item, newQuantity) => {
    const productInBill = billDetData.find((product) => product.id === item.id);

    if (newQuantity <= 0) {
      // Remove the item from the billDetData array when the quantity becomes zero or negative
      const updatedItems = billDetData.filter((selected) => selected.id !== item.id);
      setBillDetData(updatedItems);
    } else {
      const updatedItems = billDetData.map((selected) => {
        if (selected.id === item.id) {
          const updatedQuantity = Math.min(Math.max(Number(newQuantity) || 0, 0), productInBill.QUANTITY);
          return {
            ...selected,
            ACCEPT_QTY: updatedQuantity,
          };
        }
        return selected;
      });

      setBillDetData(updatedItems);
    }
  };

  const handleReasonChange = (productId, newReason) => {
    console.log('hi');
    setBillDetData((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            REJECT_REASON: newReason || 'No reason selected',
          };
        }
        return item;
      });
      console.log('Updated Items:', updatedItems);
      return updatedItems;
    });
  };
  


  const handleReturn = async () => {
    const data = {
      customer: billData,
      products: billDetData,
    }
    // Calculate total values
    const totalAcptQty = billDetData.reduce(
      (total, product) =>
        total + product.ACCEPT_QTY
      ,
      0
    );
    const totalProductAmount = billDetData.reduce((total, product) => {
      const productTotal = product.RATE * product.ACCEPT_QTY;
      return total + productTotal;
    }, 0);

    const totalGSTAmount = billDetData.reduce((total, product) => {
      const productTotal = product.RATE * product.ACCEPT_QTY;
      const discountAmount = (productTotal * product.DISCOUNTPER) / 100;
      const amountAfterDiscount = productTotal - discountAmount;
      const gstAmount = (amountAfterDiscount * product.IGSTPER) / 100;
      return total + gstAmount;
    }, 0);

    const discountAmount = billDetData.reduce((total, product) => {
      const productTotal = product.RATE * product.ACCEPT_QTY;
      const discountAmount = (productTotal * product.DISCOUNTPER) / 100;
      return total + discountAmount;
    }, 0);

    const totalBillAmount = totalProductAmount + totalGSTAmount - discountAmount;

    const bill = {
      RBILL_NO: data.customer.RBILL_NO,
      TENANT_ID: tenantId,
      RBILL_DATE: data.customer.RBILL_DATE,
      BILL_NO: data.customer.BILL_NO,
      BILL_DATE: data.customer.BILL_DATE,
      CUSTCODE: data.customer.CUSTCODE,
      TYPE: data.customer.TYPE,
      CUSTNAME: data.customer.CUSTNAME,
      MOBPHONE: data.customer.MOBPHONE,
      ADDRESS: data.customer.ADDRESS,
      CITY: data.customer.CITY,
      COUNTRY: data.customer.COUNTRY,
      BASIC: totalProductAmount,
      TERMTOTAL: totalGSTAmount,
      DISCOUNT: discountAmount,
      NET_AMT: totalBillAmount,
      SretType: returnType,
      TOT_MAX_QTY: data.customer.TOT_MAX_QTY,
      TOT_RET_QTY: data.customer.TOT_RET_QTY,
      TOT_ACCEPT_QTY: totalAcptQty,
      REVIEWED: 'YES',
      COMPANY: data.customer.COMPANY
    };
    const billTerm = {
      RBILL_NO: data.customer.RBILL_NO,
      RBILL_DATE: data.customer.RBILL_DATE,
      TYPE: data.customer.TYPE,
      BILL_NO: data.customer.BILL_NO,
      BILL_DATE: data.customer.BILL_DATE,
      SEQUENCE: '',
      PERCENTAGE: '',
      AMOUNT: '',
      DESCRIPT: ''
    };
    const entries = [
      { collectionName: collectionByTenant(collections.DBNOTE, tenantId), data: bill },
      { collectionName: collectionByTenant(collections.PRETTERM, tenantId), data: billTerm },
    ];
    // Create an array to store product entries
    const products = billDetData.map((product) => {
      return {
          RBILL_NO: data.customer.RBILL_NO,
          RBILL_DATE: data.customer.RBILL_DATE,
          BILL_NO: data.customer.BILL_NO,
          BILL_DATE: data.customer.BILL_DATE,
          CUSTNAME: data.customer.CUSTNAME,
          PRODCODE: product.PRODCODE,
          PRODNAME: product.PRODNAME,
          SGroupDesc: product.SGroupDesc,
          RETREAS: product.REASON || '',
          QUANTITY: product.QUANTITY,
          MODIFIED: true,
          MAX_QTY: product?.MAX_QTY,
          REJECT_REASON: product.REJECT_REASON,
          COMPANY: product.COMPANY,
          ACCEPT_QTY: product.ACCEPT_QTY,
          STATUS: 'ACCEPTED',
          TYPE: data.customer.TYPE,
          UOM: product.UOM,
          RATE: product.RATE,
          PRODTOTAL: product.RATE * product.ACCEPT_QTY,
          DISCOUNTPER: product.DISCOUNTPER,
          DISCOUNTAMT: (product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100,
          AMOUNT: product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100),
          IGSTPER: product.IGSTPER,
          IGSTAMT: ((product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100,
          CGSTAMT: ((product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100)) * (product.IGSTPER / 2)) / 100,
          SGSTAMT: ((product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100)) * (product.IGSTPER / 2)) / 100,
          GSTAMT: ((product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100,
          TOTALAMT: ((product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100)) + (((product.RATE * product.ACCEPT_QTY - ((product.RATE * product.ACCEPT_QTY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100))
      };
    });
    // console.log('------------->', products);
    dispatch({ type: 'SAVE_CUSTOMER', payload: bill });
    dispatch({ type: 'SAVE_PRODUCTS', payload: products });
    // dispatch({ type: 'SET_BillTERM', payload: billTerm });
    navigate('/purchase/return/confirm')
  }
  return (
    <div className="container relative">
      <div>
        <Row>
          <Col>
            <div id='customer_details' className='p-2 rounded-xl min-h-48'>
              <h2 className="text-xxl text-slate-500 font-bold m-2">{billData?.COMPANY}</h2>
              <h4 className="text-xxl text-slate-600 font-bold m-2">Request type {billData?.TYPE}</h4>
              {billData && 
              <Row className='p-2'>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Ref Bill No:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={billData?.BILL_NO}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Return Bill No:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={billData?.RBILL_NO}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Ref Bill Date:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={formatFirestoreTimestamp(billData?.BILL_DATE)}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Return Bill Date:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={formatFirestoreTimestamp(billData?.RBILL_DATE)}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Vendor Code:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={billData?.CUSTCODE}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Vendor Name:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={billData?.CUSTNAME}
                    disabled
                  />
                </Col>
              </Row>}
            </div>
            {isLoading &&
              <div className='w-full h-60 flex justify-center items-center'>
                <Spinner animation="border" variant="secondary" />
              </div>
            }
          </Col>
        </Row>
        <Row>
          <div>
            <div className='w-full rounded-lg '>
              {isModifyMode &&
                <h2 className="text-xl font-semibold m-2">You can Change the quantity</h2>}
              <div className='overflow-x-scroll rounded overflow-hidden'>
                <div className="h-60 min-h-max">
                  <table className="w-max bg-gray-400 border-collapse">
                    <thead className="">
                      <tr>
                        <th className="py-2 px-2 text-center">Code</th>
                        <th className="py-2 px-2 text-center">Product Name</th>
                        <th className="py-2 px-2 text-center">Bill Qty</th>
                        <th className="py-2 px-2 text-center">Ret Qty</th>
                        {billData?.REVIEWED === 'NO' && 
                        <th className="py-2 px-2 text-center">Return Reason</th>}
                        <th className="py-2 px-2 text-center">Accept Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billDetData[0] && billDetData.map((product, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-300' : 'bg-white'}>
                          <td className="py-2 px-4">{product.PRODCODE}</td>
                          <td className="py-2 px-4">{product.PRODNAME}</td>
                          <td className="py-2 px-4">{product.MAX_QTY}</td>
                          <td className="py-2 px-4">{product.QUANTITY}</td>
                          {billData?.REVIEWED === 'NO' &&
                          <td className="py-2 px-4">{product.RETREAS}</td>}
                          <td className='py-2 px-4'>
                          {billData?.REVIEWED === 'NO' ? 
                            <div className='flex'>
                              <Button variant="outline-primary" onClick={() => handleRemoveItem(product)}>
                                -
                              </Button>
                              <div className='w-20 px-2'>
                                <Form.Control
                                  type="number"
                                  min="0"
                                  max={billDetData.ACCEPT_QTY}
                                  value={billDetData.find((item) => item.id === product.id)?.ACCEPT_QTY || 0}
                                  onChange={(e) => handleManualQuantityChange(product, e.target.value)}
                                  className='w-full text-center'
                                />
                              </div>

                              <Button variant="outline-primary" onClick={() => handleAddItem(product)}>
                                +
                              </Button>
                            </div> : 
                            <div>
                              <div className='w-20 px-2'>
                                <Form.Control
                                  type="number"
                                  min="0"
                                  disabled
                                  value={billDetData.find((item) => item.id === product.id)?.ACCEPT_QTY}
                                  className='w-full text-center'
                                />
                              </div>
                            </div>}
                          </td>
                          <td className="py-2 px-1">
                          {billData?.REVIEWED === 'NO' ?
                            <Form.Select
                              value={billDetData.find((item) => item.id === product.id)?.REJECT_REASON || ''}
                              disabled={product.QUANTITY === billDetData.find((item) => item.id === product.id)?.ACCEPT_QTY}
                              onChange={(e) => handleReasonChange(product.id, e.target.value)}>
                                <option value="Select Return Reason">Select Return Reason</option>
                                <option value="Short recieved">Time Exceeded</option>
                                <option value="Extra recieved">Non Returnable</option>
                                <option value="Damage recieved">Damage recieved</option>
                            </Form.Select> : 
                            <div className='px-2'>
                              <Form.Control
                                type="text"
                                disabled
                                value={product?.REJECT_REASON}
                                className='w-full text-center'
                              />
                            </div>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {billData?.REVIEWED === 'NO' && 
            <div>
              <Row>
                <Col className='flex justify-center m-4'>
                  <Button onClick={handleReturn}>Procced</Button>
                </Col>
              </Row>
            </div>}
          </div>
        </Row>
      </div>
    </div>
  );
}

export default FetchPurchaseBillDataModify;
