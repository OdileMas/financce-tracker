import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, PieChart, ShieldCheck, Target, 
  ArrowRight, Globe, MessageCircle, Hash
} from "lucide-react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <div className="badge glass-card">Smart Expense Management</div>
          <h1 className="headline">
            Master your finances <br />
            with <span className="highlight-text">clarity.</span>
          </h1>
          <p className="hero-description">
            Experience a modern, intuitive way to track your spending, analyze patterns, 
            and achieve your financial goals effortlessly.
          </p>
          <div className="button-group">
            <button className="primary-btn" onClick={() => navigate("/auth")}>
              Get Started Now <ArrowRight size={18} />
            </button>
            <button className="secondary-btn glass-card" onClick={() => navigate("/dashboard")}>
              View Dashboard
            </button>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-header">
          <h2>What is this system?</h2>
          <p>Your personal financial assistant, simplified.</p>
        </div>
        <div className="about-grid">
          <div className="about-card glass-card">
            <div className="icon-wrapper">
              <BarChart3 size={48} color="#C65C26" />
            </div>
            <h3>What it does</h3>
            <p>
              It provides a centralized dashboard to log all your daily expenses, 
              categorize them, and visualize where your money is going over time.
            </p>
          </div>
          <div className="about-card glass-card">
            <div className="icon-wrapper">
              <PieChart size={48} color="#C65C26" />
            </div>
            <h3>How it helps</h3>
            <p>
              By giving you a clear picture of your spending habits, it empowers you 
              to make informed decisions, cut unnecessary costs, and save more.
            </p>
          </div>
        </div>
      </section>

      <section className="expectations-section">
        <div className="section-header">
          <h2>What to expect</h2>
          <p>A seamless journey from start to financial freedom.</p>
        </div>
        <div className="timeline-container">
          <div className="timeline-item glass-card">
            <div className="timeline-marker">
              <Target size={24} />
            </div>
            <div className="timeline-content">
              <h3>Before creating an account</h3>
              <p>
                You can explore the interface and understand our features. However, 
                your financial data requires a secure account to be stored, analyzed, 
                and protected properly.
              </p>
            </div>
          </div>
          <div className="timeline-item glass-card">
            <div className="timeline-marker">
              <ShieldCheck size={24} />
            </div>
            <div className="timeline-content">
              <h3>After creating an account</h3>
              <p>
                Unlock the full potential! Log unlimited transactions, generate visual 
                reports, set up categories, and access your dashboard securely from 
                any device, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>FinanceTracker</h3>
            <p>Take control of your money.</p>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Have questions? We're here to help.</p>
            <a href="mailto:masengeshoodile@gmail.com.com" className="contact-link">
              masengeshoodile@gmail.com
            </a>
          </div>
          <div className="footer-socials">
            <h4>Follow Us</h4>
            <div className="social-links">
              <span className="social-icon"><Globe size={20} /></span>
              <span className="social-icon"><MessageCircle size={20} /></span>
              <span className="social-icon"><Hash size={20} /></span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;