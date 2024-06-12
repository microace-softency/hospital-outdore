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
  patientname: "",
  testname: [],
  referDrName: "",
  totalAmount: "",
  advancePayment: "",
  duePayment: "",
  date: new Date().toISOString().split("T")[0],
  patientnumber: "",
};

function UpdatePathology({ onCreate, onCancel, customers, model }) {
  const navigate = useNavigate();
  const [tests, setTests] = useState([{ testname: "", result: "" }]);
  const [doctor, setDoctor] = useState([]);

  const [state, setState] = useState(initialState);
  console.log("pathologyfield", state);
  const {
    patientname,
    testname,
    referDrName,
    totalAmount,
    advancePayment,
    duePayment,
    date,
    patientnumber
  } = state;

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/pathology/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !patientname ||
      !testname ||
      !referDrName ||
      !totalAmount ||
      !advancePayment ||
      !duePayment ||
      !date ||
      !patientnumber
    ) {
      toast.error("Please provide a value for each input field ");
    } else {
      if (id) {
        axios
        .put(`http://localhost:8005/api/pathology/updatepathology/${id}`, {
          patientname,
          testname,
          referDrName,
          totalAmount,
          advancePayment,
          duePayment,
          date,
          patientnumber,
        })
        .then(() => {
          setState(initialState);
          console.log("classdetails", state);
        })
        .catch((err) => toast.error(err.respose.data));
      toast.success("update Successfully");
      } 
      setTimeout(() => {navigate('/pathology')}, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const addTestField = () => {
    setTests([...tests, { testname: "", result: "" }]);
  };

  const handleTestChange = (index, event) => {
    const { name, value } = event.target;
    const newTests = [...tests];
    newTests[index][name] = value;
    setState({
      ...state,
      testname: newTests,
    });
    setTests(newTests);
  };

  const handleDeleteTest = (index) => {
    setTests((prevTests) => {
      const updatedTests = [...prevTests];
      updatedTests.splice(index, 1);
      return updatedTests;
    });
  };

  // Fetch doctor
  const loadDoctorData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/doctor");
      setDoctor(response.data[0]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl ml-4 w-11/12">
      {/* <h2 className="text-xl font-semibold ">Create {model}</h2> */}
      <Form onSubmit={handleSubmit}>
        <div className=" py-2">
          <Row>
            <Col lg={6} md={6} sm={12}>
              <Form.Group controlId="PATIENT_ID">
                <Form.Label className="block text-gray-700 font-medium">
                  Patient's Name
                </Form.Label>
                <Input
                  className=""
                  placeholder="Patients name"
                  type="text"
                  name="patientname"
                  value={patientname || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Form.Group controlId="patientnumber">
                <Form.Label className="block text-gray-700 font-medium">
                  Patient's Mobile Number
                </Form.Label>
                <Input
                  className=""
                  placeholder="Patient's number"
                  type="text"
                  name="patientnumber"
                  value={patientnumber || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={12}>
              {/* Other form fields */}
              <Form.Group controlId="testsAssigned">
                <Form.Label className="font-semibold">Tests</Form.Label>
                {tests.map((test, index) => (
                  <div key={index}>
                    <Row className="my-1">
                      <Col>
                        <Form.Control
                          as="select"
                          name="testname"
                          value={test.testname}
                          onChange={(e) => handleTestChange(index, e)}
                        >
                          <option value="">Select Test</option>
                          <option value="Blood Pressure">Blood Pressure</option>
                          <option value="Blood Sugar">Blood Sugar</option>
                          <option value="Cholesterol">Cholesterol</option>
                          <option value="Complete Blood Count">
                            Complete Blood Count
                          </option>
                          <option value="Liver Function Tests">
                            Liver Function Tests
                          </option>
                          <option value="Kidney Function Tests">
                            Kidney Function Tests
                          </option>
                          <option value="Electrocardiogram (ECG)">
                            Electrocardiogram (ECG)
                          </option>
                          <option value="X-Ray">X-Ray</option>
                          <option value="Ultrasound">Ultrasound</option>
                          <option value="MRI Scan">MRI Scan</option>
                        </Form.Control>
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          name="remarks"
                          placeholder="remarks"
                          value={test.remarks}
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
                Add Test
              </Button>
            </Col>
            <Col lg={7} md={4} sm={12} xs={12}>
              <Form.Group controlId="symptoms">
                <Form.Label className="block text-gray-700 font-medium">
                  Refer Doctor *
                </Form.Label>
                <Form.Select
                  placeholder="Select a Doctor"
                  value={referDrName || ""}
                  name="referDrName"
                  onChange={handleInputChange}
                >
                  <option value={""}>select doctor</option>
                  {doctor.map((item) => (
                    <option key={item.doctorname} value={item.doctorname}>
                      {item.doctorname} ({item.designation})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Total Amount
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Total Amount"
                  name="totalAmount"
                  value={totalAmount || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Advance Payment
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Advance Payment"
                  name="advancePayment"
                  value={advancePayment || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">
                  Due Amount
                </Form.Label>
                <Input
                  type="text"
                  placeholder="Due Payment"
                  name="duePayment"
                  value={duePayment || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={()=>navigate('/pathology')}
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

export default UpdatePathology;
