import React, { useEffect, useState } from 'react';
import CreateCustomer from '../../../components/CreateCustomer';
import { db } from "../../../firebase"
import {
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  limit,
  doc,
  where
} from 'firebase/firestore';
import { FiRefreshCcw } from "react-icons/fi";
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { collections, tableFields } from '../../../config';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../../components/Table';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { createData, deleteData, deleteMultipleDocs, fetchDataFromDb } from '../../../services';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime, formatDateTimestamp } from '../../../services/utils';

function PurchaseReturn() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length -1];
  const { myCollection, getCompanyDetailsByTenantId } = useAuth();
  const collectionName = myCollection(collections.DBNOTE)
  // const [gvnGrnOption, setGvnGrnOption] = useState('GVN');
  const [statusOption, setStatusOption] = useState('ALL');
  useEffect(() => {
    setData([])
    setColumns(
      tableFields.DBNOTE.map((col) => ({
        header: col.heading,
        accessorKey: col.item,
      }))
    );
    getData();
  }, [])
   useEffect(()=>{
    setShowCreateForm(false);
   }, [model])
  useEffect(() => {
  let sort = searchParams.get("sort");
    getData(sort?.split(",").map((el) => el.split(":")))
  }, [searchParams, model])

  const getData = (sort, q) => {
    setData([])
    setIsLoading(true)
    fetchDataFromDb(sort, q, collectionName)
      .then((servicefetch) => {
        setData(servicefetch)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });
    // setIsLoading(false)

  }

const fetchData = () => {
  if (statusOption !== 'ALL') {
    console.log(statusOption);
    const whereQuery = where("REVIEWED", "==", statusOption);
    getData([], whereQuery)
  } else {
    getData([], [])
  }
}

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_CUSTOMERS', payload: data });
    }
  }, [data]);

  const handleStatusChange = (e) => {
    setStatusOption(e.target.value);
  }
//   const handleCreateCustomer = async (newCustomer) => {
//     createData(customer, newCustomer)
//       .then((servicefetch) => {
//         setShowCreateForm(false)
//         const whereQuery = where("CUST_VEND", "==", model == 'customer' ? 'C' : 'V');
//         console.log('fetch');
//         getData([], whereQuery);
//         toast.success(`${model} Customer Successfully Created`, {
//           position: "top-center",
//           autoClose: 600,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "colored",
//         });
//       })
//       .catch((error) => {
//         console.error('Error fetching customers:', error);
//       });
//   }
  const showDeleteConfirmation = (id) => {
    setCustomerIdToDelete(id);
    setShowDeleteModal(true);
  };

  // Function to cancel the delete action
  const cancelDelete = () => {
    setCustomerIdToDelete(null);
    setShowDeleteModal(false);
  };
  const handleDelete = (id) => {
    console.log(id);
    deleteMultipleDocs(myCollection(collections.DBNOTE), 'RBILL_NO', id)
    deleteMultipleDocs(myCollection(collections.PRETTERM), 'RBILL_NO', id)
    deleteMultipleDocs(myCollection(collections.PRETDET), 'RBILL_NO', id)
    .then(() => {
      console.log('hohohohohohoh');
        getData([], );
        toast.success('Purchase Return Successfully Deleted', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  };

  return (
    <div className='container p-2 '>
      <h2 className="text-xl font-bold mb-2">{model.charAt(0).toUpperCase() + model.slice(1)}s</h2>
        <div className='flex justify-between items-center h-10 mb-2'>
            {/* <select
              id="reportType"
              className="px-2 h-10 rounded-md drop-shadow"
              value={gvnGrnOption}
              onChange={(e) => {
                setGvnGrnOption(e.target.value);
              }}
            >
              <option value="GVN">GVN</option>
              <option value="GRM">GRM</option>
            </select> */}
            <div>
              <select
                id="reportType"
                className="px-2 h-10 rounded-md drop-shadow"
                value={statusOption}
                onChange={handleStatusChange}
              >
                <option value={'ALL'}>ALL</option>
                <option value={'NO'}>Not Reviewed</option>
                <option value={'YES'}>Reviewed</option>
              </select>
            </div>
          <Button className='mb-2 drop-shadow h-10 ' onClick={fetchData}> 
            <FiRefreshCcw />
          </Button>
        </div>
      {isLoading && !data[0] &&
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div>}
      {showCreateForm ? null :
        (data[0] ?
          <div className='drop-shadow'>
            <Table
            data={data}
            columns={[
              {
                header: 'BILL_DATE',
                cell: (rowData) => {
                  return (<div className="flex justify-between font-semibold">
                    <td> {formatDateTimestamp(rowData?.row?.original?.BILL_DATE)} </td>
                  </div>)
                }
              },{
                header: 'Status',
                cell: (rowData) => {
                  return (<div className="flex justify-between font-semibold">
                    <td>
                      <Button variant={rowData?.row?.original?.REVIEWED === 'YES' ? 'success' : 'warning'} className='w-20 btn-sm'>
                        {rowData?.row?.original?.REVIEWED === 'YES' ? 'Reviewed' : 'Pending'}
                      </Button>
                    </td>
                  </div>)
                }
              },
              ...columns,
              {
                header: 'Actions',
                cell: (rowData) => {
                  return (<div className="flex justify-between">
                    <button onClick={() => navigate(`/return/${rowData?.row?.original?.refId}/${rowData?.row?.original?.RBILL_NO}`)} className="btn btn-primary btn-sm" > View </button>
                    {/* <button onClick={() => handleDelete(rowData?.row?.original?.RBILL_NO)} className="btn btn-danger btn-sm" > Delete </button> */}
                  </div>)
                }
              }
            ]}
            pageLimit={10}
          />
          </div> :
          (!isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Returns</p>
            : '')
        )}
    </div>
  );
}

export default PurchaseReturn;
