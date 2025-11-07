import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Website name capsule */}
      <div className="tracker-name">Smart Expense Management</div>

      {/* Big headline */}
      <h1 className="headline">
        Take Control of <span className="highlight">Your</span> Finances
      </h1>

      {/* Description */}
      <p className="description">
        Track expenses, visualize spending patterns, and achieve your financial goals
        with our intuitive expense tracker.
      </p>

      {/* Buttons row */}
      <div className="button-row">
        <button className="get-started-btn" onClick={() => navigate("/auth")}>
          Get Started Free →
        </button>
        <button className="view-dashboard-btn" onClick={() => navigate("/dashboard")}>View Dashboard</button>
      </div>

      {/* Feature boxes */}
      <div className="features-grid">
        <div className="feature-box">
          <div className="feature-icon" style={{ backgroundColor: '#e0f7fa' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2">
              <path d="M3 17l3-3 4 4 8-8 3 3" />
              <path d="M21 7v6" />
            </svg>
          </div>
          <h3 className="feature-title">Track Expenses</h3>
          <p className="feature-description">
            Easily log and categorize all your expenses in seconds.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon" style={{ backgroundColor: '#e0f7fa' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3 className="feature-title">Visual Analytics</h3>
          <p className="feature-description">
            Beautiful charts and graphs to understand your spending.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon" style={{ backgroundColor: '#e0f7fa' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h3 className="feature-title">Set Budgets</h3>
          <p className="feature-description">
            Create category budgets and stay on track with your goals.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon" style={{ backgroundColor: '#e0f7fa' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3 className="feature-title">Secure & Private</h3>
          <p className="feature-description">
            Your financial data is encrypted and completely private.
          </p>
        </div>
      </div>

      {/* Stats banner */}
      <div className="stats-banner">
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Free to Use</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">∞</div>
          <div className="stat-label">Unlimited Transactions</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Access Anywhere</div>
        </div>
      </div>
    </div>
  );
}

export default Home;