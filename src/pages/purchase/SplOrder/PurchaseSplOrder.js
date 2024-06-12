import React, { useEffect, useState } from 'react';
import CreateCustomer from '../../../components/CreateCustomer';

import { db, rdb } from "../../../firebase"
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
import { Spinner, Modal, Button as BootstrapButton } from 'react-bootstrap';
import Table from '../../../components/Table';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { createData, deleteData, fetchDataFromDb, fetchDataWithMultipleWheree, updateDocWithWhere } from '../../../services';
import { useAuth } from '../../../context/AuthContext';
import { formatDateTime, formatDateTimestamp } from '../../../services/utils';
import { getDatabase, ref, onValue, onChildChanged, set, get } from 'firebase/database';
import { FiRefreshCcw } from "react-icons/fi";
import { writeToDatabase } from '../../../services/realtimeService';

function PurchaseSplOrder() {
  const { state, dispatch } = useGlobalState();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation();
  const url = location.pathname;
  const parts = url.split("/");
  const model = parts[parts.length - 1];
  const { myCollection, tenant } = useAuth();
  const collectionName = myCollection(collections.SPLORDER)
  const tenantDocRef = ref(rdb, `/TenantsDb/specialOrder`)
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [customerIdToReject, setCustomerIdToReject] = useState(null);
  const [customerCompanyToReject, setCustomerCompanyToReject] = useState(null);
  const [customerTenantId, setCustomerTenantId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusOption, setStatusOption] = useState('ALL');

  const handleStatusChange = (e) => {
    setStatusOption(e.target.value);
  }
console.log('tenant', tenant);
  const fetchData = () => {
    // if (statusOption !== 'ALL') {
    //   console.log(statusOption);
    //   const whereQuery = where("STATUS", "==", statusOption);
    //   getData([], whereQuery)
    // } else if (statusOption === 'ALL') {
      // console.log('hey');
      getData()
    // }
  }

  const openRejectModal = (tenantId, customerId, company) => {
    setCustomerIdToReject(customerId);
    setCustomerCompanyToReject(company);
    setCustomerTenantId(tenantId)
    setShowRejectModal(true);
  };

  const cancelReject = () => {
    setCustomerIdToReject(null);
    setRejectionReason('');
    setShowRejectModal(false);
  };

  const handleReject = async (customerId, company, reason) => {
    try {
      const tenantsCollection = collection(db, 'TenantsDb');
      const tenantRef = doc(tenantsCollection, customerTenantId);
      const reference = collection(tenantRef, collections.SPLORDER);
      const newData = {
        STATUS: 'REJECTED',
        Return_Message: reason
      }
      
      await updateDocWithWhere(reference, 'BILL_NO', customerId, 'COMPANY', company, newData)
        .then((res) => {
          console.log(res);
          const tenantDocRef = ref(rdb, `/TenantsDb/${customerTenantId}`)
          writeToDatabase(tenantDocRef, 'update', true).then(()=> {
            console.log('database updated');
          })
          toast.success('Order Rejected', {
            position: "top-center",
            autoClose: 600,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          getData();

        })
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const handleAcceptOrder = async (tenantId, customerId, company) => {
    try {
      const tenantsCollection = collection(db, 'TenantsDb');
      const tenantDocRef = doc(tenantsCollection, tenantId);
      const reference = collection(tenantDocRef, collections.SPLORDER);
      const newData = {
        STATUS: 'ACCEPTED',
      }
      
      await updateDocWithWhere(reference, 'BILL_NO', customerId, 'COMPANY', company, newData)
        .then((res) => {
          console.log(res);
          const tenantDocRef1 = ref(rdb, `/TenantsDb/${tenantId}`)
          writeToDatabase(tenantDocRef1, 'update', true).then(()=> {
            console.log('database updated');
          })
          toast.success('Order sucessfully Accepted', {
            position: "top-center",
            autoClose: 600,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          getData();
        })
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const openQuickViewModal = (imageData) => {
    setSelectedImageData(imageData);
    setShowQuickViewModal(true);
  };

  const closeQuickViewModal = () => {
    setShowQuickViewModal(false);
  };

  const listenForResponseChanges = () => {
    onChildChanged(tenantDocRef, (snapshot) => {
      const responseData = snapshot.val();
      if (responseData) {
          console.log('respose', responseData);
          getData()
      }
    });
  };

  useEffect(() => {
    listenForResponseChanges();
  }, []);

  useEffect(() => {
    setData([])
    setColumns(
      tableFields.SPLORDERS.map((col) => ({
        header: col.heading,
        accessorKey: col.item,
      }))
    );
    dispatch({ type: 'SYNC', payload: false })
    getData();
  }, [])
  useEffect(() => {
    setShowCreateForm(false);
  }, [model])

  useEffect(() => {
    let sort = searchParams.get("sort");
    const whereQuery = where("CUST_VEND", "==", model == 'customer' ? 'C' : 'V');
    getData(sort?.split(",").map((el) => el.split(":")))

  }, [searchParams, model])

  const getData = (sort, q) => {
    setIsLoading(true)
    const query = where("STATUS", "==", statusOption);
    if (statusOption !== 'ALL') {
      const query = where("STATUS", "==", statusOption);
      fetchDataFromDb(sort || [], query, collectionName)
      .then((servicefetch) => {
        setData(servicefetch);
        writeToDatabase(tenantDocRef, 'update', false)
        setIsLoading(false)

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false)
      });
    } else {
      fetchDataFromDb(sort || [], q || [], collectionName)
      .then((servicefetch) => {
        setData(servicefetch);
        console.log(servicefetch);
        writeToDatabase(tenantDocRef, 'update', false)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false)
      });
    }
  }

  useEffect(() => {
    if (data[0]) {
      dispatch({ type: 'SET_CUSTOMERS', payload: data });
    }
  }, [data]);

  const handleView = (data) => {
    navigate(`/purchase/special/order/${data}`)
  }

  return (
    <div className={`container p-2`}>
      <h2 className="text-xl font-bold mb-4">Purchase Spl Orders</h2>
      <div className='flex justify-between items-center h-10 mb-2'>
        <div>
          <select
            id="reportType"
            className="px-2 h-10 rounded-md drop-shadow"
            value={statusOption}
            onChange={handleStatusChange}
          >
            <option value={'ALL'}>ALL</option>
            <option value={'PENDING'}>PENDING</option>
            <option value={'ACCEPTED'}>ACCEPTED</option>
            <option value={'REJECTED'}>REJECTED</option>
          </select>
        </div>
        <Button className='mb-2 drop-shadow h-10 ' onClick={fetchData}>
          <FiRefreshCcw />
        </Button>
      </div>
      <Modal className="" show={showRejectModal} onHide={cancelReject}>
        <div className="bg-teal-800 p-2 rounded-md m-0">
          <Modal.Header className="" closeButton>
            <Modal.Title className="text-xl font-bold text-white">Confirm Reject</Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <p className="text-gray-700 text-white">Are you sure you want to reject this order?</p>
            <textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="form-control mt-2"
            />
          </Modal.Body>
          <Modal.Footer className="p-0 ">
            <div className="flex p-2 justify-between w-full m-0">
              <Button variant="light" onClick={cancelReject} className="mr-2">
                Cancel
              </Button>
              <Button variant="danger" onClick={() => {
                handleReject(customerIdToReject, customerCompanyToReject, rejectionReason);
                cancelReject();
              }}>
                Reject
              </Button>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
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
                  header: 'Company',
                  cell: (rowData) => {
                    return (<div className="flex justify-between font-semibold">
                      <td>
                        <div className='flex flex-col'>
                          <p>{rowData?.row?.original?.COMPANY}</p>
                          <div
                            onClick={() => { openQuickViewModal(rowData?.row?.original?.CIMAGEURL) }}
                            className="flex justify-between font-semibold">
                            <td> <img className='w-40 rounded' src={rowData?.row?.original?.CIMAGEURL} /> </td>
                          </div>
                        </div>
                      </td>
                    </div>)
                  }
                }, 
                ...columns,
                {
                  header: 'BILL_DATE',
                  cell: (rowData) => {
                    return (<div className="flex justify-between font-semibold">
                      <td> {formatDateTimestamp(rowData?.row?.original?.BILL_DATE)} </td>
                    </div>)
                  }
                }, {
                  header: 'Details',
                  cell: (rowData) => {
                    return (<div className="flex justify-between font-semibold">
                      <td>
                        <div className='w-40'>
                          <span>
                            <span className='font-bold font-xl text-slate-600'>CakeType : </span>{rowData?.row?.original?.CAKETYPE}
                          </span><br />
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Category : </span>{rowData?.row?.original?.CATEGORY}
                          </span><br />
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Flavour : </span>{rowData?.row?.original?.CFLAVOUR}
                          </span><br />
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Cake Message : </span>{rowData?.row?.original?.CMESSAGE}
                          </span><br />
                        </div>
                      </td>
                    </div>)
                  }
                }, {
                  header: 'Pricing and Qty',
                  cell: (rowData) => {
                    return (<div className="flex justify-between font-semibold">
                      <td>
                        <div className='w-32'>
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Weight : </span>{rowData?.row?.original?.WEIGHT}
                          </span><br />
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Peices : </span>{rowData?.row?.original?.PCS}
                          </span><br />
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Rate : </span>{rowData?.row?.original?.RATE}
                          </span><br />
                          <span>
                            <span className='font-bold font-xl text-slate-600'>Amount : </span>{rowData?.row?.original?.AMOUNT}
                          </span><br />
                        </div>
                      </td>
                    </div>)
                  }
                },
                {
                  header: 'DLVDATE',
                  cell: (rowData) => {
                    return (<div className="flex justify-between font-semibold">
                      <td> {formatDateTimestamp(rowData?.row?.original?.DLVDATE)} </td>
                    </div>)
                  }
                },
                {
                  header: 'Actions',
                  cell: (rowData) => {
                    return (
                      <div className="w-20">
                        <button onClick={() => {
                          handleAcceptOrder(
                            rowData?.row?.original?.refId,
                            rowData?.row?.original?.BILL_NO,
                            rowData?.row?.original?.COMPANY)
                        }}
                          disabled={rowData?.row?.original?.STATUS !== 'PENDING'}
                          className="btn btn-success w-full my-1" >
                          Accept
                        </button> <br />
                        <button
                          onClick={() => {
                            openRejectModal(
                              rowData?.row?.original?.refId,
                              rowData?.row?.original?.BILL_NO,
                              rowData?.row?.original?.COMPANY)}}
                          disabled={rowData?.row?.original?.STATUS !== 'PENDING'}
                          className="btn btn-danger w-full my-1" > Reject </button>
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
      <Modal show={showQuickViewModal} onHide={closeQuickViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Quick View</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImageData && (
            <img className='w-full' src={selectedImageData} alt="Product Image" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={closeQuickViewModal}>
            Close
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PurchaseSplOrder;
