"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type SessionUser = {
  name?: string;
  role?: string;
};

export default function Home() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    window.location.href = "/login";
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1>Next.js Hub</h1>
          <p>
            Single entry point for local development and cross-app navigation.
          </p>

          {!loading && user && (
            <p style={{ fontSize: 14, opacity: 0.7 }}>
              Logged in as <strong>{user.name ?? "User"}</strong>
              {user.role && ` (${user.role})`}
            </p>
          )}
        </section>

        <nav className={styles.ctas} aria-label="Applications">
          {!loading && !user && (
            <Link href="/login" className="secondary">
              Go to Login
            </Link>
          )}

          {!loading && user && (
            <button
              onClick={logout}
              className={`secondary ${loading ? styles.buttonDisabled : ""}`}
            >
              Logout
            </button>
          )}

          <a className="primary" href="http://localhost:4200/">
            Open User App
          </a>

          <a className="secondary" href="http://localhost:4201/">
            Open Admin App
          </a>
        </nav>

        <footer className={styles.footer}>
          <small className={styles.ports}>
            Local ports: Next (3000) · User (4200) · Admin (4201) · API (5000)
          </small>
        </footer>
      </main>
    </div>
  );
}
