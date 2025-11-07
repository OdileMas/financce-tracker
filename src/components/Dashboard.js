import React from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // Sample data for the chart
  const spendingData = [
    { month: "Jan", amount: 850 },
    { month: "Feb", amount: 1200 },
    { month: "Mar", amount: 1000 },
    { month: "Apr", amount: 1500 },
    { month: "May", amount: 1100 },
    { month: "Jun", amount: 1250 },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-expense">Expense</span>
            <span className="logo-tracker">Tracker</span>
          </h1>
          <p className="welcome-text">Welcome back!</p>
        </div>
        <div className="header-right">
          <button className="add-expense-btn">
            <span className="plus-icon">+</span>
            Add Expense
          </button>
          <button className="home-btn" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-header">
            <span className="stat-title">This Month</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="stat-amount">$1234.50</div>
          <div className="stat-subtitle">41.1% of $3000 budget</div>
        </div>

        <div className="stat-card stat-card-white">
          <div className="stat-header">
            <span className="stat-title-dark">Total Expenses</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" strokeWidth="2">
              <path d="M3 17l3-3 4 4 8-8 3 3" />
              <path d="M21 7v6" />
            </svg>
          </div>
          <div className="stat-amount-dark">$2543.50</div>
          <div className="stat-subtitle-dark">All time</div>
        </div>

        <div className="stat-card stat-card-white">
          <div className="stat-header">
            <span className="stat-title-dark">vs Last Month</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
              <path d="M3 17l3-3 4 4 8-8 3 3" />
              <path d="M21 10l-6-6" />
            </svg>
          </div>
          <div className="stat-amount-dark">-5.7%</div>
          <div className="stat-subtitle-dark">$74.50 difference</div>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="chart-section">
        <h2 className="chart-title">Spending Trend</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#999"
                style={{ fontSize: '14px' }}
              />
              <YAxis 
                stroke="#999"
                style={{ fontSize: '14px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#00bcd4" 
                strokeWidth={3}
                dot={{ fill: '#00bcd4', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;