import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from 'axios';
import { Input } from '@mui/joy';

const initialState = {
  doctorname: "",
  designation: "",
  fees:"",
  percentage:""
};

function CreateCustomer({ onCreate, onCancel, customers, model }) {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [doctorCode, setDoctorCode] = useState([]);

  console.log('doctor data', doctorCode);
  const {
    doctorname,
    designation,
    fees,
    percentage
  } = state;

  const { id } = useParams();

  useEffect(() => {
    const fetchNextDoctorCode = async () => {
      try {
        const response = await axios.get('http://localhost:8005/api/doctor/nextdoctorcode');
        setDoctorCode(response.data.DoctorCode);
      } catch (error) {
        console.error('Error fetching next product code:', error);
        toast.error('Error fetching next product code');
      }
    };
  
    fetchNextDoctorCode();
  }, []);

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!doctorname || !designation ) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/doctor/createdoctor", {
            doctorname,
            designation,
            fees,
            percentage
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("Doctor Create  Successfully");
      } 
      setTimeout(() => {onCancel()}, 500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <div className='bg-sky-200 p-4 drop-shadow rounded-xl'>
      <h2 className="text-xl font-semibold ">Create {model}</h2>
      <Form onSubmit={handleSubmit}>
        <div className=' py-2'>
          <Row> 
            <Col lg={2} md={6} sm={12}>
              <Form.Group controlId="PATIENT_ID">
                <Form.Label className="block text-gray-700 font-medium">Doctor's Code</Form.Label>
                <Input
                  className=''
                  type="text"
                  name="doctorname"
                  disabled
                  value={doctorCode}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Doctor's Name</Form.Label>
                <Input
                  required
                  type="text"
                  placeholder='Doctor,s Name'
                  id="doctorname" 
                  name="doctorname" 
                  value={doctorname || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Degree</Form.Label>
                <Input
                required
                  type="text"
                  placeholder='Designation'
                  name="designation" 
                  value={designation || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Fees Amount</Form.Label>
                <Input
                  type="text"
                  placeholder='Fees'
                  name="fees" 
                  value={fees || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={5} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Percentage</Form.Label>
                <Input
                  type="text"
                  placeholder='Percentage'
                  name="percentage" 
                  value={percentage || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
        <div className="flex justify-content-between my-4">
          <Button
            variant='danger'
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2"
            onClick={()=>console.log('click')}
          >
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateCustomer;



