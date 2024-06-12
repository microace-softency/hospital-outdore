// Appointments.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table1 from "../../components/Table1";
import { useGlobalState } from "../../context/GlobalStateContext";
import CreateAppointmentForm from "../../components/CreateAppoinment";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
// import { FaEye } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import GrowExample from '../../components/spiner/GrowExample';
import { Button } from "react-bootstrap";


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
      const response = await axios.get("http://localhost:8005/api/outdoreregistation");
      setData(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("data", data);
  useEffect(() => {
    loadData();
  }, [createForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Registation details ?")
    ) {
      axios.delete(
        `http://localhost:8005/api/registation/removeregistation/${id}`
      );
      toast.success("Registation Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Patiant Code",
      accessorKey: "orpCode",
    },
    {
      header: "Patiant Name",
      accessorKey: "patiantname",
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
      header: "Address",
      accessorKey: "address",
    },
    {
      header: "Guardian Number",
      accessorKey: "guardiannumber",
    },
    {
      header: "Guardian Name",
      accessorKey: "guardianname",
    },
  ];

  const handleViewAppointment = (id) => {
    // You can navigate to a detailed view of the appointment using the appointment ID
    // Example: navigate(`/appointments/${id}`);
    navigate("new user");
  };

  const handleUpdate = (id) => {
    navigate(`/appoinment/${id}`);
  };

  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Registation</h2>
      {createForm ? (
        <CreateAppointmentForm
        onCancel={() => {
          showCreateForm(false);
        }}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
          >
            {" "}
            Register New Appoinment
          </Button>
        </div>
      )}
      {isLoading && !data[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <GrowExample/>
        </div>
      )}
      {!createForm &&
        (data[0] ? (
          <div className="drop-shadow">
            <Table1
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
                        onClick={() => handleUpdate(rowData?.row?.original?.id)}
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
