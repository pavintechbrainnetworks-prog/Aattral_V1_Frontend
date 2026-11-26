import React, { useState } from "react";
import "./PasswordAssistance.css";
import logo from "../../assets/attrallogo.png";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";

const PasswordAssistance = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // 60 sec countdown for OTP
  const [isResent, setIsResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email ID.");
      return;
    }
    setError("");
    setMessage("");
    try {
      setLoading(true);
      const res = await authApi.sendOtp(email);
      setMessage(res.message || "OTP sent to your email!");
      setIsResent(true);
      setTimer(60);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError("Please enter both email and OTP.");
      return;
    }
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await authApi.verifyOtp(email, otp);
      // Navigate to create new password screen with email and verified OTP
      navigate("/CreateNewPassword", { state: { email, otp } });
    } catch (err) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (timer > 0 && isResent) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer, isResent]);

  return (
    <form className="password-assistance-form" onSubmit={handleSubmit}>
      <div>
        <img className="password-assistance-aattral" src={logo} alt="aattral" />
        <a
          className="password-assistance-Poweredby"
          href="https://techbrainnetworks.com/"
        >
          Powered by <span className="password-assistance-techbrain">
            Techbrain Networks
          </span>
        </a>
      </div>

      <div className="password-assistance-container">
        <h2 className="password-assistance-head">Password Assistance</h2>

        <div className="password-assistance-input-container">
          <div className="password-assistance-input-box">
            <input
              className="password-input"
              type="email"
              placeholder="Enter your email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="password-assistance-input-box">
            <input
              className="password-input"
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        </div>

        {message && (
          <p style={{ color: "#38a169", fontSize: "13px", margin: "6px 0", textAlign: "center" }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ color: "#e53e3e", fontSize: "13px", margin: "6px 0", textAlign: "center" }}>
            {error}
          </p>
        )}

        <button
          type="button"
          className="resentotp"
          onClick={handleSendOtp}
          disabled={loading || (timer > 0 && isResent)}
        >
          {isResent && timer > 0 ? `Resend OTP in ${timer}s` : "Send / Resend OTP"}
        </button>

        <button type="submit" className="password-assistance-submit" disabled={loading}>
          {loading ? "Verifying..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default PasswordAssistance;
