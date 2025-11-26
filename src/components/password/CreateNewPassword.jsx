import React, { useState } from "react";
import "./CreateNewPassword.css";
import logo from "../../assets/attrallogo.png";

const CreateNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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

  const handleSubmit = (e) => {
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

    // SUCCESS
    setSuccess("Password successfully updated!");
    console.log("New password saved:", password);
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
        <h2 className="create-new-password-head">Create New Password</h2>

        <div className="create-new-password-input-container">
          <div className="create-new-password-input-box">
            <input
              className="create-new-password-input"
              type="password"
              placeholder="New Password"
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
            <input
              className="create-new-password-input"
              type="password"
              placeholder="Re-enter Password"
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

        {error && <p className="error-text">{error}</p>}
        {notMatch && <p className="notmatch-text">{notMatch}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit" className="create-new-password-submit">
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateNewPassword;
