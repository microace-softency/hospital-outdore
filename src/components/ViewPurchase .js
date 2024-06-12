import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const   ViewPurchase = () => {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const response = await axios.get(`http://localhost:8005/api/purchase/${id}`);
        setPurchase(response.data);
      } catch (error) {
        setError(error.message);
        toast.error("Error fetching purchase data");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
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
      <h2 className="text-xl font-bold mb-4">Purchase Details</h2>
      {purchase ? (
        <div>
          <p><strong>Purchase Inv No:</strong> {purchase.PurchaseInvNo}</p>
          <p><strong>Inv Date:</strong> {purchase.InvDate}</p>
          <p><strong>Party Inv No:</strong> {purchase.PartyInvNo}</p>
          <p><strong>Purchase Inv Date:</strong> {purchase.PurchaseInvDate}</p>
          <p><strong>Vendor Code:</strong> {purchase.VendorCode}</p>
          <p><strong>Vendor Name:</strong> {purchase.VendorName}</p>
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
              {purchase.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.ItemCode}</td>
                  <td>{item.Description}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.UOM}</td>
                  <td>{item.Rate}</td>
                  <td>{item.ProductTotal}</td>
                  <td>{item.GSTRate}</td>
                  <td>{item.GSTAmount}</td>
                  <td>{item.Amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      ) : (
        <p>No purchase data available</p>
      )}
    </div>
  );
};

export default ViewPurchase;
