import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { toast } from 'react-toastify';
import { multiEntry, paymentEntries } from '../../../services/billingServices';
import { collections } from '../../../config';
import { useAuth } from '../../../context/AuthContext';
import InvoiceHeader from '../../../components/InvoiceHeader';
import { roundOff } from '../../../services/utils';

function BillPaymentPage() {
  const { state } = useGlobalState();
  const [paymentMode, setPaymentMode] = useState('');
  const [isBillingMode, setBillingMode] = useState(false);
  const navigate = useNavigate()
  const [customerInfo, SetCustomerInfo] = useState({})
  const [productInfo, SetProductInfo] = useState('')
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const modelFor = parts[parts.length - 2];
  const thisModel = modelFor === 'sale' ? 'Invoice' : 'Order';
  const custVend = modelFor === 'sale' ? 'Customer' : 'Vendor';
  const { myCollection } = useAuth();
  useEffect(() => {
    if (state.customerDetails) {
      SetCustomerInfo(state.customerDetails)
      SetProductInfo(state.addedProducts)
    }
    if (!customerInfo && isBillingMode) {
      navigate('/entry')
    }
  }, [])

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
  // Total bill amount with discount and GST
  // const totalBillAmount = calculateTotalBill(state.addedProducts) - discountAmount + totalGSTAmount;
  const totalProductAmount = calculateTotalProductAmount(state.addedProducts);

  function calculateTotalDiscount(addedProducts) {
    return addedProducts.reduce(
      (total, product) => total + ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100),
      0
    );
  }

  function calculateTotalGST(addedProducts) {
    return addedProducts.reduce(
      (total, product) => total + (product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100),
      0
    );
  }

  function calculateTotalProductAmount(addedProducts) {
    return addedProducts.reduce((total, product) => {
      const perTotal = product.MRP_RATE * product.QUANTITY;
      return total + perTotal;
    }, 0);
  }

  function calculateTotalBill(addedProducts) {
    return addedProducts.reduce((total, product) => {
      const subtotal = product.MRP_RATE * product.QUANTITY;
      const discountAmount = subtotal * (product.DISCPER / 100);
      const gstAmount = subtotal * (product.IGST / 100);
      const totalAmount = subtotal - discountAmount + gstAmount;
      return total + totalAmount;
    }, 0);
  }

  // Function to handle the print action
  function handlePrint() {
    window.print();
  }
  const handlePaymentModeSelect = (mode) => {
    setPaymentMode(mode);
  };

  const generateInvoiceNumber = async () => {
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

    if (month) {
      return `${formattedDate} ${formattedTime}`;
    }
  }

  // Helper function to add leading zero to single-digit numbers
  function padZero(num) {
    return num < 10 ? `0${num}` : num.toString();
  }

  const handlePaymentReceived = async () => {
    if (!paymentMode) {
      toast.warning('Select payment mode', {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return
    }
    const invoiceNumber = await generateInvoiceNumber();
    const currentDate = new Date();
    const date = currentDate;
    const data = {
      customer: state.customerDetails,
      products: state.addedProducts,
      paymentMethod: paymentMode,
      invoiceNumber: invoiceNumber,
      paymentDate: date,
    }
    const updatedCustomer =
    {
      ...state.customerDetails,
      invoiceNumber: invoiceNumber,
      paymentDate: date,
    }
    const bill = {
      BILL_NO: data.invoiceNumber || '',
      BILL_DATE: data.paymentDate || '',
      CUSTCODE: data.customer?.CUSTCODE || '',
      CUSTNAME: data.customer?.NAME || '',
      MOBPHONE: data.customer?.MOBPHONE || '',
      ADDRESS: data.customer?.ADDRESS || '',
      CITY: data.customer?.CITY || '',
      COUNTRY: data.customer?.COUNTRY || '',
      BASIC: roundOff(totalProductAmount) || '',
      TERMTOTAL: roundOff(totalGSTAmount) || '',
      DISCOUNT: roundOff(discountAmount) || '',
      NET_AMT: roundOff(totalBillAmount) || '',
      PAY_MODE: paymentMode || '',
    };
    const billTerm = {
      BILL_NO: data.invoiceNumber,
      BILL_DATE: data.paymentDate,
      SEQUENCE: '',
      PERCENTAGE: '',
      AMOUNT: '',
      DESCRIPT: ''
    };
    const entries = [
      { collectionName: myCollection(collections.BILL), data: bill },
      { collectionName: myCollection(collections.BILLTERM), data: billTerm },
    ];
    // Create an array to store product entries
    const productEntries = state.addedProducts.map((product) => {
      return {
        collectionName: myCollection(collections.BILLDET),
        data: {
          BILL_NO: data.invoiceNumber || '',
          BILL_DATE: date || '',
          CUSTNAME: data.customer?.NAME || '',
          PRODCODE: product.PRODCODE || '',
          PRODNAME: product.DESCRIPT || '',
          GroupDesc: product.GroupDesc || '',
          SGroupDesc: product.SGroupDesc || '',
          QUANTITY: product.QUANTITY || '',
          UOM: product.UOM_SALE || '',
          RATE: product.MRP_RATE || '',
          PRODTOTAL: roundOff(product.MRP_RATE * product.QUANTITY) || '',
          DISCOUNTPER: product.DISCPER || '',
          DISCOUNTAMT: roundOff((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) || '',
          AMOUNT: roundOff(product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) || '',
          IGSTPER: roundOff(product.IGST) || '',
          IGSTAMT: roundOff(((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST)) / 100) || '',
          CGSTAMT: roundOff(((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST / 2)) / 100) || '',
          SGSTAMT: roundOff(((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST / 2)) / 100) || '',
          GSTAMT: roundOff(((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST)) / 100) || '',
          TOTALAMT: roundOff(((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) + (((product.MRP_RATE * product.QUANTITY - ((product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)) * (product.IGST)) / 100)))
        },
      };
    });
    multiEntry(entries);
    multiEntry(productEntries)
      .then(() => {
        toast.success('entry Successfull', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        SetCustomerInfo(updatedCustomer)
        setBillingMode(true)
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
      <div className="bg-white p-2 rounded-lg shadow-lg printable-content" id="printableContent">
        {/* <div className='flex justify-center p-2 bg-sky-300 -mx-6 px-4'>
          {isBillingMode ? <h1 className=''>Invoice bill</h1> : <h1 className="text-3xl font-semibold mb-4">Confirm billing Info</h1>}
        </div>
        {customerInfo && (
          <div className=''>
            {isBillingMode &&
              <div className='flex justify-between px-4 flex-col py-2'>
                <p className='m-0'><strong>Bill Number:</strong> {customerInfo?.invoiceNumber}</p>
                <p className='m-0'><strong>Billing Date:</strong> {formatDateTime(customerInfo?.paymentDate)}</p>
              </div>
            }
            <h2 className="text-xl font-semibold mb-2 bg-sky-300 -mx-6 px-4">Customer Details</h2>
            <p><strong>Invoice For :</strong> {customerInfo.NAME}</p>
            <p><strong>Number:</strong> {customerInfo.MOBPHONE}</p>
            <p><strong>GST Number:</strong> {customerInfo.GSTIn}</p>
          </div>
        )} */}
        <InvoiceHeader paymentMode={paymentMode} customer={customerInfo.NAME} time={formatDateTime(customerInfo?.paymentDate)}/>
        {/* Product Details */}
        {isBillingMode ? (
          productInfo.length > 0 && (
            <div className="mt-4 text-xs -mx-2">
              <p className="text-md font-semibold mb-2 ms-4">Product Details</p>
              <div className="">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="py-2 px-3 sm:px-2 text-left">Item</th>
                      <th className="py-2 px-3 sm:px-2 text-left">QTY</th>
                      <th className="py-2 px-3 sm:px-2 text-left">Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productInfo.map((product, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                        <td className="py-2 px-3 sm:px-2 text-xsm">{product.DESCRIPT}</td>
                        <td className="py-2 px-3 sm:px-2">{product.QUANTITY.toFixed(2)}</td>
                        <td className="py-2 px-3 sm:px-2">₹{(((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) / 100 * product.IGST) + (product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-300">
                      <td className="py-2 px-3 sm:px-2 font-semibold">Total:</td>
                      <td className="py-2 px-3 sm:px-2">
                        {productInfo.reduce((total, product) => total + product.QUANTITY, 0)}
                      </td>
                      <td className="py-2 px-3 sm:px-2 font-semibold">₹{totalBillAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )) :
          (productInfo.length > 0 && (
            <div className="mt-4 text-sm">
              <h2 className="text-xl font-semibold mb-2">Product Details</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-400">
                    <tr>
                      <th className="py-2 px-3 sm:px-2 text-left">SL.No</th>
                      <th className="py-2 px-3 sm:px-2 text-left">Item</th>
                      {/* <th className="py-2 px-3 sm:px-2 text-left">UOM</th> */}
                      <th className="py-2 px-3 sm:px-2 text-left">QTY</th>
                      <th className="py-2 px-3 sm:px-2 text-left">Rate</th>
                      {/* <th className="py-2 px-3 sm:px-2 text-left">Product Total</th> */}
                      <th className="py-2 px-3 sm:px-2 text-left">Discount</th>
                      {/* <th className="py-2 px-3 sm:px-2 text-left">Taxable Amt</th> */}
                      <th className="py-2 px-3 sm:px-2 text-left">GST Rate</th>
                      {/* <th className="py-2 px-3 sm:px-2 text-left">GST AMOUNT</th> */}
                      <th className="py-2 px-3 sm:px-2 text-left">Sub Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productInfo.map((product, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                        <td className="py-2 px-3 sm:px-2">{index + 1}</td>
                        <td className="py-2 px-3 sm:px-2 text-xsm">{product.DESCRIPT}</td>
                        {/* <td className="py-2 px-3 sm:px-2">{product.UOM_SALE}</td> */}
                        <td className="py-2 px-3 sm:px-2">{product.QUANTITY}</td>
                        <td className="py-2 px-3 sm:px-2">₹{product.MRP_RATE}</td>
                        {/* <td className="py-2 px-3 sm:px-2">₹{product.MRP_RATE * product.QUANTITY}</td> */}
                        <td className="py-2 px-3 sm:px-2">{product.DISCPER}% (₹{(product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100})</td>
                        {/* <td className="py-2 px-3 sm:px-2">₹{(product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)}</td> */}
                        <td className="py-2 px-3 sm:px-2">{product.IGST}%</td>
                        {/* <td className="py-2 px-3 sm:px-2">₹{((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) /100 * product.IGST)}</td> */}
                        <td className="py-2 px-3 sm:px-2">₹{((product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100) / 100 * product.IGST) + (product.MRP_RATE * product.QUANTITY - (product.MRP_RATE * product.QUANTITY * product.DISCPER) / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-400">
                      <td className="py-2 px-3 sm:px-2 font-semibold">Total:</td>
                      <td className="py-2 px-3 sm:px-2"></td>
                      {/* <td className="py-2 px-3 sm:px-2"></td> */}
                      <td className="py-2 px-3 sm:px-2">
                        {productInfo.reduce((total, product) => total + product.QUANTITY, 0)}
                      </td>
                      <td className="py-2 px-3 sm:px-2"></td>
                      {/* <td className="py-2 px-3 sm:px-2">{totalProductAmount}</td> */}
                      <td className="py-2 px-3 sm:px-2"> ₹{(discountAmount)}</td>
                      {/* <td className="py-2 px-3 sm:px-2 font-semibold">₹{(totalProductAmount - discountAmount)}</td> */}
                      <td className="py-2 px-3 sm:px-2"></td>
                      {/* <td className="py-2 px-3 sm:px-2">₹{totalGSTAmount}</td> */}
                      <td className="py-2 px-3 sm:px-2 font-semibold">₹{totalBillAmount}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))
        }
        {!isBillingMode && (
          <div>
            <h3 className="text-xl font-semibold mb-4 my-4">Choose Mode of Payment</h3>
            <div className='flex justify-center '>
              <div className="flex space-x-4 w-max">
                <button
                  onClick={() => handlePaymentModeSelect('CARD')}
                  className={`py-2 px-4 rounded-md ${paymentMode === 'CARD'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                    } hover:bg-blue-600 hover:text-white`}
                >
                  Card
                </button>
                <button
                  onClick={() => handlePaymentModeSelect('CASH')}
                  className={`py-2 px-4 rounded-md ${paymentMode === 'CASH'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                    } hover:bg-blue-600 hover:text-white`}
                >
                  Cash
                </button>
                <button
                  onClick={() => handlePaymentModeSelect('UPI')}
                  className={`py-2 px-4 rounded-md ${paymentMode === 'UPI'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                    } hover:bg-blue-600 hover:text-white`}
                >
                  UPI
                </button>
              </div>
            </div>
          </div>
        )}
        <div className='flex justify-center mt-20'>
          {!isBillingMode &&
            (<button
              onClick={handlePaymentReceived}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              Proceed Billing
            </button>)
          }
        </div>
      </div>
      <div className='my-2 p-2 flex justify-between'>

        {isBillingMode && 
        <div className=''>
          <button
            onClick={() => { navigate('/sale/bill/add') }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-blue-600 me-2"
          >
            Cancel
          </button>
          <button
            onClick={() => { window.print() }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Print receipt
          </button>
        </div>}
      </div>
    </div>
  );
}

export default BillPaymentPage;
