import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMe, logout } from "../services/api";
import type { User } from "../services/api";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("session");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const result = await getMe(token);
        setUser(result.user);
      } catch {
        localStorage.removeItem("session");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [navigate]);

  async function handleLogout() {
    const token = localStorage.getItem("session");

    setLoggingOut(true);
    setError("");

    try {
      if (token) {
        await logout(token);
      }
    } catch {
      setError("Não foi possível encerrar a sessão.");
      return;
    } finally {
      localStorage.removeItem("session");
      setLoggingOut(false);
    }

    navigate("/login", { replace: true });
  }

  if (loading) {
    return (
      <main className="loading-container">
        <p>Carregando...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="home-container">
      <header className="home-header">
        <div className="brand">
          <span className="brand-mark">S</span>
          <span>Salvus</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Saindo..." : "Sair"}
        </button>
      </header>

      <section className="home-content">
        <p className="welcome">Olá, {user.name}!</p>

        <h1>Meus dados</h1>

        <div className="user-card">
          <div className="user-info">
            <span>Nome</span>
            <strong>{user.name}</strong>
          </div>

          <div className="user-info">
            <span>E-mail</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}
      </section>
    </main>
  );
}
