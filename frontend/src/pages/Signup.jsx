import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const response = await authAPI.register(formData);
      
      alert("Account created successfully! Please login.");
      navigate("/login");
      
    } catch (error) {
      console.error("Signup error:", error);
      if (error.message.includes('already exists')) {
        setErrors({ email: "Email already exists" });
      } else {
        setErrors({ general: error.message || "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
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
            <h1 className="auth-title">Sign Up</h1>
            
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name Input */}
              <div className="form-group">
                <div className="input-group">
                  <div className="input-icon">👤</div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Full Name"
                    required
                  />
                </div>
                {errors.name && (
                  <div className="error-text">{errors.name}</div>
                )}
              </div>

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
                  />
                </div>
                {errors.password && (
                  <div className="error-text">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="form-group">
                <div className="input-group">
                  <div className="input-icon">🔒</div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="error-text">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="btn auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            {/* Login Link */}
            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Login here!
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

export default Signup;
