// OutdoreUser.js
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
import CreateOutdoreUser from "../../components/CreateOutdoreUser";
import GrowExample from '../../components/spiner/GrowExample';


function OutdoreUser() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8005/api/outdoreuser");
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
      axios.delete(
        `http://localhost:8005/api/outdoreuser/removeoutdoreuser/${id}`
      );
      toast.success("user Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };
  const columns = [
    {
      header: "User ID",
      accessorKey: "email",
    },
    {
      header: "Password",
      accessorKey: "password",
    },
    {
      header: "Location",
      accessorKey: "location",
    },
  ];

  const handleViewAppointment = (id) => {
    // You can navigate to a detailed view of the appointment using the appointment ID
    // Example: navigate(`/appointments/${id}`);
  };

  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Outdoor User</h2>
      {createForm ? (
        <CreateOutdoreUser
          onCancel={() => {
            showCreateForm(false);
          }}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
            // onClick={() => navigate("/createappoinment")}
          >
            {" "}
            Create New User
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
        ) : !isLoading ? (
          <p className="text-red-400 font-semibold w-max mx-auto my-20">
            No Outdore User Data
          </p>
        ) : (
          ""
        ))}
    </div>
  );
}

export default OutdoreUser;
