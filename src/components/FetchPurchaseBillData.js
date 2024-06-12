import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Form, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';

import { RiFileSearchLine } from 'react-icons/ri';
import { BsSearch } from 'react-icons/bs';
import { fetchDataWithWhere, formatFirestoreTimestamp } from '../services';
import { collections } from '../config';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { multiEntry } from '../services/billingServices';
import BillsTableModal from './BillTableModal';
function FetchPurchaseBillDataViewer() {
  const { state, dispatch } = useGlobalState();
  const [billNo, setBillNo] = useState('');
  const [retNo, setRetNo] = useState('');
  const [billData, setBillData] = useState([]);
  const [billDetData, setBillDetData] = useState([]);
  // const [billTermData, setBillTermData] = useState([]);
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [noRefModel, setNoRefModal] = useState(false);
  const [returnType, setReturnType] = useState('GRM');
  const [newRefId, setNewRefId] = useState('');
  const [showHelp, setShowHelp ] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const returnId = parts[parts.length - 1] ? parts[parts.length - 1] : null;
  const { myCollection } = useAuth()

  useEffect(()=> {
    // dispatch({ type: 'SET_CUSTOMERS', payload: [] });
    // dispatch({ type: 'SET_PRODUCTS', payload: [] });
    // dispatch({ type: 'SET_BillTERM', payload: [] });
  },)
  useEffect(() => {
    if (returnId !== 'add' && !billData[0]) {
      // console.log(returnId);
      setBillNo(returnId);
      fetchdetails(returnId)
    }
  }, [returnId])
  const handleCancelNewRef = () => {
    setNoRefModal(false)
    setBillData(null);
    setSelectedItems([]);
    setBillDetData([]);
    setBillNo('')
    navigate('/purchase/return')
  }

  const fetchdetails = async (billNo) => {
    if (!billNo) {
      setShowHelp(true)
      return
    } else {
      setIsLoading(true)
      const matchField = 'BILL_NO'
      fetchDataWithWhere(myCollection(collections.BILLIN), matchField, billNo)
        .then((servicefetch) => {
          setBillData(...servicefetch);
          // console.log('billdata------->', ...servicefetch);
        })
        .catch((error) => {
          setNoRefModal(true);
          setNewRefId(billNo)
          setBillData([])
          setBillDetData([])
          // setBillTermData([])
        });
      fetchDataWithWhere(myCollection(collections.BLLINDET), matchField, billNo)
        .then((servicefetch) => {
          setBillDetData([...servicefetch]);
          if (showHelp) {
            setShowHelp(false);
            setBillNo(billNo)
          }
          // console.log('BillDetData------->', ...servicefetch);
        })
        .catch((error) => {
          // console.error('Error fetching customers:', error);
        });
      setIsLoading(false)
    }
  }

  const handleAddItem = (item) => {
    // Find the product in the billDetData
    const productInBill = billDetData.find((product) => product.id === item.id);

    if (!productInBill) {
      return;
    }

    // Check if the item is already in the selectedItems list
    const selectedItem = selectedItems.find((selectedItem) => selectedItem.id === item.id);

    if (selectedItem) {
      // Item already exists, so update the quantity (up to product quantity)
      const updatedItems = selectedItems.map((selected) => {
        if (selected.id === item.id) {
          const newQuantity = selectedItem.QUANTITY + 1;
          const updatedQuantity = Math.min(newQuantity, productInBill.QUANTITY); // Ensure it doesn't exceed available quantity
          return {
            ...selected,
            QUANTITY: updatedQuantity
          };
        }
        return selected;
      });
      setSelectedItems(updatedItems);
    } else {
      // Item is not in the list, so add it with a quantity of 1 (up to product quantity)
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          QUANTITY: 1
        }
      ]);
    }
  };

  const handleRemoveItem = (item) => {
    const selectedItem = selectedItems.find((selectedItem) => selectedItem.id === item.id);
    if (!selectedItem) {
      return;
    }

    if (selectedItem.quantity === 1 && selectedItems.length === 1) {
      // If the last item is being removed, clear the selectedItems array
      setSelectedItems([]);
    } else {
      // Update the quantity (down to 1 or remove if it reaches 0)
      const updatedItems = selectedItems
        .map((selected) => {
          if (selected.id === item.id) {
            const updatedQuantity = Math.max(selectedItem.quantity - 1, 0);
            if (updatedQuantity > 0) {
              return {
                ...selected,
                quantity: updatedQuantity,
              };
            } else {
              return null; // Remove the item from the list
            }
          }
          return selected;
        })
        .filter(Boolean); // Filter out null values (removed items)
      setSelectedItems(updatedItems);
    }
  };

  const handleReasonChange = (productId, newReason) => {
    setSelectedItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            REASON: newReason,
          };
        }
        return item;
      });
    });
  };

  const handleManualQuantityChange = (item, newQuantity) => {
    const productInBill = billDetData.find((product) => product.id === item.id);

    if (newQuantity <= 0) {
      // Remove the item from the selectedItems array when the quantity becomes zero or negative
      const updatedItems = selectedItems.filter((selected) => selected.id !== item.id);
      setSelectedItems(updatedItems);
    } else {
      const updatedItems = selectedItems.map((selected) => {
        if (selected.id === item.id) {
          const updatedQuantity = Math.min(Math.max(Number(newQuantity) || 0, 0), productInBill.QUANTITY);
          return {
            ...selected,
            QUANTITY: updatedQuantity
          };
        }
        return selected;
      });

      setSelectedItems(updatedItems);
    }
  };

  // Helper function to add leading zero to single-digit numbers
  function padZero(num) {
    return num < 10 ? `0${num}` : num.toString();
  }
  const generateInvoiceNumber = async (returnType) => {
    const characters = '0123456789';
    let invoiceNumberPrefix = '';

    // Determine the invoice number prefix based on the return type
    if (returnType === 'GRM') {
      invoiceNumberPrefix = 'SR';
    } else if (returnType === 'GVN') {
      invoiceNumberPrefix = 'SV';
    }

    // Generate 5 random numbers
    let randomNumbers = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomNumbers += characters[randomIndex];
    }

    // Combine the prefix and random numbers to form the invoice number
    const invoiceNumber = `${invoiceNumberPrefix}${randomNumbers}`;

    return invoiceNumber;
  };

  function formatDateTime(inputDateTime) {
    // Parse the input date-time string
    const dateTime = new Date(inputDateTime);

    // Extract the year, month, day, hour, minute, and second components
    const year = dateTime.getFullYear() % 100; // Get the last two digits of the year
    const month = dateTime.getMonth() + 1; // Months are 0-based, so add 1
    const day = dateTime.getDate();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();

    // Create the formatted date and time string
    const formattedDate = `${padZero(month)}/${padZero(day)}/${padZero(year)}`;
    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    // console.log(`${formattedDate} ${formattedTime}`);

    return `${formattedDate} ${formattedTime}`;
  }

  // const handleReturn = async () => {

  //   const invoiceNumber = await generateInvoiceNumber(returnType);
  //   const currentDate = new Date();
  //   const date = currentDate;
  //   const data = {
  //     customer: billData,
  //     products: billDetData,
  //     // paymentMethod: paymentMode,
  //     invoiceNumber: invoiceNumber,
  //     paymentDate: date,
  //   }
  //   // Calculate total values
  //   const totalProductAmount = selectedItems.reduce((total, product) => {
  //     const productTotal = product.RATE * product.QUANTITY;
  //     return total + productTotal;
  //   }, 0);

  //   const totalGSTAmount = selectedItems.reduce((total, product) => {
  //     const productTotal = product.RATE * product.QUANTITY;
  //     const discountAmount = (productTotal * product.DISCOUNTPER) / 100;
  //     const amountAfterDiscount = productTotal - discountAmount;
  //     const gstAmount = (amountAfterDiscount * product.IGSTPER) / 100;
  //     return total + gstAmount;
  //   }, 0);

  //   const discountAmount = selectedItems.reduce((total, product) => {
  //     const productTotal = product.RATE * product.QUANTITY;
  //     const discountAmount = (productTotal * product.DISCOUNTPER) / 100;
  //     return total + discountAmount;
  //   }, 0);

  //   const totalBillAmount = totalProductAmount + totalGSTAmount - discountAmount;

  //   const bill = {
  //     RBILL_NO: data.invoiceNumber,
  //     RBILL_DATE: data.paymentDate,
  //     BILL_NO: data.customer.BILL_NO,
  //     BILL_DATE: data.customer.BILL_DATE,
  //     CUSTCODE: data.customer.CUSTCODE,
  //     CUSTNAME: data.customer.CUSTNAME,
  //     MOBPHONE: data.customer.MOBPHONE,
  //     ADDRESS: data.customer.ADDRESS,
  //     CITY: data.customer.CITY,
  //     COUNTRY: data.customer.COUNTRY,
  //     BASIC: totalProductAmount,
  //     TERMTOTAL: totalGSTAmount,
  //     DISCOUNT: discountAmount,
  //     NET_AMT: totalBillAmount,
  //   };
  //   const billTerm = {
  //     RBILL_NO: data.invoiceNumber,
  //     RBILL_DATE: data.paymentDate,
  //     BILL_NO: data.customer.BILL_NO,
  //     BILL_DATE: data.customer.BILL_DATE,
  //     SEQUENCE: '',
  //     PERCENTAGE: '',
  //     AMOUNT: '',
  //     DESCRIPT: ''
  //   };
  //   const entries = [
  //     { collectionName: myCollection(collections.DBNOTE), data: bill },
  //     { collectionName: myCollection(collections.PRETTERM), data: billTerm },
  //   ];
  //   // Create an array to store product entries
  //   const productEntries = selectedItems.map((product) => {
  //     return {
  //       collectionName: myCollection(collections.PRETDET),
  //       data: {
  //         RBILL_NO: data.invoiceNumber,
  //         RBILL_DATE: date,
  //         CUSTNAME: data.customer.CUSTNAME,
  //         PRODCODE: product.PRODCODE,
  //         PRODNAME: product.PRODNAME,
  //         RETREAS: product.REASON,
  //         QUANTITY: product.QUANTITY,
  //         UOM: product.UOM,
  //         RATE: product.RATE,
  //         PRODTOTAL: product.RATE * product.QUANTITY,
  //         DISCOUNTPER: product.DISCOUNTPER,
  //         DISCOUNTAMT: (product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100,
  //         AMOUNT: product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100),
  //         IGSTPER: product.IGSTPER,
  //         IGSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100,
  //         CGSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER / 2)) / 100,
  //         SGSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER / 2)) / 100,
  //         GSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100,
  //         TOTALAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) + (((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100))
  //       },
  //     };
  //   });
  //   multiEntry(entries);
  //   multiEntry(productEntries)
  //     .then(() => {
  //       toast.success('Return Successfull', {
  //         position: "top-center",
  //         autoClose: 600,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //       setBillData(null);
  //       setSelectedItems([]);
  //       setBillDetData([]);
  //       setBillNo('')
  //       navigate('/purchase/return')
  //     })
  //     .catch((error) => {
  //       console.error('Sumthing unexpected happened', error);
  //       toast.error('entry failed', {
  //         position: "top-center",
  //         autoClose: 600,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     });
  // }
  const handleReturn = async () => {

    const invoiceNumber = await generateInvoiceNumber(returnType);
    const currentDate = new Date();
    const date = currentDate;
    const data = {
      customer: billData,
      products: billDetData,
      // paymentMethod: paymentMode,
      invoiceNumber: invoiceNumber,
      paymentDate: date,
    }
    // Calculate total values
    const totalProductAmount = selectedItems.reduce((total, product) => {
      const productTotal = product.RATE * product.QUANTITY;
      return total + productTotal;
    }, 0);

    const totalGSTAmount = selectedItems.reduce((total, product) => {
      const productTotal = product.RATE * product.QUANTITY;
      const discountAmount = (productTotal * product.DISCOUNTPER) / 100;
      const amountAfterDiscount = productTotal - discountAmount;
      const gstAmount = (amountAfterDiscount * product.IGSTPER) / 100;
      return total + gstAmount;
    }, 0);

    const discountAmount = selectedItems.reduce((total, product) => {
      const productTotal = product.RATE * product.QUANTITY;
      const discountAmount = (productTotal * product.DISCOUNTPER) / 100;
      return total + discountAmount;
    }, 0);

    const totalBillAmount = totalProductAmount + totalGSTAmount - discountAmount;

    const bill = {
      RBILL_NO: data.invoiceNumber,
      RBILL_DATE: data.paymentDate,
      BILL_NO: data.customer.BILL_NO,
      BILL_DATE: data.customer.BILL_DATE,
      CUSTCODE: data.customer.CUSTCODE,
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
    };
    const billTerm = {
      RBILL_NO: data.invoiceNumber,
      RBILL_DATE: data.paymentDate,
      BILL_NO: data.customer.BILL_NO,
      BILL_DATE: data.customer.BILL_DATE,
      SEQUENCE: '',
      PERCENTAGE: '',
      AMOUNT: '',
      DESCRIPT: ''
    };
    const entries = [
      { collectionName: myCollection(collections.DBNOTE), data: bill },
      { collectionName: myCollection(collections.PRETTERM), data: billTerm },
    ];
    // Create an array to store product entries
    const products = selectedItems.map((product) => {
      return {
          RBILL_NO: data.invoiceNumber,
          RBILL_DATE: date,
          CUSTNAME: data.customer.CUSTNAME,
          PRODCODE: product.PRODCODE,
          PRODNAME: product.PRODNAME,
          SGroupDesc: product.SGroupDesc,
          RETREAS: product.REASON || '',
          QUANTITY: product.QUANTITY,
          MODIFIED: true,
          MAX_QTY: billDetData?.find((item) => item.id === product.id)?.QUANTITY,
          UOM: product.UOM,
          RATE: product.RATE,
          PRODTOTAL: product.RATE * product.QUANTITY,
          DISCOUNTPER: product.DISCOUNTPER,
          DISCOUNTAMT: (product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100,
          AMOUNT: product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100),
          IGSTPER: product.IGSTPER,
          IGSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100,
          CGSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER / 2)) / 100,
          SGSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER / 2)) / 100,
          GSTAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100,
          TOTALAMT: ((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) + (((product.RATE * product.QUANTITY - ((product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100)) * (product.IGSTPER)) / 100))
      };
    });
    // console.log('------------->', products);
    dispatch({ type: 'SAVE_CUSTOMER', payload: bill });
    dispatch({ type: 'SAVE_PRODUCTS', payload: products });
    dispatch({ type: 'SET_BillTERM', payload: billTerm });
    navigate('/purchase/return/confirmation')
  }
  return (
    <div className="container">
      <BillsTableModal
      show={showHelp}
      onDataSelect={fetchdetails}
      onClose={()=> setShowHelp(false)}
      />
      <Modal centered className="" show={noRefModel}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" >
            <Modal.Title className="text-xl font-bold text-white">No Bill Reference Found</Modal.Title>
          </Modal.Header>
          <Modal.Body className="flex justify-between items-center">
            <p className="text-gray-700 text-white text-lg">Do you want to continue with this Ref ?</p>
            <div className="flex justify-between w-1/2 m-0">
              <Button variant="danger" onClick={handleCancelNewRef} className="px-4">
                No
              </Button>
              <Button variant="success" onClick={() => { navigate(`/purchase/return/add/custom/${billNo}`) }} className="px-4">
                Yes
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      {/* <p className='font-bold m-2'>Find Billing info</p> */}
      <Row>
        <Col lg={4}>
          <form className="w-full bg-sky-300 mb-2 rounded-xl">
            <div className='p-4'>
              <div className="pb-2">
                <label htmlFor="customerCode" className="block text-gray-700 font-bold mb-2">
                  Ref No:
                </label>
                <div className='flex h-10'>
                  <input
                    type="number"
                    id="billNumber"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    className="w-full h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow"
                  />
                  <Button onClick={() => {fetchdetails(billNo)}} variant="primary" className='px-2 mx-2 drop-shadow'>
                    <span className='flex items-center gap-2 text-xl'>
                      <BsSearch />
                    </span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center">
                <label htmlFor="reportType" className="text-gray-700 font-bold me-4 ">
                  Report Type:
                </label>
                <select
                  id="reportType"
                  className="px-2 rounded-md drop-shadow"
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value)}
                >
                  <option value="GRM">GRM</option>
                  <option value="GVN">GVN</option>
                </select>
              </div>
            </div>
          </form>
        </Col>
        <Col lg={8}>
          <div id='customer_details' className='bg-sky-300 p-2 rounded-xl min-h-48'>
            <h2 className="text-xl font-semibold m-2">Vendor Details</h2>
            {billData && <Row className='p-2'>
              <Col md={6}>
                <label className='block text-gray-700 font-bold'>Bill Date:</label>
                <input
                  type="text"
                  className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                  value={formatFirestoreTimestamp(billData?.BILL_DATE)}
                  disabled
                />
              </Col>
              <Col md={6}>
                <label className='block text-gray-700 font-bold'>Vendor Code:</label>
                <input
                  type="text"
                  className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                  value={billData?.CUSTCODE}
                  disabled
                />
              </Col>
              <Col md={6}>
                <label className='block text-gray-700 font-bold'>Vendor Name:</label>
                <input
                  type="text"
                  className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                  value={billData?.CUSTNAME}
                  disabled
                />
              </Col>
              <Col md={6}>
                <label className='block text-gray-700 font-bold'>Phone Number:</label>
                <input
                  type="text"
                  className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                  value={billData?.MOBPHONE}
                  disabled
                />
              </Col>
              <Col lg={4}>
                {/* <Button variant='danger' className='mt-4 ms-2 px-4' onClick={handleCrearCustomer}>
                  Clear
                </Button> */}
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
          <div className='bg-sky-300 my-4 rounded-lg '>
            <h2 className="text-xl font-semibold m-2">Select Products for return</h2>
            <div className='overflow-x-scroll'>
              <div className="h-60 min-h-max">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-400">
                    <tr>
                      <th className="py-2 px-2 text-left">Name</th>
                      <th className="py-2 px-2 text-left">Qty</th>
                      <th className="py-2 px-2 text-left">Price</th>
                      <th className="py-2 px-2 text-left">Amount</th>
                      <th className="py-2 px-2 text-left">Select</th>
                      <th className="py-2 px-20 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billDetData[0] && billDetData.map((product, index) => (
                      (!product.RETURNED &&
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-300' : 'bg-white'}>
                        <td className="py-2 px-4">{product.PRODNAME}</td>
                        <td className="py-2 px-4">{product.QUANTITY}</td>
                        <td className="py-2 px-4">₹{product.RATE}</td>
                        <td className="py-2 px-4">₹{product.RATE * product.QUANTITY}</td>
                        <td className='py-2 px-4'>
                          <div className='flex'>
                            <Button variant="outline-primary" onClick={() => handleRemoveItem(product)}>
                              -
                            </Button>
                            <div className='w-20 px-2'>
                              <Form.Control
                                type="number"
                                min="0"
                                max={product.QUANTITY}
                                value={selectedItems.find((item) => item.id === product.id)?.QUANTITY || 0}
                                onChange={(e) => handleManualQuantityChange(product, e.target.value)}
                                className='w-full text-center'
                              />
                            </div>

                            <Button variant="outline-primary" onClick={() => handleAddItem(product)}>
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="py-2 px-1">
                          {/* <Form.Control
                            as="textarea"
                            className='w-full'
                            rows={1}
                            value={selectedItems.find((item) => item.id === product.id)?.REASON || ''}
                            onChange={(e) => handleReasonChange(product.id, e.target.value)}
                            disabled={!selectedItems.find((item) => item.id === product.id)?.QUANTITY > 0}
                          /> */}
                          <Form.Select
                          value={selectedItems.find((item) => item.id === product.id)?.REASON || ''}
                          disabled={!selectedItems.find((item) => item.id === product.id)?.QUANTITY > 0}
                          onChange={(e) => handleReasonChange(product.id, e.target.value)}>
                            <option>Select Return Reason</option>
                            <option value="Short recieved">Short recieved</option>
                            <option value="Extra recieved">Extra recieved</option>
                            <option value="Damage recieved">Damage recieved</option>
                          </Form.Select>
                        </td>
                      </tr>)
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <Row>
              <Col className='flex justify-center'>
                <Button onClick={handleReturn} disabled={!selectedItems[0]}>Procced Return</Button>
              </Col>
            </Row>
          </div>
        </div>
      </Row>
    </div>
  );
}

export default FetchPurchaseBillDataViewer;
