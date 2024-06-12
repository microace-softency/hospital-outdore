import React, { useEffect, useState } from 'react';
import { query, where, Timestamp, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { collections } from '../../config';
import { Button, Col, Row } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

const PurchaseReturnReport = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [returnType, setReturnType] = useState('ALL');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  const { myCollection } = useAuth();

  const handleGetReport = async () => {
    try {
      const startDateTimestamp = new Date(startDateInput).getTime();
      const endDateTimestamp = new Date(endDateInput).setHours(23, 59, 59, 999);
      const snapshotCash = query(
        myCollection(collections.PRETDET),
        where('RBILL_DATE', '>=', Timestamp.fromMillis(startDateTimestamp)),
        where('RBILL_DATE', '<=', Timestamp.fromMillis(endDateTimestamp)),
        where('SretType', '==', returnType)
      );
      const snapshot = query(
        myCollection(collections.PRETDET),
        where('RBILL_DATE', '>=', Timestamp.fromMillis(startDateTimestamp)),
        where('RBILL_DATE', '<=', Timestamp.fromMillis(endDateTimestamp)),
      );

      const fetchBillData = await getDocs(returnType !== 'ALL' ? snapshotCash : snapshot);

      const billData = fetchBillData.docs.map((doc) => doc.data());
      console.log('billData', billData);
      setData(billData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container w-max">
      <h4 className='text-teal-800'>Purchase Return Report </h4>
      <form className='bg-sky-300 p-2 w-full rounded shadow-lg'>
        <Row>
          <Col className='py-2'>
            <label htmlFor="startDateInput" className='font-semibold'>Start Date:</label><br />
            <input
              type="date"
              id="startDateInput"
              className='px-2 rounded-md drop-shadow'
              value={startDateInput}
              onChange={(e) => setStartDateInput(e.target.value)}
            />
          </Col>
          <Col className='py-2'>
            <label htmlFor="endDateInput" className='font-semibold'>End Date:</label><br />
            <input
              type="date"
              id="endDateInput"
              className='px-2 rounded-md drop-shadow'
              value={endDateInput}
              onChange={(e) => setEndDateInput(e.target.value)}
            />
          </Col>
          <Col className='py-2'>
            <label htmlFor="returnType" className="font-semibold">
              Return Type:
            </label><br />
            <select
              id="returnType"
              className="px-2 rounded-md drop-shadow"
              value={returnType}
              onChange={(e) => {
                setReturnType(e.target.value);
              }}
            >
              <option value="ALL">ALL</option>
              <option value="GVN">GVN</option>
              <option value="GRM">GRM</option>
            </select>
          </Col>
          <Col className='py-3'>
            <Button
              className='w-full drop-shadow'
              type="button"
              disabled={!startDateInput || !endDateInput}
              onClick={handleGetReport}
            >
              Apply
            </Button>
          </Col>
        </Row>
      </form>
      <div className='mt-4 rounded shadow-lg max-w-max overflow-x-scroll mx-auto'>
        {isLoading && !data[0] &&
          <div className='w-full h-60 flex justify-center items-center'>
            <Spinner animation="border" variant="secondary" />
          </div>}
        {data[0] &&
          <table className='w-full'>
            <thead className="bg-white border-b border-slate-400">
              <tr>
                <th className='px-3'>SR</th>
                <th className='px-3'>CR. No</th>
                <th className='px-3'>Date</th>
                <th className='px-3'>Bill No</th>
                <th className='px-3'>Bill Date</th>
                <th className='px-3'>Return Qty</th>
                <th className='px-3'>Status</th>
                <th className='px-3'>Accept Qty</th>
                <th className='px-3'>Remarks</th>
              </tr>
            </thead>
            <tbody className='bg-white font-semibold text-slate-700'>
              {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-sky-300' : 'bg-white'}>
                  <td className='text-center p-2'>{index + 1}</td>
                  <td className='text-center p-2'>{item.RBILL_NO}</td>
                  <td className='text-center p-2'>{item.RBILL_DATE.toDate().toLocaleDateString()}</td>
                  <td className='text-center p-2'>{item.BILL_NO}</td>
                  <td className='text-center p-2'>{item.BILL_DATE.toDate().toLocaleDateString()}</td>
                  <td className='text-center p-2'>{item.QUANTITY}</td>
                  <td className='text-center p-2'>
                    <span className='bg-yellow-600 p-1 text-xs rounded text-white'>PENDING</span>
                  </td>
                  <td className='text-center p-2'>{/* Add logic for Accept Qty */}</td>
                  <td className='text-center p-2'>{item.RETREAS || 'NA'}</td>
                </tr>
              ))}
            </tbody>
          </table>}
      </div>

    </div>
  );
};

export default PurchaseReturnReport;
