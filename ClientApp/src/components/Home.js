import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Using "export const" for the component
export const Home = () => {
  const [fileData, setFileData] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // Ensure a file is selected
    if (file) {
      const reader = new FileReader();

      // Read the Excel file as a binary string
      reader.onload = (e) => {
        const data = e.target.result;

        // Parse the file using xlsx library
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get the first sheet and read its content
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert the sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData);  // Log the Excel data to the console

        setFileData(jsonData); // Optionally, you can store the data in a state
      };

      reader.readAsBinaryString(file);
    }
  };

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
