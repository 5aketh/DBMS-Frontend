import { useState, useEffect, useMemo } from "react";
import { fetchData } from "./api";
import "../styles/table.css";

export default function Table({
  type,
  searchTags = [],
  viewLimit = 10,
  currentPage = 1
}) {

  const [items, setItems] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {

    const loadData = async () => {

      const fetched = await fetchData(type);

      if (Array.isArray(fetched))
        setItems(fetched);
    };

    loadData();

  }, [type]);

  /* ---------- DATE PARSER ---------- */

  const parseDate = (value) => {

    if (!value) return null;

    const parsed = new Date(value);

    if (!isNaN(parsed))
      return parsed;

    if (!isNaN(value))
      return new Date(value, 0);

    return null;
  };

  /* ---------- FILTER ---------- */

  const filteredItems = useMemo(() => {

    if (!searchTags.length)
      return items;

    return items.filter(row =>

      searchTags.every(tag => {

        const q = tag.value.toLowerCase();

        /* ---------- MONTH RANGE ---------- */

        if (tag.type === "monthRange") {

          const months = {
            jan:0,feb:1,mar:2,apr:3,may:4,jun:5,
            jul:6,aug:7,sep:8,oct:9,nov:10,dec:11
          };

          const [start,end] = q.split("-");

          const startM = months[start];
          const endM = months[end];

          return Object.values(row).some(v => {

            const d = parseDate(v);

            if (!d) return false;

            const m = d.getMonth();

            return m >= startM && m <= endM;

          });

        }

        /* ---------- COLUMN SEARCH ---------- */

        if (tag.type === "column") {

          const matchingKeys =
            Object.keys(row).filter(k =>
              k.toLowerCase().includes(q)
            );

          return matchingKeys.some(key => {

            const val = row[key];

            return val !== null &&
              val !== undefined &&
              String(val).trim() !== "";

          });

        }

        /* ---------- KEYWORD ---------- */

        return Object.entries(row).some(([k,v]) =>

          k.toLowerCase().includes(q) ||
          String(v).toLowerCase().includes(q)

        );

      })

    );

  }, [items, searchTags]);

  /* ---------- SORT ---------- */

  const sortedItems = useMemo(() => {

    if (!sortConfig)
      return filteredItems;

    const { key, direction } = sortConfig;

    return [...filteredItems].sort((a,b)=>{

      let A = a[key];
      let B = b[key];

      const dateA = parseDate(A);
      const dateB = parseDate(B);

      if (dateA && dateB)
        return direction === "asc"
          ? dateA - dateB
          : dateB - dateA;

      if (!isNaN(A) && !isNaN(B))
        return direction === "asc"
          ? A - B
          : B - A;

      return direction === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));

    });

  }, [filteredItems, sortConfig]);

  /* ---------- COLUMNS ---------- */

  const columns = useMemo(() => {

    if (!sortedItems.length)
      return [];

    const keys =
      Object.keys(sortedItems[0])
        .filter(k => k !== "faculty_id");

    return keys.includes("id")
      ? ["id", ...keys.filter(k => k !== "id")]
      : keys;

  }, [sortedItems]);

  /* ---------- PAGINATION ---------- */

  const paginatedItems = useMemo(() => {

    const start = (currentPage - 1) * viewLimit;

    return sortedItems.slice(
      start,
      start + viewLimit
    );

  }, [sortedItems, currentPage, viewLimit]);

  /* ---------- SORT HANDLER ---------- */

  const handleSort = (col) => {

    setSortConfig(prev => {

      if (!prev || prev.key !== col)
        return { key: col, direction: "asc" };

      if (prev.direction === "asc")
        return { key: col, direction: "desc" };

      return null;

    });

  };

  return (

    <div className="table-scroll">

      <table className="rounded-table">

        <thead>

          <tr>

            {columns.map(col => (

              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{cursor:"pointer"}}
              >

                {col.toUpperCase().replaceAll("_"," ")}

                {sortConfig?.key === col &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}

              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {paginatedItems.map((row,i)=>(

            <tr key={i}>

              {columns.map(col => (

                <td key={col}>
                  {row[col] ?? "—"}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}