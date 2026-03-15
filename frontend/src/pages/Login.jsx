
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API
      const response = await authAPI.login(formData);
      
      // Check if it's admin login
      const isAdmin = response.data.user.role === 'admin';
      
      alert("Login successful! Welcome back.");
      
      // Redirect based on user role
      if (isAdmin) {
        navigate("/profile"); // Admin dashboard
      } else {
        navigate("/"); // Regular user dashboard
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: error.message || "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const email = prompt("Enter your email address for password reset:");
    if (email && /\S+@\S+\.\S+/.test(email)) {
      alert(`Password reset link has been sent to ${email}`);
    } else if (email) {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="auth-page">
      {/* Navigation */}
      <nav className="auth-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            MovieReview
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/top-rated">Top Rated</Link>
            <Link to="/login">Login / Signup</Link>
          </div>
          <div className="nav-search">
            <input
              type="text"
              placeholder="Search movies..."
              className="search-input"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="auth-main">
        <div className="auth-background"></div>
        <div className="auth-form-container">
          <div className="auth-card">
            <h1 className="auth-title">Login</h1>
            
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email Input */}
              <div className="form-group">
                <div className="input-group">
                  <div className="input-icon">📧</div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Email"
                    required
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <div className="error-text">{errors.email}</div>
                )}
              </div>

              {/* Password Input */}
              <div className="form-group">
                <div className="input-group">
                  <div className="input-icon">🔒</div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                  />
                </div>
                {errors.password && (
                  <div className="error-text">{errors.password}</div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="forgot-password">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="forgot-link"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Signup Link */}
            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Sign up here!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="auth-footer-bottom">
        <p>© 2024 MovieReview. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
