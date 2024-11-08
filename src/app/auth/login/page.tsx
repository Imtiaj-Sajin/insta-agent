"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = () => {
    setError("");
    if (password === "1") {
      if (username === "admin") {
        document.cookie = "authToken=adminToken; path=/";
        router.push("/admin/dashboard");
      } else if (username === "moderator") {
        document.cookie = "authToken=moderatorToken; path=/";
        router.push("/moderator/dashboard");
      } else {
        setError("Invalid username. Please use 'admin' or 'moderator'.");
      }
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div style={{ overflow: "hidden" ,display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <div style={{ maxWidth: "400px", padding: "24px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "#333" }}>Login</h1>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Username</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" style={{  padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", outline: "none", marginBottom: "8px" }} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "14px", outline: "none", marginBottom: "8px" }} />
        </div>
        {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
        <button onClick={handleLogin} style={{ width: "100%", padding: "10px", background: "linear-gradient(180deg, #8058ac, #5a3c87)", color: "white", fontSize: "14px", borderRadius: "4px", border: "none", cursor: "pointer", textAlign: "center" }}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
