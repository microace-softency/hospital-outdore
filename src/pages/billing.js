import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';

function BillingPage() {
  const { state } = useGlobalState();

  // Function to calculate the total bill
  function calculateTotalBill(addedProducts) {
    return addedProducts.reduce((total, product) => total + product.rate * product.quantity, 0);
  }

  // Function to handle the print action
  function handlePrint() {
    window.print();
  }

  return (
    <div className="container mx-auto py-8">
      {/* Billing Details */}
      <div className="bg-white p-6 rounded-lg shadow-lg printable-content" id="printableContent">
        <h1 className="text-3xl font-semibold mb-4">Billing Details</h1>

        {/* Customer Details */}
        {state.customerDetails && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Customer Details</h2>
            <p><strong>Number:</strong> {state.customerDetails.number}</p>
            <p><strong>Name:</strong> {state.customerDetails.name}</p>
            <p><strong>GST Number:</strong> {state.customerDetails.gstNumber}</p>
          </div>
        )}

        {/* Product Details */}
        {state.addedProducts.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Product Details</h2>
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Quantity</th>
                  <th className="py-2 px-4 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {state.addedProducts.map((product, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">{product.quantity}</td>
                    <td className="py-2 px-4">₹{product.rate * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Total Bill */}
        {state.addedProducts.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xl font-semibold">Total Bill: ₹{calculateTotalBill(state.addedProducts)}</p>
          </div>
        )}

        {/* Print Button */}
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
