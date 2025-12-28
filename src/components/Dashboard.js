import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });

  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', expenseForm);
      setShowAddExpense(false);
      setExpenseForm({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0]
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Calculations
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Spending Trend (Group by Month)
  const spendingData = expenses.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ month, amount: curr.amount });
    }
    return acc;
  }, []);
  // Sort by month (simple approximation, relying on insert order or date sort in backend)
  // Backend sorts by date DESC, so reverse for chart?
  // Actually reducing from DESC list might give reverse order.
  // Better to sort by date.
  spendingData.sort((a, b) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });


  // Category Breakdown
  const categoryData = categories.map(cat => {
    const value = expenses.filter(e => e.category === cat).reduce((acc, c) => acc + c.amount, 0);
    return { name: cat, value, color: getCategoryColor(cat) };
  }).filter(item => item.value > 0);

  function getCategoryColor(category) {
    const colors = {
      Food: "#00bcd4",
      Transport: "#ff7043",
      Entertainment: "#4caf50",
      Shopping: "#66bb6a",
      Bills: "#9e9e9e",
      Other: "#607d8b"
    };
    return colors[category] || "#607d8b";
  }

  function getCategoryIcon(category) {
    const icons = {
      Food: "🛒",
      Transport: "🚗",
      Entertainment: "🎬",
      Shopping: "🛍️",
      Bills: "🏠",
      Other: "💳"
    };
    return icons[category] || "💳";
  }

  // Recent Transactions
  const recentTransactions = expenses.slice(0, 10); // First 10 (sorted DESC by backend)

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Fixed Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-expense">Expense</span>
            <span className="logo-tracker">Tracker</span>
          </h1>
          <p className="welcome-text">Welcome back, {user?.username}!</p>
        </div>
        <div className="header-right">
          <button className="add-expense-btn" onClick={() => setShowAddExpense(true)}>
            <span className="plus-icon">+</span>
            Add Expense
          </button>
          <button className="home-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-header">
              <span className="stat-title">Total Balance</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="stat-amount">${totalExpenses.toFixed(2)}</div>
            <div className="stat-subtitle">Total Spent</div>
          </div>

          {/* More stats can be added if calculated effectively */}
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <div className="transaction-icon">{getCategoryIcon(transaction.category)}</div>
                  <div className="transaction-details">
                    <h3 className="transaction-title">{transaction.title}</h3>
                    <p className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</p>
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
                  <button className="delete-btn" onClick={() => handleDeleteExpense(transaction.id)}>×</button>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && <p className="no-transactions">No transactions yet.</p>}
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
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
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
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
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
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
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