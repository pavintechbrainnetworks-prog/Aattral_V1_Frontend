import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/attrallogo.png";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import facebook from "../../assets/facebook.png";
import "./Signuppage.css";

const Signuppage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const handleClick = () => {
    setExpanded(!expanded);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [createpassword, setCreatepassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION FUNCTION ----------------
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!createpassword) {
      newErrors.createpassword = "Password is required";
    } else if (createpassword.length < 6) {
      newErrors.createpassword = "Password must be at least 6 characters";
    }

    if (!confirmpassword) {
      newErrors.confirmpassword = "Confirm your password";
    } else if (createpassword !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validate()) {
      setLoading(true);
      try {
        await api.post("/auth/register", {
          name,
          email,
          phone,
          password: createpassword,
        });
        navigate("/sign-in");
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Registration failed. Please try again.";
        setApiError(Array.isArray(msg) ? msg.join(", ") : msg);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="signuppage-form">
      <div className="Signuppage">
        <img className="signup-attral" src={logo} alt="attral" />
        <a href="https://techbrainnetworks.com/" className="signup-Poweredby">
          Powered by <span className="signup-techbrain">Techbrain Networks</span>
        </a>
      </div>

      <div className={`signup-container ${expanded ? "expanded" : ""}`}>
        <h1 className="signup-tittle">Sign up</h1>

        {/* FULL NAME */}
        <div className="signup-input-box">
          <label htmlFor="signup-name" className="sr-only">Full Name</label>
          <input
            id="signup-name"
            className="signup-input"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span id="name-error" className="error" role="alert">{errors.name}</span>}
        </div>

        {/* EMAIL */}
        <div className="signup-input-box">
          <label htmlFor="signup-email" className="sr-only">Email Address</label>
          <input
            id="signup-email"
            className="signup-input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email ID"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span id="email-error" className="error" role="alert">{errors.email}</span>}
        </div>

        {/* PHONE */}
        <div className="signup-input-box">
          <label htmlFor="signup-phone" className="sr-only">Phone Number</label>
          <input
            id="signup-phone"
            className="signup-input"
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="Enter your phone number"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <span id="phone-error" className="error" role="alert">{errors.phone}</span>}
        </div>

        {/* PASSWORD */}
        <div className="signup-input-box">
          <label htmlFor="signup-password" className="sr-only">Create Password</label>
          <input
            id="signup-password"
            className="signup-input"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create password"
            aria-invalid={!!errors.createpassword}
            aria-describedby={errors.createpassword ? "createpassword-error" : undefined}
            value={createpassword}
            onChange={(e) => setCreatepassword(e.target.value)}
          />
          {errors.createpassword && (
            <span id="createpassword-error" className="error" role="alert">{errors.createpassword}</span>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="signup-input-box">
          <label htmlFor="signup-confirmpassword" className="sr-only">Confirm Password</label>
          <input
            id="signup-confirmpassword"
            className="signup-input"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm password"
            aria-invalid={!!errors.confirmpassword}
            aria-describedby={errors.confirmpassword ? "confirmpassword-error" : undefined}
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          {errors.confirmpassword && (
            <span id="confirmpassword-error" className="error" role="alert">{errors.confirmpassword}</span>
          )}
        </div>

        {/* BUTTON */}
        <div className="signup-input-box">
          {apiError && <span className="error" role="alert">{apiError}</span>}
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing up…" : "Sign up"}
          </button>
        </div>

        <p className="or-signup">or sign up with</p>

        {/* SOCIAL ICONS */}
        <div className="signup-social-icon">
          <a href="https://accounts.google.com/">
            <img src={google} alt="google-login" />
          </a>
          <a href="https://account.apple.com/sign-in">
            <img src={apple} alt="apple-logo" />
          </a>
          <a href="https://www.facebook.com/">
            <img src={facebook} alt="facebook-logo" />
          </a>
        </div>

        <span className="already">
          Already have an account?{" "}
          <Link to="/sign-in" className="signin" onClick={handleClick}>
            {expanded ? "Close" : "Sign in"}
          </Link>
        </span>
      </div>
    </form>
  );
};

export default Signuppage;
