import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/attrallogo.png";
import google from "../../assets/google.png";
import apple from "../../assets/apple.png";
import facebook from "../../assets/facebook.png";
import "./Signuppage.css";
import { authApi, setAuthToken, setAuthUser } from "../../services/api";

const Signuppage = () => {
  const [expanded, setExpanded] = useState(false);
  const handleClick = () => {
    setExpanded(!expanded);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [createpassword, setCreatepassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (createpassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (createpassword !== confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
        password: createpassword,
      });

      if (res.data?.token) {
        setAuthToken(res.data.token);
        setAuthUser(res.data.user);
        navigate("/HomePage");
      } else {
        navigate("/Signinpage");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="Signuppage">
        <img className="signup-attral" src={logo} alt="attral" />
        <a href="https://techbrainnetworks.com/" className="signup-Poweredby">
          Powered by <span className="signup-techbrain">Techbrain Networks</span>
        </a>
      </div>

      <div className={`signup-container ${expanded ? "expanded" : ""}`}>
        <h1 className="signup-tittle">Sign up</h1>

        <div className="signup-input-box">
          <input
            className="signup-input"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-box">
          <input
            className="signup-input"
            type="email"
            placeholder="Enter your email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-box">
          <input
            className="signup-input"
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-box">
          <input
            className="signup-input"
            type="password"
            placeholder="Create password"
            value={createpassword}
            onChange={(e) => setCreatepassword(e.target.value)}
            required
          />
        </div>

        <div className="signup-input-box">
          <input
            className="signup-input"
            type="password"
            placeholder="Confirm password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p style={{ color: "#e53e3e", fontSize: "13px", margin: "6px 0 10px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <div className="signup-input-box">
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </div>

        <p className="or-signup">or sign up with</p>
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
          <Link
            to="/Signinpage"
            className="signin"
            onClick={handleClick}
          >
            {expanded ? "Close" : "Sign in"}
          </Link>
        </span>
      </div>
    </form>
  );
};

export default Signuppage;
