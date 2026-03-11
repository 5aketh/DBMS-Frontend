import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import Table from "./table";
import DynamicForm from "./actionForm";
import Header from "./header";

import { fetchFacultyData } from "./api";

import "../styles/fdashboard.css";

export default function FDashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState("");
  
  // Track expansion state: { books: false, conferences: false, journals: false }
  const [expandedSections, setExpandedSections] = useState({});
  const isAnySectionOpen = Object.values(expandedSections).some(val => val === true);

  const types = ["books", "conferences", "journals"];
  const COLORS = ["#47B39C", "#FFC154", "#EC6B56"];

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login first");
      navigate("/login", { replace: true });
      return;
    }
    const response = await fetchFacultyData(token);
    if (response.error) {
      console.error(response.error);
      return;
    }
    setUserData(response.data);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddForm = (action, type = null) => {
    setFormAction(`${action} ${type}`);
    setShowForm(true);
  };

  const closeForm = async () => {
    setShowForm(false);
    await loadData();
  };

  const toggleSection = (type) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const counts = types.map((type) => {
    const dataArray = userData?.[type] || [];
    return { name: type, value: dataArray.length };
  });

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <>
      <Header loginStatus="logout" />
      <div className="user-details">
        <div className="chart">
          <PieChart width={330} height={330}>
            <Pie
              data={counts}
              dataKey="value"
              outerRadius={160}
            >
              {counts.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ display: "none" }} />
          </PieChart>
        </div>

        <div className="right-side">
          <img src="/images/bms.png" alt="BMS" className="bg-img-icon" />
          <img src={userData.image} alt="Profile" className="img-icon" />

          <div className="user-data">
            <h1>{userData.name}</h1>
            <p>{userData.title}</p>
            <p>{userData.degrees.replaceAll(", ", " | ")}</p>
            <p>{userData.department}</p>
          </div>

          <div className="interests">{userData.interests}</div>

          <div className="contact-info">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="/images/gmail.png" alt="Gmail" style={{ width: "20px", marginRight: "10px" }} />
              <p style={{ margin: 0 }}>{userData.email}</p>
            </div>
            <a href={`${userData.link}`}> view more </a>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 2vw", position: "relative", marginTop: "-5vh", marginBottom: 0, marginLeft: isAnySectionOpen ? "0vw" : "4vw" }}>        
        <div style={{ display: "flex", gap: "1vw", marginBottom: "20px", flexWrap: "wrap" }}>
          {types.map((type, index) => {
            if (expandedSections[type]) return null;
            return (
              <div 
                key={type} 
                onClick={() => toggleSection(type)}
                style={{ 
                  cursor: "pointer",
                  padding: "10px 24px",
                  marginBottom: isAnySectionOpen ? "10vh" : 0,
                  borderRadius: "25px",
                  backgroundColor: COLORS[index],
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  transition: "transform 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <span style={{ marginRight: "10px", fontSize: "10px" }}>▶</span>
                <h4 style={{ textTransform: "capitalize", margin: 0, fontSize: "0.9rem" }}>{type}</h4>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {types.map((type, index) => {
            if (!expandedSections[type]) return null;
            return (
              <div 
                key={type} 
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  width: "100%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                <div 
                  className="table-head" 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #35507533"
                  }}
                >
                  <div 
                    onClick={() => toggleSection(type)} 
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <span style={{ 
                      marginRight: "10px", 
                      transform: "rotate(90deg)", 
                      display: "inline-block", 
                      fontSize: "10px",
                      color: "black"
                    }}>▶</span>
                    <h4 style={{ textTransform: "capitalize", margin: 0, color: "#355075", fontWeight: "bold" }}>
                      {type}
                    </h4>
                  </div>

                  <div className="action-btns">
                    <img
                      src="/svgs/add.svg"
                      alt="add"
                      onClick={(e) => { e.stopPropagation(); openAddForm("Add", type); }}
                      style={{ cursor: "pointer", width: "20px" }}
                    />
                    <img
                      src="/svgs/edit.svg" 
                      alt="edit"
                      title="Edit Existing"
                      onClick={(e) => { e.stopPropagation(); openAddForm("Update", type); }}
                      style={{ cursor: "pointer", width: "20px", transition: "opacity 0.2s" }}
                      onMouseOver={(e) => e.currentTarget.style.opacity = "0.7"}
                      onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                    />
                    <img
                      src="/svgs/delete.svg"
                      alt="delete"
                      onClick={(e) => { e.stopPropagation(); openAddForm("Delete", type); }}
                      style={{ cursor: "pointer", width: "20px" }}
                    />
                  </div>
                </div>
                <div style={{ padding: "20px", overflowX: "auto" }}>
                  <Table data={userData[type] || []} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <DynamicForm
          action={formAction}
          onClose={closeForm}
        />
      )}
    </>
  );
}