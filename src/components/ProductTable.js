// ProductTable.js
import React from 'react';
import Table from 'react-bootstrap/Table';

function ProductTable({ products }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>${product.price}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ProductTable;
