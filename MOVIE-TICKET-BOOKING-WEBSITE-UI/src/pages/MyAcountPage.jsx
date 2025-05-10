import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../contexts/AuthContext';
import "./styles/MyAccountPage.css";
import DashboardTab from '../components/account/DashboardTab';
import OrdersTab from '../components/account/OrdersTab';

function MyAccountPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [activeDashboardTab, setActiveDashboardTab] = useState("Dashboard");
  const { signIn, signUp, currentUser, signOut } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await signIn({
      email: formData.email,
      password: formData.password,
    });

    if (!success) setError("Invalid login credentials.");
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await signUp({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (!success) {
      setError("Registration failed.");
    } else {
      setActiveTab("login");
    }

    setLoading(false);
  };

  // Render the active dashboard tab content
  const renderDashboardContent = () => {
    switch (activeDashboardTab) {
      case "Dashboard":
        return <DashboardTab />;
      case "Orders":
        return <OrdersTab />;
      case "Downloads":
        return (
          <div className="alert alert-info">
            You have no downloads available yet.
          </div>
        );
      case "Addresses":
        return (
          <div className="alert alert-info">
            You haven't added any addresses yet.
          </div>
        );
      case "Account details":
        return (
          <div>
            <h3 className="mb-4">Account Details</h3>
            <p>Name: {currentUser?.name || "Not provided"}</p>
            <p>Email: {currentUser?.email}</p>
          </div>
        );
      default:
        return <DashboardTab />;
    }
  };

  // Dashboard UI when logged in
  const renderDashboard = () => (
    <div className="container py-5 d-flex flex-column flex-md-row">
      <div style={{ width: "300px" }} className="mb-4 mb-md-0">
        <ul className="list-group">
          {[
            "Dashboard",
            "Orders",
            "Downloads",
            "Addresses",
            "Account details",
            "Log out",
          ].map((item) => (
            <li
              key={item}
              className={`list-group-item fw-bold border-0 ${
                item === activeDashboardTab ? "bg-primary text-white" : "hoverable"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (item === "Log out") {
                  signOut();
                } else {
                  setActiveDashboardTab(item);
                }
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 flex-grow-1">
        {renderDashboardContent()}
      </div>
    </div>
  );


  return (
    <>
      <Navbar />
      <Header title="My Account" />
      <main className="py-5">
        <div className="container d-flex justify-content-center">
          {currentUser ? (
            renderDashboard()
          ) : (
            <div style={{ width: "100%", maxWidth: "400px" }}>
              {/* Tabs */}
              <ul className="nav nav-tabs mb-3 justify-content-center">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "login" ? "active text-primary fw-bold border-bottom border-primary" : "text-primary"}`}
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "register" ? "active text-primary fw-bold border-bottom border-primary" : "text-primary"}`}
                    onClick={() => setActiveTab("register")}
                  >
                    Register
                  </button>
                </li>
              </ul>

              {error && (
                <div className="alert alert-primary text-center py-1">
                  {error}
                </div>
              )}

              {/* Login Form */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">
                      Email address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">
                      Password <span className="text-primary">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ backgroundColor: "#e9f2ff" }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-block text-white w-100 bg-primary"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log in"}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === "register" && (
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-bold">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">
                      Email address <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">
                      Password <span className="text-primary">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ backgroundColor: "#e9f2ff" }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-block text-white w-100"
                    style={{ backgroundColor: "#cc5a1e" }}
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MyAccountPage;
