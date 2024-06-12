import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { auth, db } from '../firebase';
import { createData } from '../services';
import { collections } from '../config';
import { toast } from 'react-toastify';
import { collection } from 'firebase/firestore';
import PasswordModal from '../components/PasswordModal';

function UserPage() {
  const { tenant } = useAuth();
  const [ newUserRef, setNewUserRef ] = useState({});
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'USER',
    password: '',
  });
  const [createForm, SetCreateForm] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  const isAdmin = tenant.role === 'ADMIN';

  const handleCreateUser = async () => {
    setPasswordModal(true); // Open the password modal
  };

  const handlePasswordVerification = async () => {
    try {
      // Verify the entered password
      await signInWithEmailAndPassword(auth, tenant.email, password);

      // Password is correct, proceed to create the new user
      

      // Create the new user without automatically signing them in
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

    // Access the UID from the user object
      const uid = userCredential.user.uid;

      const userData = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tenant_id: tenant.tenant_id,
        uid: uid,
      };
      // console.log(userData);
      // Now you can perform additional actions, such as adding user data to Firestore
      const value = collection(db, collections.TENANTS);
      await createData(value, userData);
      await signInWithEmailAndPassword(auth, tenant.email, password)
      // Display success toast
      toast.success('User Successfully Created', {
        position: 'top-center',
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      // Clear the form
      setNewUser({
        name: '',
        email: '',
        contactNumber: '',
        role: 'STAFF',
      });

      // Close the create form and password modal
      SetCreateForm(false);
      setPasswordModal(false);
    } catch (error) {
      console.error('Error creating user:', error);

      // Display error toast
      toast.error('User not created', {
        position: 'top-center',
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };
  return (
    <div className="container min-h-screen">
      <PasswordModal
        show={passwordModal}
        onHide={() => setPasswordModal(false)}
        onVerify={handlePasswordVerification}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-full mx-auto p-2 rounded">
          <h2 className="text-2xl font-bold mb-2">User Details</h2>
          <Row>
            <Col lg={6} md={6} sm={12} className="my-4 mx-2">
              <h4>Welcome, <span className='text-teal-700'>{tenant.email}</span> !</h4>
            </Col>
          </Row>
          <Row>
            {/* <Col md={12} lg={6}>
              <div className='bg-white p-4 drop-shadow rounded'>    
                <h2 className="text-2xl font-semibold mb-4">Your Franchise Information</h2>
                <Row className='px-2'>
                  <Col lg={12} md={12} sm={12} className="">
                    <Form.Group controlId="FRANCHISE_NAME">
                      <Form.Label className="block text-gray-700 font-medium">Franchise Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="FRANCHISE_NAME"
                        placeholder="Enter User Name"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12} md={12} sm={12} className="">
                    <Form.Group controlId="FRANCHISE_LOCATION">
                      <Form.Label className="block text-gray-700 font-medium">Franchise Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="FRANCHISE_LOCATION"
                        placeholder="Enter Franchise Location"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className='bg-white p-4 drop-shadow rounded'>
                <h2 className="text-2xl font-semibold mb-4">Other Information</h2>
                <Row className='px-2'>
                  <Col lg={12} md={12} sm={12} className="">
                    <Form.Group controlId="CONTACT_NAME">
                      <Form.Label className="block text-gray-700 font-medium">Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="CONTACT_NAME"
                        placeholder="Enter Franchise Name"
                      // Add value and onChange as needed
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12} md={12} sm={12} className="">
                    <Form.Group controlId="CONTACT_LOCATION">
                      <Form.Label className="block text-gray-700 font-medium">Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="CONTACT_LOCATION"
                        placeholder="Enter Franchise Location"
                      // Add value and onChange as needed
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={12} md={12} sm={12} className="">
                    <Form.Group controlId="CONTACT_NUMBER">
                      <Form.Label className="block text-gray-700 font-medium">Contact</Form.Label>
                      <Form.Control
                        type="text"
                        name="CONTACT_NUMBER"
                        placeholder="Enter Contact Number"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col> */}
          </Row>
          {isAdmin && (
            <div>
              <div className='p-4'>
                <Button
                  className=""
                  onClick={() => { SetCreateForm(!createForm) }}
                >
                  {!createForm ? '+ Add new user' : 'Cancel'}
                </Button>
              </div>
              {createForm &&
                <div>
                  <Col md={12} lg={6}>
                    <div className='bg-white p-4 drop-shadow rounded'>
                      <h2 className="text-2xl font-semibold mb-4">New User Information</h2>
                      <Row className='px-2'>
                        <Col lg={12} md={12} sm={12} className="">
                          <Form.Group controlId="USER_NAME">
                            <Form.Label className="block text-gray-700 font-medium">Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="USER_NAME"
                              placeholder="Enter User Name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={12} md={12} sm={12} className="">
                          <Form.Group controlId="USER_EMAIL">
                            <Form.Label className="block text-gray-700 font-medium">User Email </Form.Label>
                            <Form.Control
                              type="text"
                              name="USER_EMAIL"
                              placeholder="example@.mail.com"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={12} md={12} sm={12} className="">
                          <Form.Group controlId="USER_PASSWORD">
                            <Form.Label className="block text-gray-700 font-medium">User Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="USER_PASSWORD"
                              placeholder="Enter Password"
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col lg={12} md={12} sm={12} className="">
                          <Button
                            className="bg-blue-500 text-white my-6 rounded"
                            onClick={handleCreateUser}
                          >
                            Create User
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
