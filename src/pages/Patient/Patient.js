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
import GrowExample from '../../components/spiner/GrowExample';


function Patient() {
  // const { state, dispatch } = useGlobalState();
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [createForm, showCreateForm] = useState(false);
  // const [error, setError] = useState(null);

  const { state, dispatch } = useGlobalState();
  const [registrationData, setRegistrationData] = useState([]);
  const [admissionData, setAdmissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const [error, setError] = useState(null);
  const [showRegistrationTable, setShowRegistrationTable] = useState(true);


  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const registrationResponse = await axios.get(
        "http://localhost:8005/api/registation"
      );
      setRegistrationData(registrationResponse.data[0]);
      const admissionResponse = await axios.get(
        "http://localhost:8005/api/admission"
      );
      setAdmissionData(admissionResponse.data[0]);
      console.log(registrationResponse.data);
      console.log(admissionResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false)
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

  const columns1 = [
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
      header: "Amount",
      accessorKey: "price",
    },
    {
      header: "Address",
      accessorKey: "location",
    },
  ];

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
  ];

  const handleViewAppointment = (id) => {
    // You can navigate to a detailed view of the appointment using the appointment ID
    // Example: navigate(`/appointments/${id}`);
    navigate(`/appointments/${id}`);
  };

  return (
    // <div className="container p-2 ">
    //   <h2 className="text-xl font-bold mb-4">Registation</h2>
    //   {isLoading && !data[0] && (
    //     <div className="w-full h-60 flex justify-center items-center">
    //       <Spinner animation="border" variant="secondary" />
    //     </div>
    //   )}
    //   {createForm ? (
    //     <CreateAppointmentForm
    //       onCancel={() => {
    //         showCreateForm(false);
    //       }}
    //     />
    //   ) : (
    //     <div className="flex justify-between">
    //       <Button
    //         className="mb-2 drop-shadow"
    //         onClick={() => showCreateForm(true)}
    //       >
    //         {" "}
    //         Register New Appoinment
    //       </Button>
    //     </div>
    //   )}
    //   {!createForm &&
    //     (data[0] ? (
    //       <div className="drop-shadow">
    //         <Table1
    //           data={data}
    //           columns={[
    //             {
    //               header: "No.",
    //               cell: (row) => {
    //                 return <>{row.cell.row.index + 1}</>;
    //               },
    //             },
    //             ...columns1,
    //             {
    //               header: "Actions",
    //               cell: (rowData) => (
    //                 <div className="flex justify-between">
    //                   <button
    //                     onClick={() =>
    //                       handleViewAppointment(rowData?.row?.original?.id)
    //                     }
    //                     className="btn btn-primary btn-sm me-2"
    //                   >
    //                     {" "}
    //                     <FaEye />{" "}
    //                   </button>
    //                   <button
    //                     onClick={() =>
    //                       deleteContact(rowData?.row?.original?.id)
    //                     }
    //                     className="btn btn-danger btn-sm"
    //                   >
    //                     {" "}
    //                     <MdDelete />{" "}
    //                   </button>
    //                 </div>
    //               ),
    //             },
    //           ]}
    //           pageLimit={10}
    //         />
    //       </div>
    //     ) : !isLoading ? (
    //       <p className="text-red-400 font-semibold w-max mx-auto my-20">
    //         No Appointment Data
    //       </p>
    //     ) : (
    //       ""
    //     ))}
    // </div>
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Registration and Admission</h2>
      {isLoading && !registrationData[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <GrowExample />
        </div>
      )}
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
            onClick={() => setShowRegistrationTable(!showRegistrationTable)}
          >
            {showRegistrationTable
              ? "Show  Registration Data"
              : "Show Admission Data"}
          </Button>
          {showRegistrationTable && (
            <Button
              className="drop-shadow"
              onClick={() => showCreateForm(true)}
            >
              Register New Admission
            </Button>
          )}
        </div>
      )}
      {!showRegistrationTable  && !createForm && (
        <div className="drop-shadow">
          <Table1
            data={registrationData}
            columns={[
              {
                header: "No.",
                cell: (row) => {
                  return <>{row.cell.row.index + 1}</>;
                },
              },
              ...columns1,
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
                      <FaEye />{" "}
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
                    <button
                      onClick={() =>
                        handleViewAppointment(rowData?.row?.original?.id)
                      }
                      className="btn btn-primary btn-sm me-2"
                    >
                      {" "}
                      <FaEye />{" "}
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

export default Patient;
