import { useState, useRef, useEffect } from "react";
import "../styles/filter.css";

export default function Filter({
  onChange,
  facultyOptions = [],
  columnOptions = [],
  typeOptions = []
}) {

  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dropdownRef = useRef(null);

  /* ---------- CLOSE DROPDOWN ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- UPDATE PARENT ---------- */
  const updateParent = (updatedTags) => {
    onChange({
      searchTags: updatedTags,
      currentPage: 1,
      visibleColumns: updatedTags
        .filter(t => t.type === "column")
        .map(t => t.value)
    });
  };

  /* ---------- ADD TAG ---------- */
  const addTag = (newTag) => {
    if (!tags.find(t => t.type === newTag.type && t.value === newTag.value)) {
      const updated = [...tags, newTag];
      setTags(updated);
      updateParent(updated);
    }
  };

  /* ---------- REMOVE TAG ---------- */
  const removeTag = (id) => {
    const updated = tags.filter(t => t.id !== id);
    setTags(updated);
    updateParent(updated);
  };

  /* ---------- ENTER SEARCH ---------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();

      addTag({
        id: Date.now(),
        type: "keyword",
        value: inputValue.toLowerCase(),
        display: inputValue
      });

      setInputValue("");
    }
  };

  /* ---------- TOGGLE TAG ---------- */
  const toggleTag = (type, value, display) => {
    const exists = tags.find(t => t.type === type && t.value === value);

    let updated;

    if (exists) {
      updated = tags.filter(t => !(t.type === type && t.value === value));
    } else {
      updated = [...tags, { id: Date.now(), type, value, display }];
    }

    setTags(updated);
    updateParent(updated);
  };

  /* ---------- DATE TAG ---------- */
  const applyDate = () => {
    if (!startDate) return;

    const value = `${startDate}_${endDate || startDate}`;

    const display = endDate
      ? `Date: ${startDate} → ${endDate}`
      : `Date: ${startDate}`;

    const updated = tags.filter(t => t.type !== "date");

    updated.push({
      id: Date.now(),
      type: "date",
      value,
      display
    });

    setTags(updated);
    updateParent(updated);
  };

  return (
    <div className="search-section" ref={dropdownRef}>

      <div className="search-bar" onClick={() => setShowDropdown(true)}>
        <div className="search-tags">

          {tags.map(tag => (
            <span key={tag.id} className={`badge ${tag.type}`}>
              {tag.display}
              <button className="remove-btn" onClick={() => removeTag(tag.id)}>
                ×
              </button>
            </span>
          ))}

          <input
            type="text"
            placeholder={tags.length ? "" : "Search or apply filters"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              minWidth: "120px",
              flex: 1
            }}
          />
        </div>
      </div>

      {/* DROPDOWN */}
      {showDropdown && (
        <div className="filter-dropdown">

          {/* TYPE */}
          {typeOptions.length > 0 && (
            <div className="filter-block">
              <h4>Type</h4>
              <div className="filter-options">
                {typeOptions.map(t => {
                  const val = t.toLowerCase().trim();
                  return (
                    <button
                      key={t}
                      className={
                        tags.some(tag => tag.type === "type" && tag.value === val)
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        toggleTag("type", val, `Type: ${t}`)
                      }
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FACULTY */}
          <div className="filter-block">
            <h4>Faculty Name</h4>
            <div className="filter-options">
              {facultyOptions.map(f => {
                const val = f.toLowerCase().trim();
                return (
                  <button
                    key={f}
                    className={
                      tags.some(tag => tag.type === "faculty" && tag.value === val)
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      toggleTag("faculty", val, f)
                    }
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMNS */}
          <div className="filter-block">
            <h4>Columns</h4>
            <div className="filter-options">
              {columnOptions.map(col => (
                <button
                  key={col}
                  className={
                    tags.some(tag => tag.type === "column" && tag.value === col)
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    toggleTag("column", col, `Col: ${col}`)
                  }
                >
                  {col.replaceAll("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* DATE */}
          <div className="filter-block">
            <h4>Date</h4>
            <div className="filter-options">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button onClick={applyDate}>✔</button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}