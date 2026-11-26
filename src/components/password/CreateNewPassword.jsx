import React, { useState } from "react";
import "./CreateNewPassword.css";
import logo from "../../assets/attrallogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";

const CreateNewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";
  const otpFromState = location.state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [notMatch, setNotMatch] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    const minLength = pass.length >= 8 && pass.length <= 64;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);

    return (
      minLength && [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length >= 2
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotMatch("");
    setSuccess("");

    if (!validatePassword(password)) {
      setError(
        "Password must be 8–64 characters and include at least 2 types: uppercase, lowercase, number, special character."
      );
      return;
    }

    if (password !== confirmPass) {
      setNotMatch("Passwords do not match.");
      return;
    }

    if (!emailFromState || !otpFromState) {
      setError("Missing email or OTP verification. Please start from Password Assistance.");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword(emailFromState, otpFromState, password);
      setSuccess("Password successfully updated! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/Signinpage");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-new-password-form" onSubmit={handleSubmit}>
      <div>
        <img className="create-new-password-aattral" src={logo} alt="aattral" />
        <a
          className="create-new-password-Poweredby"
          href="https://techbrainnetworks.com/"
        >
          Powered by <span className="create-new-password-techbrain">
            Techbrain Networks
          </span>
        </a>
      </div>

      <div className="create-new-password-container">
        <h2 className="create-new-password-head">Create New Password</h2>

        <div className="create-new-password-input-container">
          <div className="create-new-password-input-box">
            <input
              className="create-new-password-input"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="password-tips">
              <h6>Tip</h6>
              <p className="tip">
                Be between 8 and 64 characters. <br /> Include at least two of
                the following:
              </p>
              <ul className="tip-list">
                <li>An uppercase character</li>
                <li>A lowercase character</li>
                <li>A number</li>
                <li>A special character</li>
              </ul>
            </div>
          </div>

          <div className="create-new-password-input-box">
            <input
              className="create-new-password-input"
              type="password"
              placeholder="Re-enter Password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}
        {notMatch && <p className="notmatch-text">{notMatch}</p>}
        {success && <p style={{ color: "#38a169", fontSize: "14px", margin: "8px 0", textAlign: "center" }}>{success}</p>}

        <button type="submit" className="create-new-password-submit" disabled={loading}>
          {loading ? "Updating..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default CreateNewPassword;
