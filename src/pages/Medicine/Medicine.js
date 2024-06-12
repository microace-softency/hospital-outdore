// Medicine.js
import React, { useEffect, useState } from 'react';
// import CreateMedicine from '../../components/CreateMedicine';
import { where } from 'firebase/firestore';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { collections } from '../../config';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../components/Table';
import { useGlobalState } from '../../context/GlobalStateContext';
import { adminCollection, createData, deleteData } from '../../services';
import { useAuth } from '../../context/AuthContext';

function Medicine() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Medicine Name',
      accessorKey: 'NAME',
    },
    {
      header: 'Generic Name',
      accessorKey: 'GENERIC_NAME',
    },
    {
      header: 'Stock',
      accessorKey: 'STOCK',
    },
    {
      header: 'Price',
      accessorKey: 'PRICE',
    },
    // Add more columns as needed
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicineIdToDelete, setMedicineIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length - 1];
  const { myCollection } = useAuth();
  const medicineCollection = adminCollection(collections.MEDICINE); // Adjust this based on your actual collection name

  const demoMedicineData = [
    {
      id: '1',
      NAME: 'Medicine A',
      GENERIC_NAME: 'Generic A',
      STOCK: 100,
      PRICE: 10.99,
    },
    {
      id: '2',
      NAME: 'Medicine B',
      GENERIC_NAME: 'Generic B',
      STOCK: 50,
      PRICE: 5.99,
    },
    {
      id: '3',
      NAME: 'Medicine C',
      GENERIC_NAME: 'Generic C',
      STOCK: 75,
      PRICE: 7.49,
    },
    {
      id: '4',
      NAME: 'Medicine D',
      GENERIC_NAME: 'Generic D',
      STOCK: 120,
      PRICE: 12.99,
    },
    {
      id: '5',
      NAME: 'Medicine E',
      GENERIC_NAME: 'Generic E',
      STOCK: 90,
      PRICE: 8.99,
    },
    {
      id: '6',
      NAME: 'Medicine F',
      GENERIC_NAME: 'Generic F',
      STOCK: 60,
      PRICE: 6.49,
    },
    {
      id: '7',
      NAME: 'Medicine G',
      GENERIC_NAME: 'Generic G',
      STOCK: 80,
      PRICE: 9.99,
    },
    {
      id: '8',
      NAME: 'Medicine H',
      GENERIC_NAME: 'Generic H',
      STOCK: 110,
      PRICE: 11.49,
    },
    {
      id: '9',
      NAME: 'Medicine I',
      GENERIC_NAME: 'Generic I',
      STOCK: 70,
      PRICE: 7.99,
    },
    {
      id: '10',
      NAME: 'Medicine J',
      GENERIC_NAME: 'Generic J',
      STOCK: 95,
      PRICE: 10.49,
    },
    // Add more demo data as needed
  ];

  useEffect(() => {
    setData([]);
    getData();
  }, []);

  useEffect(() => {
    setShowCreateForm(false);
  }, [model]);

  useEffect(() => {
    let sort = searchParams.get("sort");
    getData(sort?.split(",").map((el) => el.split(":")), []);
  }, [searchParams, model]);

  const getData = async (sort, whereQuery) => {
    setIsLoading(true);

    // If there is no real data, use the demo data
    const fetchData = data.length ? data : demoMedicineData;

    setData(fetchData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_MEDICINE', payload: data });
    }
  }, [data]);

  const handleCreateMedicine = async (newMedicine) => {
    createData(await medicineCollection, newMedicine)
      .then(() => {
        setShowCreateForm(false);
        getData([], []);
        toast.success(`${model} Medicine Successfully Created`, {
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
        console.error('Error fetching medicine:', error);
      });
  };

  const showDeleteConfirmation = (id) => {
    setMedicineIdToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setMedicineIdToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = (id) => {
    deleteData(medicineCollection, id)
      .then(() => {
        toast.success('Medicine Successfully Deleted', {
          position: "top-center",
          autoClose: 600,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        getData([], []);
      })
      .catch((error) => {
        console.error('Error fetching medicine:', error);
      });
  };

  const handleView = (data) => {
    navigate(`/${model}/${data}`);
  };

  return (
    <div className='container p-2 '>
      <h2 className="text-xl font-bold mb-4">{model.charAt(0).toUpperCase() + model.slice(1)}s</h2>
      <Modal className="" show={showDeleteModal} onHide={cancelDelete}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <p className="text-gray-700 text-white">Are you sure you want to delete this Medicine?</p>
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button variant="light" onClick={cancelDelete} className="mr-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                handleDelete(medicineIdToDelete);
                cancelDelete();
              }}>
                Delete
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
      {showCreateForm ? (
        <div></div>
        // <CreateMedicine onCreate={handleCreateMedicine} onCancel={() => { setShowCreateForm(false) }} medicine={data} model={model}/>
      ) : (
        <div className='flex justify-between'>
          <Button className='mb-2 drop-shadow' onClick={() => setShowCreateForm(true)}> Add {model}</Button>
        </div>
      )}
      {isLoading && !data[0] && (
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
      {showCreateForm ? null : (
        data[0] ? (
          <div className='drop-shadow'>
            <Table
              data={data}
              columns={[
                ...columns,
                {
                  header: 'Actions',
                  cell: (rowData) => (
                    <div className="flex justify-between">
                      <button onClick={() => handleView(rowData?.row?.original?.id)} className="btn btn-primary btn-sm me-2" > View </button>
                      <button onClick={() => showDeleteConfirmation(rowData?.row?.original?.id)} className="btn btn-danger btn-sm" > Delete </button>
                    </div>
                  ),
                },
              ]}
              pageLimit={10}
            />
          </div>
        ) : (
          !isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Medicine Data</p> : ''
        )
      )}
    </div>
  );
}

export default Medicine;
