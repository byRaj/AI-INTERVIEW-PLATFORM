import React, { useState } from "react";
import Loader from "../components/Loader";
import { useLocation, useNavigate } from "react-router";
import { verifyOtp, resendOtp } from "../services/auth.api";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ GET LOGIN FUNCTION
  const { handleLogin } = useAuth();

  // ✅ GET DATA PASSED FROM REGISTER PAGE
  const { userId, email, password } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ VERIFY OTP
      const response = await verifyOtp({
        userId,
        otp,
      });

      toast.success("OTP verified successfully!");

      // ✅ AUTO LOGIN AFTER VERIFY
      await handleLogin({
        email,
        password,
      });

      // ✅ REDIRECT HOME
      navigate("/");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "OTP verification failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESEND OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const response = await resendOtp({
        email,
      });

      toast.success("OTP resent successfully! Check your email.");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to resend OTP";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ❌ INVALID ACCESS
  if (!userId || !email) {
    return (
      <main>
        <div className="form-container">
          <h1>Invalid Access</h1>
          <p>Please register first.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return <Loader />;
  }
  return (
    <main>
      <div className="form-container">
        <h1>Verify OTP</h1>
        <p>
          Enter the OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>
        <form onSubmit={handleVerifyOtp}>
          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <button className="button primary-button" disabled={loading}>
            Verify OTP
          </button>
        </form>
        <button
          onClick={handleResendOtp}
          disabled={loading}
          className="button"
          style={{ marginTop: "1rem" }}
        >
          Resend OTP
        </button>
      </div>
    </main>
  );
};

export default VerifyOtp;
