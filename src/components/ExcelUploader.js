import React, { useState } from 'react';

const ExcelUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        onUpload(data);
      };

      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <input
        type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button className='btn-primary btn' onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ExcelUploader;
