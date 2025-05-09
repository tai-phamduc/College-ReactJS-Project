import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../contexts/AuthContext';
import "./styles/MyAccountPage.css";

function MyAccountPage() {
  const [activeTab, setActiveTab] = useState("login");
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

  // Dashboard UI when logged in
  const renderDashboard = () => (
    <div className="container py-5 d-flex">
      <div style={{ width: "300px" }}>
        <ul className="list-group">
          {[
            "Dashboard",
            "Orders",
            "Downloads",
            "Addresses",
            "Account details",
            "Log out",
          ].map((item, idx) => (
            <li
              key={item}
              className={`list-group-item fw-bold border-0 ${
                item === "Dashboard" ? "bg-primary text-white" : "hoverable"
              } ${item === "Log out" ? "" : ""}`}
              style={{ cursor: item === "Log out" ? "pointer" : "default" }}
              onClick={item === "Log out" ? signOut : undefined}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4">
        <p>
          Hello <strong>{currentUser?.email}</strong> (
          <span className="text-primary" onClick={signOut} style={{ cursor: "pointer" }}>
            not {currentUser?.email}? Log out
          </span>
          )
        </p>
        <p>
          From your account dashboard you can view your{" "}
          <span className="text-warning">recent orders</span>, manage your{" "}
          <span className="text-warning">shipping and billing addresses</span>, and{" "}
          <span className="text-warning">edit your password and account details</span>.
        </p>
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
