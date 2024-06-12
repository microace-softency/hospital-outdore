import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  departmentName: "",
};

const CreateDepartment = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [departmentCode, setDepartmentCode] = useState([]);
  const { id, departmentName } = state;

  useEffect(() => {
    const fetchNextDepartmentCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8005/api/department/nextdepartmentcode"
        );
        setDepartmentCode(response.data.DpCode);
      } catch (error) {
        console.error("Error fetching next product code:", error);
        toast.error("Error fetching next product code");
      }
    };

    fetchNextDepartmentCode();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!departmentName) {
      toast.error("Please provide a value for each input field");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/department/createdepartment", {
            departmentName
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Department Create Successfully");
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

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl ml-4 w-11/12">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Department Code</Form.Label>
            <Form.Control type="text" name="id" value={departmentCode} disabled />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              name="departmentName"
              value={departmentName || ""}
              onChange={handleInputChange}
              placeholder="Enter Department Name"
            />
          </Form.Group>
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

export default CreateDepartment;
