import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { getTableFields } from "./Fields";
import "./Table.css";

const Table = ({ apiRoute, name }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerState, setDrawerState] = useState({ isOpen: false, mode: "", rowData: {} });
  const rowsPerPage = 5;
  const timeIdField = ["id", "created_at", "login_at", "date_joined", "last_login", "signup_time", "buy_time","moved_at"];
  const timeFieldRow = ["created_at","date", "login_at", "date_joined", "last_login", "signup_time", "buy_time","moved_at"];
  const timeFields = ["created_at","departure_time","date","arrival_time", "login_at", "date_joined", "last_login","moved_at", "signup_time", "buy_time"];

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
    const sanitizedData = { ...rowData };
    if (mode === "edit") {
      sanitizedData.id = rowData.id; // Retain ID for edit mode
    }
    delete sanitizedData.created_at;
    delete sanitizedData.login_at;
    delete sanitizedData.signup_time;
    setDrawerState({ isOpen: true, mode, rowData: sanitizedData });
  };

  // Close Drawer
  const closeDrawer = () => {
    setDrawerState({ isOpen: false, mode: "", rowData: {} });
  };

  // CRUD Operations
  const handleSave = async () => {
    try {
      if (drawerState.mode === "add") {
        const response = await axiosInstance.post(`${apiRoute}add/`, drawerState.rowData);
        setData((prev) => [...prev, response.data]);
      } else if (drawerState.mode === "edit") {
        const response = await axiosInstance.put(`${apiRoute}${drawerState.rowData.id}/update/`, drawerState.rowData);
        setData((prev) =>
          prev.map((item) => (item.id === drawerState.rowData.id ? response.data : item))
        );
      }
      closeDrawer();
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  // Delete operation
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiRoute}${id}/delete/`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  // Pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    fetchData();
  }, [apiRoute]);

  const tableFields = getTableFields(name);

  const getNestedFieldValue = (row, field) => {
    const value = field.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined && acc[part] !== null ? acc[part] : null;
    }, row);

    if (value === null) return "";

    if (timeFieldRow.includes(field)) {
      return new Date(value).toLocaleString();
    }

    if (typeof value === "boolean") {
      return value ? "Active" : "Inactive";
    }

    return value;
  };


  return (
    <div className="table-container">
      <h2>{name} Table</h2>
      {/* Add Button */}
      <button className="add-button" onClick={() => openDrawer("add")}>+ Add</button>

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
              {tableFields.map((field) => {
                const fieldValue = getNestedFieldValue(row, field.field);
                return (
                  <td key={field.field}>
                    {fieldValue !== null ? fieldValue : "-"}
                  </td>
                );
              })}
              <td>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent row click from triggering
                  handleDelete(row.id);
                }}>Delete</button>
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
      {drawerState.isOpen && (
        <div className={`drawer ${drawerState.isOpen ? "open" : ""}`}>
          <div className="drawer-header">
            <h3>{drawerState.mode === "add" ? "Add Entry" : "Edit Entry"}</h3>
            <button onClick={closeDrawer}><i className="fa-solid fa-xmark"></i></button>
          </div>

          <div className="drawer-body">
            {tableFields.map((field) => {
              if (timeIdField.includes(field.field)) {
                return null;
              }

              if (field.field === "status") {
                return (
                  <select
                    key={field.field}
                    value={drawerState.rowData[field.field] || ""}
                    onChange={(e) =>
                      setDrawerState({
                        ...drawerState,
                        rowData: { ...drawerState.rowData, [field.field]: e.target.value },
                      })
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="complete">Complete</option>
                    <option value="pending">Pending</option>
                    <option value="cancel">Cancel</option>
                  </select>
                );
              }

              if (field.field === "is_active") {
                return (
                  <select
                    key={field.field}
                    value={drawerState.rowData[field.field] || ""}
                    onChange={(e) =>
                      setDrawerState({
                        ...drawerState,
                        rowData: { ...drawerState.rowData, [field.field]: e.target.value },
                      })
                    }
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                );
              }

              if (field.field === "role") {
                return (
                  <select
                    key={field.field}
                    value={drawerState.rowData[field.field] || ""}
                    onChange={(e) =>
                      setDrawerState({
                        ...drawerState,
                        rowData: { ...drawerState.rowData, [field.field]: e.target.value },
                      })
                    }
                  >
                    <option value="user">User</option>
                    <option value="client">Client</option>
                    <option value="driver">Driver</option>
                    <option value="staff">Staff</option>
                  </select>
                );
              }

              if (timeFields.includes(field.field)) {
                // Determine the input type based on field type
                const inputType = field.field.includes("time")
                  ? "time"
                  : field.field.includes("date")
                    ? "date"
                    : "datetime-local";

                return (
                  <input
                    key={field.field}
                    type={inputType}
                    placeholder={field.label}
                    value={drawerState.rowData[field.field] || ""}
                    onChange={(e) =>
                      setDrawerState({
                        ...drawerState,
                        rowData: { ...drawerState.rowData, [field.field]: e.target.value },
                      })
                    }
                  />
                );
              }

              return (
                <input
                  key={field.field}
                  type="text"
                  placeholder={field.label}
                  value={drawerState.rowData[field.field] || ""}
                  onChange={(e) =>
                    setDrawerState({
                      ...drawerState,
                      rowData: { ...drawerState.rowData, [field.field]: e.target.value },
                    })
                  }
                />
              );
            })}
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
