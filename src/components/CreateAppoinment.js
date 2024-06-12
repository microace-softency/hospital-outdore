import React, { useEffect, useRef, useState } from "react";
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
  Input,
  Radio,
  RadioGroup,
} from "@mui/joy";
import Webcam from "react-webcam";

const initialState = {
  date: new Date().toISOString().split("T")[0],
  location: "",
  name: "",
  image: "",
  mobilenumber: "",
  sex: "",
  age: "",
  guardiannumber: "",
  guardianname: "",
  doctorname: "",
  doctordesignation: "",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
  type: "",
  price: "",
};

function CreateAppointmentForm({ onCreate, onCancel }) {
  const [doctor, setDoctor] = useState([]);
  const [showLocation, setShowLocation] = useState([]);
  const [state, setState] = useState(initialState);
  const [patiant, setPatiant] = useState([]);
  const [indoor, setIndoor] = useState(false);
  const [error, setError] = useState();
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const webcamRef = useRef(null); 
  const [registationCode, setRegistationCode] = useState([]);

  console.log('registationCode', registationCode);

  const {
    date,
    location,
    name,
    image,
    mobilenumber,
    sex,
    age,
    guardiannumber,
    guardianname,
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

  useEffect(() => {
    const fetchNextRegistationCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8005/api/registation/nexregistationcode"
        );
        setRegistationCode(response.data.RegistationCode);
      } catch (error) {
        console.error("Error fetching next Registation code:", error);
        toast.error("!Opps Somthing Wrong");
      }
    };
    fetchNextRegistationCode();
  }, []);

  // Function to get current date and time
  const getCurrentDateAndTime = () => {
    const now = new Date();
    setCurrentDate(now);
    setCurrentTime(now);
  };

  useEffect(() => {
    getCurrentDateAndTime();
  }, []);

  const capturePhoto = () => {
    const photo = webcamRef.current.getScreenshot({
      screenshotFormat: "image/jpeg",
      quality: 1.0, 
    });
    setState({ ...state, photo });
    setShowCaptureButton(false); // Hide the capture button after photo is captured
  };

  const handleRecapture = () => {
    setState({ ...state, photo: null });
    setShowCaptureButton(true); // Show the capture button again
  };

  const videoConstraints = {
    facingMode: "environment", // Use the back camera
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
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
          .post("http://localhost:8005/api/registation/createregistation", {
            date,
            location,
            name,
            image,
            mobilenumber,
            sex,
            age,
            guardiannumber,
            guardianname,
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
              guardiannumber: "",
              guardianname: "",
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

  return (
    <div className="container p-2">
      {/* <h2 className="text-xl font-semibold">Create Registation</h2> */}
      <Form onSubmit={handleSubmit}>
        <Row className="p-2">
          <Col lg={12} className="p-1">
            <div className="bg-sky-200 rounded p-2 drop-shadow">
              <div className="py-2">
                <h2 className="text-lg font-semibold">Patient Details:</h2>
                <Row>
                  <Col lg={4} md={4} sm={12}>
                    <Form.Group controlId="mobileNo">
                      <Form.Label className="block text-gray-700 font-medium">
                        Patiant ID
                      </Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        id="mobilenumber"
                        name="id"
                        value={registationCode}
                        // onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12}>
                    <Form.Group>
                      <Form.Label className="block text-gray-700 font-medium">
                        Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={currentDate.toISOString().split("T")[0]}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12}>
                    <Form.Group controlId="durationOfSymptoms">
                      <Form.Label className="block text-gray-700 font-medium">
                        Time
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="time"
                        name="time"
                        value={currentTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Name
                      </Form.Label>
                      <Input
                        required
                        placeholder="Enter Patiant Name"
                        type="text"
                        id="name"
                        name="name"
                        value={name || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={5} md={5} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Address
                      </Form.Label>
                      <Input
                        required
                        placeholder="Enter Patiant Address"
                        type="text"
                        name="location"
                        value={location || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={3} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Image
                      </Form.Label>
                      <Webcam
                        audio={false}
                        ref={webcamRef} // Ref to access webcam component
                        screenshotFormat="image/jpeg"
                        width={320}
                        height={240}
                        videoConstraints={videoConstraints}
                      />

                      {/* Conditional rendering for capture and re-capture buttons */}
                      {showCaptureButton && (
                        <Button onClick={capturePhoto}>Capture</Button>
                      )}
                      {!showCaptureButton && (
                        <Button onClick={handleRecapture}>Re-capture</Button>
                      )}
                      {/* Display captured photo */}
                      {state.photo && (
                        <div>
                          <img src={state.photo} alt="Captured" />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Mobile Number *
                      </Form.Label>
                      <Form.Control
                         required
                        placeholder="Enter Mobile Number"
                        type="text"
                        id="mobilenumber"
                        name="mobilenumber"
                        value={mobilenumber || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={6} xs={6}>
                    <Form.Group>
                      <Form.Label className="block text-gray-700 font-medium">
                        Gender *
                      </Form.Label>
                      <Form.Select
                      required
                        placeholder="Select Gender"
                        name="sex"
                        value={sex || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={12}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Age *
                      </Form.Label>
                      <Form.Control
                         required
                        placeholder="Age"
                        type="text"
                        id="age"
                        name="age"
                        value={age || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={12}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Guardian Name
                      </Form.Label>
                      <Form.Control
                        placeholder="Guardian Name"
                        type="text"
                        id="guardianname"
                        name="guardianname"
                        value={guardianname || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={12}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Guardian MobileNo
                      </Form.Label>
                      <Form.Control
                        placeholder="Guardian Mobile No."
                        type="text"
                        id="guardiannumber"
                        name="guardiannumber"
                        value={guardiannumber || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={4} sm={12} xs={12}>
                    <Form.Group controlId="symptoms">
                      <Form.Label className="block text-gray-700 font-medium">
                        Select Doctor *
                      </Form.Label>
                      <Form.Select
                        placeholder="Select a Doctor"
                        value={doctorname || ""}
                        name="doctorname"
                        onChange={handleInputChange}
                      >
                        <option value={""}>Select Doctor</option>
                        {doctor.map((item) => (
                          <option key={item.doctorname} value={item.doctorname}>
                            {item.doctorname} ({item.designation})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={6}>
                    <Form.Group controlId="medications">
                      <Form.Label className="block text-gray-700 font-medium">
                        Charge
                      </Form.Label>
                      <Form.Control
                        rows={1}
                        id="price"
                        name="price"
                        value={price || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
        <div className="flex justify-content-between my-4">
          <Button
            variant="danger"
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-4 py-2">
            Create
          </Button>
        </div>
        {/* </Form> */}
      </Form>
    </div>
  );
}

export default CreateAppointmentForm;
