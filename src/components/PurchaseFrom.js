import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DynamicTable from "./DynamicTable";

const initialState = {
  PurchaseInvNo: "",
  InvDate: "",
  PartyInvNo: "",
  PurchaseInvDate: "",
  VendorCode: "",
  VendorName: "",
  items:[]  
};

const PurchaseFrom = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [medicines, setMedicines] = useState([]);
  const [tableData, setTableData] = useState([
    [null, null, null, null, null, null, null, null, null],
  ]);
  const { id } = useParams();

  console.log('tableData', tableData);
  const {
    PurchaseInvNo,
    InvDate,
    PartyInvNo,
    PurchaseInvDate,
    VendorCode,
    VendorName,
    items
  } = state;
  console.log("paranttable", state);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!PurchaseInvNo || !VendorCode) {
      toast.error("Please provide a value for each input field");
    } else {
      const purchaseData = {
        PurchaseInvNo,
        InvDate,
        PartyInvNo,
        PurchaseInvDate,
        VendorCode,
        VendorName,
        items: tableData.map((row, rowIndex) => ({
          ItemCode: PurchaseInvNo,
          Description: row[1], 
          Quantity: row[2],
          UOM: row[3],
          Rate: row[4],
          ProductTotal: row[5],
          GSTRate: row[6],
          GSTAmount: row[7],
          Amount: row[8],
        })),
      };
        console.log('purchaseData', items);
      axios
        .post("http://localhost:8005/api/purchase/createpurches", purchaseData)
        .then(() => {
          setState(initialState);
          setMedicines([]);
          setTableData([
            [null, null, null, null, null, null, null, null, null],
          ]);
          toast.success("Purchase Successfully Created");
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
  };

  const handleAddMedicine = () => {
    setMedicines((prevMedicines) => [
      ...prevMedicines,
      { name: "", instruction: "", dosage: "" },
    ]);
  };

  const handleDeleteMedicine = (index) => {
    setMedicines((prevMedicines) => {
      const updatedMedicines = [...prevMedicines];
      updatedMedicines.splice(index, 1);
      return updatedMedicines;
    });
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Purchase Inv No.</Form.Label>
              <Form.Control
                required
                type="text"
                name="PurchaseInvNo"
                value={PurchaseInvNo || ""}
                onChange={handleInputChange}
                placeholder="Purchase Inv No"
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Inv Date</Form.Label>
              <Form.Control
                type="date"
                name="InvDate"
                value={InvDate || ""}
                onChange={handleInputChange}
                placeholder="GRN Date"
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Party Inv No.</Form.Label>
              <Form.Control
                type="text"
                name="PartyInvNo"
                value={PartyInvNo || ""}
                onChange={handleInputChange}
                placeholder="Enter Type"
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Party Inv Date</Form.Label>
              <Form.Control
                type="date"
                name="PurchaseInvDate"
                value={PurchaseInvDate || ""}
                onChange={handleInputChange}
                placeholder="Enter Type"
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Vendor Code</Form.Label>
              <Form.Control
                required
                type="text"
                name="VendorCode"
                value={VendorCode || ""}
                onChange={handleInputChange}
                placeholder="Vendor Code"
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Vendor Name</Form.Label>
              <Form.Control
                type="text"
                name="VendorName"
                value={VendorName || ""}
                onChange={handleInputChange}
                placeholder="Vendor Name"
              />
            </Form.Group>
          </Col>
          <Col lg={12} md={12} sm={12}>
            <Form.Label></Form.Label>
             <DynamicTable tableData={tableData} setTableData={setTableData} />
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

export default PurchaseFrom;
