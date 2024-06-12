import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const ViewSale = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log('sale', sale);
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await axios.get(`http://localhost:8005/api/sales/${id}`);
        setSale(response.data);
      } catch (error) {
        setError(error.message);
        toast.error("Error fetching sale data");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-60 flex justify-center items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container p-2">
      <h2 className="text-xl font-bold mb-4">Sale Details</h2>
      {sale ? (
        <div>
          <p><strong>Bill No:</strong> {sale.billNo}</p>
          <p><strong>Bill Date:</strong> {sale.billDate}</p>
          <p><strong>Cust Code:</strong> {sale.custCode}</p>
          <p><strong>Cust Name:</strong> {sale.custName}</p>
          <p><strong>Payment Mode:</strong> {sale.paymentMode}</p>
          <p><strong>Advance Payment:</strong> {sale.advancePayment}</p>
          <p><strong>Due Payment:</strong> {sale.duePayment}</p>
          <h3>Items</h3>
          <div className="w-100 overflow-x-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Rate</th>
                  <th>Product Total</th>
                  <th>GST Rate</th>
                  <th>GST Amount</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemCode}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.uom}</td>
                    <td>{item.rate}</td>
                    <td>{item.productTotal}</td>
                    <td>{item.gstrRate}</td>
                    <td>{item.gstAmount}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No sale data available</p>
      )}
    </div>
  );
};

export default ViewSale;
