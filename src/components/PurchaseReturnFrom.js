import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DynamicTableReturn from "./DynamicTableReturn";
// import DynamicTable from "./DynamicTable ";

const initialState = {
  bedname: "",
  type: "",
};

const PurchaseReturnFrom = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [medicines, setMedicines] = useState([]);
  
  const { id, bedname, type } = state;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bedname || !type) {
      toast.error("Please provide a value for each input field");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/createbed", {
            bedname,
            type,
          })
          .then(() => {
            setState(initialState);
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Purchase Return Successfully");
      } 
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
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col lg={4} md={6} sm={12}>
          <Form.Group as={Col}>
            <Form.Label>Purchase Return Code</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={id || ""}
              onChange={handleInputChange}
              placeholder="PR01"
              disabled
            />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Form.Group as={Col}>
            <Form.Label>Purchase Code</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={id || ""}
              onChange={handleInputChange}
              placeholder="Purchases Return code"
            />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Form.Group as={Col}>
            <Form.Label>Purchases Date</Form.Label>
            <Form.Control
              type="date"
              name="type"
              value={type || ""}
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
              name="type"
              value={type || ""}
              onChange={handleInputChange}
              placeholder="Enter Type"
            />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Form.Group as={Col}>
            <Form.Label>Inv Date</Form.Label>
            <Form.Control
              type="date"
              name="type"
              value={type || ""}
              onChange={handleInputChange}
              placeholder="Enter Type"
            />
          </Form.Group>
        </Col>
        <Col lg={4} md={6} sm={12}>
          <Form.Group as={Col}>
            <Form.Label>Vendor Code</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={type || ""}
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
              name="type"
              value={type || ""}
              onChange={handleInputChange}
              placeholder="Vendor Name"
            />
          </Form.Group>
        </Col>
        <Col lg={12} md={12} sm={12}>
          <Form.Label></Form.Label>
          <DynamicTableReturn />
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
  );
};

export default PurchaseReturnFrom;