import React, { useState, useEffect } from "react";
import "./PasswordAssistance.css";
import logo from "../../assets/attrallogo.png";

const PasswordAssistance = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResent, setIsResent] = useState(false);

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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Email:", email);
      console.log("OTP:", otp);
      alert("OTP Verified Successfully!");
    }
  };

  // ---------------- RESEND OTP HANDLER ----------------
  const handleResendOtp = () => {
    if (!email.trim()) {
      setErrors({ email: "Enter email before resending OTP" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Enter a valid email before resending OTP" });
      return;
    }

    setIsResent(true);
    setTimer(60);
    console.log("Resent OTP to:", email);

    // API call for resend OTP goes here
  };

  // ---------------- TIMER RUNNING ----------------
  useEffect(() => {
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
          Powered by{" "}
          <span className="password-assistance-techbrain">Techbrain Networks</span>
        </a>
      </div>

      <div className="password-assistance-container">
        <h2 className="password-assistance-head">Password Assistance</h2>

        <div className="password-assistance-input-container">
          {/* EMAIL */}
          <div className="password-assistance-input-box">
            <input
              className="password-input"
              type="text"
              placeholder="Enter your email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* OTP */}
          <div className="password-assistance-input-box">
            <input
              className="password-input"
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors.otp && <span className="error">{errors.otp}</span>}
          </div>
        </div>

        {/* RESEND OTP BUTTON */}
        <button
          type="button"
          className="resentotp"
          onClick={handleResendOtp}
          disabled={timer > 0 && isResent}
        >
          {isResent && timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP?"}
        </button>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="password-assistance-submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default PasswordAssistance;
