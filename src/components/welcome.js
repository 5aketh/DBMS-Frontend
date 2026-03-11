import { useLocation, useNavigate } from "react-router-dom";

import Header from "./header";

import "../styles/welcome.css";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const is404 = location.pathname === "/404";

  return (
    <>
      <header className="header">
        <Header/>
      </header>
      <div className="home-container">
        {is404 ? (
          <div className="home_content">
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <img src="/images/404.png" alt="Home Illustration" className="error_img"/>
          </div>
        ) : (
          <div className="home_content" style={{"flexDirection":"row"}}>
            <><img src="/images/home.png" alt="Home Illustration" className="home_img"/></>
            <div className="btns-cont">
              <h2>Welcome to <h1>BMSCE PAPERS</h1></h2>
              <p>To keep check your dashboard please login with your college credentials</p>
              <button onClick={() => navigate("/login", { replace: true })}>Login</button>
              <button onClick={() => navigate("/journals", { replace: true })}>Enter site</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}