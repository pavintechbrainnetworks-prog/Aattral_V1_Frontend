import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/attrallogo1.png'
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import facebook from "../../assets/facebook.png";
import "./Signinpage.css";
import { Link } from "react-router-dom";
import api from "../../services/api";

export const Signinpage = () => {
  const [expanded, setExpanded] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      setApiError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signinpage-wrapper">
      <div className="Signinpage">
        <img className="signin-attral" src={logo} alt="attral" />
        <a
          href="https://techbrainnetworks.com/"
          className="signin-Poweredby"
        >
          Powered by{" "}
          <span className="signin-techbrain">Techbrain Networks</span>
        </a>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={`signin-container ${expanded ? "expanded" : ""}`}
      >
        <h1 className="signin-title">Sign in</h1>

        {/* Email */}
        <div className="signin-input-box">
          <label htmlFor="signin-email" className="sr-only">Email Address</label>
          <input
            id="signin-email"
            className="signin-input"
            type="email"
            placeholder="Enter your email ID"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="error-msg" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="signin-input-box">
          <label htmlFor="signin-password" className="sr-only">Password</label>
          <input
            id="signin-password"
            className="signin-input"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <p className="error-msg" role="alert">{errors.password.message}</p>
          )}
        </div>

        <a className="forgot-password" href="/password-assistance">
          forgot password?
        </a>

        <button className="signin-button" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {apiError && (
          <p className="error-msg" role="alert">{apiError}</p>
        )}

        <p className="or-signup">or sign up with</p>
        
        {/* Social Icons */}
        <div className="signin-social-icon">
          <a href="https://accounts.google.com/" aria-label="Sign in with Google">
            <img src={google} alt="" aria-hidden="true" />
          </a>

          <a href="https://account.apple.com/" aria-label="Sign in with Apple">
            <img src={apple} alt="" aria-hidden="true" />
          </a>

          <a href="https://www.facebook.com/" aria-label="Sign in with Facebook">
            <img src={facebook} alt="" aria-hidden="true" />
          </a>
        </div>

        <span className="no-account">
          Don't have an account?{" "}
          <Link to="/sign-up" className="signin" onClick={handleClick}>
            {expanded ? "Close" : "Sign up"}
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signinpage;
