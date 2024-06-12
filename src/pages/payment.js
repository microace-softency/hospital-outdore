import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-toastify';
import { paymentEntries } from '../services/billingServices';

function PaymentPage() {
  const { state } = useGlobalState();
  const [paymentMode, setPaymentMode] = useState('');
  const [isBillingMode, setBillingMode] = useState(false);
  const navigate = useNavigate()
  const [customerInfo, SetCustomerInfo] = useState({})
  const [productInfo, SetProductInfo] = useState('')
  const previousProducts = JSON.parse(localStorage.getItem('reports')) || []
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const modelFor = parts[parts.length -2];
  const thisModel = modelFor === 'sale' ? 'Invoice' : 'Order';
  const custVend = modelFor === 'sale' ? 'Customer' : 'Vendor';
  // console.log(thisModel);
  useEffect(() => {
    if (state.customerDetails) {
      SetCustomerInfo(state.customerDetails)
      SetProductInfo(state.addedProducts)
    }
    if (!customerInfo && isBillingMode) {
      navigate('/entry')
    }
  }, [] )
  // Function to calculate the total bill
  function calculateTotalBill(addedProducts) {
    return addedProducts.reduce((total, product) => total + product.MRP_RATE * product.quantity, 0);
  }

  // Function to handle the print action
  function handlePrint() {
    window.print();
  }
  const handlePaymentModeSelect = (mode) => {
    setPaymentMode(mode);
  };

  const generateInvoiceNumber = async() => {
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
    const paymentData = {
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
    
    SetCustomerInfo(updatedCustomer)
    console.log('customerInfo', updatedCustomer);
    setBillingMode(true)
  };

  return (
    <div className="container mx-auto m-8">
      <div className="bg-white p-6 rounded-lg shadow-lg printable-content" id="printableContent">
      <div className='flex justify-center p-2 bg-sky-300 -mx-6 px-4'>
      {isBillingMode ? <h1 className=''>{thisModel}</h1> :<h1 className="text-3xl font-semibold mb-4">Confirm {thisModel} Info</h1>}
      </div>
        {/* Customer Details */}
        {customerInfo && (
          <div className=''>
            {isBillingMode &&
              <div className='flex justify-between px-4 flex-col py-2'>
                <p className='m-0'><strong>{thisModel} Number:</strong> {customerInfo?.invoiceNumber}</p>
                <p className='m-0'><strong>{thisModel} Date:</strong> {formatDateTime(customerInfo?.paymentDate)}</p>
              </div>
            }
            <h2 className="text-xl font-semibold mb-2 bg-sky-300 -mx-6 px-4">{custVend} Details</h2>
            <p><strong>Invoice For :</strong> {customerInfo.name}</p>
            <p><strong>Number:</strong> {customerInfo.mobNumber}</p>
            <p><strong>GST Number:</strong> {customerInfo.gstNumber}</p>
          </div>
        )}

        {/* Product Details */}
        {productInfo.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <table className="w-full border-collapse -ms-3">
              <thead className="bg-gray-400">
                <tr>
                  <th className="py-2 px-2 text-left">Name</th>
                  <th className="py-2 px-2 text-left">Qty</th>
                  <th className="py-2 px-2 text-left">Price</th>
                  <th className="py-2 px-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {productInfo.map((product, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="py-2 px-4">{product.descript}</td>
                    <td className="py-2 px-4">{product.quantity}</td>
                    <td className="py-2 px-4">₹{product.MRP_RATE}</td>
                    <td className="py-2 px-4">₹{product.MRP_RATE * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-400">
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4"></td>
                  <td className="py-2 px-4 font-semibold">Total:</td>
                  <td className="py-2 px-4 font-semibold">
                    ₹{calculateTotalBill(productInfo)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Total Bill */}
        
        {!isBillingMode ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">Choose Mode of Payment</h3>
            <div className='flex justify-center '>
              <div className="flex space-x-4 w-max">
                <button
                  onClick={() => handlePaymentModeSelect('Credit Card')}
                  className={`py-2 px-4 rounded-md ${paymentMode === 'Credit Card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                    } hover:bg-blue-600 hover:text-white`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => handlePaymentModeSelect('Cash')}
                  className={`py-2 px-4 rounded-md ${paymentMode === 'Cash'
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
        ) :
          (
            <div className='flex items-center '>
              <h3 className="text-xl font-semibold me-4">Mode of Payment</h3>
              <div className='bg-slate-300 px-3 py-2 rounded-md'>
                <p className='m-0 font-semibold text-lg'>{paymentMode}</p>
              </div>
            </div>
          )}
        <div className='flex justify-center mt-20'>
          {!isBillingMode ?
            (<button
              onClick={handlePaymentReceived}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              Proceed Billing
            </button>)
            :
            (
              <button
                onClick={() => { window.print() }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Print receipt
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
