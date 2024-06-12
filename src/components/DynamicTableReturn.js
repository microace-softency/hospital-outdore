import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
// import BatchModal from "./BatchModal ";


const DynamicTableReturn = () => {
  const [tableData, setTableData] = useState([
    [null, null, null, null, null, null]
  ]);
  const [productData, setProductData] = useState([]);
  // const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const[data, SetData] = useState()
  const [selectedProductDetails, setSelectedProductDetails] = useState(null); 

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  // console.log('array', productData  );
  console.log('TABLE', tableData  );
  const loadProductData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/product");
      setProductData(response.data[0]); 
    } catch (error) {
      // setError(error.message);
    }
  };

  useEffect(() => {
    loadProductData();
  }, []);

  const handleCellChange = (value, rowIndex, colIndex) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][colIndex] = value;
   console.log('value', value);
    
    if (colIndex === 1) {
      const selectedProduct = productData.find(product => product.Description === value);
      if (selectedProduct) {
        setSelectedProductDetails(selectedProduct); 
        updatedData[rowIndex][3] = selectedProduct.hsnsaccode;
        updatedData[rowIndex][4] = selectedProduct.buyrate;
        updatedData[rowIndex][6] = selectedProduct.taxcategory;
      }
    }


    if (colIndex === 2) {
      openModal();
      const productDescription = updatedData[rowIndex][1]; 
      const quantity = parseFloat(value) || 0; 
      if (productDescription && quantity >= 0) {
        const selectedProduct = productData.find(product => product.Description === productDescription);
        
        if (quantity) {
          const rate = parseFloat(selectedProduct.buyrate) || 0;
          const productTotal = quantity * rate;
          console.log('productTotal', rate);
          updatedData[rowIndex][5] = productTotal; 
          const gstRate = parseFloat(selectedProduct.taxcategory) || 0;
          const gstAmount = productTotal * gstRate / 100 ;
          console.log('gstRate', gstAmount);
          updatedData[rowIndex][7] = gstAmount; 
          updatedData[rowIndex][8] = productTotal + gstAmount; 
        }
      }
    }
    setTableData(updatedData);
  };

  const addRow = () => {
    const newEmptyRow = [null, null, null, null, null, null];
    setTableData([...tableData, newEmptyRow]);
  };
  
  
  return (
    <div style={{ overflowX: "hidden" }}>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Serial</th>
            <th>Product On Invoice</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>UOM</th>
            <th>Rate</th>
            <th>Amount</th> 
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  {colIndex === 1 ? (
                    <Form.Control
                      as="select"
                      value={cell || ""}

                      onChange={(e) =>
                        handleCellChange(e.target.value, rowIndex, colIndex)
                      }
                    >
                      <option value="">Select Product</option>
                      {productData.map((product) => (
                        <option key={product.Id} value={product.Description}>
                          {product.Description}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <Form.Control
                      type="text"
                      value={cell || ""}
                      onChange={(e) =>
                        handleCellChange(e.target.value, rowIndex, colIndex)
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="outline-primary" onClick={addRow}>
        Add Row 
      </Button>
      {/* {modalContent} */}

{/* Render BatchModal */}
{/* <BatchModal
  showModal={showModal}
  handleClose={() => setShowModal(false)}
  selectedProductDetails={selectedProductDetails}
/> */}
    </div>
  );
};

export default DynamicTableReturn;