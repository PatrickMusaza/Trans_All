import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ activeView,setActiveView }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    { id: 1, icon: "fas fa-tachometer-alt", label: "Dashboard", view: "dashboard" },
    {
      id: 2,
      icon: "fas fa-map",
      label: "Routes",
      view: "routes",
    },
    {
      id: 3,
      icon: "fas fa-route",
      label: "Trips",
      view: "trips",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <i className={collapsed ? "fas fa-chevron-right" : "fas fa-bus"}></i>
        {!collapsed && <span>TransConnect</span>}
      </div>
      <nav className="menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className={item.dropdown || activeView === item.view ? "dropdown active" : ""}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.dropdown) {
                    toggleDropdown(item.id);
                  } else {
                    setActiveView(item.view);
                  }
                }}
              >
                <i className={item.icon}></i>
                {!collapsed && item.label}
                {item.dropdown && (
                  <i
                    className={`fas fa-chevron-down ${
                      activeDropdown === item.id ? "rotate" : ""
                    }`}
                  ></i>
                )}
              </a>
              {item.dropdown && activeDropdown === item.id && !collapsed && (
                <ul className="dropdown-menu">
                  {item.dropdown.map((subItem, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveView(subItem.view);
                        }}
                      >
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
