// Nurse.js
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Spinner, Modal } from 'react-bootstrap';
import Table from '../../components/Table';
import { useGlobalState } from '../../context/GlobalStateContext';
import { adminCollection, createData, deleteData, fetchDataFromDb } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { collections } from '../../config';

function Nurse() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
      header: 'Name',
      accessorKey: 'NAME',
    },
    {
      header: 'ID',
      accessorKey: 'ID',
    },
    {
      header: 'Ward No',
      accessorKey: 'WARD_NO',
    },
    {
      header: 'Present',
      accessorKey: 'PRESENT',
    },
    // Add more columns as needed
  ]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nurseIdToDelete, setNurseIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length - 1];
  const { myCollection } = useAuth();
  const nurseCollection = adminCollection(collections.NURSE); // Adjust this based on your actual collection name

  const demoNurseData = [
    {
      id: '1',
      NAME: 'Nurse John',
      ID: 'N001',
      WARD_NO: '001',
      PRESENT: 'Yes',
    },
    {
      id: '2',
      NAME: 'Nurse Jane',
      ID: 'N002',
      WARD_NO: '002',
      PRESENT: 'No',
    },
    {
      id: '3',
      NAME: 'Nurse Michael',
      ID: 'N003',
      WARD_NO: '003',
      PRESENT: 'Yes',
    },
    {
      id: '4',
      NAME: 'Nurse Emily',
      ID: 'N004',
      WARD_NO: '004',
      PRESENT: 'Yes',
    },
    {
      id: '5',
      NAME: 'Nurse Robert',
      ID: 'N005',
      WARD_NO: '005',
      PRESENT: 'No',
    },
    {
      id: '6',
      NAME: 'Nurse Olivia',
      ID: 'N006',
      WARD_NO: '006',
      PRESENT: 'Yes',
    },
    {
      id: '7',
      NAME: 'Nurse Daniel',
      ID: 'N007',
      WARD_NO: '007',
      PRESENT: 'No',
    },
    {
      id: '8',
      NAME: 'Nurse Sophia',
      ID: 'N008',
      WARD_NO: '008',
      PRESENT: 'Yes',
    },
    {
      id: '9',
      NAME: 'Nurse Ethan',
      ID: 'N009',
      WARD_NO: '009',
      PRESENT: 'No',
    },
    {
      id: '10',
      NAME: 'Nurse Isabella',
      ID: 'N010',
      WARD_NO: '010',
      PRESENT: 'Yes',
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
    const fetchData = data.length ? data : demoNurseData;

    setData(fetchData);
    setIsLoading(false);
  };

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_NURSES', payload: data });
    }
  }, [data]);

  const handleCreateNurse = async (newNurse) => {
    createData(await nurseCollection, newNurse)
      .then(() => {
        setShowCreateForm(false);
        getData([], []);
        toast.success(`${model} Nurse Successfully Created`, {
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
        console.error('Error fetching nurses:', error);
      });
  };

  const showDeleteConfirmation = (id) => {
    setNurseIdToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setNurseIdToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = (id) => {
    deleteData(nurseCollection, id)
      .then(() => {
        toast.success('Nurse Successfully Deleted', {
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
        console.error('Error fetching nurses:', error);
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
            <p className="text-gray-700 text-white">Are you sure you want to delete this Nurse?</p>
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button variant="light" onClick={cancelDelete} className="mr-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                handleDelete(nurseIdToDelete);
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
        // <CreateNurse onCreate={handleCreateNurse} onCancel={() => { setShowCreateForm(false) }} nurse={data} model={model}/>
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
          !isLoading ? <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Nurse Data</p> : ''
        )
      )}
    </div>
  );
}

export default Nurse;
