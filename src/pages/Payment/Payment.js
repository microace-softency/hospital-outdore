import React, { useState, useEffect } from 'react';
import { Spinner, Table, Button } from 'react-bootstrap'; // Import necessary components from React Bootstrap

function Payment() {
  const [payments, setPayments] = useState([]); // State to store payment data
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]); // State to define table columns

// Sample payment data
const demoPaymentData = [
    {
      id: '1',
      patientName: 'Rajesh Kumar',
      contactPerson: 'Priya Kumar',
      phoneNumber: '9876543210',
      bedNumber: '101',
      paymentType: 'Cash',
      amount: '₹5000',
      status: 'Paid',
    },
    {
      id: '2',
      patientName: 'Anita Singh',
      contactPerson: 'Raj Singh',
      phoneNumber: '8765432109',
      bedNumber: '102',
      paymentType: 'Credit Card',
      amount: '₹7000',
      status: 'Paid',
    },
    {
      id: '3',
      patientName: 'Amit Patel',
      contactPerson: 'Neeta Patel',
      phoneNumber: '7654321098',
      bedNumber: '103',
      paymentType: 'Insurance',
      amount: '₹10000',
      status: 'Pending',
    },
    {
      id: '4',
      patientName: 'Anjali Gupta',
      contactPerson: 'Sunil Gupta',
      phoneNumber: '6543210987',
      bedNumber: '104',
      paymentType: 'Cash',
      amount: '₹6000',
      status: 'Paid',
    },
    {
      id: '5',
      patientName: 'Rahul Sharma',
      contactPerson: 'Sunita Sharma',
      phoneNumber: '5432109876',
      bedNumber: '105',
      paymentType: 'Credit Card',
      amount: '₹8500',
      status: 'Pending',
    },
    {
      id: '6',
      patientName: 'Pooja Joshi',
      contactPerson: 'Vikram Joshi',
      phoneNumber: '4321098765',
      bedNumber: '106',
      paymentType: 'Insurance',
      amount: '₹12000',
      status: 'Paid',
    },
    {
      id: '7',
      patientName: 'Ravi Verma',
      contactPerson: 'Sonia Verma',
      phoneNumber: '3210987654',
      bedNumber: '107',
      paymentType: 'Cash',
      amount: '₹4000',
      status: 'Pending',
    },
    {
      id: '8',
      patientName: 'Suman Khanna',
      contactPerson: 'Nitin Khanna',
      phoneNumber: '2109876543',
      bedNumber: '108',
      paymentType: 'Credit Card',
      amount: '₹9500',
      status: 'Paid',
    },
    // Add more payment data as needed
  ];
  

  useEffect(() => {
    // Set table columns once when the component mounts
    setColumns([
      { header: 'ID', accessorKey: 'id' },
      { header: 'Patient', accessorKey: 'patientName' },
      { header: 'Con Person', accessorKey: 'contactPerson' },
      { header: 'Phone No', accessorKey: 'phoneNumber' },
      { header: 'Bed', accessorKey: 'bedNumber' },
      { header: 'Payment Mode', accessorKey: 'paymentType' },
      { header: 'Amount', accessorKey: 'amount' },
      { header: 'Status', accessorKey: 'status' },
      // Add more columns as needed
      { header: 'Actions', accessorKey: 'actions' }, // Actions column
    ]);

    // Fetch payment data
    setIsLoading(true);
    // Simulate fetching payment data from an API
    setPayments(demoPaymentData);
    setIsLoading(false);
  }, []);

  return (
    <div className='container p-2'>
      <h2 className='text-xl font-bold mb-4'>Payments</h2>
      {isLoading && !payments[0] && (
        <div className='w-full h-60 flex justify-center items-center'>
          <Spinner animation='border' variant='secondary' />
        </div>
      )}
      <div className='flex justify-between'>
        {/* Button to trigger payment creation form */}
        <Button className='mb-2 drop-shadow'>
          Register New Payment
        </Button>
      </div>
      {/* Payment Table */}
      {!isLoading && payments[0] ? (
        <div className='drop-shadow'>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {/* Render table headers based on columns state */}
                {columns.map((column) => (
                  <th key={column.accessorKey}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Map through payment data to populate table rows */}
              {payments.map((payment) => (
                <tr key={payment.id}>
                  {/* Render table cells based on columns state */}
                  {columns.map((column) => (
                    <td key={column.accessorKey}>
                      {column.accessorKey !== 'actions' ? payment[column.accessorKey] : (
                        <Button className='w-full' variant='primary' size='sm'>
                          View
                        </Button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        !isLoading && <p className='text-red-400 font-semibold w-max mx-auto my-20'>No Payment Data</p>
      )}
    </div>
  );
}

export default Payment;
