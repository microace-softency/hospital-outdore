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
import { FaPen } from "react-icons/fa";
import GrowExample from '../../components/spiner/GrowExample';



function Doctor() {
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
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8005/api/doctor");
      setData(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }finally{
    setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showCreateForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Doctor ?")
    ) {
      axios.delete(`http://localhost:8005/api/doctor/removedoctor/${id}`);
      toast.success("Dotor Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  const columns = [
    {
      header: "Doctor Code",
      accessorKey: "dcode",
    },
    {
      header: "Doctor Name",
      accessorKey: "doctorname",
    },
    {
      header: "Designation",
      accessorKey: "designation",
    },
    {
      header: "Fees Amount",
      accessorKey: "fees",
    },
    {
      header: "Percentage%",
      accessorKey: "percentage",
    },
  ];

  const handleView = (id) => {
    navigate(`/doctor/${id}`);
  };

  const handleUpdate = (data) => {
    navigate(`/doctor/${data}`);
  };

  return (
    <div className="container p-2 ">
      <Modal
        show={showSyncModal}
        onHide={() => !isSyncing && setShowSyncModal(false)}
      >
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">
              Product Syncronization
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            {isSyncing ? (
              <div>
                <p className="text-gray-700 text-white">{progressText}</p>
                <div
                  className="progress"
                  style={{ height: "20px", marginTop: "10px" }}
                >
                  <div
                    id="progress-bar"
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${progressPercent}%` }}
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <p
                  id="progress-message"
                  className="text-white mt-2"
                >{`Syncing... ${progressPercent.toFixed(2)}%`}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 text-white">
                  All tenants will be syncronised with Vendor details
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button
                variant="danger"
                disabled={isSyncing}
                onClick={() => setShowSyncModal(false)}
                className="mr-2"
              >
                Cancel
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
      {showCreateForm ? (
        <CreateCustomer
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
            Add {model}
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
          No Doctor's Data
        </p>
      ) : (
        ""
      )}
    </div>
  );
}

export default Doctor;
