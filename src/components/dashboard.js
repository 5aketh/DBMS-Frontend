import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FDashboard from "./fDashboard";
import ADashboard from "./aDachboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin")==="true";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login first");
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  return (
    <div className="screen">
      {(isAdmin) ? (<ADashboard/>) : (<FDashboard/>)} 
    </div>
  );
}