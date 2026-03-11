import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Filter from "./filter";
import Header from "./header";
import Table from "./table";

export default function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = useMemo(() => [
    { name: "Journals", path: "/journals" },
    { name: "Books", path: "/books" },
    { name: "Conferences", path: "/conferences" },
  ], []);

  const [items, setItems] = useState([]);
  const [viewLimit, setViewLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTags, setSearchTags] = useState([]);
  const type = location.pathname.slice(1);

  useEffect(() => {
    const validPaths = navItems.map(item => item.path);
    if (!validPaths.includes(location.pathname)) {
      navigate("/404");
    }
  }, [location.pathname, navigate, navItems]);

  return (
    <div className="screen">
      <header className="header">
        <Header navItems={navItems} loginStatus={"login"} />
        <Filter
          page={currentPage}
          onChange={({ searchTags: tags, currentPage: page }) => {
            setSearchTags(tags);
            setCurrentPage(page);
          }}
        />
      </header>

      <Table
        key={type}
        type={type}
        items={items}
        searchTags={searchTags}
        viewLimit={viewLimit}
        currentPage={currentPage}
        onChange={({ currentPage: page, viewLimit: limit }) => {
          setCurrentPage(page);
          setViewLimit(limit);
        }}
      />
    </div>
  );
}