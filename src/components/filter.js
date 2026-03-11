import { useState } from "react";
import "../styles/filter.css";

export default function Filter({ page, onChange }) {

  const [inputValue, setInputValue] = useState("");
  const [searchTags, setSearchTags] = useState([]);

  const monthRangePattern =
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$/;

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && inputValue.trim() !== "") {

      e.preventDefault();

      const rawValue = inputValue.trim().toLowerCase();

      let newTag;

      /* ---------- MONTH RANGE ---------- */

      if (monthRangePattern.test(rawValue)) {

        newTag = {
          id: `month-${rawValue}-${Date.now()}`,
          type: "monthRange",
          value: rawValue,
          display: `Month: ${rawValue}`
        };

      }

      /* ---------- COLUMN SEARCH ---------- */

      else if (rawValue.startsWith("col:")) {

        const columnName = rawValue.split(":")[1];

        if (!columnName) return;

        newTag = {
          id: `col-${columnName}-${Date.now()}`,
          type: "column",
          value: columnName,
          display: `Col contains: ${columnName}`
        };

      }

      /* ---------- KEYWORD SEARCH ---------- */

      else {

        newTag = {
          id: `key-${rawValue}-${Date.now()}`,
          type: "keyword",
          value: rawValue,
          display: rawValue
        };

      }

      if (!searchTags.find(t => t.value === newTag.value && t.type === newTag.type)) {

        const updatedTags = [...searchTags, newTag];

        setSearchTags(updatedTags);

        if (onChange)
          onChange({
            searchTags: updatedTags,
            currentPage: 1
          });
      }

      setInputValue("");
    }
  };

  const removeTag = (tagId) => {

    const updatedTags = searchTags.filter(t => t.id !== tagId);

    setSearchTags(updatedTags);

    if (onChange)
      onChange({
        searchTags: updatedTags,
        currentPage: 1
      });
  };

  return (

    <div className="search-section">

      <div className="search-bar">

        <div className="search-tags">

          {searchTags.map(tag => (

            <span key={tag.id} className={`badge ${tag.type}`}>

              {tag.display}

              <button
                type="button"
                className="remove-btn"
                onClick={() => removeTag(tag.id)}
              >
                ×
              </button>

            </span>

          ))}

          <input
            type="text"
            placeholder="Apply filters"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

        </div>

      </div>

    </div>
  );
}