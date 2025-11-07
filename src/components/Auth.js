// src/components/Auth.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup

  return (
    <div className="auth-container">
    
      <button className="back-btn" onClick={() => navigate("/")}>
        ←Back To Home
      </button>

      <div className="auth-box">
        <div className="welcome">Welcome To Expense tracker</div>
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

        {isLogin ? (
          <div className="form-content">
            <span>Email</span>
            <input type="email" placeholder="yourEmail@gmail.com" />
            <span>Password</span>
            <input type="password" placeholder="Password" />
            <button className="auth-btn">Login</button>
          </div>
        ) : (
          <div className="form-content">
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button className="auth-btn">Signup</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
