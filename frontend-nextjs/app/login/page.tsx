"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Polimento: se já existir sessão, manda pro Hub
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });

        if (res.ok) {
          window.location.href = "/";
        }
      } catch {
        // ignore
      }
    };

    check();
  }, []);

  const doLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        alert("Login failed");
        return;
      }

      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Login</h1>

          <p>
            Creates a session cookie (<code>.session.demo</code>) via the .NET
            API and returns you to the Hub.
          </p>

          <div className={styles.formRow}>
            <input
              className={styles.input}
              placeholder="Phone (mocked)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              aria-label="Phone (mocked)"
            />

            <button
              className={`${styles.button} primary`}
              onClick={doLogin}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </section>

        <nav className={styles.ctas} aria-label="Navigation">
          <Link href="/" className="secondary">
            Back to Hub
          </Link>
        </nav>
      </main>
    </div>
  );
}
