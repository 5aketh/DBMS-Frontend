import { useState, useRef } from "react";

import Header from "./header";
import Table from "./table";
import DynamicForm from "./actionForm";
import Filter from "./filter";

import { uploadFile } from "./api";

export default function Records() {
  const [formAction, setFormAction] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [viewLimit, setViewLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTags, setSearchTags] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [tableModes, setTableModes] = useState({}); 
  // { journals: "view", books: "edit", conferences: "delete" }

  const fileInputRefs = useRef({});

  const types = ["Journals", "Books", "Conferences"];

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

      <Filter
        page={currentPage}
        onChange={({ searchTags: tags, currentPage: page }) => {
          setSearchTags(tags);
          setCurrentPage(page);
        }}
      />

      <div style={{ marginBottom: "10vh", marginTop: "3vh" }}>
        {types.map((type) => {
          const key = type.toLowerCase();

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

                  {/* upload */}
                  <img
                    src="/svgs/upload.svg"
                    alt="upload"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      fileInputRefs.current[key]?.click()
                    }
                  />

                  {/* add */}
                  <img
                    src="/svgs/add.svg"
                    alt="add"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      openAddForm("Add", key)
                    }
                  />

                  {/* edit */}
                  <img
                    src="/svgs/edit.svg"
                    alt="edit"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      changeTableMode(key, "edit")
                    }
                  />

                  {/* delete */}
                  <img
                    src="/svgs/delete.svg"
                    alt="delete"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      changeTableMode(key, "delete")
                    }
                  />

                </div>
              </div>

              <Table
                type={key}
                mode={tableModes[key] || "view"}
                items={items}
                searchTags={searchTags}
                viewLimit={viewLimit}
                currentPage={currentPage}
                onChange={({ displayItems, currentPage, viewLimit }) => {
                  setItems(displayItems);
                  setCurrentPage(currentPage);
                  setViewLimit(viewLimit);
                }}
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