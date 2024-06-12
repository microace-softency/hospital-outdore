import React from 'react';
import * as XLSX from 'xlsx';
import ExcelUploader from '../components/ExcelUploader';
import { addProductsToProductsAdmin } from '../services/specialFunctions';
import { toast } from 'react-toastify';

const ProductImport = () => {
  const handleExcelUpload = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });

    // Assume the first sheet in the Excel file contains the product data
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: '' });

    // Handle jsonData (e.g., send it to a server to update the database)
    console.log(jsonData[0]);
    try {
    addProductsToProductsAdmin(jsonData).then(()=>{
      toast.success(`Products added Successfully to ADMIN`, {
        position: "top-center",
        autoClose: 600,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    })
    } catch (error) {
      console.log('error uploading docs ->', error);
    }
  };

  return (
    <div className='container p-2'>
      <h2 className="text-xl font-bold mb-4">Product Import</h2>
      <ExcelUploader onUpload={handleExcelUpload} />
    </div>
  );
};

export default ProductImport;
