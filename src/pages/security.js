import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDataWithQuery } from '../services';
import { collection, deleteDoc, doc, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Dropdown, Button, Col, Form, Row } from 'react-bootstrap';
import { Permissions } from '../config';
import { toast } from 'react-toastify';
import { deleteUser, getAuth, listUsers } from 'firebase/auth';

function SecurityPage() {
  const { tenant } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [demoUser, setDemoUser] = useState({
    name: '',
    email: '',
    contactNumber: '',
    role: 'STAFF',
    permissions: {
      sale: false,
      purchase: false,
      report: false,
      create: false,
      update: false,
      delete: false,
    },
  });
  const [selectedUser, setSelectedUser] = useState({
  });
  const [selectedRights, setSelectedRights] = useState(selectedUser?.rights || []);
  const handleCheckboxChange = (right) => {
    // Toggle the inclusion of the right in the selectedRights array
    setSelectedRights((prevRights) => {
      if (prevRights.includes(right)) {
        return prevRights.filter((r) => r !== right);
      } else {
        return [...prevRights, right];
      }
    });
  };
  const tenantsCollection = collection(db, 'Tenants');
  const query1 = where('tenant_id', '==', tenant.tenant_id);
  const query2 = where("role", "!=", "ADMIN");
  const snapshot = query(tenantsCollection, query1, query2);

  const fetchUserData = () => {
    if (snapshot) {
      fetchDataWithQuery(snapshot)
        .then((res) => {
          setAllUsers(res);
          return res;
        });
    }
  }
  useEffect(() => {
    fetchUserData()
  }, []);

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setSelectedRights(user.rights || [])
  };

  const handleUpdateRights = async () => {
    const userRef = doc(tenantsCollection, selectedUser.id);
    
    await updateDoc(userRef, { rights: selectedRights }).then((res)=>{
      fetchUserData();
      toast.success('User Successfully Created', {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setSelectedUser({});
    }).catch((err) => {
      console.error(err);
    })

  };
  // const handleDeleteUser = async () => {
  //   if (window.confirm(`Are you sure you want to delete the user ${selectedUser.email}?`)) {
  //     const userRef = doc(tenantsCollection, selectedUser.uid);

  //     try {
  //       // Delete the user document from Firestore
  //       console.log('selectedUser.uid', selectedUser.uid);
  //       getAuth()
  //       .deleteUser(selectedUser.uid)
  //       .then((res) => {
  //         console.log('Successfully deleted user', res);
  //       })
  //       .catch((error) => {
  //         console.log('Error deleting user:', error);
  //       });


  //       // Update the user list
  //       fetchUserData();

  //       // Display success toast
  //       toast.success('User Successfully Deleted', {
  //         position: "top-center",
  //         autoClose: 600,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });

  //       // Clear the selected user
  //       setSelectedUser({});
  //     } catch (error) {
  //       console.error(error);

  //       // Display error toast
  //       toast.error('Error deleting user', {
  //         position: "top-center",
  //         autoClose: 600,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "colored",
  //       });
  //     }
  //   }
  // };


  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Security</h2>
      <Row>
        <Col md={4} lg={4} className='mb-2'>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Select User
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {allUsers ? allUsers.map((user) => (
                <Dropdown.Item key={user.id} onClick={() => handleUserSelection(user)}>
                  {user.email}
                </Dropdown.Item>
              )): (
                <Dropdown.Item >
                  No User found
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={8} lg={8}>
          {selectedUser?.email && (
        <>
          <div className="bg-white py-2 px-4 rounded">
          <h2 className="text-2xl font-semibold mb-4">User Details</h2>
          <Row>
            <Col>
              <p>
                <strong>Email:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>Rights:</strong>
              </p>
              {Permissions.UserRights.map((right) => (
                <div key={right} className="mb-2">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRights.includes(right)}
                      onChange={() => handleCheckboxChange(right)}
                    />
                    {right}
                  </label>
                </div>
              ))}
              {JSON.stringify(selectedUser.rights) !== JSON.stringify(selectedRights) && (
                <Button variant="primary" onClick={handleUpdateRights}>
                  Update Rights
                </Button>
              )}
              {/* <Button variant="danger" className="ml-2" onClick={handleDeleteUser}>
                  Delete User
                </Button> */}
            </Col>
          </Row>
          </div>
        </>
      )}
        </Col>
      </Row>
    </div>
  );
}

export default SecurityPage;
