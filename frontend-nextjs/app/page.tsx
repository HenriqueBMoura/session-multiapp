"use client";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Next.js Hub</h1>

      <a href="/login">Go to Login</a>

      <br /><br />

      <button onClick={() => (window.location.href = "http://localhost:4200")}>
        Resume Application
      </button>
    </div>
  );
}