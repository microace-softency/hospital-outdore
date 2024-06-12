import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  address: "",
  district: "",
  pincode: "",
  pos: "",
  postoffice: "",
  lcode: "",
};

const LocationFrom = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [locationCode, setLocationCode] = useState([]);
  const { address, district, pincode, lcode, postoffice } = state;
  const { id } = useParams();

  useEffect(() => {
    const fetchNextLocationCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8005/api/location/nextlocationcode"
        );
        setLocationCode(response.data.LocationCode);
      } catch (error) {
        console.error("Error fetching next product code:", error);
        toast.error("Error fetching next product code");
      }
    };

    fetchNextLocationCode();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !district || !pincode || !postoffice) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/location/createlocation", {
            address,
            district,
            pincode,
            postoffice,
            lcode,
          })
          .then(() => {
            setState(initialState);
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("Successfully");
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
          <Col lg={4} md={6} sm={12}></Col>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              required
              type="text"
              name="address"
              value={address || ""}
              onChange={handleInputChange}
              placeholder="Enter Address"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>District</Form.Label>
            <Form.Control
              required
              type="text"
              name="district"
              value={district || ""}
              onChange={handleInputChange}
              placeholder="District"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group>
            <Form.Label>Pin Code</Form.Label>
            <Form.Control
              required
              type="number"
              name="pincode"
              value={pincode || ""}
              onChange={handleInputChange}
              placeholder="Enter Pin Code"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Post Office</Form.Label>
            <Form.Control
              required
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

export default LocationFrom;
