import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { toast } from 'react-toastify';
import { multiEntry, paymentEntries } from '../../../services/billingServices';
import { useAuth } from '../../../context/AuthContext';
import { collections } from '../../../config';
import { Button, Modal } from 'react-bootstrap';

function OrderConfirmation() {
  const { state } = useGlobalState();
  const [printModelShpw, setPrintModelShpw] = useState(false);
  const navigate = useNavigate()
  const [customerInfo, SetCustomerInfo] = useState({})
  const [productInfo, SetProductInfo] = useState('')
  const [orderId, setOrderId] = useState('')
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const { myCollection } = useAuth()

  useEffect(() => {
    if (state.customerDetails) {
      SetCustomerInfo(state.customerDetails)
      SetProductInfo(state.addedProducts)
      console.log(state.addedProducts);
    }
    setOrderId(generateInvoiceNumber())
  }, [])
  // Function to calculate the total bill
  const totalBll = state.addedProducts.reduce((total, product) => total + product.MRP_RATE * product.QUANTITY, 0);
  const totalQty = state.addedProducts.reduce((total, product) => total + product.QUANTITY, 0);

  // Function to handle the print action
  function handlePrint() {
    window.print();
  }

  const generateInvoiceNumber = () => {
    const characters = '0123456789';
    let invoiceNumber = '';
    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      invoiceNumber += characters[randomIndex];
    }
    return invoiceNumber;
  }

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

  // Helper function to add leading zero to single-digit numbers
  function padZero(num) {
    return num < 10 ? `0${num}` : num.toString();
  }
  const totalProductAmount = state.addedProducts.reduce(
    (total, product) => total + ((product.MRP_RATE * product.QUANTITY)),
    0
  );
  const discountAmount = state.addedProducts.reduce(
    (total, product) => total + ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100),
    0
  );
  const totalGSTAmount = state.addedProducts.reduce(
    (total, product) => total + ((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) / 100 * product.IGST),
    0
  );
  const totalBillAmount = state.addedProducts.reduce(
    (total, product) =>
      total + (
        ((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) / 100 * product.IGST) +
        (product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)
      )
    ,
    0
  );
  const currentDate = new Date();
  const date = currentDate;

  const handleConfirm = async () => {
    const invoiceNumber = orderId;
    const data = {
      customer: state.customerDetails,
      products: state.addedProducts,
      invoiceNumber: invoiceNumber,
      paymentDate: date,
      advanceAmount: advanceAmount,
    }
    const bill = {
      OA_NO: data.invoiceNumber || '',
      OA_DATE: data.paymentDate || '',
      CUSTCODE: data.customer.CUSTCODE || '',
      CUSTNAME: data.customer.NAME || '',
      MOBPHONE: data.customer.MOBPHONE || '',
      ADDRESS: data.customer.ADDRESS || '',
      CITY: data.customer.CITY || '',
      COUNTRY: data.customer.COUNTRY || '',
      BASIC: totalProductAmount || '',
      TERMTOTAL: totalGSTAmount || '',
      DISCOUNT: discountAmount || '',
      NET_AMT: totalBillAmount || '',
      ADV_AMT:data.advanceAmount || '',
    };
    const billTerm = {
      OA_NO: data.invoiceNumber,
      OA_DATE: date,
      SEQUENCE: '',
      PERCENTAGE: '',
      AMOUNT: '',
      DESCRIPT: ''
    };
    // console.log('biLl---->', bill);
    // console.log('billTerm---->', billTerm);
    // console.log('billTerm---->', billTerm);
    const entries = [
      { collectionName: myCollection(collections.ORDER), data: bill },
      { collectionName: myCollection(collections.ORDERTERM), data: billTerm },
    ];
    // Create an array to store product entries
    const productEntries = state.addedProducts.map((product) => {
      return {
        collectionName: myCollection(collections.ORDERDET),
        data: {
          OA_NO: data.invoiceNumber || '',
          OA_DATE: date || '',
          CUSTNAME: data.customer.NAME || '',
          PRODCODE: product.PRODCODE || '',
          PRODNAME: product.DESCRIPT || '',
          SGroupDesc: product.SGroupDesc || '',
          QUANTITY: product.QUANTITY || '',
          UOM: product.UOM_SALE || '',
          RATE: product.MRP_RATE || '',
          PRODTOTAL: (product.MRP_RATE * product.QUANTITY) || '',
          DISCOUNTPER: product.DISCPER || '',
          DISCOUNTAMT: ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) || '',
          AMOUNT: (product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) || '',
          IGSTPER: product.IGST || '',
          IGSTAMT: (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST)) / 100) || '',
          CGSTAMT: (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST / 2)) / 100) || '',
          SGSTAMT: (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST / 2)) / 100) || '',
          GSTAMT: (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST)) / 100) || '',
          TOTALAMT: (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) + (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST)) / 100)))
        },
      };
    });
    multiEntry(entries);
    multiEntry(productEntries)
      .then(() => {
        toast.success('Order succesfully placed', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setPrintModelShpw(true)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        toast.error('entry failed', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  return (
    <div className="container mx-auto m-8">
      <Modal centered className="" show={printModelShpw}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" >
            <Modal.Title className="text-xl font-bold text-white">Print</Modal.Title>
          </Modal.Header>
          <Modal.Body className="flex justify-between items-center">
            <p className="text-gray-700 text-white text-lg">Do you want Print</p>
            <div className="flex justify-between w-1/2 m-0">
              <Button variant="danger" onClick={() => { navigate('/sale/order') }} className="px-4">
                No
              </Button>
              <Button variant="success" onClick={() => { navigate('/sale/order'); window.print() }} className="px-4">
                Yes
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      <div className="bg-white p-6 overflow-hidden rounded-lg shadow-lg printable-content" id="printableContent">
        <div className='flex justify-start p-2 bg-sky-300 -mx-6 px-4'>
          <h1 className="text-3xl font-semibold text-slate-400 mb-4">Order Confirmation</h1>
        </div>
        <div className=''>
          <div className='flex justify-between flex-col py-2'>
            <p className='my-1'><span className='font-bold'>Order ID :</span> {orderId}</p>
            <p className='my-1'><span className='font-bold'>Date:</span> {formatDateTime(date)}</p>
          </div>
          <h2 className="text-xl font-semibold mb-2 bg-sky-300 -mx-6 px-4">Vendor Details</h2>
          <p className='text-slate-500 font-semibold text-2xl'>{customerInfo.NAME}</p>
          <p><strong>contact No :</strong> {customerInfo.MOBPHONE}</p>
        </div>
        {productInfo.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="py-2 px-3 sm:px-2 text-left">SL.No</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Product Name</th>
                    <th className="py-2 px-3 sm:px-2 text-left">UOM</th>
                    <th className="py-2 px-3 sm:px-2 text-left">QTY</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Rate</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Product Total</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Discount</th>
                    <th className="py-2 px-3 sm:px-2 text-left">GST AMT</th>
                    <th className="py-2 px-3 sm:px-2 text-left">TOTAL AMT</th>
                  </tr>
                </thead>
                <tbody>
                  {productInfo.map((product, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                      <td className="py-2 px-3 sm:px-2">{index + 1}</td>
                      <td className="py-2 px-3 sm:px-2">{product.DESCRIPT}</td>
                      <td className="py-2 px-3 sm:px-2">{product.UOM_SALE}</td>
                      <td className="py-2 px-3 sm:px-2">{product.QUANTITY}</td>
                      <td className="py-2 px-3 sm:px-2">{product.MRP_RATE}</td>
                      <td className="py-2 px-3 sm:px-2">{product.MRP_RATE * product.QUANTITY}</td>
                      <td className="py-2 px-3 sm:px-2">{product.DISCPER}% (₹{(product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100})</td>
                      <td className="py-2 px-3 sm:px-2">₹{((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) / 100 * product.IGST)}</td>
                      <td className="py-2 px-3 sm:px-2">₹{((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) / 100 * product.IGST) + (product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-400">
                    <td className="py-2 px-3 sm:px-2 font-semibold">Total:</td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2">
                      {productInfo.reduce((total, product) => total + product.QUANTITY, 0)}
                    </td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2">{totalProductAmount}</td>
                    <td className="py-2 px-3 sm:px-2"> ₹{(discountAmount)}</td>
                    <td className="py-2 px-3 sm:px-2">₹{totalGSTAmount}</td>
                    <td className="py-2 px-3 sm:px-2 font-semibold">₹{totalBillAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        <div className= 'bg-slate-300 p-2 -mx-20 flex justify-center items-center mt-20'>
          <span className='font-bold me-2'>Advance :</span>
          <input
            type="number"
            className='border border-slate-500 rounded p-2 text-right'
            placeholder="Enter Amount"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(parseFloat(e.target.value))}
          />
        </div>
        <div className='flex justify-center mt-20'>
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
          >
            Confirm and Place
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
