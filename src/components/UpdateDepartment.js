import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  dpcode: "",
  departmentName: "",
};

const UpdateDepartment = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { dpcode, departmentName } = state;
  const { id } = useParams();

  console.log("Dp data", state);
  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/department/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!departmentName ) {
      toast.error("Please provide a value for each input field");
    } else {
      if (id) {
        axios
          .put(`http://localhost:8005/api/department/updatedepartment/${id}`, {
            dpcode,
            departmentName,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Update Successfully");
      }
      setTimeout(() => {
        navigate("/department");
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
            <Form.Control
              type="text"
              name="id"
              value={dpcode || ""}
              onChange={handleInputChange}
              disabled
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Bed Name</Form.Label>
            <Form.Control
               required
              type="text"
              name="departmentName"
              value={departmentName || ""}
              onChange={handleInputChange}
              placeholder="Enter Bed Name"
            />
          </Form.Group>
        </Row>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={() => navigate("/bed")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateDepartment;
