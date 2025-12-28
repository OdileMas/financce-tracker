import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    fullName: "" // Kept for UI but not sent to backend if not needed or mapped to username
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        await signup(formData.username || formData.fullName.split(' ')[0], formData.email, formData.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back To Home
      </button>

      <div className="auth-box">
        <div className="welcome">Welcome To Expense Tracker</div>
        <p>Sign in to your Account or Create a new one</p>
        <div className="tab-row">
          <div
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </div>
          <div
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-content">
          {!isLogin && (
            <>
              <span>Username</span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </>
          )}
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="yourEmail@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <>
              <span>Confirm</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </>
          )}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Login" : "Signup")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
