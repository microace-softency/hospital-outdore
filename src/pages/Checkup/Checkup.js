// // Checkup.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from 'react-bootstrap/esm/Button';
// import { Spinner } from 'react-bootstrap';
// import Table from '../../components/Table';
// import { useGlobalState } from '../../context/GlobalStateContext';
// import CheckupForm from '../../components/CheckupForm';

// function Checkup() {
//   const { state, dispatch } = useGlobalState();
//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([])
//   const [isLoading, setIsLoading] = useState(false);
//   const [createForm, showCreateForm] = useState(false)
//   const navigate = useNavigate();

// const checkupLogsData = [
//   {
//     id: '1',
//     patientName: 'Rajesh Kumar',
//     contact: '9876543210',
//     isAdmitted: true,
//     bedNo: '101',
//     amount: '₹500',
//     paymentStatus: 'Paid',
//   },
//   {
//     id: '2',
//     patientName: 'Anita Singh',
//     contact: '8765432109',
//     isAdmitted: false,
//     bedNo: '',
//     amount: '₹700',
//     paymentStatus: 'Pending',
//   },
//   {
//     id: '3',
//     patientName: 'Amit Patel',
//     contact: '7654321098',
//     isAdmitted: true,
//     bedNo: '103',
//     amount: '₹1000',
//     paymentStatus: 'Paid',
//   },
//   {
//     id: '4',
//     patientName: 'Anjali Gupta',
//     contact: '6543210987',
//     isAdmitted: false,
//     bedNo: '',
//     amount: '₹600',
//     paymentStatus: 'Pending',
//   },
//   {
//     id: '5',
//     patientName: 'Rahul Sharma',
//     contact: '5432109876',
//     isAdmitted: true,
//     bedNo: '105',
//     amount: '₹850',
//     paymentStatus: 'Paid',
//   },
// ];

//   useEffect(() => {
//     setData([]);
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
//         header: 'Contact',
//         accessorKey: 'contact',
//       },
//       {
//         header: 'Admitted',
//         accessorKey: 'isAdmitted',
//       },
//       {
//         header: 'Bed No',
//         accessorKey: 'bedNo',
//       },
//       {
//         header: 'Amount',
//         accessorKey: 'amount',
//       },
//       {
//         header: 'Payment Status',
//         accessorKey: 'paymentStatus',
//       },
//     ]);

//     getData();
//   }, [])

//   const getData = async () => {
//     setIsLoading(true);

//     // Use the demo data for now
//     setData(checkupLogsData);

//     setIsLoading(false);
//   };

//   const handleCreateCustomer = () => {
//     console.log('create');
//   }

//   const handleViewAppointment = (id) => {
//     // You can navigate to a detailed view of the appointment using the appointment ID
//     // Example: navigate(`/appointments/${id}`);
//   };

//   return (
//     <div className='container p-2 '>
//       <h2 className="text-xl font-bold mb-4">Checkup Logs</h2>
//       {isLoading && !data[0] &&
//         <div className='w-full h-60 flex justify-center items-center'>
//           <Spinner animation="border" variant="secondary" />
//         </div>}
//         {createForm ?  <CheckupForm onCreate={handleCreateCustomer} onCancel={() => { showCreateForm(false)}}/> : <div className='flex justify-between'>
//         <Button className='mb-2 drop-shadow'
//         onClick={() => showCreateForm(true)}
//         > Register New Checkup</Button>
//         </div>}
//       {!createForm &&  (data[0] ?
//         <div className='drop-shadow'>
//           <Table
//             data={data}
//             columns={[
//               ...columns,
//               {
//                 header: 'Actions',
//                 cell: (rowData) => (
//                   <Button
//                     onClick={() => handleViewAppointment(rowData?.row?.original?.id)}
//                     className="btn btn-primary btn-sm">
//                     View Log
//                   </Button>
//                 ),
//               },
//             ]}
//             pageLimit={10}
//           />
//         </div> :
//         (!isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Appointment Data</p>
//           : ''))
//       }
//     </div>
//   );
// }

// export default Checkup;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { useGlobalState } from "../../context/GlobalStateContext";
import CreateAppointmentForm from "../../components/CreateAppoinment";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import GrowExample from '../../components/spiner/GrowExample';

function Appointments() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8005/api/registation");
      setData(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [createForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Appoinment ?")
    ) {
      axios.delete(`http://localhost:8005/api/removeregistation/${id}`);
      toast.success("Class Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Address",
      accessorKey: "location",
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
      header: "Image",
      accessorKey: "image",
    },
    {
      header: "Mobile Number",
      accessorKey: "mobilenumber",
    },
    {
      header: "Sex",
      accessorKey: "sex",
    },
    {
      header: "Age",
      accessorKey: "age",
    },
    {
      header: "Doctor Name",
      accessorKey: "doctorname",
    },
    {
      header: "Time",
      accessorKey: "time",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Price",
      accessorKey: "price",
    },
  ];

  const handleViewAppointment = (id) => {
    navigate(`/patientdetails/${id}`);
  };

  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Checkup</h2>
      {isLoading && !data[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <GrowExample/>
        </div>
      )}
      {/* {createForm ?  <CreateAppointmentForm  onCancel={() => { showCreateForm(false)}}/> : <div className='flex justify-between'>
        <Button className='mb-2 drop-shadow'
        onClick={() => showCreateForm(true)}
        // onClick={() => navigate("/createappoinment")}
        > Register New Appoinment</Button>
        </div>} */}
      {!createForm &&
        (data[0] ? (
          <div className="drop-shadow">
            <Table
              data={data}
              columns={[
                {
                  header: "No.",
                  cell: (row) => {
                    return <>{row.cell.row.index + 1}</>;
                  },
                },
                ...columns,
                {
                  header: "Actions",
                  cell: (rowData) => (
                    <div className="flex justify-between">
                      <button
                        onClick={() =>
                          handleViewAppointment(rowData?.row?.original?.id)
                        }
                        className="btn btn-primary btn-sm me-2"
                      >
                        {" "}
                        <FaPencilAlt />{" "}
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
        ) : !isLoading ? (
          <p className="text-red-400 font-semibold w-max mx-auto my-20">
            No Appointment Data
          </p>
        ) : (
          ""
        ))}
    </div>
  );
}

export default Appointments;
