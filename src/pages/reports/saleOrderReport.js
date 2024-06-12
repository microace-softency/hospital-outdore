import React, { useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';

import { useAuth } from '../../context/AuthContext';
import { collections } from '../../config';

import CustProdDetail from '../../components/CustProdDetail';
import { fetchAndMapWithQueries } from './reportServices';

function SaleOrderReport() {
  const [startDate, setStartDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subGroupMenu, setSubGroupMenu] = useState(false);
  const [subGroupArray, setSubgroupsArray] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState('ALL');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [selectedModalOption, setSelectedModalOption] = useState('Customer');
  const [selectedPaymentType, setSelectedPaymentType] = useState('All');
  const { myCollection } = useAuth();
  const collection1 = myCollection(collections.ORDER)
  const collection2 = myCollection(collections.ORDERDET)
  const FDATE = 'OA_DATE'
  const FNUMBER = 'OA_NO'
  const handleGetReport = async () => {
    setReportData([])
    setIsLoading(true)

    await fetchAndMapWithQueries(
      collection1,
      collection2,
      startDate,
      endDate,
      selectedPaymentType,
      selectedSubgroup,
      setSubgroupsArray,
      FDATE,
      FNUMBER
    )
      .then((resData) => {
        setReportData(resData)
        setIsLoading(false)
        setSubGroupMenu(true)
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false)
      })
  };

  return (
    <div className="container">
      <h4 className='text-teal-800'>Sale Order Register</h4>
      <form className='bg-sky-300 p-2 rounded w-full drop-shadow'>
        <Row className='my-1'>
          <Col className='py-2'>
            <label htmlFor="startDate" className='font-semibold'>Start Date:</label><br />
            <input
              type="date"
              id="startDate"
              className='px-2 rounded-md drop-shadow'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>
          <Col className='py-2'>
            <label htmlFor="endDate" className='font-semibold'>End Date:</label><br />
            <input
              type="date"
              id="endDate"
              className='px-2 rounded-md drop-shadow'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>
          <Col className='py-2'>
            <label htmlFor="reportType" className="font-semibold">
              Report Type:
            </label><br />
            <select
              id="reportType"
              className="px-2 rounded-md drop-shadow"
              value={selectedModalOption}
              onChange={(e) => {
                setSelectedModalOption(e.target.value);
              }}
            >
              <option value="Customer">Customer</option>
              <option value="Product">Product</option>
            </select>
          </Col>
          {subGroupMenu && (
            <Col className='py-2'>
              <label htmlFor="subgroup" className="font-semibold">
                Select Subgroup:
              </label><br />
              <select
                id="subgroup"
                className="px-2 rounded-md drop-shadow"
                value={selectedSubgroup}
                onChange={(e) => setSelectedSubgroup(e.target.value)}
              >
                <option key="" value="ALL">
                  All
                </option>
                {subGroupArray.map((subgroup, i) => (
                  <option key={i} value={subgroup}>
                    {subgroup}
                  </option>
                ))}
              </select>
            </Col>
          )}
          <Col className='py-3'>
            <Button
              className='w-full drop-shadow'
              type="button"
              disabled={!startDate || !endDate}
              onClick={handleGetReport}
            >
              Apply
            </Button>
          </Col>
        </Row>

      </form>
      {isLoading &&
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation="border" variant="secondary" />
        </div>}
      {reportData[0] ? (
        <div className='w-full rounded overflow-hidden my-4 overflow-x-scroll text-xs drop-shadow'>
          <CustProdDetail totalReportData={reportData} FDATE={FDATE} FNUMBER={FNUMBER} />
        </div>
      ) : (
        (startDate || endDate &&
          <div>
            <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Customer Data</p>
          </div>)
      )}
    </div>
  );
}

export default SaleOrderReport;
