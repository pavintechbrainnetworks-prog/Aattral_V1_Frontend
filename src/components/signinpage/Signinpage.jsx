import React, { useState } from "react";
import { useForm } from "react-hook-form";
import logo from '../../assets/attrallogo1.png'
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import facebook from "../../assets/facebook.png";
import "./Signinpage.css";
import { Link } from "react-router-dom";

export const Signinpage = () => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
  };

  return (
    <div>
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
        className={`signin-container ${expanded ? "expanded" : ""}`}
      >
        <h1 className="signin-title">Sign in</h1>

        {/* Email */}
        <div className="signin-input-box">
          <input
            className="signin-input"
            type="text"
            placeholder="Enter your email ID"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && (
            <p className="error-msg">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="signin-input-box">
          <input
            className="signin-input"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <p className="error-msg">{errors.password.message}</p>
          )}
        </div>

        <a className="forgot-password" href="/PasswordAssistance">
          forgot password?
        </a>

        <button className="signin-button" type="submit">
          Sign in
        </button>

        <p className="or-signup">or sign up with</p>
        
        {/* Social Icons */}
        <div className="signin-social-icon">
          <a href="https://accounts.google.com/">
            <img src={google} alt="google-login" />
          </a>

          <a href="https://account.apple.com/">
            <img src={apple} alt="apple-login" />
          </a>

          <a href="https://www.facebook.com/">
            <img src={facebook} alt="facebook-login" />
          </a>
        </div>

        <span className="no-account">
          Don't have an account?{" "}
          <Link to="/Signuppage" className="signin" onClick={handleClick}>
            {expanded ? "Close" : "Sign up"}
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signinpage;
