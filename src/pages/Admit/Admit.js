// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from 'react-bootstrap/esm/Button';
// import { Spinner } from 'react-bootstrap';
// import Table from '../../components/Table';
// import { useGlobalState } from '../../context/GlobalStateContext';
// import AdmittingForm from '../../components/AdmittingForm';
// import { useAuth } from '../../context/AuthContext';
// // import CreateAdmissionForm from '../../components/CreateAdmission'; // Assuming you have a CreateAdmissionForm component

// function Admit() {
//   const { state, dispatch } = useGlobalState();
//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [createForm, showCreateForm] = useState(false);
//   const navigate = useNavigate();
//   const { token } = useAuth()
// console.log('token-------------', token);
//   const demoAdmissionData = [
//     {
//       id: '1',
//       patientName: 'John Doe',
//       doctorName: 'Dr. Smith',
//       time: '10:00 AM',
//       cause: 'Regular Checkup',
//       department: 'Orthopedics',
//       bedNumber: '101',
//     },
//     {
//       id: '2',
//       patientName: 'Jane Smith',
//       doctorName: 'Dr. Johnson',
//       time: '02:30 PM',
//       cause: 'Fever',
//       department: 'Pediatrics',
//       bedNumber: '102',
//     },
//     {
//       id: '3',
//       patientName: 'Michael Johnson',
//       doctorName: 'Dr. White',
//       time: '11:45 AM',
//       cause: 'Orthopedic Consultation',
//       department: 'Orthopedics',
//       bedNumber: '103',
//     },
//     {
//       id: '4',
//       patientName: 'Emily White',
//       doctorName: 'Dr. Brown',
//       time: '04:15 PM',
//       cause: 'Dermatology Appointment',
//       department: 'Dermatology',
//       bedNumber: '104',
//     },
//     {
//       id: '5',
//       patientName: 'Robert Davis',
//       doctorName: 'Dr. Black',
//       time: '01:30 PM',
//       cause: 'Neurology Consultation',
//       department: 'Neurology',
//       bedNumber: '105',
//     },
//     {
//       id: '6',
//       patientName: 'Olivia Brown',
//       doctorName: 'Dr. Green',
//       time: '03:00 PM',
//       cause: 'Gynecology Appointment',
//       department: 'Gynecology',
//       bedNumber: '106',
//     },
//   ];
  

//   useEffect(() => {
//     setColumns([
//       {
//         header: 'ID',
//         accessorKey: 'id',
//       },
//       {
//         header: 'Patient Name',
//         accessorKey: 'patientName',
//       },
//       {
//         header: 'Doctor Name',
//         accessorKey: 'doctorName',
//       },
//       {
//         header: 'Time',
//         accessorKey: 'time',
//       },
//       {
//         header: 'Cause',
//         accessorKey: 'cause',
//       },
//       {
//         header: 'Department',
//         accessorKey: 'department',
//       },
//       {
//         header: 'Bed Number',
//         accessorKey: 'bedNumber',
//       },
//       // Add more columns as needed
//       {
//         header: 'Actions',
//         cell: (rowData) => (
//           <Button
//             onClick={() => handleViewAdmission(rowData?.row?.original?.id)}
//             className="btn btn-primary btn-sm"
//           >
//             View Admission
//           </Button>
//         ),
//       },
//     ]);
//     getData();
//   }, []);

//   const getData = async () => {
//     setIsLoading(true);
//     // Use the demo data for now
//     setData(demoAdmissionData);
//     setIsLoading(false);
//   };

//   const handleCreateAdmission = () => {
//     console.log('create admission');
//   };

//   const handleViewAdmission = (id) => {
//     // You can navigate to a detailed view of the admission using the admission ID
//     // Example: navigate(`/admissions/${id}`);
//   };

//   return (
//     <div className='container p-2 '>
//       <h2 className="text-xl font-bold mb-4">Admitting</h2>
//       {isLoading && !data[0] && (
//         <div className='w-full h-60 flex justify-center items-center'>
//           <Spinner animation="border" variant="secondary" />
//         </div>
//       )}
//       {createForm ? (
//         <AdmittingForm onCreate={handleCreateAdmission} onCancel={() => showCreateForm(false)} />
//       ) : (
//         <div className='flex justify-between'>
//           <Button className='mb-2 drop-shadow' onClick={() => showCreateForm(true)}>
//             Register New Admission
//           </Button>
//         </div>
//       )}
//       {!createForm && (
//         data[0] ? (
//           <div className='drop-shadow'>
//             <Table
//               data={data}
//               columns={columns}
//               pageLimit={10}
//             />
//           </div>
//         ) : (
//           !isLoading && <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Admission Data</p>
//         )
//       )}
//     </div>
//   );
// }

// export default Admit;




// Patient.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { Spinner } from "react-bootstrap";
import Table1 from "../../components/Table1";
import { useGlobalState } from "../../context/GlobalStateContext";
import CreateAppointmentForm from "../../components/CreateAppoinment";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import CreateAdmitpatiant from "../../components/CreateAdmitpatiant";
import { FaPen } from "react-icons/fa";


function Admit() {

  const { state, dispatch } = useGlobalState();
  const [admissionData, setAdmissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const [error, setError] = useState(null);
  const [showRegistrationTable, setShowRegistrationTable] = useState(true);


  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const admissionResponse = await axios.get(
        "http://localhost:8005/api/admission"
      );
      setAdmissionData(admissionResponse.data[0]);
      console.log(admissionResponse.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [createForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Appoinment ?")
    ) {
      axios.delete(`http://localhost:8005/api/admission/removeadmission/${id}`);
      toast.success("Admit Patiant Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  

  const columns2 = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Patiant Name",
      accessorKey: "name",
    },
    {
      header: "Age",
      accessorKey: "age",
    },
    {
      header: "Gender",
      accessorKey: "sex",
    },
    {
      header: "Mobile Number",
      accessorKey: "mobilenumber",
    },
    {
      header: "Doctor Name",
      accessorKey: "doctor",
    },
    {
      header: "Time",
      accessorKey: "time",
    },
    {
      header: "Pin Code",
      accessorKey: "pincode",
    },
    {
      header: "Block",
      accessorKey: "block",
    },
    {
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Bed",
      accessorKey: "bed",
    },
  ];

  const handleViewAppointment = (id) => {
    // You can navigate to a detailed view of the appointment using the appointment ID
    // Example: navigate(`/appointments/${id}`);
    navigate(`/appointments/${id}`);
  };

  const handleUpdate = (data) => {
    navigate(`/admission/${data}`);
  };

  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Admission</h2>
      {createForm ? (
        <CreateAdmitpatiant
          onCancel={() => {
            showCreateForm(false);
          }}
        />
      ) : (
        <div className="flex justify-between mb-2">
          <Button
              className="drop-shadow"
              onClick={() => showCreateForm(true)}
            >
              Register New Admission
            </Button>
        </div>
      )}
        {showRegistrationTable && !createForm && (

        <div className="drop-shadow">
          <Table1
            data={admissionData}
            columns={[
              {
                header: "No.",
                cell: (row) => {
                  return <>{row.cell.row.index + 1}</>;
                },
              },
              ...columns2,
              {
                header: "Actions",
                cell: (rowData) => (
                  <div className="flex justify-between">
                    {/* <button
                      onClick={() =>
                        handleViewAppointment(rowData?.row?.original?.id)
                      }
                      className="btn btn-primary btn-sm me-2"
                    >
                      {" "}
                      <FaEye />{" "}
                    </button> */}
                    <button
                      onClick={() =>
                        handleUpdate(rowData?.row?.original?.id)
                      }
                      className="btn btn-primary btn-sm me-2"
                    >
                      {" "}
                      <FaPen />{" "}
                    </button>
                    <button
                      onClick={() =>
                        deleteContact(rowData?.row?.original?.id)
                      }
                      className="btn btn-danger btn-sm"
                    >
                      {" "}
                      <MdDelete />{" "}
                    </button>
                  </div>
                ),
              },
            ]}
            pageLimit={10}
          />
        </div>
      )}
    </div>
  );
}

export default Admit;
