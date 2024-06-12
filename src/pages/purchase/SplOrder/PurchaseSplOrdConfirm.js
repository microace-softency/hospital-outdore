import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { toast } from 'react-toastify';
import { multiEntry, paymentEntries } from '../../../services/billingServices';
import { useAuth } from '../../../context/AuthContext';
import { collections } from '../../../config';
import { Button, Modal } from 'react-bootstrap';

function PurchaseSplOrdConfirm() {
  const { state } = useGlobalState();
  const [printModelShpw, setPrintModelShpw] = useState(false);
  const navigate = useNavigate()
  const [customerInfo, SetCustomerInfo] = useState({})
  const [specialOrder, setSpecialOrder] = useState(state.splOrd || [

  ])
  const previousProducts = JSON.parse(localStorage.getItem('reports')) || []
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/")
  const [orderId, setOrderId] = useState('')
  const { myCollection } = useAuth()

  useEffect(() => {
    if (state.customerDetails) {
      SetCustomerInfo(state.customerDetails)
    }
    setOrderId(generateInvoiceNumber())
    setSpecialOrder(state.splOrd)
    // console.log('huhuhu', state.splOrd);
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
      splOrd: specialOrder,
      invoiceNumber: invoiceNumber,
      paymentDate: date,
    }
    const bill = {
      BILL_NO: data.invoiceNumber || '',
      BILL_DATE: data.paymentDate || '',
      CUSTCODE: data.customer.CUSTCODE || '',
      CUSTNAME: data.customer.NAME || '',
      MOBPHONE: data.customer.MOBPHONE || '',
      ADDRESS: data.customer.ADDRESS || '',
      CITY: data.customer.CITY || '',
      COUNTRY: data.customer.COUNTRY || '',
      CAKETYPE: specialOrder?.cakeType || '',
      CATEGORY: specialOrder?.category || '',
      DLVDATE: new Date(specialOrder?.deliveryDate) || null,
      CFLAVOUR: specialOrder?.flavour || '',
      CMESSAGE: specialOrder?.message || '',
      CREMARKS: specialOrder?.remarks || '',
      CIMAGEURL: specialOrder?.imageUrl || '',
      ADVANCE: specialOrder?.advance || '',
      WEIGHT: specialOrder?.weight || '',
      RATE: specialOrder?.rate || '',
      AMOUNT: specialOrder?.amount || '',
      PCS: specialOrder?.pcs || '',
      STATUS: 'PENDING'

    };
    // console.log('biLl---->', bill);
    const entries = [
      { collectionName: myCollection(collections.SPLORDER), data: bill },
    ];
    multiEntry(entries)
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
// console.log(specialOrder,'-----------------', specialOrder.imageUrl);
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
              <Button variant="danger" onClick={()=> {navigate('/purchase/special/order')}} className="px-4">
                No
              </Button>
              <Button variant="success" onClick={() => {navigate('/purchase/special/order');window.print()}} className="px-4">
                Yes
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      <div className="bg-white p-6 rounded-lg shadow-lg printable-content" id="printableContent">
        <div className='flex justify-start p-2 bg-sky-300 -mx-6 px-4'>
          <h1 className="text-3xl font-semibold text-slate-400 mb-4">Order Confirmation</h1>
        </div>
        <div className=''>
          <div className='flex justify-between flex-col py-2'>
            <p className='my-1'><span className='font-bold'>Order ID :</span> {orderId}</p>
            <p className='my-1'><span className='font-bold'>Date:</span> {formatDateTime(date)}</p>
          </div>
          <h2 className="text-xl font-semibold mb-2 bg-sky-300 -mx-6 px-4 py-1">Customer Details</h2>
          <p className='text-slate-500 font-semibold text-2xl'>{customerInfo.NAME}</p>
          <p><strong>contact No :</strong> {customerInfo.MOBPHONE}</p>
        </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2 bg-sky-300 -mx-6 px-4 py-1">Special Order</h2>
            <div className='w-full'>
            <h4 className="text-xl font-semibold mb-2">Image Ref: </h4>
              <img src={specialOrder?.imageUrl} className='w-48 ml-auto rounded' alt='image' />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="py-2 px-3 sm:px-2 text-left">SL.No</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Cake Type</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Category</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Delivery Date</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Flavour</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Message</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <td className="py-2 px-3 sm:px-2">1</td>
                      <td className="py-2 px-3 sm:px-2">{specialOrder.cakeType}</td>
                      <td className="py-2 px-3 sm:px-2">{specialOrder.category}</td>
                      <td className="py-2 px-3 sm:px-2">{specialOrder.deliveryDate}</td>
                      <td className="py-2 px-3 sm:px-2">{specialOrder.flavour}</td>
                      <td className="py-2 px-3 sm:px-2">{specialOrder.message}</td>
                      <td className="py-2 px-3 sm:px-2">{specialOrder.remarks}</td>
                    </tr>
                </tbody>
                {/* <tfoot>
                  <tr className="bg-gray-400">
                    <td className="py-2 px-3 sm:px-2 font-semibold">Total:</td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2">
                      {productInfo.reduce((total, product) => total + product.QUANTITY, 0)}
                    </td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2">{totalProductAmount}</td>
                    <td className="py-2 px-3 sm:px-2"> ₹{(discountAmount).toFixed(2)}</td>
                    <td className="py-2 px-3 sm:px-2">₹{totalGSTAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 sm:px-2 font-semibold">₹{totalBillAmount.toFixed(2)}</td>
                  </tr>
                </tfoot> */}
              </table>
            </div>
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

export default PurchaseSplOrdConfirm;
