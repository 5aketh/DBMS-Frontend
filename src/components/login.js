import { useState, useEffect } from "react";

import Header from "./header";
import { userAuth } from "./api";

import "../styles/login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navItems = [
    { name: "Journals", path: "/journals" },
    { name: "Books", path: "/books" },
    { name: "Conference", path: "/conferences" },
  ];

  function validate() {
    if (!email) return "Email is required";

    if (!/^[a-zA-Z0-9._%+-]+@bmsce\.ac\.in$/.test(email))
      return "Enter a valid BMSCE email";

    if (!password) return "Password is required";
    return "";
  }


  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    setLoading(true);

    const result = await userAuth(email, password);

    if (result.error) {
      setLoading(false);
      return setError(result.error);
    }

    if (result.access_token) {
      console.log(result)
      localStorage.setItem('isAdmin', email.split("@")[0] === "admin")
      localStorage.setItem('accessToken', result.access_token);
      localStorage.setItem('tokenType', result.token_type);
      window.location.href = `/dashboard`;
    }

    setEmail("");
    setPassword("");
    setLoading(false);
  }


  useEffect(() => {
    if (localStorage.getItem('accessToken') !== null && localStorage.getItem('tokenType') !== null) {
      window.location.href = "/dashboard";
    }
  }, []);


  return (
    <>
      <Header navItems={navItems} />
      <div className="login-main-cont">
        <><img src="/images/home.png" alt="Home Illustration" className="home_img" /></>
        <div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="login-container"
        >
          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to access your account</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name.dept@bmsce.ac.in" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-wrap">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <button type="button" className="eye-btn" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <img src="/svgs/eye2.svg" alt="eyeOff" /> : <img src="/svgs/eye.svg" alt="eye" />}
                </button>
              </div>
            </div>
            <div className="form-row">
              <label><input type="checkbox" /> Remember me</label>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
