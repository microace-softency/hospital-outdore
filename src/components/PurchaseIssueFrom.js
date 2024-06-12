import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IssueTable from "./IssueTable";

const initialState = {
  PurchaseIssueNo: "",
  IssueDate: "",
  department: "",
  remarks: "",
  items: [],
};

const PurchaseIssueForm = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [departments, setDepartment] = useState([]);
  const [tableData, setTableData] = useState([[null, null, null, null]]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  console.log('tableData', tableData);
  console.log('state', state);

  const loadDepartmentData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/department");
      setDepartment(response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadDepartmentData();
  }, []);

  const {
    PurchaseIssueNo,
    IssueDate,
    department,
    remarks,
    items,
  } = state;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!PurchaseIssueNo || !department) {
      toast.error("Please provide a value for each input field");
    } else {
      const purchaseData = {
        PurchaseIssueNo,
        IssueDate,
        department,
        remarks,
        items: tableData.map((row) => ({
          Product: row[0],
          Quantity: row[1],
          UOM: row[2],
          Description: row[3],
        })),
      };

      console.log("purchaseData", purchaseData);

      axios
        .post("http://localhost:8005/api/purchaseissue/create", purchaseData)
        .then(() => {
          setState(initialState);
          setTableData([[null, null, null, null]]);
          toast.success("Purchase Issue Successfully Created");
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

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Purchase Issue No.</Form.Label>
              <Form.Control
                required
                type="text"
                name="PurchaseIssueNo"
                value={PurchaseIssueNo || ""}
                onChange={handleInputChange}
                placeholder="Purchase Issue No"
              />
            </Form.Group>
          </Col>

          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Issue Date</Form.Label>
              <Form.Control
                type="date"
                name="IssueDate"
                value={IssueDate || ""}
                onChange={handleInputChange}
                placeholder="Issue Date"
              />
            </Form.Group>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                name="department"
                value={department || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                {departments.map((dp) => (
                  <option key={dp.Id} value={dp.departmentName}>
                    {dp.departmentName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col lg={12} md={12} sm={12}>
            <Form.Label></Form.Label>
            <IssueTable tableData={tableData} setTableData={setTableData} />
          </Col>
          <Col lg={12} md={12} sm={12}>
            <Form.Group as={Col}>
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                name="remarks"
                value={remarks || ""}
                onChange={handleInputChange}
                placeholder="Write......"
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

export default PurchaseIssueForm;
