import { useState, useRef } from "react";

import Header from "./header";
import Table from "./table";
import DynamicForm from "./actionForm";
import { downloadStructuredExcel } from "./excelFormatting";

import { uploadFile } from "./api";

export default function Records() {
  const [formAction, setFormAction] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tableModes, setTableModes] = useState({});
  const fileInputRefs = useRef({});

  const types = ["Journals", "Books", "Conferences"];
  const bHeads = ["title", "publisher_details", "publication_month_year", "name", "email"];
  const cHeads = ["title_of_paper", "conference_name", "held_on", "place", "isbn", "name", "email"];
  const jHeads = ["title_of_paper", "journal_name", "url_doi", "issn", "publication_month_year", "page_numbers", "name", "email"];

  const openAddForm = (action, type = null) => {
    setFormAction(`${action} ${type}`);
    setShowForm(true);
  };

  const closeForm = async () => {
    setShowForm(false);
  };

  const changeTableMode = (type, mode) => {
    setTableModes(prev => ({
      ...prev,
      [type]: mode
    }));
  };

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

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <Header
        loginStatus="logout"
        navItems={[
          { name: "Faculty", path: "/dashboard" },
          { name: "Records", path: "/records" },
        ]}
      />

      <div className="downloads">
        <h1>Download formats: </h1>
        <p onClick={() => downloadStructuredExcel([], bHeads, "Books")}>Books</p>
        <p onClick={() => downloadStructuredExcel([], cHeads, "Conferences")}>Conferences</p>
        <p onClick={() => downloadStructuredExcel([], jHeads, "Journals")}>Journals</p>
      </div>

      <div style={{ marginBottom: "10vh", marginTop: "3vh" }}>
        {types.map((type) => {
          const key = type.toLowerCase();
          const mode = tableModes[key] || "view";

          return (
            <div key={type}>
              <div className="table-head">
                <h4>{type}</h4>

                <div className="action-btns">

                  {/* hidden upload input */}
                  <input
                    type="file"
                    accept=".xlsx"
                    disabled={uploading}
                    ref={(el) => (fileInputRefs.current[key] = el)}
                    onChange={(e) => fileUpload(e, key)}
                    style={{ display: "none" }}
                  />

                  {/* NORMAL MODE */}
                  {mode === "view" ? (
                    <>
                      <img
                        src="/svgs/upload.svg"
                        alt="upload"
                        style={{ cursor: "pointer" }}
                        onClick={() => fileInputRefs.current[key]?.click()}
                      />

                      <img
                        src="/svgs/add.svg"
                        alt="add"
                        style={{ cursor: "pointer" }}
                        onClick={() => openAddForm("Add", key)}
                      />

                      <img
                        src="/svgs/edit.svg"
                        alt="edit"
                        style={{ cursor: "pointer" }}
                        onClick={() => changeTableMode(key, "edit")}
                      />

                      <img
                        src="/svgs/delete.svg"
                        alt="delete"
                        style={{ cursor: "pointer" }}
                        onClick={() => changeTableMode(key, "delete")}
                      />
                    </>
                  ) : (
                    <>
                      {/* CONFIRM */}
                      <button
                        style={{
                          backgroundColor: mode === "delete" ? "#e74c3c" : "#355075",
                          color: "white",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                        onClick={async () => {
                          const actions = window.__TABLE_ACTIONS__?.[key];
                          if (mode === "edit") {
                            await actions?.save();
                          }
                          if (mode === "delete") {
                            await actions?.delete();
                          }
                          changeTableMode(key, "view");
                        }}
                      >
                        {mode === "delete" ? "Delete" : "Save"}
                      </button>

                      {/* CANCEL */}
                      <span
                        style={{
                          color: "red",
                          fontSize: "18px",
                          cursor: "pointer",
                          marginLeft: "10px"
                        }}
                        onClick={() => changeTableMode(key, "view")}
                      >
                        ✖
                      </span>
                    </>
                  )}

                </div>
              </div>

              <Table
                type={key}
                mode={mode}
              />
            </div>
          );
        })}
      </div>

      {showForm && (
        <DynamicForm
          action={formAction}
          user="admin"
          onClose={closeForm}
        />
      )}
    </>
  );
}