import React, { useState } from "react";
import "./RecentTripTable.css";

const Table = () => {
  // Sample Data
  const [data, setData] = useState([
    { id: 1, fn: "John", ln: "Doe", age: 25, address: "123 Main St", createdAt: "2023-11-01" },
    { id: 2, fn: "Jane", ln: "Smith", age: 30, address: "456 Maple Ave", createdAt: "2023-11-02" },
    { id: 3, fn: "Alice", ln: "Johnson", age: 28, address: "789 Pine Rd", createdAt: "2023-11-03" },
    { id: 4, fn: "Bob", ln: "Brown", age: 35, address: "321 Oak St", createdAt: "2023-11-04" },
    { id: 5, fn: "Emily", ln: "Davis", age: 22, address: "654 Elm St", createdAt: "2023-11-05" },
    { id: 6, fn: "Michael", ln: "Taylor", age: 40, address: "987 Cedar Ln", createdAt: "2023-11-06" },
    { id: 7, fn: "Sara", ln: "Wilson", age: 27, address: "432 Birch Ave", createdAt: "2023-11-07" },
    { id: 8, fn: "David", ln: "White", age: 45, address: "876 Walnut St", createdAt: "2023-11-08" },
    { id: 9, fn: "Anna", ln: "Moore", age: 33, address: "219 Spruce Blvd", createdAt: "2023-11-09" },
    { id: 10, fn: "James", ln: "Hall", age: 38, address: "556 Poplar Ct", createdAt: "2023-11-10" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  return (
    <div className="table-container">
      <h2>Drivers List</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.fn}</td>
              <td>{row.ln}</td>
              <td>{row.age}</td>
              <td>{row.address}</td>
              <td>{row.createdAt}</td>
              <td>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
