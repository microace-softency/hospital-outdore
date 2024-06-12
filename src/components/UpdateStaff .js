import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Input } from "@mui/joy";
import { RxCross2 } from "react-icons/rx";

const initialState = {
  name: "",
  degicnation: "",
  department: "",
  basicpay: "",
  pf: "",
  esi: "",
  aadharcard: "",
  pancard: "",
  additionalfield:[],
  direction: [],
  scode: ""
};

function UpdateStaff ({ onCreate, onCancel, customers, model }) {
  const navigate = useNavigate();
  const [tests, setTests] = useState([{ testname: "", result: "" }]);
  const [directions, setDirection] = useState([{ directionName: "", directionResult: "" }]);

  const [state, setState] = useState(initialState);
  console.log('updatedinput====>', state);

  const {   
    name,
    degicnation,
    department,
    pf,
    esi,
    aadharcard,
    pancard,
    additionalfield,
    direction,
    scode
  } = state;

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/staff/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !degicnation) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (id) {
        axios
          .put(`http://localhost:8005/api/staff/updatestaff/${id}`, {
            name,
            degicnation,
            department,
            pf,
            esi,
            aadharcard,
            pancard,
            additionalfield,
            direction,
            scode
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("update Successfully");
      }
      setTimeout(() => {navigate('/staff')}, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleTestChange = (index, event) => {
    const { name, value } = event.target;
    const newAdditionalField = [...tests];
    newAdditionalField[index][name] = value;
    setState({
      ...state,
      // testname: newAdditionalField.map(test => test.testname)
      additionalfield: newAdditionalField,
    });
    setTests(newAdditionalField);
  };
  console.log("newtest", tests);

  const handleDeleteTest = (index) => {
    setTests((prevTests) => {
      const updatedTests = [...prevTests];
      updatedTests.splice(index, 1);
      return updatedTests;
    });
  };
  const addTestField = () => {
    setTests([...tests, { testname: "", result: "" }]);
  };

  const handleDiretionChange = (index, event) => {
    const { name, value } = event.target;
    const newDirection = [...directions];
    newDirection[index][name] = value;
    setDirection({
      ...state,
      direction: newDirection,
    });
    setDirection(newDirection);
  };

  const handleDeleteDirection = (index) => {
    setDirection((prevTests) => {
      const updatedTests = [...prevTests];
      updatedTests.splice(index, 1);
      return updatedTests;
    });
  };

  const addDirectionField = () => {
    setDirection([...directions, { directionName: "", directionResult: "" }]);
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl ml-4 w-11/12">
      {/* <h2 className="text-xl font-semibold ">Create {model}</h2> */}
      <Form onSubmit={handleSubmit}>
        <div className=" py-2">
          <Row>
            <Col lg={2} md={6} sm={12}>
              <Form.Group controlId="PATIENT_ID">
                <Form.Label className="block text-gray-700 font-medium">
                  Staff's Code
                </Form.Label>
                <Input
                  className=""
                  type="text"
                  name="doctorname"
                  disabled
                  value={scode || ""}
                  // placeholder="SF005"
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Name
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Staff,s Name"
                  name="name"
                  value={name || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Designation
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Designation"
                  name="degicnation"
                  value={degicnation || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Department
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Department"
                  name="department"
                  value={department || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            {/* <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Basic Pay</Form.Label>
                <Input
                  type="text"
                  placeholder='Percentage'
                  name="percentage" 
                  value={percentage || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col> */}
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  PF
                </Form.Label>
                <Input
                  type="text"
                  placeholder="PF"
                  name="pf"
                  value={pf || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  ESI
                </Form.Label>
                <Input
                  type="text"
                  placeholder="ESI"
                  name="esi"
                  value={esi || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Aadhar No.
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Aadhar Card No."
                  name="aadharcard"
                  value={aadharcard || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  PAN No.
                </Form.Label>
                <Input
                  type="text"
                  placeholder="PAN Card No."
                  name="pancard"
                  value={pancard || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              {/* Other form fields */}
              <Form.Group controlId="testsAssigned">
                <Form.Label className="font-semibold">
                  Additional field
                </Form.Label>
                {tests.map((test, index) => (
                  <div key={index}>
                    <Row className="my-1">
                      <Col>
                        <input
                          type="text"
                          name="testname"
                          className="form-control"
                          value={test.testname || ""}
                          onChange={(e) => handleTestChange(index, e)}
                          placeholder="Enter Field Name"
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="result"
                          placeholder="value"
                          value={test.result || ""}
                          onChange={(e) => handleTestChange(index, e)}
                        />
                      </Col>
                      {index !== 0 ? (
                        <Col lg={2}>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteTest(index)}
                          >
                            <RxCross2 />
                          </Button>
                        </Col>
                      ) : (
                        <Col lg={2}></Col>
                      )}
                    </Row>
                  </div>
                ))}
              </Form.Group>
              <Button
                className="w-full my-2"
                variant="outline-primary"
                onClick={addTestField}
              >
                + Add
              </Button>
            </Col>
          </Row>
        </div>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={()=> navigate('/staff')}
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

export default UpdateStaff ;
