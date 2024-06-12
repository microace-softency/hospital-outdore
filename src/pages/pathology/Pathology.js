// Customers.js
import React, { useEffect, useState } from "react";
import CreateCustomer from "../../components/CreateCustomer";
import { where } from "firebase/firestore";
import Button from "react-bootstrap/esm/Button";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { collections, tableFields } from "../../config";
import { Spinner, Modal } from "react-bootstrap";
import Table from "../../components/Table";
import { useGlobalState } from "../../context/GlobalStateContext";
import {
  adminCollection,
  createData,
  deleteData,
  fetchDataFromDb,
} from "../../services";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import CreatePathology from "../../components/CreatePathology";
import { FaPen } from "react-icons/fa";
import GrowExample from '../../components/spiner/GrowExample';



function Pathology() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length - 1];
  const { myCollection } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const customer = adminCollection(collections.DOCTOR);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8005/api/pathology");
      setData(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    } finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadData();
  }, [showCreateForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Pathology ?")
    ) {
      axios.delete(`http://localhost:8005/api/pathology/removepathology/${id}`);
      toast.success("Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Patient Name",
      accessorKey: "patientname",
    },
    {
      header: "Patient Mobile Number",
      accessorKey: "patientnumber",
    },
    {
      header: "Test Name",
      accessorKey: "testname",
    },
    {
      header: "Refer Doctor",
      accessorKey: "referDrName",
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
    },
    {
      header: "Advance Payment",
      accessorKey: "advancePayment",
    },
    {
      header: "Due Payment",
      accessorKey: "duePayment",
    },
  ];

  const handleView = (data) => {
    navigate(`/${model}/${data}`);
  };

  const handleUpdate = (data) => {
    navigate(`/pathology/${data}`);
  };
  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">
        {model.charAt(0).toUpperCase() + model.slice(1)}
      </h2>
      {showCreateForm ? (
        <CreatePathology
          onCancel={() => {
            setShowCreateForm(false);
          }}
          customers={data}
          model={model}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => setShowCreateForm(true)}
          >
            {" "}
            {/* Add {model} */}
            + Booking
          </Button>
        </div>
      )}
      {isLoading && !data[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <GrowExample/>
        </div>
      )}
      {showCreateForm ? null : data[0] ? (
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
                  );
                },
              },
            ]}
            pageLimit={10}
          />
        </div>
      ) : !isLoading ? (
        <p className="text-red-400 font-semibold w-max mx-auto my-20">
          No pathology's Data
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default Pathology;
