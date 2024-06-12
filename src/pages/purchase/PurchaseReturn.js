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
import PurchaseReturnFrom from "../../components/PurchaseReturnFrom";

function PurchaseReturn() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, showCreateForm] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/purchasereturn");
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
      window.confirm("Are you sure that you wanted to delete that Location ?")
    ) {
      axios.delete(`http://localhost:8005/api/purchaseissue/remove/${id}`);
      toast.success("Issue Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  useEffect(() => {
    setColumns([
      {
        header: "GRN Date",
        accessorKey: "grndate",
      },
      {
        header: "PO No.",
        accessorKey: "pono",
      },
      {
        header: "Party Inv No.",
        accessorKey: "partyinvno",
      },
      {
        header: "Inv Date",
        accessorKey: "invdate",
      },
      {
        header: "Rate",
        accessorKey: "rate",
      },
      {
        header: "Vendor Code",
        accessorKey: "vendorcode",
      },
      {
        header: "Vendor Name",
        accessorKey: "vendorname",
      },
      // Add more columns as needed
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
      <h2 className="text-xl font-bold mb-4">Purchase Return</h2>
      {isLoading && !data[0] && (
        <div className="w-full h-60 flex justify-center items-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      {createForm ? (
        <PurchaseReturnFrom
          onCreate={handleCreateAdmission}
          onCancel={() => showCreateForm(false)}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
          >
            Purchase Return
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
          {/* <img className="text-red-400 font-semibold w-max mx-auto my-20" alt="No pathology's Data" src="datanotfound.avif"/> */}

            <p className="text-red-400 font-semibold w-max mx-auto my-20">
              No Purchase Return Data
            </p>
            </>
          )
        ))}
    </div>
  );
}

export default PurchaseReturn;
