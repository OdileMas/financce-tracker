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
        <button className="view-dashboard-btn">View Dashboard</button>
      </div>
    </div>
  );
}

export default Home;
