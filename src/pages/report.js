import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import the Link component from React Router

function ReportPage() {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto p-4">
        <p className='font-bold my-4 text-xl'>Reports</p>
      {/* Add buttons for different reports */}
      <div
      onClick={()=> navigate('/sale/register/report')}
      className='bg-teal-700 hover:bg-teal-600 shadow px-4 my-2 sm:w-full md:w-max rounded-xl cursor-pointer'>
        <p className='font-bold text-xl py-2 text-white'>Sale Register Report</p>
      </div>
    </div>
  );
}

export default ReportPage;
