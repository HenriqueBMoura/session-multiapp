"use client";
import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");

  const doLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Login failed");
      return;
    }

    window.location.href = "/";
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login – Next.js</h1>

      <input
        placeholder="Phone (mocked)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginRight: 8 }}
      />

      <button onClick={doLogin}>Login</button>
    </div>
  );
}
