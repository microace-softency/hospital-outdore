import React, { useEffect, useState } from 'react';
import { query, where, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { collections } from '../../config';
import { fetchDataWithQuery } from '../../services';
import { Button, Col, Row } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

const MaterialInOutReport = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  const { myCollection } = useAuth();


  const getTotalQuantityByProduct = (dataArray) => {
    const totalQuantityMap = {};

    if (dataArray) {
        dataArray.forEach((item) => {
        const { PRODCODE, QUANTITY } = item;
        const key = PRODCODE;
        totalQuantityMap[key] = (totalQuantityMap[key] || 0) + QUANTITY;
        });
    }

    return totalQuantityMap;
  };

  const handleGetReport = () => {
    setIsLoading(true)
    fetchData().then(()=> {
        setIsLoading(false)
    }).catch(()=> {
        setIsLoading(false)
    });
  }
  const calculateOpeningQty = async (prodCode) => {
    try {
      const productQuery = query(myCollection(collections.PRODUCTS), where('PRODCODE', '==', prodCode));
      const productDocSnapshot = await fetchDataWithQuery(productQuery);
  
      if (productDocSnapshot) {
        const openingQty = productDocSnapshot[0].OPENING_Q
        const prodName = productDocSnapshot[0].DESCRIPT
        const prodDetails = {
            QTY : openingQty,
            NAME: prodName
        }
        return prodDetails;
      } else {
        console.error(`No product found with PRODCODE: ${prodCode}`);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching opening quantity:', error);
      return 0;
    }
  };
  const fetchData = async () => {
    try {
      const startDate = new Date(startDateInput).getTime();
      const endDate = new Date(endDateInput).setHours(23, 59, 59, 999);

      const soldBeforeStartQuery = query(
        myCollection(collections.BILLDET),
        where('BILL_DATE', '<', Timestamp.fromMillis(startDate))
      );
      const soldBeforeStartSnapshot = await fetchDataWithQuery(soldBeforeStartQuery);
      const soldBeforeStart = getTotalQuantityByProduct(soldBeforeStartSnapshot);

      const soldAfterStartQuery = query(
        myCollection(collections.BILLDET),
        where('BILL_DATE', '>', Timestamp.fromMillis(startDate)),
        where('BILL_DATE', '<', Timestamp.fromMillis(endDate))
      );
      const soldAfterStartSnapshot = await fetchDataWithQuery(soldAfterStartQuery);
      const soldAfterStart = getTotalQuantityByProduct(soldAfterStartSnapshot);

      const purchaseBeforeStartQuery = query(
        myCollection(collections.BLLINDET),
        where('BILL_DATE', '<', Timestamp.fromMillis(startDate))
      );
      const purchaseBeforeStartSnapshot = await fetchDataWithQuery(purchaseBeforeStartQuery);
      const purchaseBeforeStart = getTotalQuantityByProduct(purchaseBeforeStartSnapshot);

      const purchaseAfterStartQuery = query(
        myCollection(collections.BLLINDET),
        where('BILL_DATE', '>', Timestamp.fromMillis(startDate)),
        where('BILL_DATE', '<', Timestamp.fromMillis(endDate))
      );
      const purchaseAfterStartSnapshot = await fetchDataWithQuery(purchaseAfterStartQuery);
      const purchaseAfterStart = getTotalQuantityByProduct(purchaseAfterStartSnapshot);

      const returnBeforeStartQuery = query(
        myCollection(collections.PRETDET),
        where('RBILL_DATE', '<', Timestamp.fromMillis(startDate))
      );
      const returnBeforeStartSnapshot = await fetchDataWithQuery(returnBeforeStartQuery);
      const returnBeforeStart = getTotalQuantityByProduct(returnBeforeStartSnapshot);

      const returnAfterStartQuery = query(
        myCollection(collections.PRETDET),
        where('RBILL_DATE', '>', Timestamp.fromMillis(startDate)),
        where('RBILL_DATE', '<', Timestamp.fromMillis(endDate))
      );
      const returnAfterStartSnapshot = await fetchDataWithQuery(returnAfterStartQuery);
      const returnAfterStart = getTotalQuantityByProduct(returnAfterStartSnapshot);

      // Calculate opening quantity and create a new array with the desired structure
      const materialDataPromises = Object.keys(soldAfterStart).map(async(prodCode) => {
        const prodDetails = await calculateOpeningQty(prodCode);
        const opening_quanity =
          Number(prodDetails.QTY) +
          (Number(purchaseBeforeStart[prodCode]) || 0) -
          (Number(soldBeforeStart[prodCode]) || 0) -
          (Number(returnBeforeStart[prodCode]) || 0);
        const closing_quanity =
          opening_quanity +
          (Number(purchaseAfterStart[prodCode]) || 0) -
          (Number(soldAfterStart[prodCode]) || 0) -
          (Number(returnAfterStart[prodCode]) || 0);

        return {
          product_code: prodCode,
          product_name: prodDetails.NAME,
          opening_quantity: opening_quanity,
          total_quantity_purchased: Number(purchaseAfterStart[prodCode]) || 0,
          total_quantity_sold: Number(soldAfterStart[prodCode]) || 0,
          total_quantity_returned: Number(returnAfterStart[prodCode]) || 0,
          closing_qty: closing_quanity,
        };
      });
      const materialData = await Promise.all(materialDataPromises);
      console.log('data', materialData);
      setData(materialData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="container">
      <h4 className='text-teal-800'>Material In/Out </h4>
      <form className='bg-sky-300 p-2 rounded w-full shadow-lg'>
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
    {isLoading && !data[0] &&
        <div className='w-full h-60 flex justify-center items-center'>
            <Spinner animation="border" variant="secondary" />
        </div>}
    <div className='mt-4 rounded shadow-lg max-w-max overflow-x-scroll mx-auto'>
      {data[0] && 
      <table>
        <thead className="bg-white border-b border-slate-400">
          <tr>
            <th className='px-3'>ProdCode</th>
            <th className='px-3'>ProdName</th>
            <th className='px-3'>Opening</th>
            <th className='px-3'>Received</th>
            <th className='px-3'>Delivered</th>
            <th className='px-3'>Returned</th>
            <th className='px-3'>Balanece</th>
          </tr>
        </thead>
        <tbody className='bg-white font-semibold'>  
          {data.map((item, index) => (
            <tr key={item.product_code} className={index % 2 === 0 ? 'bg-sky-300' : 'bg-white'}>
              <td className='text-center px-1'>{item.product_code}</td>
              <td className='text-center px-1'>{item.product_name}</td>
              <td className='text-center px-1'>{item.opening_quantity}</td>
              <td className='text-center px-1'>{item.total_quantity_purchased}</td>
              <td className='text-center px-1'>{item.total_quantity_sold}</td>
              <td className='text-center px-1'>{item.total_quantity_returned}</td>
              <td className='text-center px-1'>{item.closing_qty}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
    </div>
  );
};

export default MaterialInOutReport;
