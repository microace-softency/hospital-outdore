import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";


const DynamicSalesTable = ({ tableData, setTableData }) => {
  const [productData, setProductData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [openedModalRows, setOpenedModalRows] = useState([]);
  const quantityInputRef = useRef(null);

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
    const productDescription = tableData[rowIndex][1]; // Assuming product description is at colIndex 1
    const quantity = parseFloat(tableData[rowIndex][3]) || 0; // Assuming quantity is at colIndex 3

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

    if (colIndex === 1) {
      const selectedProduct = productData.find(
        (product) => product.Description === value
      );
      if (selectedProduct) {
        setSelectedProductDetails(selectedProduct);
        updatedData[rowIndex][0] = selectedProduct.productcode;
        updatedData[rowIndex][3] = selectedProduct.purchesunit;
        updatedData[rowIndex][4] = selectedProduct.buyrate;
        updatedData[rowIndex][8] = selectedProduct.taxcategory;
      }
    }

    if (colIndex === 2 || colIndex === 6 || colIndex === 4) { // If quantity or discount changes
      const productDescription = updatedData[rowIndex][1];
      const quantity = parseFloat(updatedData[rowIndex][2]) || 0;
      const rate = parseFloat(updatedData[rowIndex][4]) || 0;
      const discount = parseFloat(updatedData[rowIndex][6]) || 0;

      if (productDescription && quantity >= 0) {
        const productTotal = quantity * rate;
        updatedData[rowIndex][5] = productTotal;
        const taxableAmount = productTotal - discount;
        updatedData[rowIndex][7] = taxableAmount;
        const gstRate = parseFloat(updatedData[rowIndex][8]) || 0;
        const gstAmount = (taxableAmount * gstRate) / 100;
        updatedData[rowIndex][9] = gstAmount;
        updatedData[rowIndex][10] = taxableAmount + gstAmount;
      }
    }
    setTableData(updatedData);
  };

  const addRow = () => {
    const newEmptyRow = [null, null, null, null, null, null, null, null, null, null, null];
    setTableData([...tableData, newEmptyRow]);
  };

  const deleteRow = (rowIndex) => {
    const updatedData = [...tableData];
    updatedData.splice(rowIndex, 1);
    setTableData(updatedData);
  };

  const handleInputChange = (e, rowIndex, columnName) => {
    const updatedData = [...tableData];
    const value = e.target.value;

    updatedData[rowIndex][getColumnIndex(columnName)] = value;
    setTableData(updatedData);
  };

  const getColumnIndex = (columnName) => {
    switch (columnName) {
      case "batchNumber":
        return 1;
      case "mfgDate":
        return 2;
      case "expDate":
        return 3;
      case "quantity":
        return 4;
      default:
        return -1;
    }
  };

  const handleSave = () => {
    closeModal();
  };

  const calculateTotals = () => {
    let productTotal = 0;
    let gstTotal = 0;
    let amountTotal = 0;

    tableData.forEach(row => {
      productTotal += parseFloat(row[7]) || 0;
      gstTotal += parseFloat(row[9]) || 0;
      amountTotal += parseFloat(row[10]) || 0;
    });

    return { productTotal, gstTotal, amountTotal };
  };

  const totals = calculateTotals();

  return (
    <div>
      <div style={{ overflowX: "scroll" }}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Product Code</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Rate</th>
              <th>Product Total</th>
              <th>Discount</th>
              <th>Taxable Amount</th>
              <th>GST Rate</th>
              <th>GST Amount</th>
              <th>Amount</th>
              <th>Action</th>
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
                        type={colIndex === 3 ? "" : "text"}
                        value={cell || ""}
                        onChange={(e) =>
                          handleCellChange(e.target.value, rowIndex, colIndex)
                        }
                        ref={colIndex === 3 ? quantityInputRef : null}
                        onFocus={() => {
                          if (colIndex === 3) handleQuantityFocus(rowIndex);
                        }}
                      />
                    )
                    }
                  </td>
                ))}
                <td>
                  <Button variant="danger" onClick={() => deleteRow(rowIndex)}><MdDelete/></Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}><strong>Totals</strong></td>
              <td><strong>{totals.productTotal.toFixed(2)}</strong></td>
              <td></td>
              <td><strong>{totals.gstTotal.toFixed(2)}</strong></td>
              <td><strong>{totals.amountTotal.toFixed(2)}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </div>
      <Button variant="outline-primary"className="mt-2" onClick={addRow}>
        <IoAdd/>
      </Button>
    </div>
  );
};

export default DynamicSalesTable;
