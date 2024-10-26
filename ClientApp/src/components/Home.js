import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Home = () => {
  const [fileData, setFileData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

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
        setFilteredTransactions(mappedData);
        sendFileDataToAPI(mappedData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (fileData) {
      const filtered = fileData.filter((transaction) =>
          transaction.Description.toLowerCase().includes(query)
      );
      setFilteredTransactions(filtered);
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

  const getSortedKeys = (summary) => {
    return Object.keys(summary).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);

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
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search for transactions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {searchQuery && filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                        <div key={index} className="col-md-6 mb-4">
                          <div className="card h-100 shadow-sm">
                            <div className="card-body">
                              <h5 className="card-title text-primary">Transaction</h5>
                              <p><strong>Detail:</strong> {transaction.Detail}</p>
                              <p><strong>Posting Date:</strong> {transaction.PostingDate}</p>
                              <p><strong>Description:</strong> {transaction.Description}</p>
                              <p><strong>Amount:</strong> ${transaction.Amount.toFixed(2)}</p>
                              <p><strong>Type:</strong> {transaction.Type}</p>
                              <p><strong>Balance:</strong> ${transaction.Balance.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                    ))
                ) : searchQuery ? (
                    <p>No transactions found.</p>
                ) : null}
              </div>
              <div className="row">
                {getSortedKeys(summary).map((key) => (
                    <div key={key} className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title text-primary">{key} (Year-Month)</h5>
                          <p><strong>Monthly Income:</strong> ${summary[key]?.monthlyIncome?.toFixed(2) || "0.00"}</p>
                          <p><strong>Total Money Spent:</strong> ${summary[key]?.totalMoneySpent?.toFixed(2) || "0.00"}</p>
                          <p><strong>Highest Transaction:</strong> ${summary[key]?.highestTransactionSpent?.toFixed(2) || "0.00"} for {summary[key]?.highestDescription || "N/A"}</p>
                          <p><strong>Second Highest Transaction:</strong> ${summary[key]?.secondHighestTransaction?.toFixed(2) || "0.00"} for {summary[key]?.secondHighestDescription || "N/A"}</p>
                          <p><strong>Third Highest Transaction:</strong> ${summary[key]?.thirdHighestTransaction?.toFixed(2) || "0.00"} for {summary[key]?.thirdHighestDescription || "N/A"}</p>
                          <p><strong>Lowest Transaction:</strong> ${summary[key]?.lowestTransactionSpent?.toFixed(2) || "0.00"} for {summary[key]?.lowestDescription || "N/A"}</p>
                          <p><strong>Credit Card Payments:</strong> ${summary[key]?.creditCardTotal?.toFixed(2) || "0.00"}</p>
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
