import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import Table from "./table";
import DynamicForm from "./actionForm";
import Header from "./header";
import { downloadStructuredExcel } from "./excelFormatting";
import { fetchFacultyData, uploadFile, updateFaculty } from "./api";

import "../styles/fdashboard.css";

export default function FDashboard() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [uploading, setUploading] = useState(false);

  const isAnySectionOpen = Object.values(expandedSections).some(val => val === true);
  const areAllSectionsOpen = ["books", "conferences", "journals"].every(
    type => expandedSections[type]
  );

  const fileInputRefs = useRef({});
  const tableActions = useRef({});

  const bHeads = ["title", "publisher_details", "publication_month_year", "name", "email"];
  const cHeads = ["title_of_paper", "conference_name", "held_on", "place", "isbn", "name", "email"];
  const jHeads = ["title_of_paper", "journal_name", "url_doi", "issn", "publication_month_year", "page_numbers", "name", "email"];

  const types = ["books", "conferences", "journals"];
  const COLORS = ["#47B39C", "#FFC154", "#EC6B56"];

  /* ================= LOAD DATA ================= */
  const loadData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login first");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetchFacultyData(token);

      if (response.error) {
        console.error(response.error);
        alert("Failed to load data");
        return;
      }

      setUserData(response.data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ================= PIE DATA ================= */
  const counts = useMemo(() => {
    return types.map((type) => {
      const dataArray = userData?.[type] || [];
      return { name: type, value: dataArray.length };
    });
  }, [userData]);

  /* ================= FORM ================= */
  const openAddForm = (action, type = null) => {
    if ((action === "Update" || action === "Delete") && !selectedItem) {
      alert("Please select a row first");
      return;
    }

    setFormAction(`${action} ${type}`);
    setShowForm(true);
  };

  const closeForm = async () => {
    setShowForm(false);
    setSelectedItem(null);
    await loadData();
  };

  /* ================= SECTIONS ================= */
  const toggleSection = (type) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  /* ================= MODES ================= */
  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditMode(true);
    setDeleteMode(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteMode(true);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setDeleteMode(false);
    setSelectedRows([]);
  };

  /* ================= ACTIVE TYPE ================= */
  const getActiveType = () => {
    return Object.keys(expandedSections).find(t => expandedSections[t]);
  };

  /* ================= TABLE ACTIONS ================= */
  const handleDeleteConfirm = async () => {
    const activeType = getActiveType();
    if (!activeType) return;

    const actions = tableActions.current[activeType];

    if (actions?.delete) {
      await actions.delete();
    }

    handleCancel();
    await loadData();
  };

  const handleEditSave = async () => {
    const activeType = getActiveType();
    if (!activeType) return;

    const actions = tableActions.current[activeType];

    if (actions?.save) {
      await actions.save();
    }

    handleCancel();
    await loadData();
  };

  /* ================= FILE UPLOAD ================= */
  const fileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      alert("Only .xlsx files allowed");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      await uploadFile(
        file,
        type,
        localStorage.getItem("accessToken")
      );

      alert("Upload successful!");
      await loadData();

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <>
      <Header loginStatus="logout" />

      {uploading && <div className="loading">Uploading...</div>}

      <div className="downloads">
        <p>Download formats: </p>
        <a onClick={() => downloadStructuredExcel([], bHeads, "Books")}>Books</a>
        <a onClick={() => downloadStructuredExcel([], cHeads, "Conferences")}>Conferences</a>
        <a onClick={() => downloadStructuredExcel([], jHeads, "Journals")}>Journals</a>
      </div>

      <div className="user-details">
        <div className="chart">
          <PieChart width={330} height={330}>
            <Pie data={counts} dataKey="value" outerRadius={160}>
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
            <p>{userData.degrees?.replaceAll(", ", " | ") || ""}</p>
            <p>{userData.department}</p>
          </div>

          <button className="passChange" onClick={(e) => { e.stopPropagation(); openAddForm("Change", "Password"); }}>change password</button>

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

      <div style={{
        padding: "0 2vw",
        position: "relative",
        marginTop: areAllSectionsOpen ? "5vh" : "-5vh",
        marginBottom: 0,
        marginLeft: isAnySectionOpen ? "0vw" : "4vw",
        width: isAnySectionOpen ? "96%" : "max-content",
        transition: "all 0.3s ease"
      }}>

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
                  fontWeight: "normal",
                  textTransform: "capitalize",
                }}
              >
                ▶ {type}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {types.map((type) => {
            const key = type.toLowerCase();
            if (!expandedSections[type]) return null;

            return (
              <div key={type} style={{ background: "#e0dfdf", borderRadius: "25px" }}>
                <div className="table-head-f">
                  <div onClick={() => toggleSection(type)} style={{ cursor: "pointer" }}>
                    <h4>▼ {type}</h4>
                  </div>

                  <div className="action-btns">
                    {!editMode && !deleteMode && (
                      <>
                        <input
                          type="file"
                          hidden
                          ref={(el) => (fileInputRefs.current[key] = el)}
                          onChange={(e) => fileUpload(e, key)}
                        />
                        <img src="/svgs/upload.svg" alt="upload" onClick={() => fileInputRefs.current[key]?.click()} />
                        <img src="/svgs/add.svg" onClick={(e) => { e.stopPropagation(); openAddForm("Add", type); }} />
                        <img src="/svgs/edit.svg" onClick={handleEditClick} />
                        <img src="/svgs/delete.svg" onClick={handleDeleteClick} />
                      </>
                    )}

                    {editMode && (
                      <>
                        <button 
                          onClick={handleEditSave}
                          style={{
                            backgroundColor: "#355075",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          Save
                        </button>
                        <span 
                          onClick={handleCancel}
                          style={{
                            color: "red",
                            fontSize: "18px",
                            cursor: "pointer",
                            marginLeft: "10px"
                          }}
                          >✖</span>
                      </>
                    )}

                    {deleteMode && (
                      <>
                        <button 
                          onClick={handleDeleteConfirm}
                          style={{
                            backgroundColor: "#e74c3c",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                        <span 
                          onClick={handleCancel}
                          style={{
                            color: "red",
                            fontSize: "18px",
                            cursor: "pointer",
                            marginLeft: "10px"
                          }}
                        >✖</span>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <Table
                    type={key}
                    searchTags={[
                      { type: "faculty", value: userData.name.toLowerCase() }
                    ]}
                    mode={editMode ? "edit" : deleteMode ? "delete" : "view"}
                    onRegisterActions={(actions) => {
                      tableActions.current[key] = actions;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <DynamicForm
          action={formAction}
          data={selectedItem}
          onClose={closeForm}
        />
      )}
    </>
  );
}