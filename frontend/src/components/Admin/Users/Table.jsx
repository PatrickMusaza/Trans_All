import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import "./Table.css";

const Table = ({ apiRoute, name }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null); // Handle row details & updates
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Toggle drawer visibility
  const [drawerType, setDrawerType] = useState(""); // 'add' or 'edit'
  const [drawerState, setDrawerState] = useState({ isOpen: false, mode: "", rowData: {} });
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
      closeDrawer();
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
      closeDrawer();
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

  const openDrawer = (type, row = null) => {
    setDrawerType(type);
    if (type === "edit" && row) {
      setSelectedRow(row);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerType("");
    setNewUser({ fn: "", ln: "", age: "", address: "" });
    setSelectedRow(null);
  };

  useEffect(() => {
    fetchData();
  }, [apiRoute]);
  // CRUD Operations
  const handleSave = async () => {
    try {
      if (drawerState.mode === "add") {
        const response = await axiosInstance.post(apiRoute, drawerState.rowData);
        setData((prev) => [...prev, response.data]);
      } else if (drawerState.mode === "edit") {
        const response = await axiosInstance.put(`${apiRoute}/${drawerState.rowData.id}`, drawerState.rowData);
        setData((prev) =>
          prev.map((item) => (item.id === drawerState.rowData.id ? response.data : item))
        );
      }
      closeDrawer();
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <div className="table-container">
      <h2>{name} Table</h2>
      <button className="add-button" onClick={() => openDrawer("add")}>
        + Add User
      </button>

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
            <tr key={row.id} onClick={() => openDrawer("edit", row)}>
              <td>{row.id}</td>
              <td>{row.fn}</td>
              <td>{row.ln}</td>
              <td>{row.age}</td>
              <td>{row.address}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(row.id);
                  }}
                >
                  Delete
                </button>
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

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="drawer">
          <div className="drawer-content">
            <h3>{drawerType === "add" ? "Add New User" : "Edit User"}</h3>
            <button className="close-button" onClick={closeDrawer}>
              X
            </button>
            <input
              type="text"
              placeholder="First Name"
              value={drawerType === "add" ? newUser.fn : selectedRow.fn}
              onChange={(e) =>
                drawerType === "add"
                  ? setNewUser({ ...newUser, fn: e.target.value })
                  : setSelectedRow({ ...selectedRow, fn: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={drawerType === "add" ? newUser.ln : selectedRow.ln}
              onChange={(e) =>
                drawerType === "add"
                  ? setNewUser({ ...newUser, ln: e.target.value })
                  : setSelectedRow({ ...selectedRow, ln: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Age"
              value={drawerType === "add" ? newUser.age : selectedRow.age}
              onChange={(e) =>
                drawerType === "add"
                  ? setNewUser({ ...newUser, age: e.target.value })
                  : setSelectedRow({ ...selectedRow, age: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Address"
              value={drawerType === "add" ? newUser.address : selectedRow.address}
              onChange={(e) =>
                drawerType === "add"
                  ? setNewUser({ ...newUser, address: e.target.value })
                  : setSelectedRow({ ...selectedRow, address: e.target.value })
              }
            />
            <button
              onClick={() =>
                drawerType === "add" ? handleAdd() : handleUpdate(selectedRow.id, selectedRow)
              }
            >
              {drawerType === "add" ? "Save" : "Update"}
            </button>
          </div>
          <div className="drawer-footer">
            <button className="cancel-btn" onClick={closeDrawer}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
