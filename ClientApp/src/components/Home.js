import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add Bootstrap for easy styling

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

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        
        const filteredData = jsonData.slice(1).filter(row => {
          const detail = row[0];
          const postingDate = row[1];
          const description = row[2];
          const amount = row[3];
          const type = row[4];
          const balance = parseFloat(row[5]) || 0; 
  
          return detail && postingDate && !isNaN(parseFloat(amount));
        });
  
        const mappedData = filteredData.map(row => {
          const detail = row[0];
          const postingDate = new Date(row[1]).toISOString();
          const description = row[2];
          const amount = Math.abs(parseFloat(row[3]));
          const type = row[4];
          const balance = parseFloat(row[5]) || 0; 
  
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
        sendFileDataToAPI(mappedData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const sendFileDataToAPI = async (data) => {
    try {
      const response = await fetch('/budget/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Upload successful:', result);
        setSummary(result.summary);
      } else {
        console.error('Upload failed:', result);
      }
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  // Sorting the keys by year and month in descending order
  const getSortedKeys = (summary) => {
    return Object.keys(summary).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);
      
      // First sort by year in descending order, then by month
      return yearB - yearA || monthB - monthA;
    });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h3 className="mb-3">Upload Excel File</h3>
        <input
          type="file"
          className="form-control"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>

      {summary && (
        <div className="mt-5">
          <h4 className="text-center mb-4">Budget Summary by Month</h4>
          <div className="row">
          {getSortedKeys(summary).map((key) => (
              <div key={key} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{key} (Year-Month)</h5>
                    <p><strong>Monthly Income:</strong> ${summary[key].monthlyIncome.toFixed(2)}</p>
                    <p><strong>Total Money Spent:</strong> ${summary[key].totalMoneySpent.toFixed(2)}</p>
                    <p><strong>Highest Transaction:</strong> ${summary[key].highestTransactionSpent.toFixed(2)} for {summary[key].highestDescription}</p>
                    <p><strong>Second Highest Transaction:</strong> ${summary[key].secondHighestTransaction.toFixed(2)} for {summary[key].secondHighestDescription}</p>
                    <p><strong>Third Highest Transaction:</strong> ${summary[key].thirdHighestTransaction.toFixed(2)} for {summary[key].thirdHighestDescription}</p>
                    <p><strong>Lowest Transaction:</strong> ${summary[key].lowestTransactionSpent.toFixed(2)} for {summary[key].lowestDescription}</p>
                    <p><strong>Credit Card Payments:</strong> ${summary[key].creditCardTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
