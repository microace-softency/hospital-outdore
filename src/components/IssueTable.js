import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";

const IssueTable = ({ tableData, setTableData }) => {
  const [productData, setProductData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [openedModalRows, setOpenedModalRows] = useState([]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const loadProductData = async () => {
    try {
      const response = await axios.get("http://localhost:8005/api/product");
      setProductData(response.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProductData();
  }, []);

  const handleQuantityFocus = (rowIndex) => {
    const productDescription = tableData[rowIndex][1];
    const quantity = parseFloat(tableData[rowIndex][2]) || 0;

    if (productDescription && quantity > 0) {
      if (!openedModalRows.includes(rowIndex)) {
        openModal();
        setOpenedModalRows([...openedModalRows, rowIndex]);
      }
    }
  };

  const handleCellChange = (value, rowIndex, colIndex) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][colIndex] = value;
    setTableData(updatedData);
  };

  const addRow = () => {
    const newEmptyRow = [null, null, null, null];
    setTableData([...tableData, newEmptyRow]);
  };

  return (
    <div>
      <div style={{ overflowX: "scroll" }}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Add Description</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    {colIndex === 0 ? (
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
                        onFocus={() => {
                          if (colIndex === 2) handleQuantityFocus(rowIndex);
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button
        variant="outline-primary"
        style={{ marginLeft: "95%" }}
        onClick={addRow}
      >
        +
      </Button>
    </div>
  );
};

export default IssueTable;
