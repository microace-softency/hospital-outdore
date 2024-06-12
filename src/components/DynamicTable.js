import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
// import BatchModal from "./BatchModal ";

const DynamicTable = ({ tableData, setTableData }) => {
  // const [tableData, setTableData] = useState(initialTableData || [[]]);

  const [productData, setProductData] = useState([]);
  // const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, SetData] = useState();
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [openedModalRows, setOpenedModalRows] = useState([]);
  const quantityInputRef = useRef(null);

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
  };

  // console.log("TABLE", initialTableData[0]);
  console.log('tableData', tableData);

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

  const handleQuantityFocus = (rowIndex) => {
    const productDescription = tableData[rowIndex][1]; // Assuming product description is at colIndex 1
    const quantity = parseFloat(tableData[rowIndex][3]) || 0; // Assuming quantity is at colIndex 3

    // Check if a product is selected (productDescription is not empty) and a valid quantity is entered
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
        updatedData[rowIndex][3] = selectedProduct.hsnsaccode;
        updatedData[rowIndex][4] = selectedProduct.buyrate;
        updatedData[rowIndex][6] = selectedProduct.taxcategory;
      }
    }

    if (colIndex === 2) {
      // openModal();
      const productDescription = updatedData[rowIndex][1];
      const quantity = parseFloat(value) || 0;
      if (quantity < 0) {
        openModal();
      }
      if (productDescription && quantity >= 0) {
        const selectedProduct = productData.find(
          (product) => product.Description === productDescription
        );

        if (quantity) {
          const rate = parseFloat(selectedProduct.buyrate) || 0;
          const productTotal = quantity * rate;
          updatedData[rowIndex][5] = productTotal;
          const gstRate = parseFloat(selectedProduct.taxcategory) || 0;
          const gstAmount = (productTotal * gstRate) / 100;
          updatedData[rowIndex][7] = gstAmount;
          updatedData[rowIndex][8] = productTotal + gstAmount;
        }
      }
    }
    setTableData(updatedData);
  };

  const addRow = () => {
    const newEmptyRow = [null, null, null, null, null, null, null, null, null];
    setTableData([...tableData, newEmptyRow]);
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
    // Process the tableData (batch details) and perform save operation
    closeModal(); // Close modal after saving
  };

  return (
    <div>
      <div style={{ overflowX: "scroll" }}>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Inv No.</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>UOM</th>
              <th>Rate</th>
              <th>Product Total</th>
              <th>GST Rate</th>
              <th>GST Amount</th>
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
                        type={colIndex === 3 ? "number" : "text"}
                        value={cell || ""}
                        onChange={(e) =>
                          handleCellChange(e.target.value, rowIndex, colIndex)
                        }
                        ref={colIndex === 3 ? quantityInputRef : null}
                        onFocus={() => {
                          if (colIndex === 3) handleQuantityFocus(rowIndex);
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
      <Button variant="outline-primary" onClick={addRow}>
        Add Row
      </Button>
      <Modal size="xl" show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProductDetails
              ? `Product Code: ${selectedProductDetails.hsnsaccode}`
              : "Select Batch Numbers"}
          </Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          {selectedProductDetails && (
            <table className="table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Batch Numbers</th>
                  <th>Mfg Date</th>
                  <th>Exp Date</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {/* Render rows with input fields */}
                {Array.from({ length: 1 }).map((_, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td> {/* Auto-assigned SL Number */}
                    <td>
                      <input
                        type="text"
                        placeholder="Enter Batch Number"
                        onChange={(e) =>
                          handleInputChange(e, index, "batchNumber")
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        onChange={(e) => handleInputChange(e, index, "mfgDate")}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        onChange={(e) => handleInputChange(e, index, "expDate")}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        onChange={(e) =>
                          handleInputChange(e, index, "quantity")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!selectedProductDetails && (
            <p>Please select a product to view batch numbers.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DynamicTable;



// import React, { useEffect, useState, useRef } from "react";
// import { AgGridReact } from "@ag-grid-community/react";
// import { ModuleRegistry } from "@ag-grid-community/core";
// import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
// import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
// import { Button, Modal } from "react-bootstrap";
// import axios from "axios";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

// // Register the required modules with the Grid
// ModuleRegistry.registerModules([ClientSideRowModelModule, MasterDetailModule]);

// const DynamicTable = () => {
//   const [tableData, setTableData] = useState([
//     { serial: 1, invNo: "", product: "", quantity: "", uom: "", rate: "", productTotal: "", gstRate: "", gstAmount: "", amount: "", batchData: [] },
//   ]);
//   const [productData, setProductData] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProductDetails, setSelectedProductDetails] = useState(null);
//   const [openedModalRows, setOpenedModalRows] = useState([]);
//   const [batchTableData, setBatchTableData] = useState([{ batchNumber: "", mfgDate: "", expDate: "", quantity: "" }]);

//   const gridRef = useRef(null);

//   const loadProductData = async () => {
//     try {
//       const response = await axios.get("http://localhost:8005/api/product");
//       setProductData(response.data[0]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     loadProductData();
//   }, []);

//   const handleQuantityFocus = (rowIndex) => {
//     const productDescription = tableData[rowIndex].product;
//     const quantity = parseFloat(tableData[rowIndex].quantity) || 0;

//     if (productDescription && quantity > 0) {
//       if (!openedModalRows.includes(rowIndex)) {
//         openModal();
//         setOpenedModalRows([...openedModalRows, rowIndex]);
//       }
//     }
//   };

//   const handleCellChange = (params) => {
//     const { value, data, colDef } = params;
//     const updatedData = [...tableData];
//     const rowIndex = data.serial - 1;
//     updatedData[rowIndex][colDef.field] = value;

//     if (colDef.field === "product") {
//       const selectedProduct = productData.find((product) => product.Description === value);
//       if (selectedProduct) {
//         setSelectedProductDetails(selectedProduct);
//         updatedData[rowIndex].hsnsaccode = selectedProduct.hsnsaccode;
//         updatedData[rowIndex].rate = selectedProduct.buyrate;
//         updatedData[rowIndex].taxcategory = selectedProduct.taxcategory;
//       }
//     }

//     if (colDef.field === "quantity") {
//       const productDescription = updatedData[rowIndex].product;
//       const quantity = parseFloat(value) || 0;
//       if (quantity < 0) {
//         openModal();
//       }
//       if (productDescription && quantity >= 0) {
//         const selectedProduct = productData.find((product) => product.Description === productDescription);
//         if (selectedProduct) {
//           const rate = parseFloat(selectedProduct.buyrate) || 0;
//           const productTotal = quantity * rate;
//           updatedData[rowIndex].productTotal = productTotal;
//           const gstRate = parseFloat(selectedProduct.taxcategory) || 0;
//           const gstAmount = (productTotal * gstRate) / 100;
//           updatedData[rowIndex].gstAmount = gstAmount;
//           updatedData[rowIndex].amount = productTotal + gstAmount;
//         }
//       }
//     }
//     setTableData(updatedData);
//   };

//   const addRow = () => {
//     const newSerial = tableData.length + 1;
//     const newRow = { serial: newSerial, invNo: "", product: "", quantity: "", uom: "", rate: "", productTotal: "", gstRate: "", gstAmount: "", amount: "", batchData: [] };
//     setTableData([...tableData, newRow]);
//   };

//   const handleSave = () => {
//     console.log("Saving data:", tableData);
//     closeModal();
//   };

//   const openModal = () => setShowModal(true);

//   const closeModal = () => {
//     console.log("Closing modal...");
//     setShowModal(false);
//   };

//   const handleBatchCellChange = (params) => {
//     const { value, data, colDef } = params;
//     const updatedData = [...batchTableData];
//     const rowIndex = data.serial - 1;
//     updatedData[rowIndex][colDef.field] = value;
//     setBatchTableData(updatedData);
//   };

//   const columnDefs = [
//     { headerName: "Serial", field: "serial", editable: false },
//     { headerName: "Inv No.", field: "invNo", editable: true },
//     {
//       headerName: "Product", field: "product", editable: true,
//       cellEditor: "agSelectCellEditor",
//       cellEditorParams: {
//         values: productData.map(product => product.Description)
//       }
//     },
//     { headerName: "Quantity", field: "quantity", editable: true, onCellFocused: handleQuantityFocus },
//     { headerName: "UOM", field: "uom", editable: true },
//     { headerName: "Rate", field: "rate", editable: true },
//     { headerName: "Product Total", field: "productTotal", editable: false },
//     { headerName: "GST Rate", field: "gstRate", editable: false },
//     { headerName: "GST Amount", field: "gstAmount", editable: false },
//     { headerName: "Amount", field: "amount", editable: false },
//   ];

//   const batchColumnDefs = [
//     { headerName: "SL", field: "serial", editable: false },
//     { headerName: "Batch Numbers", field: "batchNumber", editable: true },
//     { headerName: "Mfg Date", field: "mfgDate", editable: true, cellEditor: "agDateCellEditor" },
//     { headerName: "Exp Date", field: "expDate", editable: true, cellEditor: "agDateCellEditor" },
//     { headerName: "Qty", field: "quantity", editable: true }
//   ];

//   const detailCellRendererParams = {
//     detailGridOptions: {
//       columnDefs: batchColumnDefs,
//       defaultColDef: {
//         flex: 1,
//       },
//       onCellValueChanged: handleBatchCellChange,
//       domLayout: 'autoHeight',
//     },
//     getDetailRowData: (params) => {
//       params.successCallback(params.data.batchData);
//     },
//   };

//   const gridOptions = {
//     masterDetail: true,
//     detailCellRendererParams,
//     columnDefs,
//     rowData: tableData,
//     onCellValueChanged: handleCellChange,
//   };

//   return (
//     <div>
//       <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
//         <AgGridReact
//           ref={gridRef}
//           gridOptions={gridOptions}
//           domLayout="autoHeight"
//         />
//       </div>
//       <Button variant="outline-primary" onClick={addRow}>
//         Add Row
//       </Button>
//       <Modal size="xl" show={showModal} onHide={closeModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {selectedProductDetails ? `Product Code: ${selectedProductDetails.hsnsaccode}` : "Select Batch Numbers"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedProductDetails && (
//             <div className="ag-theme-alpine" style={{ height: 200, width: "100%" }}>
//               <AgGridReact
//                 rowData={batchTableData}
//                 columnDefs={batchColumnDefs}
//                 onCellValueChanged={handleBatchCellChange}
//                 domLayout="autoHeight"
//               />
//             </div>
//           )}
//           {!selectedProductDetails && <p>Please select a product to view batch numbers.</p>}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleSave}>
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default DynamicTable;


