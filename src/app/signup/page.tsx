"use client"
import React, { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";
// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
const SignUpPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Complete Signup
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]=useState("")
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    // redirect("/");
    
    e.preventDefault();
    // try {
    //   const response = await fetch("/api/otp", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();

    //   if (response.ok) {
    //     alert("OTP sent to your email!");
    //     setStep(2);
    //   } else {
    //     alert(data.error || "Something went wrong");
    //   }
    // } catch (error) {
    //   console.error("Error sending OTP:", error);
    //   alert("Failed to send OTP");
    // }
    try {
      const response = await fetch("/api/signup/allAdmins", {
        method: "GET",
      });
    
      // Parse response
      const data = await response.json();
    
      if (response.ok) {
        alert("OTP sent to your email!");
        setStep(2);
      } else {
        // Handle server error message
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      // Handle network or unexpected errors
      console.error("Error sending OTP:", error.message || error);
      alert("Failed to send OTP. Please check your connection and try again.");
    }
    
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/verify-otp", {
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

      // const router = useRouter(); 

      const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }
        try {
          const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name}),
          });
          const data = await response.json();
      
          if (response.ok) {
            alert("Signup successful!");
            // window.location.href = "https://nkf448kn-3000.asse.devtunnels.ms/"; 
            window.location.href = process.env.NEXT_PUBLIC_BASE_URL || "/";
            // redirect("/");
          } else {
            alert(data.error || "Something went wrong");
          }
        } catch (error) {
          console.error("Error signing up:", error);
          alert("Failed to sign up");
        }
      };
      


  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src="/Social tree-cuate.png" style={{ width: "60%" }} />
        <h1>Create Your Account</h1>
        <p>Join us today to simplify and optimize your social automation!</p>
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
          <form className={styles.form} onSubmit={handleSignupSubmit}>
            <h1 className={styles.formTitle}>Complete Signup</h1>
            <input
              type="name"
              placeholder="Full Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
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
              Sign Up
            </button>
          </form>
        )}

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/" className={styles.link}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
