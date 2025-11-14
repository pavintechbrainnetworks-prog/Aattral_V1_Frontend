import React, { useState } from "react";
import "./PasswordAssistance.css";
import logo from "../../assets/attrallogo.png";

const PasswordAssistance = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // 60 sec countdown for OTP
  const [isResent, setIsResent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("OTP:", otp);
    // Call API for password assistance here
  };

  const handleResendOtp = () => {
    setIsResent(true);
    setTimer(60); // reset countdown
    console.log("Resent OTP to:", email);
    // Call API for resend OTP here
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
            <input className="password-input"
              type="email"
              placeholder="Enter your email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="password-assistance-input-box">
            <input className="password-input"
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="button"
          className="resentotp"
          onClick={handleResendOtp}
          disabled={timer > 0 && isResent}
        >
          {isResent && timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP?"}
        </button>

        <button type="submit" className="password-assistance-submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default PasswordAssistance;
