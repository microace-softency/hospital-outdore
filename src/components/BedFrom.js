import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  bedname: "",
  type: "",
};

const BedFrom = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [bedCode, setBedCode] = useState([]);
  const { id, bedname, type } = state;

  useEffect(() => {
    const fetchNextBedCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8005/api/bed/nextbedcode"
        );
        setBedCode(response.data.BedCode);
      } catch (error) {
        console.error("Error fetching next product code:", error);
        toast.error("Error fetching next product code");
      }
    };

    fetchNextBedCode();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bedname || !type) {
      toast.error("Please provide a value for each input field");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/bed/createbed", {
            bedname,
            type,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Bed Create Successfully");
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
            <Form.Label>Code</Form.Label>
            <Form.Control type="text" name="id" value={bedCode} disabled />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Bed Name</Form.Label>
            <Form.Control
              type="text"
              name="bedname"
              value={bedname || ""}
              onChange={handleInputChange}
              placeholder="Enter Bed Name"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Type</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={type || ""}
              onChange={handleInputChange}
              placeholder="Enter Type"
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

export default BedFrom;
