import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { useGlobalState } from "../../context/GlobalStateContext";
import AdmittingForm from "../../components/AdmittingForm";
import { useAuth } from "../../context/AuthContext";
import LocationFrom from "../../components/LocationFrom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import PackegFrom from "../../components/PackegFrom";
import BedFrom from "../../components/BedFrom";
import { FaPen } from "react-icons/fa";
import GrowExample from "../../components/spiner/GrowExample";
import CreateDepartment from "../../components/CreateDepartment";

function Department() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8005/api/department");
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

  const deleteDepartment = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Department ?")
    ) {
      axios.delete(`http://localhost:8005/api/department/removedepartment/${id}`);
      toast.success("Department Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  useEffect(() => {
    setColumns([
      {
        header: "Department code",
        accessorKey: "dpcode",
      },
      {
        header: "Department Name",
        accessorKey: "departmentName",
      }
    ]);
  }, []);

  const handleCreateAdmission = () => {
    console.log("create admission");
  };

  const handleViewAdmission = (id) => {
    // You can navigate to a detailed view of the admission using the admission ID
    // Example: navigate(`/admissions/${id}`);
  };

  const handleUpdate = (data) => {
    navigate(`/department/${data}`);
  };

  return (
    <div className="container p-2 ">
      {/* <h2 className="text-xl font-bold mb-4">Department</h2> */}
      {createForm ? (
        <CreateDepartment
          onCreate={handleCreateAdmission}
          onCancel={() => showCreateForm(false)}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
          >
            Add New Department
          </Button>
        </div>
      )}
       {isLoading && !data[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <GrowExample />
        </div>
      )}
      {!createForm &&
        (data[0] ? (
          <div className="drop-shadow">
            <Table
              data={data}
              columns={[
                ...columns,
                {
                  header: "Actions",
                  cell: (rowData) => {
                    return (
                      <div className="flex justify-between">
                        {/* <button
                        onClick={() => handleView(rowData?.row?.original?.id)}
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
                            deleteDepartment(rowData?.row?.original?.id)
                          }
                          className="btn btn-danger btn-sm"
                        >
                          {" "}
                          <MdDelete />{" "}
                        </button>
                      </div>
                    );
                  },
                },
              ]}
              pageLimit={10}
            />{" "}
          </div>
        ) : (
          !isLoading && (
            <p className="text-red-400 font-semibold w-max mx-auto my-20">
              No Department Data
            </p>
          )
        ))}
    </div>
  );
}

export default Department;
