import React from 'react';
import Table from 'react-bootstrap/Table';

function CustomerTable({ customers }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th>GST Number</th>
        </tr>
      </thead>
      <tbody>
        {customers && customers.map((customer, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{customer.name}</td>
            <td>{customer.phone}</td>
            <td>{customer.gstNumber}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default CustomerTable;
