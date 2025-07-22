import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useApi";
import AnganwadiAdd from "./Anganwadiadd"; // for the Register popup

/* -------------------------------------------------- */
/* Inline SVG icons                                  */
/* -------------------------------------------------- */
const icons = {
  register: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19v-6M9 16h6" />
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
    </svg>
  ),
  logout: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

/* -------------------------------------------------- */
/* Small reusable pieces                             */
/* -------------------------------------------------- */
const SidebarButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "transparent",
      border: "none",
      color: "#fff",
      padding: "14px 20px",
      width: "100%",
      fontSize: 16,
      fontWeight: 500,
      cursor: "pointer",
      borderRadius: 10,
      marginBottom: 8,
      transition: "background 0.2s",
    }}
  >
    <span
      style={{
        width: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

const StudentCard = ({ student, onClick }) => (
  <div
    onClick={() => onClick(student)}
    style={{
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      padding: 20,
      margin: 8,
      minWidth: 260,
      maxWidth: 320,
      flex: "1 1 260px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      cursor: "pointer",
      transition: "transform 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={{ fontWeight: "bold", fontSize: 18, color: "#2E7D32" }}>
      {student.childName || student.name}
    </div>
    <div>
      {" "}
      {student.parentName ||
        student.guardian_name ||
        student.father_name ||
        "-"}
    </div>
    <div> {student.mobileNumber || student.username || "-"}</div>
    <div> {student.village || student.address || "-"}</div>
    <div> {student.plantDistributed ? "Yes" : "No"}</div>
    {student.registrationDate && (
      <div>
        <strong>Registered:</strong> {student.registrationDate}
      </div>
    )}
  </div>
);

const StatCard = ({ label, value, icon }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 16,
      padding: 32,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      minWidth: 180,
      textAlign: "center",
      flex: "1 1 180px",
      margin: 8,
    }}
  >
    <div style={{ fontSize: 32 }}>{icon}</div>
    <div style={{ fontSize: 18, color: "#666", marginTop: 8 }}>{label}</div>
    <div
      style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#2E7D32",
        marginTop: 8,
      }}
    >
      {value}
    </div>
  </div>
);

/* -- Register popup (kept from earlier version) -- */
const RegisterModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          width: "90%",
          maxWidth: 800,
          maxHeight: "99vh",
          overflowY: "auto",
          boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            border: "none",
            background: "transparent",
            fontSize: 28,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          &times;
        </button>
        <AnganwadiAdd />
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/* MAIN Dashboard component                          */
/* -------------------------------------------------- */
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout: apiLogout } = useAuth();

  const [allStudents, setAllStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, uniqueVillages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  /* ---- fetch student data once ---- */
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://165.22.208.62:5000/data");
        const html = await res.text();
        const doc = new window.DOMParser().parseFromString(html, "text/html");
        const table = doc.querySelector("table");
        if (!table) {
          setAllStudents([]);
          setStats({ total: 0, uniqueVillages: 0 });
          setLoading(false);
          return; // No table found, exit early
        }

        const cols = [...table.querySelectorAll("th")].map((th) =>
          th.textContent.trim()
        );
        const rows = [...table.querySelectorAll("tbody tr")].map((tr) => {
          const obj = {};
          [...tr.querySelectorAll("td")].forEach(
            (td, i) => (obj[cols[i]] = td.textContent.trim())
          );
          return obj;
        });

        // --- NEW LOGIC: Filter out rows that are effectively empty ---
        const cleanedRows = rows.filter((student) => {
          // A student card is considered "empty" if its primary identifiers (name, username) are missing.
          // Adjust this condition based on what you consider a 'valid' student entry.
          const hasName = student.name && student.name.trim() !== "";
          const hasUsername =
            student.username && student.username.trim() !== "";
          const hasChildName =
            student.childName && student.childName.trim() !== ""; // From /search endpoint
          const hasMobileNumber =
            student.mobileNumber && student.mobileNumber.trim() !== ""; // From /search endpoint

          return (hasName || hasChildName) && (hasUsername || hasMobileNumber);
        });
        // --- END NEW LOGIC ---

        setAllStudents(cleanedRows); // Use cleanedRows instead of raw 'rows'
        setStats({
          total: cleanedRows.length, // Update stats based on cleaned data
          uniqueVillages: new Set(
            cleanedRows.map((s) => s.village || s.address || "")
          ).size,
        });
      } catch (error) {
        // Catch the actual error
        console.error("Error fetching or parsing student data:", error); // Log the error
        setAllStudents([]);
        setStats({ total: 0, uniqueVillages: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ---- search filter ---- */
  const filteredStudents = useMemo(() => {
    // Ensure the filter logic works correctly with the cleaned data
    if (!searchQuery.trim()) return allStudents;
    const q = searchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        (s.childName || s.name || "").toLowerCase().includes(q) ||
        (s.mobileNumber || s.username || "").toLowerCase().includes(q)
    );
  }, [allStudents, searchQuery]);

  /* ---- sidebar actions ---- */
  const handleLogout = async () => {
    await apiLogout();
    navigate("/");
  };

  /* ---- new dropdown handler ---- */
  const handleDashboardSelect = (e) => {
    const value = e.target.value;
    if (value === "student") {
      navigate("/"); // current student dashboard
    } else if (value === "anganvadi") {
      navigate("/anganvadi-dashboard"); // the new Anganvadi dashboard
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex" }}>
      {/* ------------- SIDEBAR ------------- */}
      <aside
        style={{
          width: 260,
          background: "linear-gradient(180deg,#2E7D32,#388e3c)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "32px 0",
          boxShadow: "2px 0 12px rgba(44,62,80,0.06)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: 24,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          🌳 हर घर मुंगा
        </div>

        {/* Dashboard selector dropdown */}
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <label
            style={{
              color: "#fff",
              fontSize: 14,
              marginBottom: 6,
              display: "block",
            }}
          >
            Choose Dashboard
          </label>
          <select
            onChange={handleDashboardSelect}
            defaultValue="student"
            style={{ width: "100%", padding: 12, borderRadius: 8 }}
          >
            <option value="student">Student Dashboard</option>
            <option value="anganvadi">Anganvadi Dashboard</option>
          </select>
        </div>

        <SidebarButton
          icon={icons.register}
          label="Register"
          onClick={() => setShowRegisterModal(true)}
        />
        <div style={{ flex: 1 }} />
        <SidebarButton
          icon={icons.logout}
          label="Logout"
          onClick={handleLogout}
        />
      </aside>

      {/* ------------- MAIN ------------- */}
      <main
        style={{
          flex: 1,
          padding: "40px 0",
          overflowY: "auto",
          background: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <StatCard label="Total Students" value={stats.total} icon="👨‍🎓" />
            <StatCard
              label="Unique Villages"
              value={stats.uniqueVillages}
              icon="🏡"
            />
          </div>

          {/* Search */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 24,
              marginBottom: 32,
            }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or mobile number"
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontSize: 16,
                  flex: 1,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Search
              </button>
            </form>
          </div>

          {/* Students Grid */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 24,
            }}
          >
            <h2 style={{ marginBottom: 24 }}>Registered Students</h2>
            {loading ? (
              <div>Loading…</div>
            ) : filteredStudents.length === 0 ? (
              <div>No matching data.</div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {filteredStudents.map((s, i) => (
                  <StudentCard
                    key={s.id || i}
                    student={s}
                    onClick={setSelectedStudent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Register popup */}
      <RegisterModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
};

export default Dashboard;
