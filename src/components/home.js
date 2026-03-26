import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import Filter from "./filter";
import Header from "./header";
import Table from "./table";
import { fetchData } from "./api";
import { downloadStructuredExcel } from "./excelFormatting";

export default function Welcome() {
  const location = useLocation();
  const type = location.pathname.slice(1);

  const navItems = useMemo(() => [
    { name: "Journals", path: "/journals" },
    { name: "Books", path: "/books" },
    { name: "Conferences", path: "/conferences" },
  ], []);

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    searchTags: [],
    currentPage: 1,
    visibleColumns: []
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetchData(type);
      if (Array.isArray(res)) setData(res);
    };
    load();
  }, [type]);

  const facultyOptions = useMemo(() => {
    return [...new Set(data.map(d => d.faculty_name).filter(Boolean))];
  }, [data]);

  const columnOptions = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter(k => k !== "faculty_id");
  }, [data]);

  const typeOptions = useMemo(() => {
    if (!data.length) return [];
    if (!("type" in data[0])) return [];
    return [...new Set(data.map(d => d.type).filter(Boolean))];
  }, [data]);

  // ✅ DOM extractor (KEY PART)
  const extractTableFromDOM = () => {
    const table = document.querySelector("#export-table table");
    if (!table) return { columns: [], data: [] };

    const headers = Array.from(table.querySelectorAll("thead th"))
      .map(th => th.innerText.trim());

    const rows = Array.from(table.querySelectorAll("tbody tr"));

    const extractedData = rows.map(row => {
      const cells = Array.from(row.querySelectorAll("td"));
      const obj = {};

      headers.forEach((header, i) => {
        obj[header] = cells[i]?.innerText.trim() || "";
      });

      return obj;
    });

    return { columns: headers, data: extractedData };
  };

  const handleDownload = () => {
    const { columns, data } = extractTableFromDOM();

    if (!data.length) {
      alert("No data to export");
      return;
    }

    downloadStructuredExcel(data, columns, type);
  };

  return (
    <div className="screen">
      <header className="header">
        <Header navItems={navItems} loginStatus={"login"} />

        <Filter
          facultyOptions={facultyOptions}
          columnOptions={columnOptions}
          typeOptions={typeOptions}
          onChange={setFilters}
        />

        {/* ✅ Download Button */}
        <button className="download" onClick={handleDownload}>
          Download Excel
        </button>
      </header>

      {/* ✅ Wrapper added (DO NOT MODIFY TABLE) */}
      <div id="export-table">
        <Table
          type={type}
          searchTags={filters.searchTags}
          visibleColumns={filters.visibleColumns}
          currentPage={filters.currentPage}
        />
      </div>
    </div>
  );
}