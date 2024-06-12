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
  name: "",
  address: "",
  mobilenumber: "",
  pincode: "",
  block: "",
  age: "",
  sex: "",
  doctor: "",
  date: new Date().toISOString().split("T")[0],
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
  guardiannumbaer: "",
  guardianname: "",
  bed: "",
};

function UpdateAdmitpatiant({ onCreate, onCancel }) {
  const [doctors, setDoctor] = useState([]);
  const [beds, setBed] = useState([]);
  const [showLocation, setShowLocation] = useState([]);
  const [state, setState] = useState(initialState);
  const [patiant, setPatiant] = useState([]);
  const [indoor, setIndoor] = useState(false);
  const [error, setError] = useState();

  const {
    name,
    address,
    mobilenumber,
    pincode,
    block,
    age,
    sex,
    doctor,
    date,
    time,
    guardiannumbaer,
    guardianname,
    bed,
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

  useEffect(() => {
    axios
      .get(`http://localhost:8005/api/admission/${id}`)
      .then((resp) => setState({ ...resp.data[0] }));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please provide value into * inpute field ");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/createadmision", {
            name,
            address,
            mobilenumber,
            pincode,
            block,
            age,
            sex,
            doctor,
            date,
            time,
            guardiannumbaer,
            guardianname,
            bed,
          })
          .then(() => {
            setState({
              initialState,
            });
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success(" Admision Successfully");
      } else {
        axios
          .put(`http://localhost:8005/api/admission/updateadmission/${id}`, {
            name,
            address,
            mobilenumber,
            pincode,
            block,
            age,
            sex,
            doctor,
            date,
            time,
            guardiannumbaer,
            guardianname,
            bed,
          })
          .then(() => {
            setState({ initialState });
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("Appoinment Booked Successfully");
      }
      setTimeout(() => {
        navigate("/admission");
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
  const handleTypeChange = (e) => {
    const { value } = e.target;
    setIndoor(value === "outdore");
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
  const loadBedData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/bed");
      setBed(response.data[0]);
      console.log("bed", response.data[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadDoctorData();
    loadBedData();
  }, []);

  //factch patiant
  const loadAdmissionsData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/admission");
      setPatiant(response.data[0]);
      console.log(response.data, "pataiant");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadAdmissionsData();
  }, []);

  const loadPatiantData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/admission");
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
      return `A${nextId.toString().padStart(3, "0")}`;
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
    <div className="bg-sky-200 p-4 drop-shadow rounded-xl ml-4 w-11/12">
      {/* <h2 className="text-xl font-semibold">Create Registation</h2> */}
      <Form onSubmit={handleSubmit}>
        <Row className="p-2">
          <Col lg={12} className="p-1">
            <div className="bg-sky-200 rounded p-2 drop-shadow">
              <div className="py-2">
                <h2 className="text-lg font-semibold">
                  Admission Patient Details:
                </h2>
                <Row>
                  <Col lg={3} md={4} sm={12}>
                    <Form.Group controlId="mobileNo">
                      <Form.Label className="block text-gray-700 font-medium">
                        Admision ID
                      </Form.Label>
                      <Form.Control
                        disabled
                        type="text"
                        id="mobilenumber"
                        name="id"
                        value={id || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={3} md={4} sm={12}>
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
                  <Col lg={3} md={4} sm={12}>
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
                        id="name"
                        name="name"
                        value={name || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={8} md={5} sm={6} xs={6}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        Address
                      </Form.Label>
                      <Input
                        placeholder="Enter Patiant Address"
                        type="text"
                        id="address"
                        name="address"
                        value={address || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={6} xs={6}>
                    <Form.Group>
                      <Form.Label className="block text-gray-700 font-medium">
                        Block
                      </Form.Label>
                      <Form.Select
                        placeholder="Select Block"
                        name="block"
                        value={block || ""}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Block</option>
                        <option value="Municipality">Municipality</option>
                        <option value="panchayat">panchayat</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={12}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        PIN Code
                      </Form.Label>
                      <Form.Control
                        placeholder="Pin Code"
                        type="text"
                        name="pincode"
                        value={pincode || ""}
                        onChange={handleInputChange}
                      />
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
                        name="guardianname"
                        value={guardianname || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={12}>
                    <Form.Group controlId="age">
                      <Form.Label className="block text-gray-700 font-medium">
                        guardian Nmuber
                      </Form.Label>
                      <Form.Control
                        placeholder="Guardian Name"
                        type="text"
                        name="guardiannumbaer"
                        value={guardiannumbaer || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} sm={12} xs={12}>
                    <Form.Group controlId="symptoms">
                      <Form.Label className="block text-gray-700 font-medium">
                        Select Doctor *
                      </Form.Label>
                      <Form.Select
                        placeholder="Select a Doctor"
                        value={doctor || ""}
                        name="doctor"
                        onChange={handleInputChange}
                      >
                        <option value={""}>select doctor</option>
                        {doctors.map((item) => (
                          <option key={item.doctorname} value={item.doctorname}>
                            {item.doctorname} ({item.designation})
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={3} sm={12} xs={12}>
                    <Form.Group controlId="symptoms">
                      <Form.Label className="block text-gray-700 font-medium">
                        Select Bed *
                      </Form.Label>
                      <Form.Select
                        placeholder="Select a Bed"
                        value={bed || ""}
                        name="bed"
                        onChange={handleInputChange}
                      >
                        <option value={""}>select Bed</option>
                        {beds.map((item) => (
                          <option key={item.bedname} value={item.bedname}>
                            {item.bedname} ({item.type})
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
            onClick={() => navigate("/admission")}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-4 py-2">
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateAdmitpatiant;
