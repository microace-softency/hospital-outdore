import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const initialState = {
  pcode:"",
  packegname: "",
  packegrate: "",
  packegnote: "",
};

const UpdatePackeg = ({ onCreate, onCancel }) => {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const {pcode, packegname, packegrate, packegnote} = state;
  const { id } = useParams();
console.log(state);
  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/packeg/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!packegname || !packegrate ) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (id) {
        axios
          .put(`http://localhost:8005/api/packeg/updatepackeg/${id}`, {
            id, pcode, packegname, packegrate, packegnote
          })
          .then(() => {
            setState(initialState);
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("Update Successfully");
      }
      setTimeout(() => {navigate('/packeg')}, 500);
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
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="packegname"
            value={packegname || ""}
            onChange={handleInputChange}
            placeholder="Enter Packeg Name"
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Rate</Form.Label>
          <Form.Control
            type="text"
            name="packegrate"
            value={packegrate || ""}
            onChange={handleInputChange}
            placeholder="Enter Packeg Rate"
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col}>
          <Form.Label>Packeg Note</Form.Label>
          <Form.Control
            as="textarea"
            name="packegnote"
            value={packegnote || ""}
            onChange={handleInputChange}
            placeholder=" "
          />
        </Form.Group>
      </Row>
      <div className="flex justify-content-between my-4">
        <Button
          variant="danger"
          onClick={()=>navigate('/packeg')}
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

export default UpdatePackeg;
