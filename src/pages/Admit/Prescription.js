import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";

import axios from "axios";
import { toast } from "react-toastify";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormLabel,
  Input,
  Option,
  Radio,
  RadioGroup,
  Select,
} from "@mui/joy";

const initialState = {
  date: "",
  location: "",
  name: "",
  image: "",
  mobilenumber: "",
  sex: "",
  age: "",
  doctorname: "",
  doctordesignation: "",
  time: "",
  type: "",
  price: "",
};

function Prescription({ onCreate, onCancel }) {
  const [doctor, setDoctor] = useState([]);
  const [test, setTest] = useState([]);
  const [showLocation, setShowLocation] = useState([]);
  const [state, setState] = useState(initialState);
  const [patiant, setPatiant] = useState([]);
  const [error, setError] = useState();
  console.log("data ", test);

  const {
    date,
    location,
    name,
    image,
    mobilenumber,
    sex,
    age,
    doctorname,
    doctordesignation,
    time,
    type,
    price,
  } = state;
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // view patiant data
  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/registation/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  // Function to get current date and time
  const getCurrentDateAndTime = () => {
    const now = new Date();
    setCurrentDate(now);
    setCurrentTime(now);
  };

  useEffect(() => {
    getCurrentDateAndTime();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !location ||
      !name ||
      !mobilenumber ||
      !sex ||
      !age ||
      !doctorname ||
      !type ||
      !price
    ) {
      toast.error("Please provide value into * inpute field ");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/createregistation", {
            date,
            location,
            name,
            image,
            mobilenumber,
            sex,
            age,
            doctorname,
            doctordesignation,
            time,
            type,
            price,
          })
          .then(() => {
            setState({
              date: new Date().toISOString().split("T")[0],
              location: "",
              name: "",
              image: "",
              mobilenumber: "",
              sex: "",
              age: "",
              doctorname: "",
              doctordesignation: "",
              time: "",
              type: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              price: "",
            });
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("class Add Successfully");
      } else {
        // axios
        //   .put(`http://localhost:3002/api/classupdate/${id}`, {
        //     mobilenumber,
        //     name,
        //     location,
        //     age,
        //     symptomsdescription,
        //     durationofsymptoms,
        //     medicalhistory,
        //     medications,
        //     allergies,
        //     previoustreatments,
        //     frequencyandintensity,
        //     associatedfactors,
        //     emergencycontactname,
        //     emergencycontactphone,
        //     additionalcomments,
        //   })
        //   .then(() => {
        //     setState({
        //       mobilenumber: "",
        //       name: "",
        //       location: "",
        //       age: "",
        //       symptomsdescription: "",
        //       durationofsymptoms: "",
        //       medicalhistory: "",
        //       medications: "",
        //       allergies: "",
        //       previoustreatments: "",
        //       frequencyandintensity: "",
        //       associatedfactors: "",
        //       emergencycontactname: "",
        //       emergencycontactphone: "",
        //       additionalcomments: "",
        //     });
        //     console.log("classdetails", state);
        //   })
        //   .catch((err) => toast.error(err.respose.data));
        // toast.success("Appoinment Booked Successfully");
      }

      setTimeout(() => {
        onCancel();
      }, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target || {};
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name === "date") {
        setSelectedDate(new Date(value));
      }
    };
    if (name === "type") {
      const newPrice = value === "Spacial" ? "100" : "50";
      setState({ ...state, [name]: value, price: newPrice });
    } else {
      setState({ ...state, [name]: value });
    }
    console.log("inpu", e);
  };

  //camera
  const openCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.play();

          const canvasElement = document.createElement("canvas");
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          const context = canvasElement.getContext("2d");
          context.drawImage(
            videoElement,
            0,
            0,
            canvasElement.width,
            canvasElement.height
          );
          const imageDataUrl = canvasElement.toDataURL("image/jpeg");

          setState({ ...state, photo: imageDataUrl });

          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    } else {
      console.error("getUserMedia is not supported");
    }
  };

  //fatch doctor
  const loadDoctorData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/doctor");
      setDoctor(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, []);

  //fatch Test
  const loadTestData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/test");
      setTest(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadTestData();
  }, []);

  //factch patiant
  const loadPatiantData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/registation");
      setPatiant(response.data[0]);
      console.log(response.data, "pataiant");
    } catch (error) {
      setError(error.message);
    }
  };
  useEffect(() => {
    loadPatiantData();
  }, []);

  console.log("pastain id", patiant);
  const getNextPatientId = () => {
    if (patiant && patiant.id) {
      const lastId = parseInt(patiant.id.replace("P", ""));
      const nextId = lastId + 1;
      return `P${nextId.toString().padStart(3, "0")}`;
    } else {
      return "P0DHDJSK58LI01";
    }
  };
  //fatch Location
  const loadLocationData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/location");
      setShowLocation(response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadLocationData();
  }, []);

  const [tests, setTests] = useState([{ testName: "", result: "" }]);
  const [medicines, setMedicines] = useState([]);

  const addTestField = () => {
    setTests([...tests, { testName: "", result: "" }]);
  };

  const handleTestChange = (index, event) => {
    const { name, value } = event.target;
    const newTests = [...tests];
    newTests[index][name] = value;
    setTests(newTests);
  };
  const handleDeleteTest = (index) => {
    setTests((prevTests) => {
      const updatedTests = [...prevTests];
      updatedTests.splice(index, 1);
      return updatedTests;
    });
  };
  const handleAddMedicine = () => {
    setMedicines((prevMedicines) => [
      ...prevMedicines,
      { name: "", instruction: "", dosage: "" },
    ]);
  };

  const handleDeleteMedicine = (index) => {
    setMedicines((prevMedicines) => {
      const updatedMedicines = [...prevMedicines];
      updatedMedicines.splice(index, 1);
      return updatedMedicines;
    });
  };

  return (
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl ml-4 w-11/12">
      <h2 className="text-xl font-semibold"> Prescription</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="p-2">
          <Col lg={12} className="p-1">
            <div className="bg-sky-200 rounded p-2 drop-shadow">
              <div className="py-2">
                <h2 className="text-lg font-semibold">Patient Details:</h2>
                <Row>
                  <Col lg={3} md={3} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Name
                      </Form.Label>
                      <Input
                        placeholder="Enter Patiant Name"
                        type="text"
                        id="name"
                        name="name"
                        value={name || ""}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={3} sm={6} xs={6}>
                    <Form.Group>
                      <Form.Label className="block text-gray-700 font-medium">
                        Sex
                      </Form.Label>
                      <Form.Control
                        placeholder="Select a Sex"
                        name="sex"
                        value={sex || ""}
                        disabled
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={3} sm={12} xs={12}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Age
                      </Form.Label>
                      <Form.Control
                        placeholder="age"
                        type="text"
                        id="age"
                        name="age"
                        value={age || ""}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    {/* Other form fields */}
                    <Form.Group controlId="testsAssigned">
                      <Form.Label className="font-semibold">
                        Assign Tests
                      </Form.Label>
                      {tests.map((test, index) => (
                        <div key={index}>
                          <Row className="my-1">
                            <Col>
                              <Form.Control
                                as="select"
                                name="testName"
                                value={test.testName}
                                onChange={(e) => handleTestChange(index, e)}
                              >
                                <option value="">Select Test</option>
                                {/* Options for selecting test names */}
                                <option value="">Select Test</option>
                                <option value="Blood Pressure">
                                  Blood Pressure
                                </option>
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
                                {/* Add more options as needed */}
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
                                  Delete
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
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label className="font-semibold">
                        Prescribed Medicines
                      </Form.Label>
                      {medicines.map((medicine, index) => (
                        <div
                          key={index}
                          className="border p-1 rounded flex flex-row gap-1 mb-1"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Medicine name"
                            value={medicine.name}
                            onChange={(e) => {
                              const updatedMedicines = [...medicines];
                              updatedMedicines[index].name = e.target.value;
                              setMedicines(updatedMedicines);
                            }}
                          />
                          <Form.Control
                            type="text"
                            placeholder="Instruction"
                            value={medicine.instruction}
                            onChange={(e) => {
                              const updatedMedicines = [...medicines];
                              updatedMedicines[index].instruction =
                                e.target.value;
                              setMedicines(updatedMedicines);
                            }}
                          />
                          <Form.Control
                            type="text"
                            placeholder="Dosage"
                            value={medicine.dosage}
                            onChange={(e) => {
                              const updatedMedicines = [...medicines];
                              updatedMedicines[index].dosage = e.target.value;
                              setMedicines(updatedMedicines);
                            }}
                          />
                          <Button
                            disabled={index === 0}
                            variant="danger"
                            onClick={() => handleDeleteMedicine(index)}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        className="w-full"
                        variant="outline-primary"
                        onClick={handleAddMedicine}
                      >
                        Add Medicine
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
                <Col lg={12}>
                  <Form.Group controlId="note">
                    <Form.Label>Note</Form.Label>
                    <Form.Control as="textarea" rows={6} />
                  </Form.Group>
                </Col>
              </div>
            </div>
          </Col>
        </Row>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={() => navigate("/checkup")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Back
          </Button>
          <Button type="submit" className="px-4 py-2">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Prescription;
