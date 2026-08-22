import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signin(form);
      localStorage.setItem("dayflow_token", data.token);
      localStorage.setItem("dayflow_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="logo">Dayflow</div>
        <div className="tagline">Every workday, perfectly aligned.</div>
        <div className="footnote">Odoo × NMIT Hackathon 2026</div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h1>Sign in</h1>
          <p className="subtitle">Welcome back — enter your details to continue.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="you@company.com"
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={update("password")}
                placeholder="••••••••"
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="switch-line">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
