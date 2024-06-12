// BillsTableModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Table from './Table'; // Import your Table component
import { useAuth } from '../context/AuthContext';
import { collections, tableFields } from '../config';
import { fetchDataFromDb } from '../services';
import { formatDateTimestamp } from '../services/utils';
import { useSearchParams } from 'react-router-dom';


const BillsTableModal = ({ show, onClose, onDataSelect }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const { myCollection } = useAuth();
  const collectionRef = myCollection(collections.BILLIN);
  const [searchParams, setSearchParams] = useSearchParams()

  const fetchdata = async(s) => {
    setIsLoading(true);
    fetchDataFromDb(s, [], collectionRef)
    .then((fetchedData) => {
      setData(fetchedData);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    let sort = searchParams.get("sort");
    if (sort) {
      fetchdata(sort.split(",").map((el) => el.split(":")))
    }
  }, [searchParams]);
  
  useEffect(() => {
    setColumns(
      tableFields.BILLINS.map((col) => ({
        header: col.heading,
        accessorKey: col.item,
      }))
    );
    // Fetch data when the modal is opened
    if (show) {
      fetchdata()
    }
  }, [show]);


  return (
    <Modal 
    size='xl'
    show={show}
    onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Help For Bills</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && !data[0] ? (
          <div className='w-full h-60 flex justify-center items-center'>
            <Spinner animation="border" variant="secondary" />
          </div>
        ) : (
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
                      <button onClick={() => onDataSelect(rowData?.row?.original?.BILL_NO)} className="btn btn-primary btn-sm me-2" > Return </button>
                    </div>)
                  }
                }
              ]}
              pageLimit={10}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BillsTableModal;
