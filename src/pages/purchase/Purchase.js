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
import PurchaseFrom from "../../components/PurchaseFrom";
import GrowExample from '../../components/spiner/GrowExample';

// import CreateAdmissionForm from '../../components/CreateAdmission'; // Assuming you have a CreateAdmissionForm component

function Purchase() {
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
      const response = await axios.get("http://localhost:8005/api/purchase");
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    } finally{
      setIsLoading(false)
    }
  };

  console.log(data);
  
  useEffect(() => {
    loadData();
  }, [createForm]);

  const deleteContact = (id) => {
    if (
      window.confirm("Are you sure that you wanted to delete that Purchases ?")
    ) {
      axios.delete(`http://localhost:8005/api/purchase/removepurches/${id}`);
      toast.success(" Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  useEffect(() => {
    setColumns([
      {
        header: "Inv No.",
        accessorKey: "PurchaseInvNo",
      },
      {
        header: "Inv Date",
        accessorKey: "InvDate",
      },
      {
        header: "Party Inv No.",
        accessorKey: "PartyInvNo",
      },
      {
        header: "Purchase Inv Date",
        accessorKey: "PurchaseInvDate",
      },
      {
        header: "Vendor Code",
        accessorKey: "VendorCode",
      },
      {
        header: "Vendor Name",
        accessorKey: "VendorName",
      },
      // Add more columns as needed
      {
        header: "Actions",
        cell: (rowData) => (
          <div className="flex justify-between">
            <button
              onClick={() => handleViewAdmission(rowData?.row?.original?.PurchaseID)}
              className="btn btn-primary btn-sm me-2"
            >
              {" "}
              <FaEye />{" "}
            </button>
            <button
              onClick={() => deleteContact(rowData?.row?.original?.PurchaseID)}
              className="btn btn-danger btn-sm"
            >
              {" "}
              <MdDelete />{" "}
            </button>
          </div>
        ),
      },
    ]);
  }, []);

  const handleCreateAdmission = () => {
    console.log("create admission");
  };

  const handleViewAdmission = (id) => {
    navigate(`/purchases/${id}`);
  };

  return (
    <div className="container p-2 ">
      <h2 className="text-xl font-bold mb-4">Purchase</h2>
      {createForm ? (
        <PurchaseFrom
          onCreate={handleCreateAdmission}
          onCancel={() => showCreateForm(false)}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
          >
            Purchase
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
                No Purchase Data
              </p>
            </>
          )
        ))}
    </div>
  );
}

export default Purchase;
