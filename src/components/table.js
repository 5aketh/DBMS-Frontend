import { useState, useEffect, useMemo } from "react";
import { fetchData, updateRecord, deleteRecord } from "./api";
import "../styles/table.css";

export default function Table({
  type,
  searchTags = [],
  visibleColumns = [],
  mode = "view",
}) {
  const [items, setItems] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    const load = async () => {
      const res = await fetchData(type);
      if (Array.isArray(res)) setItems(res);
    };
    load();
  }, [type]);

  /* ---------- FILTER ---------- */

  const filtered = useMemo(() => {
    return items.filter(row => 
      searchTags.every(tag => { 
        if (tag.type === "keyword") { 
          return Object.values(row).some(v => 
            String(v).toLowerCase().includes(tag.value)
          ); 
        } 
        if (tag.type === "type") { 
          return String(row.type || "").toLowerCase() === tag.value; 
        } 
        if (tag.type === "faculty") { 
          const rowValue = String(row.faculty_name || "").toLowerCase(); 
          return searchTags.filter(t => t.type === "faculty").some(t => rowValue.includes(t.value)); 
        } 
        if (tag.type === "date") { 
          const [start, end] = tag.value.split("_"); 
          const s = new Date(start); 
          const e = new Date(end); 
          return Object.values(row).some(v => 
            { const d = new Date(v); 
              if (isNaN(d)) 
                return false; 
              return d >= s && d <= e; 
            }
          ); 
        } return true; }));
  }, [items, searchTags]);

  /* ---------- COLUMNS ---------- */

  const columns = useMemo(() => {
    if (!filtered.length) return [];
    const all = Object.keys(filtered[0]).filter(k => k !== "faculty_id");
    return visibleColumns.length ? all.filter(c => visibleColumns.includes(c)) : all;
  }, [filtered, visibleColumns]);

  /* ---------- EDIT HANDLERS ---------- */

  const handleEditChange = (rowIndex, col, value) => {
    setEditedRows(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [col]: value
      }
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");

    for (let i = 0; i < filtered.length; i++) {
      const row = filtered[i];
      const updatedData = editedRows[i];

      if (updatedData) {
        await updateRecord(row.id, updatedData, type, token);
      }
    }

    setEditedRows({});
  };

  /* ---------- DELETE HANDLERS ---------- */

  const toggleSelect = (id) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");

    for (let id in selectedRows) {
      if (selectedRows[id]) {
        await deleteRecord(type, id, token);
      }
    }

    setSelectedRows({});
  };

  /* ---------- MODE ACTION ---------- */

  useEffect(() => {
    if (mode === "view") return;

    if (mode === "edit") {
      // wait for parent save trigger
    }

    if (mode === "delete") {
      // wait for parent delete trigger
    }
  }, [mode]);

  /* expose actions to parent via window (simple hack based on your structure) */
  window.__TABLE_ACTIONS__ = window.__TABLE_ACTIONS__ || {};
  window.__TABLE_ACTIONS__[type] = {
    save: handleSave,
    delete: handleDelete
  };

  return (
    <div className="table-scroll">
      <table className="rounded-table">
        <thead>
          <tr>
            {mode === "delete" && <th>Select</th>}
            {columns.map(col => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered.map((row, i) => (
            <tr key={i}>

              {/* DELETE CHECKBOX */}
              {mode === "delete" && (
                <td>
                  <input
                    type="checkbox"
                    checked={!!selectedRows[row.id]}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
              )}

              {columns.map(col => {
                const isEditable =
                  mode === "edit" &&
                  col !== "id" &&
                  col !== "faculty_name";

                return (
                  <td key={col}>
                    {isEditable ? (
                      <input
                        value={
                          editedRows[i]?.[col] ?? row[col] ?? ""
                        }
                        onChange={(e) =>
                          handleEditChange(i, col, e.target.value)
                        }
                      />
                    ) : (
                      row[col] ?? "—"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}