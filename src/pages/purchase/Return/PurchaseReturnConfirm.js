import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { toast } from 'react-toastify';
import { multiEntry, paymentEntries } from '../../../services/billingServices';
import { useAuth } from '../../../context/AuthContext';
import { collections } from '../../../config';
import { Button, Modal } from 'react-bootstrap';
import { formatDateTime, formatDateTimestamp } from '../../../services/utils';
import { collectionByTenant, deleteMultipleDocs, fetchDataWithMultipleWheree, fetchDataWithWhere, fetchRefWithMultipleWhere, updateData, updateDocWithWhere } from '../../../services';

function PurchaseReturnConfirm() {
  const { state } = useGlobalState();
  const [printModelShpw, setPrintModelShow] = useState(false);
  const navigate = useNavigate()
  const [customerInfo, SetCustomerInfo] = useState({})
  const [productInfo, SetProductInfo] = useState('')
  const [orderId, setOrderId] = useState('')
  const { myCollection } = useAuth()
  const [isSubmiting, setIsSubmiting] = useState(false)

  useEffect(() => {
    if (state.customerDetails) {
      SetCustomerInfo(state.customerDetails)
      SetProductInfo(state.addedProducts)
      setOrderId(state.retRef)
    }
  }, [])
  // Function to handle the print action
  function handlePrint() {
    window.print();
  }


  const currentDate = new Date();
  const date = currentDate;

  const handleConfirm = async () => {
    setIsSubmiting(true)
    const invoiceNumber = orderId;
    const data = {
      customer: state.customerDetails,
      products: state.addedProducts,
    }
    const bill = {
      ...data.customer,
      ACCEPT_DATE: date
    };
    const entries = [
      { collectionName:await collectionByTenant(collections.DBNOTE, data.customer.TENANT_ID), data: bill },
    ];
    // Create an array to store product entries
    const productEntriesRef = await collectionByTenant(collections.PRETDET, data.customer.TENANT_ID)
    const productEntries = data.products.map((product) => {
      return {
        collectionName: productEntriesRef,
        data: {
          ...product,
          ACCEPT_DATE: date
        },
      };;
    });
    console.log('bill', bill);
    console.log('productEntries', productEntries);
    deleteMultipleDocs(await collectionByTenant(collections.DBNOTE, data.customer.TENANT_ID), 'RBILL_NO', data.customer.RBILL_NO)
    deleteMultipleDocs(await collectionByTenant(collections.PRETDET, data.customer.TENANT_ID), 'RBILL_NO', data.customer.RBILL_NO)
    .then(()=> {
      console.log('deleted');
      multiEntry(entries)
      multiEntry(productEntries)
      .then(()=> {
        toast.success('Return Accepted', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate('/return')
      })
    })
    .catch((err)=> {
      console.log(err);
    })
    
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
              <Button variant="danger" onClick={()=> {navigate('/purchase/return')}} className="px-4">
                No
              </Button>
              <Button variant="success" onClick={() => {navigate('/purchase/return');window.print()}} className="px-4">
                Yes
              </Button>
            </div>
          </Modal.Body>
        </div>
      </Modal>
      <div className="bg-white p-6 rounded-lg shadow-lg printable-content" id="printableContent">
        <div className='flex justify-start bg-sky-300 -mx-6 px-4'>
          <h1 className="text-2xl font-semibold text-slate-400 mx-auto">Return Confirmation</h1>
        </div>
        <div className=''>
          <h1 className="text-2xl font-semibold text-slate-500 my-1">{customerInfo.COMPANY}</h1>
          <div className='flex justify-between flex-col py-2'>
            <p className='my-1'><span className='font-bold'>REF BILL NO :</span> {customerInfo.BILL_NO}</p>
            <p className='my-1'><span className='font-bold'>REF BILL Date:</span> {formatDateTimestamp(customerInfo.BILL_DATE)}</p>
            <p className='my-1'><span className='font-bold'>RET BILL NO :</span> {customerInfo.RBILL_NO}</p>
            <p className='my-1'><span className='font-bold'>RET REQ Date:</span> {formatDateTimestamp(customerInfo.RBILL_DATE)}</p>
            <p className='my-1'><span className='font-bold'>RET ACCEPT Date:</span> {formatDateTime(date)}</p>
          </div>
        </div>
        {productInfo.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="py-2 px-3 sm:px-2 text-left">SL.No</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Product</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Qty</th>
                    <th className="py-2 px-3 sm:px-2 text-left">UOM</th>
                    <th className="py-2 px-3 sm:px-2 text-left">Rate</th>
                    <th className="py-2 px-3 sm:px-20 text-right">Product Total</th>
                    <th className="py-2 px-3 sm:px-20 text-right">Discount</th>
                    <th className="py-2 px-3 sm:px-20 text-right">GST AMT</th>
                    <th className="py-2 px-3 sm:px-20 text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {productInfo.map((product, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                      <td className="py-2 px-3 sm:px-2">{index + 1}</td>
                      <td className="py-2 px-3 sm:px-2">{product.PRODNAME}</td>
                      <td className="py-2 px-3 sm:px-2 text-right">{product.ACCEPT_QTY}</td>
                      <td className="py-2 px-3 sm:px-2">{product.UOM}</td>
                      <td className="py-2 px-3 sm:px-2">{product.RATE}</td>
                      <td className="py-2 px-3 sm:px-2 text-right">{product.PRODTOTAL.toFixed(2)}</td>
                      <td className="py-2 px-3 sm:px-2 text-right">{product.DISCOUNTPER}{product.DISCOUNTPER && '%'} ({(product.DISCOUNTAMT).toFixed(2)})</td>
                      <td className="py-2 px-3 sm:px-2 text-right">{(product.GSTAMT).toFixed(2) }</td>
                      <td className="py-2 px-3 sm:px-2 text-right">{(product.TOTALAMT).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-400">
                    <td className="py-2 px-3 sm:px-2 font-semibold">Total:</td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2 text-right">
                      {productInfo.reduce((total, product) => total + product.ACCEPT_QTY, 0)}
                    </td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2"></td>
                    <td className="py-2 px-3 sm:px-2 text-right">{customerInfo.BASIC.toFixed(2)}</td>
                    <td className="py-2 px-3 sm:px-2 text-right"> {(customerInfo.DISCOUNT.toFixed(2))}</td>
                    <td className="py-2 px-3 sm:px-2 text-right">{customerInfo.TERMTOTAL.toFixed(2)}</td>
                    <td className="py-2 px-3 sm:px-2 font-semibold text-right">{customerInfo.NET_AMT.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        <div className='flex justify-center mt-20'>
          <button
            disabled={isSubmiting}
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

export default PurchaseReturnConfirm;
