import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { Spinner } from "react-bootstrap";
import Table from "../../components/Table";
import { useGlobalState } from "../../context/GlobalStateContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import GrowExample from '../../components/spiner/GrowExample';
import SalesFrom from "../../components/SalesFrom";

// import CreateAdmissionForm from '../../components/CreateAdmission'; // Assuming you have a CreateAdmissionForm component

function Sales() {
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
      const response = await axios.get("http://localhost:8005/api/sales");
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
      window.confirm("Are you sure that you wanted to delete that Sales ?")
    ) {
      axios.delete(`http://localhost:8005/api/sales/salesremove/${id}`);
      toast.success(" Delete Successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  useEffect(() => {
    setColumns([
      {
        header: "Bill No.",
        accessorKey: "billNo",
      },
      {
        header: "Bill Date",
        accessorKey: "billDate",
      },
      {
        header: "Customer Code",
        accessorKey: "custCode",
      },
      {
        header: "Customer Name",
        accessorKey: "custName",
      },
      {
        header: "Payment Mode",
        accessorKey: "paymentMode",
      },
      {
        header: "Advance Payment",
        accessorKey: "advancePayment",
      },
      {
        header: "Due Payment",
        accessorKey: "duePayment",
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
  }, []);

  const handleCreateAdmission = () => {
    console.log("create admission");
  };

  const handleViewAdmission = (id) => {
    navigate(`/sales/${id}`);
  };

  return (
    <div className="container p-2 ">
      {/* <h2 className="text-xl font-bold mb-4">Sales</h2> */}
      {createForm ? (
        <SalesFrom
          onCreate={handleCreateAdmission}
          onCancel={() => showCreateForm(false)}
        />
      ) : (
        <div className="flex justify-between">
          <Button
            className="mb-2 drop-shadow"
            onClick={() => showCreateForm(true)}
          >
            Sales Bill
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
                No Sales Data
              </p>
            </>
          )
        ))}
    </div>
  );
}

export default Sales;
