import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DynamicSalesTable from "./DynamicSalesTable";

const initialState = {
  BillNo: "",
  BillDate: "",
  CustCode: "",
  CustName: "",
  PaymentMode: "",
  AdvancePayment: 0,
  DuePayment: 0,
  items: []
};

const SalesForm = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [tableData, setTableData] = useState([
    [null, null, null, null, null, null, null, null, null, null, null],
  ]);
  const { id } = useParams();
console.log('state', state);

  useEffect(() => {
    // Set default BillDate to today
    const today = new Date().toISOString().split('T')[0];
    setState((prevState) => ({ ...prevState, BillDate: today }));

    // Generate a unique BillNo
    const generateUniqueBillNo = () => {
      const uniqueId = `BL${Date.now()}`;
      return uniqueId;
    };

    setState((prevState) => ({ ...prevState, BillNo: generateUniqueBillNo() }));
  }, []);

  const {
    BillNo,
    BillDate,
    CustCode,
    CustName,
    PaymentMode,
    AdvancePayment,
    DuePayment,
    items
  } = state;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!BillNo || !CustName) {
      toast.error("Please provide a value for each input field");
    } else {
      const salesData = {
        BillNo,
        BillDate,
        CustCode,
        CustName,
        PaymentMode,
        AdvancePayment,
        DuePayment,
        items: tableData.map((row) => ({
          ItemCode: row[0],
          Description: row[1],
          Quantity: row[2],
          UOM: row[3],
          Rate: row[4],
          ProductTotal: row[5],
          Discount: row[6],
          TaxableAmount: row[7],
          GSTRate: row[8],
          GSTAmount: row[9],
          Amount: row[10],
        })),
      };

      axios
        .post("http://localhost:8005/api/sales/create", salesData)
        .then(() => {
          setState(initialState);
          setTableData([
            [null, null, null, null, null, null, null, null, null, null, null],
          ]);
          toast.success(" Successfully ");
        })
        .catch((err) => toast.error(err.response.data));

      setTimeout(() => {
        onCancel();
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });

    // If AdvancePayment is changed, recalculate DuePayment
    if (name === "AdvancePayment") {
      const totalAmount = calculateTotalAmount();
      const duePayment = totalAmount - parseFloat(value || 0);
      setState((prevState) => ({ ...prevState, DuePayment: duePayment }));
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;
    tableData.forEach((row) => {
      total += parseFloat(row[10]) || 0; // Assuming Amount is at index 10
    });
    return total;
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col lg={3} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Bill No.</Form.Label>
              <Form.Control
                required
                type="text"
                name="BillNo"
                value={BillNo || ""}
                placeholder="BL001"
                disabled
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Bill Date</Form.Label>
              <Form.Control
                type="date"
                name="BillDate"
                value={BillDate || ""}
                onChange={handleInputChange}
                placeholder="Bill Date"
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Cust Code</Form.Label>
              <Form.Control
                required
                type="text"
                name="CustCode"
                value={CustCode || ""}
                onChange={handleInputChange}
                placeholder="Cust Code"
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Cust Name</Form.Label>
              <Form.Control
                type="text"
                name="CustName"
                value={CustName || ""}
                onChange={handleInputChange}
                placeholder="Cust Name"
              />
            </Form.Group>
          </Col>
          <Col lg={12} md={12} sm={12}>
            <Form.Label></Form.Label>
             <DynamicSalesTable tableData={tableData} setTableData={setTableData} />
          </Col>
          <Col lg={3} md={6} sm={12}>
          <Form.Group as={Col}>
              <Form.Label>Payment Mode</Form.Label>
              <Form.Control
                as="select"
                name="PaymentMode"
                value={PaymentMode}
                onChange={handleInputChange}
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Advance Payment</Form.Label>
              <Form.Control
                type="number"
                name="AdvancePayment"
                value={AdvancePayment || 0}
                onChange={handleInputChange}
                placeholder="Advance Payment"
              />
            </Form.Group>
          </Col>
          <Col lg={3} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Due Payment</Form.Label>
              <Form.Control
                type="number"
                name="DuePayment"
                value={DuePayment || 0}
                readOnly
                placeholder="Due Payment"
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SalesForm;
