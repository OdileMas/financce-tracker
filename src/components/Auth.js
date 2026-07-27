import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
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
    fullName: ""
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
      <div className="auth-bg-blob auth-blob-1"></div>
      <div className="auth-bg-blob auth-blob-2"></div>
      
      <button className="back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} /> Back To Home
      </button>

      <div className="auth-box glass-card">
        <div className="auth-header">
          <h2 className="welcome">Welcome to FinanceTracker</h2>
          <p className="auth-subtitle">
            {isLogin ? "Sign in to access your dashboard" : "Create an account to get started"}
          </p>
        </div>

        <div className="tab-row">
          <div
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Login
          </div>
          <div
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Signup
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-content">
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    name="username"
                    placeholder="e.g. johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="youremail@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" size={20} /> : (isLogin ? "Login" : "Create Account")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
