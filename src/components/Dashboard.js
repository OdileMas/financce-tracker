import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { 
  LogOut, Plus, Wallet, ShoppingCart, Car, 
  Film, Home as HomeIcon, CreditCard, X, TrendingUp 
} from "lucide-react";
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

  const [formError, setFormError] = useState("");

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
    setFormError("");
    try {
      const payload = {
        ...expenseForm,
        amount: parseFloat(expenseForm.amount)
      };
      await api.post('/expenses', payload);
      setShowAddExpense(false);
      setExpenseForm({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split('T')[0]
      });
      fetchExpenses();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Error adding expense";
      setFormError(errMsg);
      console.error("Error adding expense", errMsg);
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

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

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
  
  spendingData.sort((a, b) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

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
    switch(category) {
      case "Food": return <ShoppingCart size={20} />;
      case "Transport": return <Car size={20} />;
      case "Entertainment": return <Film size={20} />;
      case "Shopping": return <ShoppingCart size={20} />;
      case "Bills": return <HomeIcon size={20} />;
      default: return <CreditCard size={20} />;
    }
  }

  const recentTransactions = expenses.slice(0, 10);

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Fixed Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">
            Finance<span className="logo-tracker">Tracker</span>
          </h1>
          <p className="welcome-text">Welcome back, <strong>{user?.username}</strong>!</p>
        </div>
        <div className="header-right">
          <button className="add-expense-btn" onClick={() => setShowAddExpense(true)}>
            <Plus size={18} />
            Add Expense
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span className="hide-mobile">Logout</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-card-primary glass-card">
            <div className="stat-header">
              <span className="stat-title">Total Balance Spent</span>
              <div className="stat-icon-wrapper">
                <Wallet size={24} color="white" />
              </div>
            </div>
            <div className="stat-amount">${totalExpenses.toFixed(2)}</div>
            <div className="stat-subtitle">
              <TrendingUp size={16} /> All-time expenses
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Spending Trend Chart */}
          <div className="chart-section glass-card">
            <h2 className="chart-title">Spending Trend</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="month" stroke="#888" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#888" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#C65C26', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#C65C26"
                    strokeWidth={4}
                    dot={{ fill: '#C65C26', r: 5, strokeWidth: 0 }}
                    activeDot={{ r: 8, stroke: '#FFF4D6', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="chart-section glass-card">
            <h2 className="chart-title">Category Breakdown</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section glass-card">
          <h2 className="section-title">Recent Transactions</h2>
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  <div 
                    className="transaction-icon"
                    style={{ backgroundColor: `${getCategoryColor(transaction.category)}15`, color: getCategoryColor(transaction.category) }}
                  >
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div className="transaction-details">
                    <h3 className="transaction-title">{transaction.title}</h3>
                    <p className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="transaction-right">
                  <span
                    className="transaction-category"
                    style={{ backgroundColor: `${getCategoryColor(transaction.category)}15`, color: getCategoryColor(transaction.category) }}
                  >
                    {transaction.category}
                  </span>
                  <span className="transaction-amount">-${transaction.amount.toFixed(2)}</span>
                  <button className="delete-btn" onClick={() => handleDeleteExpense(transaction.id)}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="no-transactions">
                <CreditCard size={48} color="#ccc" />
                <p>No transactions yet. Start adding some!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Expense</h2>
              <button className="modal-close" onClick={() => setShowAddExpense(false)}>
                <X size={24} />
              </button>
            </div>
            {formError && <div className="error-message">{formError}</div>}
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