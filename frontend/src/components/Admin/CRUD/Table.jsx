import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import { getTableFields } from "./Fields";  
import "./Table.css";

const Table = ({ apiRoute, name }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerState, setDrawerState] = useState({ isOpen: false, mode: "", rowData: {} });
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

  // Open Drawer
  const openDrawer = (mode, rowData = {}) => {
    setDrawerState({ isOpen: true, mode, rowData });
  };

  // Close Drawer
  const closeDrawer = () => {
    setDrawerState({ isOpen: false, mode: "", rowData: {} });
  };

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

  // Get table fields based on model name
  const tableFields = getTableFields(name);

  return (
    <div className="table-container">
      <h2>{name} Table</h2>
      {/* Add Button */}
      <button className="add-button" onClick={() => openDrawer("add")}>+ Add User</button>

      {/* Data Table */}
      <table className="data-table">
        <thead>
          <tr>
            {tableFields.map((field) => (
              <th key={field.field}>{field.label}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.id} onClick={() => openDrawer("edit", row)}>
              {tableFields.map((field) => (
                <td key={field.field}>{field.field.split('.').reduce((acc, part) => acc && acc[part], row) || '-'}</td>
              ))}
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

      {/* Slide-in Drawer */}
      {drawerState.isOpen && (
        <div className={`drawer ${drawerState.isOpen ? "open" : ""}`}>
          <div className="drawer-header">
            <h3>{drawerState.mode === "add" ? "Add User" : "Edit User"}</h3>
            <button onClick={closeDrawer}><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="drawer-body">
            {tableFields.map((field) => (
              <input
                key={field.field}
                type="text"
                placeholder={field.label}
                value={drawerState.rowData[field.field] || ""}
                onChange={(e) => setDrawerState({
                  ...drawerState,
                  rowData: { ...drawerState.rowData, [field.field]: e.target.value }
                })}
              />
            ))}
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
