import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { useGlobalState } from "../../context/GlobalStateContext";
import { useAuth } from "../../context/AuthContext";
import LocationFrom from "../../components/LocationFrom";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import PurchaseFrom from "../../components/PurchaseFrom";
import PurchaseIssueFrom from "../../components/PurchaseIssueFrom";
// import CreateAdmissionForm from '../../components/CreateAdmission'; // Assuming you have a CreateAdmissionForm component

function PurchasesInventoryIssue() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { token } = useAuth();
console.log(data);
  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/purchaseissue");
      setData(response.data[0]);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [createForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Issue ?")
    ) {
      axios.delete(`http://localhost:8005/api/removebed/${id}`);
      toast.success("Bed Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  useEffect(() => {
    setColumns([
      {
        header: "Purchase Issue No ",
        accessorKey: "PurchaseIssueNo",
      },
      {
        header: "Issue Date",
        accessorKey: "IssueDate",
      },
      {
        header: "Department",
        accessorKey: "department",
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
      },
      {
        header: "Items",
        accessorKey: "items",
        cell: ({ row }) => {
          const items = row.original.items;
          return (
            <div>
              {items && items.length > 0 ? (
                items.map((item, index) => (
                  <div key={index}>
                    <strong>Product:</strong> {item.Product}, <strong>Quantity:</strong> {item.Quantity}, <strong>UOM:</strong> {item.UOM}, <strong>Description:</strong> {item.Description}
                  </div>
                ))
              ) : (
                <div>No items</div>
              )}
            </div>
          );
        }
      },
      {
        header: "Actions",
        cell: (rowData) => (
          <div className="flex justify-between">
            <button
              onClick={() => handleViewAdmission(rowData?.row?.original?.id)}
              className="btn btn-primary btn-sm me-2"
            >
              {" "}
              <FaEye />{" "}
            </button>
            <button
              onClick={() => deleteContact(rowData?.row?.original?.id)}
              className="btn btn-danger btn-sm"
            >
              {" "}
              <MdDelete />{" "}
            </button>
          </div>
        ),
      },
    ]);
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    // Use the demo data for now
    // setData(demoAdmissionData);
    setIsLoading(false);
  };

  const handleCreateAdmission = () => {
    console.log("create admission");
  };

  const handleViewAdmission = (id) => {
    navigate(`/admissions/${id}`);
  };

  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Purchases Issue</h2>
      {isLoading && !data[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      {createForm ? (
        <PurchaseIssueFrom
          onCreate={handleCreateAdmission}
          onCancel={() => showCreateForm(false)}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
          >
            Entry
          </Button>
        </div>
      )}
      {!createForm &&
        (data[0] ? (
          <div className="drop-shadow">
            <Table data={data} columns={columns} pageLimit={10} />
          </div>
        ) : (
          !isLoading && (
            <>
              {/* <img
                className="text-red-400 font-semibold w-max mx-auto my-20"
                alt="No pathology's Data"
                src="datanotfound.avif"
              /> */}

              <p className="text-red-400 font-semibold w-max mx-auto my-20">
                No  Data
              </p>
            </>
          )
        ))}
    </div>
  );
}

export default PurchasesInventoryIssue;
