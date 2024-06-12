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
import Webcam from "react-webcam";

const initialState = {
  orpCode: "",
  date: new Date().toISOString().split("T")[0],
  address: "",
  patiantname: "",
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

function AppoinmentUpdate({ onCreate, onCancel }) {
  const [doctor, setDoctor] = useState([]);
  const [showLocation, setShowLocation] = useState([]);
  const [state, setState] = useState(initialState);
  const [patiant, setPatiant] = useState([]);
  const [indoor, setIndoor] = useState(false);
  const [error, setError] = useState();
  console.log("data ", state);

  const {
    orpCode,
    date,
    patiantname,
    address,
    image,
    mobilenumber,
    sex,
    age,
    guardiannumber,
    guardianname,
    doctorname,
    doctordesignation,
    time
  } = state;
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Function to get current date and time 
  const getCurrentDateAndTime = () => {
    const now = new Date();
    setCurrentDate(now);
    setCurrentTime(now);
  };

  useEffect(() => {
    getCurrentDateAndTime();
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:8005/api/admission/${id}`)
  //     .then((resp) => setState({ ...resp.data[0] }));
  // }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/registation/${id}`)
      .then((resp) =>  setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !patiantname 
    ) {
      toast.error("Please provide value into * inpute field ");
    } else {
      if (id) {
        axios
        .put(`http://localhost:8005/api/registation/updateregistation/${id}`, {
          orpCode,
          date,
          address,
          patiantname,
          image,
          mobilenumber,
          sex,
          age,
          guardiannumber,
          guardianname,
          doctorname,
          doctordesignation,
          time,
        })
        .then(() => {
          setState({initialState});
        })
        .catch((err) => toast.error(err.respose.data));
      toast.success("Admission Update Successfully");
      }
      setTimeout(() => {navigate('/appoinment')}, 500);
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
  const handleTypeChange = (e) => {
    const { value } = e.target;
    setIndoor(value === "outdore");
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
    if (patiant && patiant.length > 0) {
      const lastPatient = patiant[patiant.length - 1];
      const lastId = parseInt(String(lastPatient.id).replace("P", ""));
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

  return (
    <div className="">
      {/* <h2 className="text-xl font-semibold">Create Registation</h2> */}
      <Form onSubmit={handleSubmit}>
        <Row className="p-2">
          <Col lg={12} className="p-1">
            <div className="bg-sky-200 rounded p-2 drop-shadow">
              <div className="py-2">
                <h2 className="text-lg font-semibold">
                  Outdoor Patient Details:
                </h2>
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
                        name="orpCode"
                        value={orpCode || ""}
                        onChange={handleInputChange}
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
                        Name *
                      </Form.Label>
                      <Input
                        placeholder="Enter Patiant Name"
                        type="text"
                        id="patiantname"
                        name="patiantname"
                        value={patiantname || ""}
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
                        placeholder="Enter Patiant Address"
                        type="text"
                        name="address"
                        value={address || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={3} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Image
                      </Form.Label>
                      {/* <Input
                        sx={{ height: "10vh" }}
                        type="file"
                        id="image"
                        name="image"
                        value={image || ""}
                        onChange={handleInputChange}
                      /> */}
                      {/* Display Webcam component */}
                      <Webcam
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width={320}
                        height={240}
                      />
                      {/* <Button
                        style={{ width: "100%", background: "rgb(60 155 181)" }}
                        onClick={openCamera}
                      >
                        Capture
                      </Button> */}
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Mobile Number *
                      </Form.Label>
                      <Form.Control
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
                        placeholder="age"
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
                        guardian Name
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
                        guardian MobileNo
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
                        <option value={""}>select doctor</option>
                        {doctor.map((item) => (
                          <option key={item.doctorname} value={item.doctorname}>
                            {item.doctorname} ({item.designation})
                          </option>
                        ))}
                      </Form.Select>
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
            onClick={()=>navigate('/appoinment')}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-4 py-2">
            Update
          </Button>
        </div>
        {/* </Form> */}
      </Form>
    </div>
  );
}

export default AppoinmentUpdate;
