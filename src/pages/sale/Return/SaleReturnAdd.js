import React, { useState, useEffect } from 'react';
import AddProduct from '../../../components/AddProduct';
import AddCustomer from '../../../components/AddCustomer';
import { useGlobalState } from '../../../context/GlobalStateContext';
import { fetchDataFromDb } from '../../../services';
import { collections, tableFields } from '../../../config';
import { Spinner } from 'react-bootstrap';
import FetchPurchaseBillDataViewer from '../../../components/FetchPurchaseBillData';

function SaleReturnAdd () {
  const { state } = useGlobalState();

  return (
    <div className="container p-2">
      <h2 className="text-xl font-bold mx-2">Purchase Return Entry</h2>
        <FetchPurchaseBillDataViewer />
    </div>
  );
}
export default SaleReturnAdd;
