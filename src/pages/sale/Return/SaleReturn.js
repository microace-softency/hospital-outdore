import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { collections, tableFields } from '../../../config';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../../components/Table';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { createData, deleteData, fetchDataFromDb } from '../../../services';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime, formatDateTimestamp } from '../../../services/utils';

function SalesReturn() {
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
  const collectionName = myCollection(collections.CRNOTE)

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
    // console.log(id);
    deleteData(collectionName, id)
    .then(() => {
        getData([], );
        toast.success('Sale Return Successfully Deleted', {
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
      <h2 className="text-xl font-bold mb-4">{model.charAt(0).toUpperCase() + model.slice(1)}s</h2>
        <Button className='mb-2 drop-shadow' onClick={() => navigate('/sale/return/add')}> Add </Button>
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
              },
              ...columns,
              {
                header: 'Actions',
                cell: (rowData) => {
                  return (<div className="flex justify-between">
                    <button onClick={() => navigate(`/sale/return/${rowData?.row?.original?.BILL_NO}`)} className="btn btn-primary btn-sm" > View </button>
                    <button onClick={() => handleDelete(rowData?.row?.original?.id)} className="btn btn-danger btn-sm" > Delete </button>
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

export default SalesReturn;
