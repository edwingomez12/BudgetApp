import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export const Home = () => {
  const [fileData, setFileData] = useState(null);
  const [summary, setSummary] = useState(null);

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
        const filteredData = jsonData.slice(1).filter(row => {
          const detail = row[0];
          const postingDate = row[1];
          const description = row[2];
          const amount = row[3];
          const type = row[4];
          const balance = row[5];
  
          // Return only rows that have valid category, item, and amount
          return detail && postingDate && !isNaN(parseFloat(amount));
        });
  
        const mappedData = filteredData.map(row => {
          const detail = row[0];
          const postingDate = new Date(row[1]).toISOString();
          const description = row[2];
          const amount = Math.abs(parseFloat(row[3]));
          const type = row[4];
          const balance = parseFloat(row[5]);
  
          return {
            Detail: detail,
            PostingDate: postingDate,
            Description: description,
            Amount: amount,
            Type: type,
            Balance: balance
          };
        });
  
        setFileData(mappedData);
  
        // Send the filtered and mapped data to the backend API
        sendFileDataToAPI(mappedData);
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
        setSummary(result.summary); // Set the summary from the API response

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

      {/* {fileData && (
        <div>
          <h4>Uploaded Budget Data:</h4>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )} */}

{summary && (
        <div>
          <h4>Budget Summary:</h4>
          <p>Total Money Spent: {summary.totalMoneySpent}</p>
          <p>Highest Transaction Spent: {summary.highestTransactionSpent} for {summary.highestDescription} on {summary.postingDate}</p>
          <p>Lowest Transaction Spent: {summary.lowestTransactionSpent} for {summary.lowestDescription} on {summary.postingDate}</p>
        </div>
      )}

    </div>
  );
};
