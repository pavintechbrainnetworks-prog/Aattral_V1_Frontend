import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateNewPassword.css";
import logo from "../../assets/attrallogo.png";
import api from "../../services/api";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [notMatch, setNotMatch] = useState("");
  const [success, setSuccess] = useState("");

  // VALIDATION FUNCTION
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8 && pass.length <= 64;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[@$!%*?&]/.test(pass);

    const types = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    return minLength && types >= 2;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError("");
    setNotMatch("");
    setSuccess("");

    // Validate new password
    if (!validatePassword(password)) {
      setError(
        "Password must be 8–64 characters and include at least 2 types: uppercase, lowercase, number, special character."
      );
      return;
    }

    // Check confirm password
    if (password !== confirmPass) {
      setNotMatch("Passwords do not match.");
      return;
    }

    // Call API
    setLoading(true);
    try {
      const email = localStorage.getItem("reset_email") || "";
      const otp = localStorage.getItem("reset_otp") || "";
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_otp");
      setSuccess("Password successfully updated!");
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to reset password. Try again.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
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
          Powered by <span className="create-new-password-techbrain">Techbrain Networks</span>
        </a>
      </div>

      <div className="create-new-password-container">
        <h1 className="create-new-password-head">Create New Password</h1>

        <div className="create-new-password-input-container">
          <div className="create-new-password-input-box">
            <label htmlFor="cnp-password" className="sr-only">New Password</label>
            <input
              id="cnp-password"
              className="create-new-password-input"
              type="password"
              name="newPassword"
              autoComplete="new-password"
              placeholder="New Password"
              aria-invalid={!!error}
              aria-describedby={error ? "cnp-error" : undefined}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
                setNotMatch("");
              }}
              required
            />
          </div>

          <div className="password-tips">
            <h6>Tip</h6>
            <p className="tip">
              Be between 8 and 64 characters. <br />
              Include at least two of the following:
            </p>
            <ul className="tip-list">
              <li>An uppercase character</li>
              <li>A lowercase character</li>
              <li>A number</li>
              <li>A special character</li>
            </ul>
          </div>

          <div className="create-new-password-input-box">
            <label htmlFor="cnp-confirmpassword" className="sr-only">Re-enter Password</label>
            <input
              id="cnp-confirmpassword"
              className="create-new-password-input"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter Password"
              aria-invalid={!!notMatch}
              aria-describedby={notMatch ? "cnp-notmatch" : undefined}
              value={confirmPass}
              onChange={(e) => {
                setConfirmPass(e.target.value);
                setNotMatch("");
                setSuccess("");
              }}
              required
            />
          </div>
        </div>

        {error && <p id="cnp-error" className="error-text" role="alert">{error}</p>}
        {notMatch && <p id="cnp-notmatch" className="notmatch-text" role="alert">{notMatch}</p>}
        {success && <p className="success-text" role="status">{success}</p>}

        <button type="submit" className="create-new-password-submit" disabled={loading}>
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default CreateNewPassword;
