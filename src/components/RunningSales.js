import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { fetchDataWithQuery } from '../services';
import { useAuth } from '../context/AuthContext';
import { query, where } from 'firebase/firestore';

function RunningSales({ salesCollectoin }) {
  const { myCollection } = useAuth();
  const [selectedSalesType, setSelectedSalesType] = useState('Total Sales');
  const [totalSales, setTotalSales] = useState(0);

  const [ todaysTotal, setTodaysTotal] = useState('');
  const [ todaysCash, setTodaysCash] = useState('');
  const [ todaysUpi, setTodaysUpi] = useState('');
  const [ todaysCard, setTodaysCard] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to midnight for precise date comparison

  const dateQuery = where("BILL_DATE", ">=", today);
  const cashQuery = where("PAY_MODE", "==", "CASH");
  const upiQuery = where("PAY_MODE", "==", "UPI");
  const cardQuery = where("PAY_MODE", "==", "CARD");
  
  const combinedCashQuery = query(salesCollectoin, cashQuery, dateQuery);
  const combinedUpiQuery = query(salesCollectoin, upiQuery, dateQuery);
  const combinedCardQuery = query(salesCollectoin, cardQuery, dateQuery);
  const combinedQuery = query(salesCollectoin, dateQuery);



  useEffect(() => {
    fetchDataWithQuery(combinedCashQuery)
      .then((servicefetch) => {
        setTodaysCash(servicefetch?.reduce(
          (total, bill) => total + parseFloat(bill.NET_AMT),
          0
        ).toFixed(2));
      })
      .catch((error) => {
        console.error('Error fetching cash sales:', error);
      });
  
    fetchDataWithQuery(combinedUpiQuery)
      .then((servicefetch) => {
        setTodaysUpi(servicefetch?.reduce(
          (total, bill) => total + parseFloat(bill.NET_AMT),
          0
        ).toFixed(2));
      })
      .catch((error) => {
        console.error('Error fetching UPI sales:', error);
      });
  
    fetchDataWithQuery(combinedCardQuery)
      .then((servicefetch) => {
        setTodaysCard(servicefetch?.reduce(
          (total, bill) => total + parseFloat(bill.NET_AMT),
          0
        ).toFixed(2));
      })
      .catch((error) => {
        console.error('Error fetching card sales:', error);
      });
  
    fetchDataWithQuery(combinedQuery)
      .then((servicefetch) => {
        setTodaysTotal(servicefetch?.reduce(
          (total, bill) => total + parseFloat(bill.NET_AMT),
          0
        ).toFixed(2));
      })
      .catch((error) => {
        console.error('Error fetching total sales:', error);
      });
  }, []);
  

  return (
    <div className="running-sales">
      <Dropdown >
        <span className='font-bold'> Total Sales: </span><br/>
        <Dropdown.Toggle variant="success"  id="dropdown-basic">
         {}
        </Dropdown.Toggle>
        <input
            className='bg-white w-32 rounded p-2 ms-2 text-right font-semibold'
            value={todaysTotal}
            disabled
         />
        <Dropdown.Menu>
            <Dropdown.Item eventKey="Total Sales flex">
                <div className='flex justify-between w-40'>
                    <span className='font-bold'> Total Sales: </span>
                    <span className='font-semibold text-slate-500'>{todaysTotal}</span>
                </div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="Total Sales">
            <div className='flex justify-between w-40'>
                <span className='font-bold'> Cash Sales: </span>
                <span className='font-semibold text-slate-500'>{todaysCash}</span>
            </div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="Total Sales">
            <div className='flex justify-between w-40'>
                <span className='font-bold'> Card Sales: </span>
                <span className='font-semibold text-slate-500'>{todaysCard}</span>
            </div>
            </Dropdown.Item>
            <Dropdown.Item eventKey="Total Sales">
            <div className='flex justify-between w-40'>
                <span className='font-bold'> UPI Sales: </span>
                <span className='font-semibold text-slate-500'>{todaysUpi}</span>
            </div>
            </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
    </div>
  );
}

export default RunningSales;
