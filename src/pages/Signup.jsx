import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  const preview =
    form.firstName && form.lastName
      ? `02${form.firstName.substring(0, 2).toUpperCase()}${form.lastName
          .substring(0, 2)
          .toUpperCase()}${new Date().getFullYear()}00XX`
      : "02XXXXYYYY0001";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await signup(payload);
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
          <h1>Create account</h1>
          <p className="subtitle">Your Login ID is generated automatically.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="login-id-preview">Your Login ID will look like: {preview}</div>

          <form onSubmit={handleSubmit}>
            <div className="row-2">
              <div className="field">
                <label>First name</label>
                <input required value={form.firstName} onChange={update("firstName")} />
              </div>
              <div className="field">
                <label>Last name</label>
                <input required value={form.lastName} onChange={update("lastName")} />
              </div>
            </div>

            <div className="field">
              <label>Email</label>
              <input type="email" required value={form.email} onChange={update("email")} />
            </div>

            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={update("phone")} />
            </div>

            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={update("role")}>
                <option value="employee">Employee</option>
                <option value="admin">Admin / HR Officer</option>
              </select>
            </div>

            <div className="row-2">
              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={update("password")}
                />
              </div>
              <div className="field">
                <label>Confirm password</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="switch-line">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
