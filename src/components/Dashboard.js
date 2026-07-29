
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { useAuth } from "../context/AuthContext";
import api from "../api";

import {
  LogOut,
  Plus,
  Wallet,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Search,
  Edit2,
  Save,
  Filter,
  X,
  TrendingUp,
  Target,
  CheckCircle,
  ShoppingCart,
  Car,
  Film,
  HomeIcon,
  CreditCard
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [deletedExpenses, setDeletedExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchMonth, setSearchMonth] = useState("");
  const [searchYear, setSearchYear] = useState("");
  
  
  const [activeTab, setActiveTab] = useState("active");
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [budgetForm, setBudgetForm] = useState({
    amount: "",
    period: "monthly"
  });
  const [budgets, setBudgets] = useState([]);
  const [deleteReason, setDeleteReason] = useState("");
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Other"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

 useEffect(() => {
  fetchExpenses();
  fetchDeletedExpenses();
  fetchBudgets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchDate, searchMonth, searchYear]);

  const fetchExpenses = async () => {
    try {
      let url = '/expenses';
      const params = new URLSearchParams();
      if (searchDate) params.append('date', searchDate);
      if (searchMonth) params.append('month', searchMonth);
      if (searchYear) params.append('year', searchYear);
      if (searchQuery) params.append('q', searchQuery);
      if (params.toString()) url += '?' + params.toString();
      const response = await api.get(url);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedExpenses = async () => {
    try {
      const response = await api.get('/expenses/deleted');
      setDeletedExpenses(response.data);
    } catch (error) {
      console.error("Error fetching deleted expenses", error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error("Error fetching budgets", error);
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
      setExpenseForm({ title: "", amount: "", category: "", date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
      fetchBudgets();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Error adding expense";
      setFormError(errMsg);
      console.error("Error adding expense", errMsg);
    }
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit({ ...expense });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!expenseToEdit) return;
    try {
      const payload = {
        ...expenseToEdit,
        amount: parseFloat(expenseToEdit.amount)
      };
      await api.put(`/expenses/${expenseToEdit.id}`, payload);
      setShowEditModal(false);
      setExpenseToEdit(null);
      fetchExpenses();
      fetchBudgets();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Error updating expense";
      setFormError(errMsg);
      console.error("Error updating expense", errMsg);
    }
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDeleteReason("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await api.delete(`/expenses/${expenseToDelete.id}`, {
        data: { reason: deleteReason || "No reason provided" }
      });
      setShowDeleteModal(false);
      setDeleteReason("");
      setExpenseToDelete(null);
      fetchExpenses();
      fetchDeletedExpenses();
      fetchBudgets();
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', {
        ...budgetForm,
        amount: parseFloat(budgetForm.amount)
      });
      setShowBudgetModal(false);
      setBudgetForm({ amount: "", period: "monthly" });
      fetchBudgets();
      fetchExpenses();
    } catch (error) {
      console.error("Error creating budget", error);
    }
  };

 

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
    return monthNames.indexOf(a.month) - monthNames.indexOf(b.month);
  });

  const now = new Date();
  const monthlyExpenses = expenses.reduce((acc, curr) => {
    const d = new Date(curr.date);
    if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
      return acc + curr.amount;
    }
    return acc;
  }, 0);

  const monthlyBudget = budgets.find(b => b.period === 'monthly');
  const remainingBudget = monthlyBudget ? monthlyBudget.amount - monthlyExpenses : 0;
  const isOverspending = monthlyBudget && monthlyExpenses > monthlyBudget.amount;
  const overspendAmount = isOverspending ? monthlyExpenses - monthlyBudget.amount : 0;

  const todaySpending = expenses.filter(e => {
    const d = new Date(e.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayTotal = todaySpending.reduce((acc, curr) => acc + curr.amount, 0);

  const todayCategoryData = categories.map(cat => {
    const value = todaySpending.filter(e => e.category === cat).reduce((acc, c) => acc + c.amount, 0);
    return { name: cat, value, color: getCategoryColor(cat) };
  }).filter(item => item.value > 0);

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
      case "Food": return <ShoppingCart size={18} />;
      case "Transport": return <Car size={18} />;
      case "Entertainment": return <Film size={18} />;
      case "Shopping": return <ShoppingCart size={18} />;
      case "Bills": return <HomeIcon size={18} />;
      default: return <CreditCard size={18} />;
    }
  }

  const recentTransactions = expenses.slice(0, 10);

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">
            Finance<span className="logo-tracker">Tracker</span>
          </h1>
          <p className="welcome-text">Welcome back, <strong>{user?.username}</strong>!</p>
        </div>
        <div className="header-right">
          <button className="add-expense-btn" onClick={() => setShowAddExpense(true)}>
            <Plus size={16} />
            Add Expense
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span className="hide-mobile">Logout</span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* 3 Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-card-total glass-card">
            <div className="stat-header">
              <span className="stat-title">Total Expenses</span>
              <div className="stat-icon-wrapper">
                <Wallet size={20} color="var(--burnt-orange)" />
              </div>
            </div>
            <div className="stat-amount">${totalExpenses.toFixed(2)}</div>
            <div className="stat-subtitle">
              <TrendingUp size={14} /> {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="stat-card glass-card stat-card-budget">
            <div className="stat-header">
              <span className="stat-title">Monthly Budget</span>
              <div className="stat-icon-wrapper">
                <Target size={20} color="var(--burnt-orange)" />
              </div>
            </div>
            {monthlyBudget ? (
              <>
                <div className="stat-amount">${monthlyBudget.amount.toFixed(2)}</div>
                {isOverspending && (
                  <div className="stat-subtitle overspend-text">
                    <AlertTriangle size={14} /> Overspent by ${overspendAmount.toFixed(2)}
                  </div>
                )}
                {!isOverspending && monthlyExpenses > 0 && (
                  <div className="stat-subtitle">
                    <CheckCircle size={14} /> ${(monthlyBudget.amount - monthlyExpenses).toFixed(2)} remaining
                  </div>
                )}
                {!isOverspending && monthlyExpenses === 0 && (
                  <div className="stat-subtitle">
                    <CheckCircle size={14} /> No expenses this month
                  </div>
                )}
              </>
             ) : (
               <>
                 <div className="stat-amount" style={{ fontSize: '1.5rem' }}>No budget set</div>
               </>
             )}
             {/* Set Budget / Edit Budget button */}
             <div className="budget-setup-row">
               <button className="budget-setup-btn" onClick={() => setShowBudgetModal(true)}>
                 <Target size={14} />
                 {monthlyBudget ? 'Edit Budget' : 'Set Budget'}
               </button>
             </div>
           </div>
            <div className="stat-header">
              <span className="stat-title">Remaining</span>
              <div className="stat-icon-wrapper">
                <Clock size={20} color="var(--burnt-orange)" />
              </div>
            </div>
            {monthlyBudget ? (
              <>
                <div className="stat-amount" style={{ color: remainingBudget < 0 ? '#ff5252' : '#2196f3' }}>
                  {remainingBudget < 0 ? '-$' : '$'}{Math.abs(remainingBudget).toFixed(2)}
                </div>
                <div className="stat-subtitle">
                  {remainingBudget < 0
                    ? `You are overspending by $${(-remainingBudget).toFixed(2)}`
                    : remainingBudget === 0
                    ? 'No money left'
                    : `You have $${remainingBudget.toFixed(2)} left to spend`}
                </div>
              </>
            ) : (
              <>
                <div className="stat-amount" style={{ fontSize: '1.5rem' }}>—</div>
                <div className="stat-subtitle">Set a budget to track</div>
              </>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="filter-bar glass-card">
          <div className="filter-bar-left">
            <Filter size={18} />
            <span>Search & Filter</span>
          </div>
          <div className="filter-controls">
            <div className="filter-group search-group">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <Calendar size={16} />
              <input
                type="date"
                value={searchDate}
                onChange={(e) => { setSearchDate(e.target.value); setSearchMonth(""); setSearchYear(""); }}
              />
            </div>
            <div className="filter-group">
              <select value={searchMonth} onChange={(e) => { setSearchMonth(e.target.value); setSearchDate(""); }}>
                <option value="">All Months</option>
                {monthNames.map((m, i) => (
                  <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select value={searchYear} onChange={(e) => { setSearchYear(e.target.value); setSearchDate(""); }}>
                <option value="">All Years</option>
                {[2026, 2025, 2024].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {(searchDate || searchMonth || searchYear || searchQuery) && (
              <button className="filter-clear-btn" onClick={() => { setSearchDate(""); setSearchMonth(""); setSearchYear(""); setSearchQuery(""); }}>
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab Row */}
        <div className="tab-row expenses-tab-row">
          <div
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Expenses ({expenses.length})
          </div>
          <div
            className={`tab ${activeTab === "deleted" ? "active" : ""}`}
            onClick={() => { setActiveTab("deleted"); fetchDeletedExpenses(); }}
          >
            Deleted ({deletedExpenses.length})
          </div>
        </div>

        {activeTab === "active" ? (
          <>
            {/* Charts */}
            <div className="charts-grid">
              <div className="chart-section glass-card">
                <h2 className="chart-title">Spending Trend</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" stroke="#888" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#888" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#C65C26"
                        strokeWidth={3}
                        dot={{ fill: '#C65C26', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, stroke: '#FFF4D6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-section glass-card">
                <h2 className="chart-title">Category Breakdown</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="bottom" height={30} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Today's Spending */}
            {todaySpending.length > 0 && (
              <div className="chart-section glass-card">
                <h2 className="chart-title">
                  Today's Spending
                  <span className="chart-subtitle"> — ${todayTotal.toFixed(2)}</span>
                </h2>
                {todayCategoryData.length > 0 ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={todayCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" stroke="#888" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#888" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="#4caf50" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="no-data">No spending recorded today yet.</p>
                )}
              </div>
            )}

            {/* Transactions Table */}
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
                      <button className="edit-btn" onClick={() => handleEditClick(transaction)} title="Edit expense">
                        <Edit2 size={16} />
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteClick(transaction)} title="Delete expense">
                        <Trash2 size={16} />
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
          </>
        ) : (
          <div className="glass-card deleted-section">
            <h2 className="section-title">Deleted Expenses</h2>
            {deletedExpenses.length === 0 ? (
              <p className="no-data">No deleted expenses yet.</p>
            ) : (
              <div className="transactions-list">
                {deletedExpenses.map((expense) => (
                  <div key={expense.id} className="transaction-item deleted-item">
                    <div className="transaction-left">
                      <div className="transaction-icon" style={{ backgroundColor: 'rgba(255,82,82,0.15)', color: '#ff5252' }}>
                        <Trash2 size={18} />
                      </div>
                      <div className="transaction-details">
                        <h3 className="transaction-title">{expense.title}</h3>
                        <p className="transaction-date">{new Date(expense.date).toLocaleDateString()}</p>
                        {expense.deletedReason && (
                          <p className="deleted-reason">Reason: {expense.deletedReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="transaction-right">
                      <span className="transaction-amount" style={{ color: '#ff5252' }}>-${expense.amount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="modal-overlay" onClick={() => setShowAddExpense(false)}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Expense</h2>
                <button className="modal-close" onClick={() => setShowAddExpense(false)}>
                  <X size={20} />
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
                  <button type="button" className="btn-cancel" onClick={() => setShowAddExpense(false)}>Cancel</button>
                  <button type="submit" className="btn-add">Add Expense</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Delete Expense</h2>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                  <X size={20} />
                </button>
              </div>
              {expenseToDelete && (
                <div className="delete-confirm-info">
                  <p><strong>{expenseToDelete.title}</strong> — ${expenseToDelete.amount.toFixed(2)}</p>
                  <p className="delete-hint">Please provide a reason for deleting this expense:</p>
                  <textarea
                    className="delete-reason-input"
                    placeholder="e.g., Duplicated entry, wrong amount..."
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    rows={3}
                  />
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    <button type="button" className="btn-delete-confirm" onClick={handleConfirmDelete}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Expense Modal */}
        {showEditModal && expenseToEdit && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Edit Expense</h2>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>
                  <X size={20} />
                </button>
              </div>
              {formError && <div className="error-message">{formError}</div>}
              <form onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={expenseToEdit.title}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseToEdit.amount}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={expenseToEdit.category}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, category: e.target.value })}
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
                    value={expenseToEdit.date}
                    onChange={(e) => setExpenseToEdit({ ...expenseToEdit, date: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn-add"><Save size={16} /> Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Budget Modal */}
        {showBudgetModal && (
          <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Set Monthly Budget</h2>
                <button className="modal-close" onClick={() => setShowBudgetModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleBudgetSubmit}>
                <div className="form-group">
                  <label>Budget Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 1000.00"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Period</label>
                  <select
                    value={budgetForm.period}
                    onChange={(e) => setBudgetForm({ ...budgetForm, period: e.target.value })}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                  <button type="submit" className="btn-add"><Save size={16} /> Save Budget</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}

export default Dashboard;