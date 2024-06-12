import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { toast } from 'react-toastify';
import { multiEntry, paymentEntries } from '../../../services/billingServices';
import { useAuth } from '../../../context/AuthContext';
import { collections } from '../../../config';
import { Button, Modal } from 'react-bootstrap';
import { formatDateTime, formatDateTimestamp } from '../../../services/utils';
import { fetchDataWithMultipleWheree, fetchDataWithWhere, fetchRefWithMultipleWhere, updateData, updateDocWithWhere } from '../../../services';

function PurchaseReturnModify() {
  const { state } = useGlobalState();
  const [printModelShpw, setPrintModelShow] = useState(false);
  const navigate = useNavigate()
  const [customerInfo, SetCustomerInfo] = useState({})
  const [productInfo, SetProductInfo] = useState('')
  const [orderId, setOrderId] = useState('')
  const { myCollection } = useAuth()

  useEffect(() => {
    if (state.customerDetails) {
      SetCustomerInfo(state.customerDetails)
      SetProductInfo(state.addedProducts)
      setOrderId(state.retRef)
    }
    // console.log(state.retRef.refId);
    // console.log(state);
    // console.log(state.customerDetails);
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
  // console.log('state.customerDetails', state.customerDetails);
  const handleConfirm = async () => {
    try {
      const invoiceNumber = orderId;
      const data = {
        customer: state.customerDetails,
        products: state.addedProducts,
      };
  
      const bill = {
        RBILL_NO: data.customer.RBILL_NO,
        RBILL_DATE: data.customer.RBILL_DATE,
        BILL_NO: data.customer.BILL_NO,
        BILL_DATE: data.customer.BILL_DATE,
        CUSTCODE: data.customer.CUSTCODE,
        CUSTNAME: data.customer.CUSTNAME,
        MOBPHONE: data.customer.MOBPHONE,
        ADDRESS: data.customer.ADDRESS,
        CITY: data.customer.CITY,
        COUNTRY: data.customer.COUNTRY,
        BASIC: data.customer.BASIC,
        TERMTOTAL: data.customer.TERMTOTAL,
        DISCOUNT: data.customer.DISCOUNT,
        NET_AMT: data.customer.NET_AMT,
        SretType: data.customer.SretType,
      };
  
      const billTerm = {
        BILL_NO: data.customer.RBILL_NO,
        BILL_DATE: data.customer.RBILL_DATE,
        SEQUENCE: '',
        PERCENTAGE: '',
        AMOUNT: '',
        DESCRIPT: ''
      };
  
      // Update main bill entry
      await updateDocWithWhere(
        myCollection(collections.DBNOTE),
        'RBILL_NO',
        bill.RBILL_NO,
        'BILL_NO',
        bill.BILL_NO,
        bill
      );
  
      // Create an array to store product entries
      const productEntries = state.addedProducts.map((product) => {
        return {
          collectionName: myCollection(collections.PRETDET),
          data: {
            RBILL_NO: data.customer.RBILL_NO,
            RBILL_DATE: data.customer.RBILL_DATE,
            BILL_NO: data.customer.BILL_NO,
            BILL_DATE: data.customer.BILL_DATE,
            CUSTNAME: data.customer.CUSTNAME,
            PRODCODE: product.PRODCODE,
            SGroupDesc: product.SGroupDesc,
            MAX_QTY: product.MAX_QTY,
            PRODNAME: product.PRODNAME,
            RETREAS: product.RETREAS,
            QUANTITY: product.QUANTITY,
            UOM: product.UOM,
            RATE: product.RATE,
            PRODTOTAL: product.PRODTOTAL,
            DISCOUNTPER: product.DISCOUNTPER,
            DISCOUNTAMT: (product.RATE * product.QUANTITY * product.DISCOUNTPER) / 100,
            AMOUNT: product.DISCOUNTAMT,
            IGSTPER: product.IGSTPER,
            IGSTAMT: product.IGSTAMT,
            CGSTAMT: product.CGSTAMT,
            SGSTAMT: product.SGSTAMT,
            GSTAMT: product.GSTAMT,
            TOTALAMT: product.TOTALAMT
          },
        };
      });
  
      // Update each product entry
      await Promise.all(productEntries.map(async (productData) => {
        await updateDocWithWhere(
          myCollection(collections.PRETDET),
          'PRODCODE',
          productData.data.PRODCODE,
          'BILL_NO',
          productData.data.BILL_NO,
          productData.data
        );
      }));
  
      // Display success message and show print modal
      toast.success('Entry successful', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setPrintModelShow(true);
    } catch (error) {
      console.error('Error updating data:', error);
      // Display error message
      toast.error('Error updating data. Please try again.', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
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
              <Button variant="danger" onClick={() => { navigate('/purchase/return') }} className="px-4">
                No
              </Button>
              <Button variant="success" onClick={() => { navigate('/purchase/return'); window.print() }} className="px-4">
                Yes
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      <div className="bg-white p-6 rounded-lg shadow-lg printable-content" id="printableContent">
        <div className='flex justify-start p-2 bg-sky-300 -mx-6 px-4'>
          <h1 className="text-3xl font-semibold text-slate-400 mb-4">Return Confirmation</h1>
        </div>
        <div className=''>
          <div className='flex justify-between flex-col py-2'>
            <p className='my-1'><span className='font-bold'>REF BILL NO :</span> {customerInfo.BILL_NO}</p>
            <p className='my-1'><span className='font-bold'>REF BILL Date:</span> {formatDateTimestamp(customerInfo.BILL_DATE)}</p>
            <p className='my-1'><span className='font-bold'>RBILL NO :</span> {customerInfo.RBILL_NO}</p>
            <p className='my-1'><span className='font-bold'>Date:</span> {formatDateTimestamp(customerInfo.RBILL_DATE)}</p>
          </div>
          <h2 className="text-xl font-semibold mb-2 bg-sky-300 -mx-6 px-4">Vendor Details</h2>
          <p className='text-slate-500 font-semibold text-2xl'>{customerInfo.CUSTNAME}</p>
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
                      <td className="py-2 px-3 sm:px-2">{product.PRODNAME}</td>
                      <td className="py-2 px-3 sm:px-2">{product.UOM}</td>
                      <td className="py-2 px-3 sm:px-2">{product.QUANTITY}</td>
                      <td className="py-2 px-3 sm:px-2">{product.RATE}</td>
                      <td className="py-2 px-3 sm:px-2">{product.PRODTOTAL}</td>
                      <td className="py-2 px-3 sm:px-2">{product.DISCOUNTPER}% (₹{(product.DISCOUNTAMT)})</td>
                      <td className="py-2 px-3 sm:px-2">₹{(product.GSTAMT)}</td>
                      <td className="py-2 px-3 sm:px-2">₹{(product.TOTALAMT)}</td>
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
                    <td className="py-2 px-3 sm:px-2">{customerInfo.BASIC}</td>
                    <td className="py-2 px-3 sm:px-2"> ₹{(customerInfo.DISCOUNT)}</td>
                    <td className="py-2 px-3 sm:px-2">₹{customerInfo.TERMTOTAL}</td>
                    <td className="py-2 px-3 sm:px-2 font-semibold">₹{customerInfo.NET_AMT}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
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

export default PurchaseReturnModify;
