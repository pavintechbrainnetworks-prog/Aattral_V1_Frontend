import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PasswordAssistance.css";
import logo from "../../assets/attrallogo.png";
import api from "../../services/api";

const PasswordAssistance = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResent, setIsResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION FUNCTION ----------------
  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be 6 digits";
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
        await api.post("/auth/verify-otp", { email, otp });
        // Store email and otp for the reset-password page
        localStorage.setItem("reset_email", email);
        localStorage.setItem("reset_otp", otp);
        navigate("/create-new-password");
      } catch (err) {
        const msg =
          err.response?.data?.message || "OTP verification failed.";
        setApiError(Array.isArray(msg) ? msg.join(", ") : msg);
      } finally {
        setLoading(false);
      }
    }
  };

  // ---------------- RESEND OTP HANDLER ----------------
  const handleResendOtp = async () => {
    if (!email.trim()) {
      setErrors({ email: "Enter email before requesting OTP" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Enter a valid email before requesting OTP" });
      return;
    }

    setApiError("");
    setSuccessMessage("");
    setSendingOtp(true);
    try {
      const res = await api.post("/auth/send-otp", { email });
      setIsResent(true);
      setTimer(60);
      setSuccessMessage(res.data?.message || `OTP sent to ${email}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP.";
      setApiError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSendingOtp(false);
    }
  };

  // ---------------- TIMER RUNNING ----------------
  useEffect(() => {
    if (timer > 0 && isResent) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer, isResent]);

  return (
    <form className="password-assistance-form" onSubmit={handleSubmit} noValidate>
      <div>
        <img className="password-assistance-aattral" src={logo} alt="aattral" />

        <a
          className="password-assistance-Poweredby"
          href="https://techbrainnetworks.com/"
        >
          Powered by{" "}
          <span className="password-assistance-techbrain">Techbrain Networks</span>
        </a>
      </div>

      <div className="password-assistance-container">
        <h1 className="password-assistance-head">Password Assistance</h1>

        <div className="password-assistance-input-container">
          {/* EMAIL */}
          <div className="password-assistance-input-box">
            <label htmlFor="pa-email" className="sr-only">Email Address</label>
            <input
              id="pa-email"
              className="password-input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email ID"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "pa-email-error" : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span id="pa-email-error" className="error" role="alert">{errors.email}</span>}
          </div>

          {/* OTP */}
          <div className="password-assistance-input-box">
            <label htmlFor="pa-otp" className="sr-only">One-Time Password</label>
            <input
              id="pa-otp"
              className="password-input"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              autoComplete="one-time-code"
              aria-invalid={!!errors.otp}
              aria-describedby={errors.otp ? "pa-otp-error" : undefined}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors.otp && <span id="pa-otp-error" className="error" role="alert">{errors.otp}</span>}
          </div>
        </div>

        {/* RESEND OTP BUTTON */}
        <button
          type="button"
          className="resentotp"
          onClick={handleResendOtp}
          disabled={(timer > 0 && isResent) || sendingOtp}
        >
          {sendingOtp
            ? "Sending OTP..."
            : isResent && timer > 0
            ? `Resend OTP in ${timer}s`
            : "Resend OTP?"}
        </button>

        {/* FEEDBACK MESSAGES */}
        {successMessage && <span className="success-msg" role="status">{successMessage}</span>}
        {apiError && <span className="error" role="alert">{apiError}</span>}
        <button type="submit" className="password-assistance-submit" disabled={loading}>
          {loading ? "Verifying…" : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default PasswordAssistance;
