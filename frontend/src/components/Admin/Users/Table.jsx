import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import "./Table.css";

const Table = ({ apiRoute, name }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null); // To handle row details & updates
  const [isAdding, setIsAdding] = useState(false); // Toggle add form
  const [newUser, setNewUser] = useState({ fn: "", ln: "", age: "", address: "" });
  const rowsPerPage = 5;

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(apiRoute);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // CRUD: Add new user
  const handleAdd = async () => {
    try {
      const response = await axiosInstance.post(apiRoute, newUser);
      setData((prevData) => [...prevData, response.data]);
      setIsAdding(false);
      setNewUser({ fn: "", ln: "", age: "", address: "" });
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  // CRUD: Update user
  const handleUpdate = async (id, updatedUser) => {
    try {
      const response = await axiosInstance.put(`${apiRoute}/${id}`, updatedUser);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? response.data : item))
      );
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  // CRUD: Delete user
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiRoute}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  // Pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    fetchData();
  }, [apiRoute]);

  return (
    <div className="table-container">
      <h2>{name} Table</h2>
      {/* Add New User */}
      <button className="add-button" onClick={() => setIsAdding(true)}>+ Add User</button>
      {isAdding && (
        <div className="add-form">
          <input
            type="text"
            placeholder="First Name"
            value={newUser.fn}
            onChange={(e) => setNewUser({ ...newUser, fn: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newUser.ln}
            onChange={(e) => setNewUser({ ...newUser, ln: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={newUser.address}
            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          />
          <button onClick={handleAdd}>Save</button>
          <button onClick={() => setIsAdding(false)}>Cancel</button>
        </div>
      )}

      {/* Data Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr
              key={row.id}
              onClick={() => setSelectedRow(selectedRow?.id === row.id ? null : row)}
            >
              <td>{row.id}</td>
              <td>{row.fn}</td>
              <td>{row.ln}</td>
              <td>{row.age}</td>
              <td>{row.address}</td>
              <td>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row.id);
                }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Row Details / Update */}
      {selectedRow && (
        <div className="row-details">
          <h3>Edit User</h3>
          <input
            type="text"
            value={selectedRow.fn}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, fn: e.target.value })
            }
          />
          <input
            type="text"
            value={selectedRow.ln}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, ln: e.target.value })
            }
          />
          <input
            type="number"
            value={selectedRow.age}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, age: e.target.value })
            }
          />
          <input
            type="text"
            value={selectedRow.address}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, address: e.target.value })
            }
          />
          <button
            onClick={() => handleUpdate(selectedRow.id, selectedRow)}
          >
            Save
          </button>
          <button onClick={() => setSelectedRow(null)}>Cancel</button>
        </div>
      )}

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
