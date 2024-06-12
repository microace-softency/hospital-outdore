import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatDateTimestamp } from '../services/utils';

const InvoiceHeader = ({ paymentMode, customer, time }) => {
    const { company } = useAuth()

  return (
    <div className="text-xs text-center">
      <div className="logo"></div>
      <div className="info">
        <h3 className="">{company?.CName}</h3>
      </div>
      <div id="mid" className="text-xs">
        <div className="info">
          <p className='text-lg text-slate-500 my-1'>Contact Info</p>
          <p className='my-1'>
            {company?.CAddress}<br />
            {company?.CAddress1}<br />
            Email: {company?.CEmail} <br />
            Phone: {company?.CContactNo} <br />
          </p>
          <p className='text-lg text-slate-500 my-1'>Thanks For Your Business {customer}</p>
          <p className='text-lg text-slate-600 my-1'>{time}</p>
        </div>
      </div>
      {/* Invoice Mid */}

      <div id="payment" className="text-xs">
        <p>Payment Mode: {paymentMode}</p>
      </div>
    </div>
  );
};

export default InvoiceHeader;
