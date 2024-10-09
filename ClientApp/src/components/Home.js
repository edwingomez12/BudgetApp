import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export const Home = () => {
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;

        const workbook = XLSX.read(data, { type: 'binary' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFileData(jsonData);

        // Send data to the backend API
        sendFileDataToAPI(jsonData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const sendFileDataToAPI = async (data) => {
    try {
      const response = await fetch('/budget/upload', { // Relative URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send data as JSON
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Upload successful:', result);
      } else {
        console.error('Upload failed:', result);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  async function TestGreet() {
    const response = await fetch('budgetupload');
    const data = await response.json();
  }


  

  return (
    <div>
      <h3>Upload Excel File</h3>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />

      {fileData && (
        <div>
          <h4>Uploaded Budget Data:</h4>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
