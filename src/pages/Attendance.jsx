import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTodayAttendance, checkIn, checkOut, getMyAttendance } from "../api";

export default function Attendance() {
  const navigate = useNavigate();
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("dayflow_token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadData();
  }, [navigate]);

  async function loadData() {
    try {
      const [todayData, historyData] = await Promise.all([
        getTodayAttendance(),
        getMyAttendance(),
      ]);
      setToday(todayData);
      setHistory(historyData);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCheckIn() {
    setLoading(true);
    setError("");
    try {
      await checkIn();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOut() {
    setLoading(true);
    setError("");
    try {
      await checkOut();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const hasCheckedIn = today && today.checkIn;
  const hasCheckedOut = today && today.checkOut;

  function formatTime(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div className="logo">Dayflow</div>
        <nav>
          <Link to="/dashboard">Employees</Link>
          <a className="active">Attendance</a>
          <a>Time Off</a>
        </nav>
        <div />
      </div>

      <div className="dash-content">
        <h1>Attendance</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="info-card" style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div className="label">Today's status</div>
            <div className="value">
              {hasCheckedOut
                ? "Checked out"
                : hasCheckedIn
                ? "Checked in"
                : "Not checked in"}
            </div>
            {hasCheckedIn && (
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>
                In: {formatTime(today.checkIn)} {hasCheckedOut && `· Out: ${formatTime(today.checkOut)}`}
              </div>
            )}
          </div>

          {!hasCheckedIn && (
            <button className="btn-primary" style={{ width: "auto", padding: "10px 24px" }} onClick={handleCheckIn} disabled={loading}>
              {loading ? "..." : "Check In"}
            </button>
          )}
          {hasCheckedIn && !hasCheckedOut && (
            <button className="btn-primary" style={{ width: "auto", padding: "10px 24px", background: "var(--error)" }} onClick={handleCheckOut} disabled={loading}>
              {loading ? "..." : "Check Out"}
            </button>
          )}
        </div>

        <h2 style={{ fontSize: 18, marginBottom: 12 }}>History</h2>
        <div className="info-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                <th style={{ padding: "12px 20px" }}>Date</th>
                <th style={{ padding: "12px 20px" }}>Check In</th>
                <th style={{ padding: "12px 20px" }}>Check Out</th>
                <th style={{ padding: "12px 20px" }}>Work Hours</th>
                <th style={{ padding: "12px 20px" }}>Extra Hours</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: 20, color: "var(--ink-soft)" }}>
                    No attendance records yet.
                  </td>
                </tr>
              )}
              {history.map((rec) => (
                <tr key={rec._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 20px" }}>{rec.date}</td>
                  <td style={{ padding: "12px 20px" }}>{formatTime(rec.checkIn)}</td>
                  <td style={{ padding: "12px 20px" }}>{formatTime(rec.checkOut)}</td>
                  <td style={{ padding: "12px 20px" }}>{rec.workHours}</td>
                  <td style={{ padding: "12px 20px" }}>{rec.extraHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
