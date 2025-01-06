"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./forgot.module.css"; // Ensure you have CSS for styling

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forgot-password/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP sent to your email!");
        setStep(2);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("OTP verified successfully!");
        setStep(3);
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password reset successfully!");
        window.location.href = "/"; 
      } else {
        alert(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src="/Social tree-cuate.png" style={{ width: "60%" }} />
        <h1>Forgot Your Password?</h1>
        <p>Enter your email to reset your password.</p>
      </div>

      <div className={styles.right}>
        {step === 1 && (
          <form className={styles.form} onSubmit={handleEmailSubmit}>
            <h1 className={styles.formTitle}>Enter Your Email</h1>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form className={styles.form} onSubmit={handleOtpSubmit}>
            <h1 className={styles.formTitle}>Verify OTP</h1>
            <input
              type="text"
              placeholder="Enter OTP"
              className={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form className={styles.form} onSubmit={handlePasswordSubmit}>
            <h1 className={styles.formTitle}>Reset Your Password</h1>
            <input
              type="password"
              placeholder="New Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Reset Password
            </button>
          </form>
        )}

        <p className={styles.footerText}>
          Remembered your password?{" "}
          <Link href="/" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
