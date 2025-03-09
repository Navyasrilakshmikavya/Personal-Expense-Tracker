import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../index.css"
import './Navigation.css'
const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning! ☀️");
    else if (hour < 18) setGreeting("Good Afternoon! 🌤️");
    else setGreeting("Good Evening! 🌙");
  }, []);

  const styles = {
    hero: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '50px 20px',
      backgroundColor: '#f3f4f6',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
    },
    heroHeading: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '15px'
    },
    heroText: {
      fontSize: '1.2rem',
      color: '#4b5563',
      maxWidth: '600px',
      marginBottom: '20px'
    },
    heroButton: {
      marginTop: '10px',
      padding: '12px 24px',
      fontSize: '1rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: '0.3s'
    },
    heroButtonHover: {
      backgroundColor: '#1e40af'
    },
    features: {
      padding: '60px 20px',
      backgroundColor: '#ffffff',
      textAlign: 'center'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      padding: '20px'
    },
    featureCard: {
      padding: '20px',
      background: '#f9fafb',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: '0.3s',
      cursor: 'pointer'
    },
    footer: {
      backgroundColor: '#2563eb',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      marginTop: '50px'
    },
    footerLink: {
      color: 'white',
      textDecoration: 'underline'
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroHeading}>{greeting}</h1>
        <p style={styles.heroText}>
          Manage your finances smartly with Expense Tracker. 
          Keep track of your spending and save money effortlessly!
        </p>
        <button
          onClick={() => navigate(user ? (user.role === "admin" ? "/admin" : "/expenses") : "/signup")}
          style={styles.heroButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.heroButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.heroButton.backgroundColor)}
        >
          {user ? `Go to ${user.role === "admin" ? "Admin Panel" : "Dashboard"}` : "Get Started"}
        </button>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#1f2937' }}>Why Choose Expense Tracker?</h2>
        <div style={styles.featureGrid}>
          {[
            { title: "🔍 Track Every Penny", text: "Monitor your expenses easily and understand where your money goes." },
            { title: "📊 Smart Analytics", text: "Visualize spending patterns with detailed charts and insights." },
            { title: "🔒 Secure & Private", text: "Your financial data is safe with us, encrypted for your protection." }
          ].map((feature, index) => (
            <div key={index} style={styles.featureCard}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#4b5563' }}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          📧 Email us at <a href="mailto:support@expensetracker.com" style={styles.footerLink}>support@expensetracker.com</a>
        </p>
        <p>
          📍 Follow us on <a href="https://twitter.com/ExpenseTracker" style={styles.footerLink}>Twitter</a>
        </p>
        <p>&copy; 2025 Expense Tracker. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
