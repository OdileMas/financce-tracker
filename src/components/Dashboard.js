import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Sample data for the line chart
  const spendingData = [
    { month: "Jan", amount: 850 },
    { month: "Feb", amount: 1200 },
    { month: "Mar", amount: 1000 },
    { month: "Apr", amount: 1500 },
    { month: "May", amount: 1100 },
    { month: "Jun", amount: 1250 },
  ];

  // Category breakdown data
  const categoryData = [
    { name: "Food", value: 36, color: "#00bcd4" },
    { name: "Transport", value: 23, color: "#ff7043" },
    { name: "Entertainment", value: 18, color: "#4caf50" },
    { name: "Shopping", value: 15, color: "#66bb6a" },
    { name: "Bills", value: 8, color: "#e0e0e0" },
  ];

  // Recent transactions data
  const transactions = [
    { id: 1, title: "Grocery Shopping", date: "2024-01-15", category: "Food", amount: 85.50, icon: "🛒" },
    { id: 2, title: "Coffee Shop", date: "2024-01-15", category: "Food", amount: 12.50, icon: "☕" },
    { id: 3, title: "Gas Station", date: "2024-01-14", category: "Transport", amount: 45.00, icon: "🚗" },
    { id: 4, title: "Electricity Bill", date: "2024-01-13", category: "Bills", amount: 120.00, icon: "🏠" },
    { id: 5, title: "Trip bill", date: "2025-04-23", category:"Entertainment", amount: 250.00, icon:"🌍" },
    { id: 5, title: "visit bill", date: "2025-10-23", category:"Bills", amount: 100.00, icon:"🚌" },
    { id: 5, title: "clothes shopping", date: "2025-11-10", category:"Shopping", amount: 2800.00, icon:"🛍️👗" },
    { id: 5, title: "other", date: "2025-11-23", category:"Other", amount: 100.00, icon:"💳" },


  ];

  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"];

  const handleAddExpense = (e) => {
    e.preventDefault();
    // Add expense logic here
    console.log("Adding expense:", expenseForm);
    setShowAddExpense(false);
    // Reset form
    setExpenseForm({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: "#00bcd4",
      Transport: "#ff7043",
      Entertainment: "#4caf50",
      Shopping: "#66bb6a",
      Bills: "#9e9e9e"
    };
    return colors[category] || "#00bcd4";
  };

  return (
    <div className="dashboard-container">
      {/* Fixed Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-expense">Expense</span>
            <span className="logo-tracker">Tracker</span>
          </h1>
          <p className="welcome-text">Welcome back!</p>
        </div>
        <div className="header-right">
          <button className="add-expense-btn" onClick={() => setShowAddExpense(true)}>
            <span className="plus-icon">+</span>
            Add Expense
          </button>
          <button className="home-btn" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="dashboard-content">
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

        {/* Category Breakdown */}
        <div className="chart-section">
          <h2 className="chart-title">Category Breakdown</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span style={{ color: '#666', fontSize: '14px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <h2 className="section-title">Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <div className="transaction-icon">{transaction.icon}</div>
                  <div className="transaction-details">
                    <h3 className="transaction-title">{transaction.title}</h3>
                    <p className="transaction-date">{transaction.date}</p>
                  </div>
                </div>
                <div className="transaction-right">
                  <span 
                    className="transaction-category" 
                    style={{ backgroundColor: `${getCategoryColor(transaction.category)}20`, color: getCategoryColor(transaction.category) }}
                  >
                    {transaction.category}
                  </span>
                  <span className="transaction-amount">-${transaction.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Expense</h2>
              <button className="modal-close" onClick={() => setShowAddExpense(false)}>×</button>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g., Grocery shopping"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddExpense(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-add">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;