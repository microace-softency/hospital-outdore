import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';

import { RiFileSearchLine } from 'react-icons/ri';
import { BsSearch } from 'react-icons/bs';
import { fetchDataWithWhere } from '../services';
import { collections } from '../config';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
function FetchBillDataViewer() {
  const [billNo, setBillNo] = useState('');
  const [retNo, setRetNo] = useState('');
  const [billData, setBillData] = useState([]);
  const [billDetData, setBillDetData] = useState([]);
  const [billTermData, setBillTermData] = useState([]);
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { myCollection } = useAuth()

  const fetchdetails = async (billNo) => {
    if (!billNo) {
      toast.warning('Enter valid Bill No', {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setIsLoading(true)
      const matchField = 'BILL_NO'
      fetchDataWithWhere(myCollection(collections.BILL), matchField, billNo)
        .then((servicefetch) => {
          setBillData(...servicefetch);
          // console.log('billdata------->', ...servicefetch);
        })
        .catch((error) => {
          toast.error('No data Found', {
            position: "top-center",
            autoClose: 500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setBillData([])
          setBillDetData([])
          setBillTermData([])
        });
      fetchDataWithWhere(myCollection(collections.BILLDET), matchField, billNo)
        .then((servicefetch) => {
          setBillDetData(...servicefetch);
          // console.log('BillDetData------->', ...servicefetch);
        })
        .catch((error) => {
          // console.error('Error fetching customers:', error);
        });
      fetchDataWithWhere(myCollection(collections.BILLTERM), matchField, billNo)
        .then((servicefetch) => {
          setBillTermData(...servicefetch);
          // console.log('BillDetTermData------->', ...servicefetch);
        })
        .catch((error) => {
          // console.error('Error fetching customers:', error);
        });
      setIsLoading(false)
    }
  }
  function formatFirestoreTimestamp(timestamp) {
    if (timestamp) {
      // Convert Firestore Timestamp to JavaScript Date
    const jsDate = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    // Format the date as a string (for example, in a specific format)
    const formattedDate = jsDate.toLocaleString(); // Adjust the format as needed
    return formattedDate;
    }
  }
  const handleAddItem = (item) => {
    // Find the product in the billDetData
    const productInBill = billDetData.products.find((product) => product.id === item.id);
    
    if (!productInBill) {
      return;
    }
    // Check if the item is already in the selectedItems list
    const selectedItem = selectedItems.find((selectedItem) => selectedItem.id === item.id);
  
    if (selectedItem) {
      // Item already exists, so update the quantity (up to product quantity)
      const updatedItems = selectedItems.map((selected) => {
        if (selected.id === item.id) {
          return {
            ...selected,
            quantity: Math.min(selectedItem.quantity + 1, productInBill.quantity)
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
          quantity: 1
        }
      ]);
    }
  };
  const handleRemoveItem = (item) => {
    const selectedItem = selectedItems.find((selectedItem) => selectedItem.id === item.id);
    if (!selectedItem) {
      return;
    }
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
  };

  return (
    <div className="container">
      {/* <p className='font-bold m-2'>Find Billing info</p> */}
      <Row>
        <Col lg={4}>
          <form className="w-full bg-sky-300 mb-2 rounded-xl">
            <div className='p-4'>
              <div className="pb-2">
                <label htmlFor="customerCode" className="block text-gray-700 font-bold mb-2">
                  Enter Refernce Invoice:
                </label>
                <div className='flex h-10'>
                  <input
                    type="number"
                    id="billNumber"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    className="w-full h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow"
                  />
                  <Button onClick={() => fetchdetails(billNo)} variant="primary" className='px-2 mx-2 drop-shadow'>
                      <span className='flex items-center gap-2 text-xl'>
                        <BsSearch />
                      </span>
                  </Button>
                </div>
              </div>
              <div className="">
                <label htmlFor="customerCode" className="block text-gray-700 font-bold mb-2">
                  Enter Sel Ret Note:
                </label>
                <div className='flex h-10'>
                  <input
                    type="number"
                    id="billNumber"
                    value={retNo}
                    onChange={(e) => setRetNo(e.target.value)}
                    className="w-full h-10 border rounded-md focus:outline-none focus:border-blue-500 px-4 mb-4 drop-shadow"
                  />
                  <Button onClick={() => fetchdetails(billNo)} variant="primary" className='px-2 mx-2 drop-shadow'>
                      <span className='flex items-center gap-2 text-xl'>
                        <BsSearch />
                      </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Col>
        <Col lg={8}>
            <div id='customer_details' className='bg-sky-300 p-2 rounded-xl'>
              <h2 className="text-xl font-semibold m-2">Customer Details</h2>
              <Row className='p-2'>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Billing Date:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={formatFirestoreTimestamp(billData?.BILL_DATE)}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Customer Code:</label>
                  <input
                    type="text"
                    className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary"
                    value={billData?.code}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <label className='block text-gray-700 font-bold'>Customer Name:</label>
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
                    value={billData?.mobNumber}
                    disabled
                  />
                </Col>
                <Col lg={4}>
                  {/* <Button variant='danger' className='mt-4 ms-2 px-4' onClick={handleCrearCustomer}>
                  Clear
                </Button> */}
                </Col>
              </Row>
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
                      </tr>
                    </thead>
                    <tbody>
                      {billDetData?.products?.map((product, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                          <td className="py-2 px-4">{product.descript}</td>
                          <td className="py-2 px-4">{product.quantity}</td>
                          <td className="py-2 px-4">₹{product.MRP_RATE}</td>
                          <td className="py-2 px-4">₹{product.MRP_RATE * product.quantity}</td>
                          <td className='py-2 px-4'>
                            <div className='flex'>
                              <Button variant="outline-primary" onClick={() => handleRemoveItem(product)}>
                                -
                              </Button>
                              <Form.Label className='w-8 flex justify-center items-center'>
                                {selectedItems.find((item) => item.id === product.id)?.quantity || 0}
                              </Form.Label>
                              <Button variant="outline-primary" onClick={() => handleAddItem(product)}>
                                +
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div>
              <Row>
                <Col className='flex justify-center'>
                  <Button onClick={()=> {console.log('123')}} disabled={!selectedItems[0]}>Procced Return</Button>
                </Col>
              </Row>
            </div>
          </div>
      </Row>
    </div>
  );
}

export default FetchBillDataViewer;
