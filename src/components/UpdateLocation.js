import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  address: "",
  district: "",
  pincode: "",
  postoffice: "",
};

const UpdateLocation = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { address, district, pincode, postoffice } = state;
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/location/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !district || !pincode || !postoffice) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (id) {
        axios
          .put(`http://localhost:8005/api/location/updatelocation/${id}`, {
            address,
            district,
            pincode,
            postoffice,
          })
          .then(() => {
            setState(initialState);
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("update Successfully");
      }
      setTimeout(() => {
        navigate("/location");
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
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={address || ""}
              onChange={handleInputChange}
              placeholder="Enter Address"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>District</Form.Label>
            <Form.Control
              type="text"
              name="district"
              value={district || ""}
              onChange={handleInputChange}
              placeholder="Enter patient's age"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Pin Code</Form.Label>
            <Form.Control
              type="number"
              name="pincode"
              value={pincode || ""}
              onChange={handleInputChange}
              placeholder="Enter Pin Code"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Post Office</Form.Label>
            <Form.Control
              type="text"
              name="postoffice"
              value={postoffice || ""}
              onChange={handleInputChange}
              placeholder="Enter Post Office  "
            />
          </Form.Group>
        </Row>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={() => navigate("/location")}
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

export default UpdateLocation;
