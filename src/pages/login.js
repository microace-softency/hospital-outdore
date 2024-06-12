import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

import background from "../assets/images/wallpaper1.jpg";

function LoginPage() {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({ mode: "onchange" });
  const navigate = useNavigate();
  const { signIn, token, tenant } = useAuth();

  //   const [values, setValues] = useState({
  //     email:"",
  //     password:""
  //   })
  //  const handleInput = (e) =>{
  //   setValues(prev => ({...prev,[e.target.name]:[e.target.values]}))
  //  }
  //   const handleSubmit = (e) =>{
  //     e.preventDefault()
  //   }

  useEffect(() => {
    token && navigate("/");
  });

  const onSubmit = async (data) => {
    try {
      await signIn(data);
      if (tenant?.tenant_id) {
        toast.success("Logged In", {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid credentials. Please try again.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(`Login failed: ${error.message}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div>
      <div
        className="min-h-screen flex items-center justify-center px-2"
        style={{ backgroundImage: `url('${background}')`, backgroundSize:"cover" }}
      >
        <div className="p-8 rounded-lg shadow-xl w-96 backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200">
          <h2 className="text-3xl font-semibold text-center mb-6 text-sky-600">
            Login
          </h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
              <Form.Label className="font-semibold">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                // onChange={handleInput}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label className="font-semibold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                {...register("password", { required: true })}
                placeholder="Enter your password"
                // onChange={handleInput}
              />
            </Form.Group>
            <Button
              type="submit"
              className="bg-sky-600 mt-10 text-white py-1  px-4 rounded-full font-semibold hover:bg-sky-800 transition duration-300 w-full"
              disabled={isSubmitting || !isDirty || !isValid}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

// login in sql database using nodejs server

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Form, Button } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';

// import { useAuth } from '../context/AuthContext';
// import { useEffect } from 'react';

// import background from '../assets/images/wallpaper.jpg'
// import Validation from './LoginValication';

// function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     // errors,
//     formState: { isSubmitting, isDirty, isValid }
//   } = useForm({ mode: "onchange" });
//   const navigate = useNavigate();
//   const { signIn, token, tenant } = useAuth();

//   const [values, setValues] = useState({
//     email:"",
//     password:""
//   });
//   const [errors , setErrors] = useState({})
//  const handleInput = (e) =>{
//   setValues(prev => ({...prev,[e.target.name]:[e.target.values]}))
//  }
//   const handleLogin = (e) =>{
//     e.preventDefault()
//     setErrors(Validation(values))
//   }
//   useEffect(() => {
//     token && navigate('/');
//   })

//   const onSubmit = async (data) => {
//     try {
//       await signIn(data);
//       if (tenant?.tenant_id) {
//         toast.success('Logged In', {
//           position: "top-center",
//           autoClose: 600,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         toast.error('Invalid credentials. Please try again.', {
//           position: "top-center",
//           autoClose: 1000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       } else {
//         toast.error(`Login failed: ${error.message}`, {
//           position: "top-center",
//           autoClose: 1000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       }
//     }
//   };

//   return (
//     <div>
//       <div className="min-h-screen flex items-center justify-center px-2" style={{ backgroundImage:` url('${background}')` }}>
//       <div className="p-8 rounded-lg shadow-xl w-96 backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200">
//           <h2 className="text-3xl font-semibold text-center mb-6 text-sky-600">Login</h2>
//           <Form onSubmit={handleLogin}>
//             <Form.Group controlId="email">
//               <Form.Label className='font-semibold'>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 // {...register('email', { required: true })}
//                 placeholder="Enter your email"
//                 onChange={handleInput}
//               />
//               {errors.email && <span className='text-danger'>{errors.email}</span>}
//             </Form.Group>
//             <Form.Group controlId="password">
//               <Form.Label className='font-semibold'>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 // {...register('password', { required: true })}
//                 placeholder="Enter your password"
//                 onChange={handleInput}
//               />
//               {errors.password && <span className='text-danger'>{errors.password}</span>}

//             </Form.Group>
//             <Button
//               type="submit"
//               className="bg-sky-600 mt-10 text-white py-1  px-4 rounded-full font-semibold hover:bg-sky-800 transition duration-300 w-full"
//               disabled={isSubmitting || !isDirty || !isValid}
//             >
//               {isSubmitting ? 'Logging in...' : 'Login'}
//             </Button>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;
