import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("dayflow_user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("dayflow_token");
    localStorage.removeItem("dayflow_user");
    navigate("/login");
  }

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="logo">Dayflow</div>
        <nav>
          <a className="active">Employees</a>
          <a>Attendance</a>
          <a>Time Off</a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{user.loginId}</span>
          <div className="avatar" onClick={handleLogout} title="Click to log out">
            {initials}
          </div>
        </div>
      </div>

      <div className="dash-content">
        <h1>Welcome, {user.firstName}</h1>

        <div className="card-grid">
          <div className="info-card">
            <div className="label">Role</div>
            <div className="value">{user.role === "admin" ? "Admin / HR Officer" : "Employee"}</div>
          </div>
          <div className="info-card">
            <div className="label">Login ID</div>
            <div className="value">{user.loginId}</div>
          </div>
          <div className="info-card">
            <div className="label">Attendance today</div>
            <div className="value">Not checked in</div>
          </div>
          <div className="info-card">
            <div className="label">Leave balance</div>
            <div className="value">24 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}
