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

function SaleOrder() {
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
  const { myCollection } = useAuth();
  const collectionName = myCollection(collections.ORDER)

  useEffect(() => {
    dispatch({type: 'SYNC', payload: false})
    setData([])
    setColumns(
      tableFields.ORDERS.map((col) => ({
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
    const whereQuery = where("CUST_VEND", "==", model == 'customer' ? 'C' : 'V');
      getData(sort?.split(",").map((el) => el.split(":")))

  }, [searchParams, model])

  const getData = (sort) => {
    setIsLoading(true)
    
    fetchDataFromDb(sort,[], collectionName)
      .then((servicefetch) => {
        setData(servicefetch);
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
        setIsLoading(false)
      });
  }

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_CUSTOMERS', payload: data });
    }
  }, [data]);

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
    deleteMultipleDocs(myCollection(collections.ORDER), 'OA_NO', id)
    deleteMultipleDocs(myCollection(collections.ORDERTERM), 'OA_NO', id)
    deleteMultipleDocs(myCollection(collections.ORDERDET), 'OA_NO', id)
    .then(() => {
        getData([]);
        toast.success('Customer Successfully Deleted', {
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
  const handleView = (data) => {
    navigate(`/sale/${model}/${data}`)
  }

  return (
    <div className='container p-2 '>
      <h2 className="text-xl font-bold mb-4">Sale Orders</h2>
      <Modal className="" show={showDeleteModal} onHide={cancelDelete}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <p className="text-gray-700 text-white">Are you sure you want to delete this Customer?</p>
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button variant="light" onClick={cancelDelete} className="mr-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                handleDelete(customerIdToDelete);
                cancelDelete();
              }}>
                Delete
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
        <Button className='mb-2 drop-shadow' onClick={() => navigate('/sale/order/add')}> Add </Button>
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
                header: 'OA_DATE',
                cell: (rowData) => {
                  return (<div className="flex justify-between font-semibold">
                    <td> {formatDateTimestamp(rowData?.row?.original?.OA_DATE)} </td>
                  </div>)
                }
              },
              ...columns,
              {
                header: 'Actions',
                cell: (rowData) => {
                  return (<div className="flex justify-between">
                    <button onClick={() => handleView(rowData?.row?.original?.OA_NO)} className="btn btn-primary btn-sm me-2" > View </button>
                    <button onClick={() => showDeleteConfirmation(rowData?.row?.original?.OA_NO)} className="btn btn-danger btn-sm" > Delete </button>
                  </div>)
                }
              }
            ]}
            pageLimit={10}
          />
          </div> :
          (!isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Customer Data</p>
            : '')
        )}
    </div>
  );
}

export default SaleOrder;
