import React, { useState , useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';

function CreateProduct({ onCreate, onCancel, products }) {
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productGroup, setProductGroup] = useState('');
  const [productUOM, setProductUOM] = useState('');
  const [productRate, setProductRate] = useState('');

  const handleProductCodeChange = (e) => {
    setProductCode(e.target.value);
  };
  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };
  const handleProductGroupChange = (e) => {
    setProductGroup(e.target.value);
  };
  const handleProductUOMChange = (e) => {
    setProductUOM(e.target.value);
  };
  const handleProductRateChange = (e) => {
    setProductRate(e.target.value);
  };

  useEffect(() => {
    const existingProductCodes = products.map((product) => product.code);
    const maxProductCode = Math.max(...existingProductCodes, 0);                
    const nextCode = (1 + maxProductCode).toString();
    setProductCode(nextCode)
  }, [products]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a product object
    const productData = {
      code: productCode,
      name: productName,
      group: productGroup,
      uom: productUOM,
      rate: productRate,
    };

    // Call the onCreate function passed from the parent component
    onCreate(productData);

    // Clear the form inputs
    setProductCode('');
    setProductName('');
    setProductGroup('');
    setProductUOM('');
    setProductRate('');
  };

  return (
    <div className='bg-sky-300 p-4 drop-shadow rounded-xl'>
      <h2 className="text-xl font-semibold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col sm={6} className="mb-4">
            <label htmlFor="productCode" className="block text-gray-700 font-medium">
              Product Code:
            </label>
            <input
              type="text"
              id="productCode"
              value={productCode}
              disabled
              className="w-max px-4 py-2 border-2 rounded-md bg-gray-100 font-bold text-gray-500"
            />
          </Col>
          <Col sm={12} className="mb-4">
            <label htmlFor="productName" className="block text-gray-700 font-medium">
              Name:
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={handleProductNameChange}
              className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col className="mb-4">
            <label htmlFor="productGroup" className="block text-gray-700 font-medium">
              Group:
            </label>
            <input
              type="text"
              id="productGroup"
              value={productGroup}
              onChange={handleProductGroupChange}
              className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </Col>
          <Col className="mb-4">
            <label htmlFor="productUOM" className="block text-gray-700 font-medium">
              UOM:
            </label>
            <input
              type="text"
              id="productUOM"
              value={productUOM}
              onChange={handleProductUOMChange}
              className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </Col>
        </Row>
        <Row>
          <Col className="mb-4">
            <label htmlFor="productRate" className="block text-gray-700 font-medium">
              Rate:
            </label>
            <input
              type="text"
              id="productRate"
              value={productRate}
              onChange={handleProductRateChange}
              className="w-full px-4 py-2 border-2 rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </Col>
        </Row>
        <div className='flex justify-content-between'>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
