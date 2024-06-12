import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Input } from "@mui/joy";

const initialState = {
  testname: "",
  amount: "",
  day: "",
};

function UpdateTest({ onCreate, onCancel, customers, model }) {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const { testname, amount, day } = state;
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/test/${id}`)
      .then((resp) =>  setState({ ...resp.data[0] }));
  }, [id]);

  console.log("data ", state);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testname || !amount) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (id) {
        axios
        .put(`http://localhost:8005/api/test/updatetest/${id}`, {
          testname,
          amount,
          day,
        })
        .then(() => {
          setState({
            testname: "",
            amount: "",
            day: "",
          });
          console.log("classdetails", state);
        })
        .catch((err) => toast.error(err.respose.data));
      toast.success("Update Successfully");
      }
      setTimeout(() => {navigate('/test')}, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl ml-4 w-11/12">
      {/* <h2 className="text-xl font-semibold ">Create {model}</h2> */}
      <Form onSubmit={handleSubmit}>
        <div className=" py-2">
          <Row>
            <Col lg={4} md={6} sm={12}>
              <Form.Group controlId="PATIENT_ID">
                <Form.Label className="block text-gray-700 font-medium">
                  Test Name
                </Form.Label>
                <Input
                  className=""
                  placeholder="Test Name"
                  type="text"
                  name="testname"
                  value={testname || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Amount
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Amount"
                  name="amount"
                  value={amount || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Day's
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Day"
                  name="day"
                  value={day || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={ ()=> navigate('/test')}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2"
            onClick={() => console.log("click")}
          >
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateTest;
