import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { fetchAllFactulty, updateFaculty } from "./api";
import DynamicForm from "./actionForm";
import Header from "./header";

import "../styles/adashboard.css";

export default function ADashboard() {
  const navigate = useNavigate();

  const [facultyData, setFacultyData] = useState([]);

  const [sortMode, setSortMode] = useState("");

  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  const editableFields = ["name", "email", "department", "is_active"];

  const [showForm, setShowForm] = useState(false);
  const [formAction, setFormAction] = useState("");

  /* ================= LOAD DATA ================= */

  const loadData = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login first");
      navigate("/login", { replace: true });
      return;
    }

    const res = await fetchAllFactulty(token);

    if (!res?.error) {
      setFacultyData(Object.entries(res.data));
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  /* ================= SORT ================= */

  const sortedFaculty = useMemo(() => {
    const arr = [...facultyData];

    switch (sortMode) {
      case "name-asc":
        return arr.sort((a, b) =>
          a[1].name.localeCompare(b[1].name)
        );

      case "name-desc":
        return arr.sort((a, b) =>
          b[1].name.localeCompare(a[1].name)
        );

      case "oldest":
        return arr.sort((a, b) => a[1].id - b[1].id);

      case "newest":
        return arr.sort((a, b) => b[1].id - a[1].id);

      default:
        return arr;
    }
  }, [facultyData, sortMode]);

  /* ================= FORM ================= */

  const openAddForm = (action, type = null) => {
    setFormAction(type ? `${action} ${type}` : action);
    setShowForm(true);
  };

  const closeForm = async () => {
    setShowForm(false);
    await loadData();
  };

  /* ================= UPDATE ================= */

  const update = async (facultyId, field, value) => {
    const token = localStorage.getItem("accessToken");

    const payload = {
      [field]: field === "is_active" ? value === "Yes" : value,
    };

    await updateFaculty(payload, facultyId, token);
    await loadData();
  };

  /* ================= UI ================= */

  return (
    <>
      <Header
        loginStatus="logout"
        navItems={[
          { name: "Faculty", path: "" },
          { name: "Records", path: "/records" },
        ]}
      />

      {/* SORT CONTROLS */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2vh",
        }}
      >
        <div className="sort-controls">

          <label>Sort:</label>

          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="">None</option>
            <option value="oldest">Oldest → Newest</option>
            <option value="newest">Newest → Oldest</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
          </select>
        </div>

        <div className="action-bts" style={{ gap: "2vw" }}>
          <button onClick={() => openAddForm("Add Faculty")}>
            <img src="/svgs/person_add.svg" alt="addFaculty" />
          </button>

          <button onClick={() => openAddForm("Delete Faculty")}>
            <img src="/svgs/person_del.svg" alt="delFaculty" />
          </button>
        </div>
      </div>

      {/* FACULTY LIST */}

      <div className="faculty-list">
        {sortedFaculty.map(([index, data]) => (
          <div key={index} className="faculty-box">

            {Object.entries(data).map(([id, value]) => {
              const isEditable = editableFields.includes(id);

              const isEditing =
                editing?.index === index &&
                editing?.id === id;

              return (
                <div key={id} className="data-line">

                  {isEditing ? (
                    <input
                      value={editValue}
                      onChange={(e) =>
                        setEditValue(e.target.value)
                      }
                    />
                  ) : (
                    <p>
                      {id === "is_active"
                        ? value
                          ? "Yes"
                          : "No"
                        : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </p>
                  )}

                  {isEditable && (
                    <div className="actions">

                      {isEditing ? (
                        <div className="action-bts2">

                          <img
                            src="/svgs/save.svg"
                            alt="save"
                            onClick={() => {
                              update(data.id, id, editValue);
                              setEditing(null);
                            }}
                          />

                          <img
                            src="/svgs/cancel.svg"
                            alt="cancel"
                            onClick={() => {
                              setEditing(null);
                              setEditValue("");
                            }}
                          />

                        </div>
                      ) : (
                        <img
                          src="/svgs/edit.svg"
                          className="edit-btn"
                          alt="edit"
                          style={{ height: "20px" }}
                          onClick={() => {
                            setEditing({ index, id });
                            setEditValue(String(value));
                          }}
                        />
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        ))}
      </div>

      {/* FORM */}

      {showForm && (
        <DynamicForm action={formAction} onClose={closeForm} />
      )}
    </>
  );
}