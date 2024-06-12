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
    email:"",
    password:"",
    location:""
};


function CreateOutdoreUser({ onCreate, onCancel, customers, model }) {
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const {
    email,
    password,
    location
  } = state;
  const { id } = useParams();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !location ) {
      toast.error("Please provide value into each inpute field ");
    } else {
      if (!id) {
        axios
          .post("http://localhost:8005/api/outdoreuser/createoutdoreuser", {
            email,
            password,
            location
          })
          .then(() => {
            setState(initialState);
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("Appointment  Successfully");
      } else {
        axios
          .put(`http://localhost:8005/api/createoutdoreuser/${id}`, {
            email,
            password,
            location
          })
          .then(() => {
            setState({
                email:"",
                password:"",
                location:""
            });
            console.log("classdetails", state);
          })
          .catch((err) => toast.error(err.respose.data));
        toast.success("update Successfully");
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
            <Col lg={6} md={6} sm={12}>
              <Form.Group controlId="PATIENT_ID">
                <Form.Label className="block text-gray-700 font-medium">User Id</Form.Label>
                <Input
                  required
                  placeholder='User Id'
                  className=''
                  type="text"
                  name="email"
                  value={email || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Password</Form.Label>
                <Input
                  required
                  type="text"
                  placeholder='Password'
                  name="password" 
                  value={password || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col lg={12} md={6} sm={12}>
              <Form.Group>
                <Form.Label className=" text-gray-700 font-medium">Location</Form.Label>
                <Input
                  required
                  type="text"
                  placeholder='Location'
                  name="location" 
                  value={location || ""}
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

export default CreateOutdoreUser;



// import React, { useState } from 'react';
// import axios from 'axios';

// function CreateOutdoreUser() {
//   const [registerData, setRegisterData] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');

 

//   const handleRegisterChange = (e) => {
//     setRegisterData({ ...registerData, [e.target.name]: e.target.value });
//   };


//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8005/api/createoutdoreuser', registerData);
//       console.log('response', response.data);
//       setMessage('Registration successful');
//     } catch (error) {
//       console.error('Error:', error.response.data.message);
//       setMessage('Registration failed. Please try again later.');
//     }
//   };

//   return (
//     <div>
      

//       <h2>Register</h2>
//       <form onSubmit={handleRegisterSubmit}>
//         <input type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
//         <input type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
//         <button type="submit">Register</button>
//       </form>

//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// export default CreateOutdoreUser;





// import React, { useState } from 'react';
// import axios from 'axios';

// const CreateOutdoreUser = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8005/api/createoutdoreuser', { email, password });
//       alert(response.data); // Show success message
//     } catch (error) {
//       alert('Error signing up'); // Show error message
//     }
//   };

//   return (
//     <form onSubmit={handleSignup}>
//       <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// };

// export default CreateOutdoreUser;

