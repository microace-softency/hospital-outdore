// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Form, Button } from "react-bootstrap";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";

// import { useAuth } from "../context/AuthContext";
// import { useEffect } from "react";

// import background from "../assets/images/wallpaper1.jpg";

// function LoginPage() {
//   const {
//     register,
//     handleSubmit,
//     errors,
//     formState: { isSubmitting, isDirty, isValid },
//   } = useForm({ mode: "onchange" });
//   const navigate = useNavigate();
//   const { signIn, token, tenant } = useAuth();

//   //   const [values, setValues] = useState({
//   //     email:"",
//   //     password:""
//   //   })
//   //  const handleInput = (e) =>{
//   //   setValues(prev => ({...prev,[e.target.name]:[e.target.values]}))
//   //  }
//   //   const handleSubmit = (e) =>{
//   //     e.preventDefault()
//   //   }

//   useEffect(() => {
//     token && navigate("/");
//   });

//   const onSubmit = async (data) => {
//     try {
//       await signIn(data);
//       if (tenant?.tenant_id) {
//         toast.success("Logged In", {
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
//         toast.error("Invalid credentials. Please try again.", {
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
//       <div
//         className="min-h-screen flex items-center justify-center px-2"
//         style={{ backgroundImage: `url('${background}')`, backgroundSize:"cover" }}
//       >
//         <div className="p-8 rounded-lg shadow-xl w-96 backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200">
//           <h2 className="text-3xl font-semibold text-center mb-6 text-sky-600">
//             Login
//           </h2>
//           <Form onSubmit={handleSubmit(onSubmit)}>
//             <Form.Group controlId="email">
//               <Form.Label className="font-semibold">Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 name="email"
//                 {...register("email", { required: true })}
//                 placeholder="Enter your email"
//                 // onChange={handleInput}
//               />
//             </Form.Group>
//             <Form.Group controlId="password">
//               <Form.Label className="font-semibold">Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 {...register("password", { required: true })}
//                 placeholder="Enter your password"
//                 // onChange={handleInput}
//               />
//             </Form.Group>
//             <Button
//               type="submit"
//               className="bg-sky-600 mt-10 text-white py-1  px-4 rounded-full font-semibold hover:bg-sky-800 transition duration-300 w-full"
//               disabled={isSubmitting || !isDirty || !isValid}
//             >
//               {isSubmitting ? "Logging in..." : "Login"}
//             </Button>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;



// login in sql database using nodejs server

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import background from "../assets/images/wallpaper1.jpg";


import { BiHide } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";



function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const { signIn, token } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8005/api/outdoreuser/loginoutdoreuser",
        data
      );
      signIn({
        token: response.data.token,
        username: response.data.username,
        email: response.data.email,
        location: response.data.location,
      }); // Save the token to auth context
      toast.success(`Logged in successfully! ${response.data.username}`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      navigate("/");
    } catch (error) {
      console.error(error.response?.data?.message || "Login failed");
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2"
      style={{ backgroundImage: `url('${background}')`, backgroundSize: 'cover' }}
    >
      <div className="p-8 rounded-lg shadow-xl w-96 backdrop-filter backdrop-blur-sm bg-opacity-50 bg-slate-200">
        <h2 className="text-3xl font-semibold text-center mb-6 text-sky-600">Login</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="username">
            <Form.Label className="font-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              {...register('username', { required: true })}
              placeholder="Enter your username"
            />
            {errors.username && <span className="text-danger">Username is required</span>}
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label className="font-semibold">Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                {...register('password', { required: true })}
                placeholder="Enter your password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                className="btn-toggle-password"
              >
                {showPassword ? <BiHide/> : <BiSolidShow/>}
              </Button>
            </div>
            {errors.password && <span className="text-danger">Password is required</span>}
          </Form.Group>
          <Button
            type="submit"
            className="bg-sky-600 mt-10 text-white py-1 px-4 rounded-full font-semibold hover:bg-sky-800 transition duration-300 w-full"
            disabled={isSubmitting || !isDirty || !isValid}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;