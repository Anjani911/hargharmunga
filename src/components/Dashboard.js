import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useApi"; 
import AnganwadiAdd from "./Anganwadiadd";

// =========================================================================
// 1. Reusable Components & Icons (Keep as is, they are well-structured)
// =========================================================================

const icons = {
  register: (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19v-6M9 16h6" />
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
    </svg>
  ),
  logout: (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

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
    <span style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
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
    <div style={{ fontWeight: "bold", fontSize: 18, color: "#2E7D32" }}>{student.childName || student.name || "N/A"}</div>
    <div>{student.parentName || student.guardian_name || student.father_name || "-"}</div>
    <div>{student.mobileNumber || student.username || "-"}</div>
    <div>{student.village || student.address || "-"}</div>
    <div>Plant Distributed: {student.plantDistributed ? "Yes" : "No"}</div>
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
    <div style={{ fontSize: 28, fontWeight: "bold", color: "#2E7D32", marginTop: 8 }}>{value}</div>
  </div>
);

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
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close registration form"
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            border: "none",
            background: "transparent",
            fontSize: 28,
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <AnganwadiAdd />
      </div>
    </div>
  );
};

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;
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
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close student details"
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            border: "none",
            background: "transparent",
            fontSize: 28,
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: 16 }}>Student Details</h2>
        {Object.entries(student).map(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} style={{ marginBottom: '8px' }}>
                <strong>{formattedKey}:</strong> {String(value)}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

const RestrictedViewMessage = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f5f5f5",
      textAlign: "center",
      padding: "20px",
      boxSizing: "border-box",
    }}
  >
    <h2 style={{ color: "#D32F2F", marginBottom: "20px" }}>
      <span role="img" aria-label="Warning">⚠️</span> Optimized for Larger Screens
    </h2>
    <p style={{ fontSize: "18px", lineHeight: "1.6", maxWidth: "500px" }}>
      This dashboard provides a richer experience on desktop or larger tablet devices.
      Please access it from a personal computer for full functionality.
    </p>
  </div>
);

// =========================================================================
// 2. Main Dashboard Component (Updated Layout)
// =========================================================================

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout: apiLogout } = useAuth();

  const [allStudents, setAllStudents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    uniqueVillages: 0,
    totalPlantsPlanted: 0,
    totalPhotosUploaded: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const SMALL_SCREEN_BREAKPOINT = 768;

  const checkScreenSize = useCallback(() => {
    setIsSmallScreen(window.innerWidth <= SMALL_SCREEN_BREAKPOINT);
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [checkScreenSize]);

  const fetchAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://165.22.208.62:5000/data");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const html = await res.text();

      if (typeof window.DOMParser === 'undefined') {
        console.error("DOMParser is not supported in this environment.");
        return;
      }

      const doc = new window.DOMParser().parseFromString(html, "text/html");
      const table = doc.querySelector("table");

      if (!table) {
        console.warn("No table found in the fetched HTML data.");
        setAllStudents([]);
        setStats({ total: 0, uniqueVillages: 0, totalPlantsPlanted: 0, totalPhotosUploaded: 0 });
        return;
      }

      const cols = [...table.querySelectorAll("th")].map((th) => th.textContent.trim());
      const rows = [...table.querySelectorAll("tbody tr")].map((tr) => {
        const obj = {};
        const tds = [...tr.querySelectorAll("td")];
        cols.forEach((col, i) => {
          obj[(col || `column${i}`).trim()] = (tds.length > i ? tds[i].textContent.trim() : '');
        });
        return obj;
      });

      const cleanedRows = rows.filter((student) => {
        const hasName = student.name?.trim() || student.childName?.trim();
        const hasContact = student.mobileNumber?.trim() || student.username?.trim();
        return hasName && hasContact;
      });

      const totalPlants = cleanedRows.filter(
        (student) => student.plant_photo && student.plant_photo !== "None"
      ).length;

      const totalPhotos = cleanedRows.reduce(
        (sum, student) => sum + (parseInt(student.totalImagesYet) || 0),
        0
      );

      setAllStudents(cleanedRows);
      setStats({
        total: cleanedRows.length,
        uniqueVillages: new Set(cleanedRows.map((s) => s.village || s.address).filter(Boolean)).size,
        totalPlantsPlanted: totalPlants,
        totalPhotosUploaded: totalPhotos
      });
    } catch (err) {
      console.error("Error fetching or parsing student data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        (s.childName || s.name || "").toLowerCase().includes(q) ||
        (s.mobileNumber || s.username || "").toLowerCase().includes(q)
    );
  }, [allStudents, searchQuery]);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [apiLogout, navigate]);

  const handleDashboardSelect = useCallback((e) => {
    const value = e.target.value;
    navigate(value === "student" ? "/" : "/anganvadi-dashboard");
  }, [navigate]);

  return (
    isSmallScreen ? (
      <RestrictedViewMessage />
    ) : (
      // New: Use a grid container for the main layout
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr", // 260px for sidebar, 1fr for main content
          minHeight: "100vh",
          backgroundColor: "#f5f5f5", // Apply the background to the entire container
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            // No need for a fixed width here, as the grid column defines it
            background: "linear-gradient(180deg,#2E7D32,#388e3c)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: "32px 0",
            overflowY: "auto", // In case the sidebar content overflows
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: 24, textAlign: "center", marginBottom: 24 }}>🌳 हर घर मुंगा</div>
          <div style={{ padding: "0 20px", marginBottom: 24 }}>
            <label htmlFor="dashboard-select" style={{ color: "#fff", fontSize: 14, marginBottom: 6, display: "block" }}>
              Choose Dashboard
            </label>
            <select
              id="dashboard-select"
              onChange={handleDashboardSelect}
              defaultValue="student"
              style={{ width: "100%", padding: 12, borderRadius: 8 }}
            >
              <option value="student">Student Dashboard</option>
              <option value="anganvadi">Anganvadi Dashboard</option>
            </select>
          </div>
          <SidebarButton icon={icons.register} label="Register" onClick={() => setShowRegisterModal(true)} />
          <div style={{ flex: 1 }} /> {/* Spacer */}
          <SidebarButton icon={icons.logout} label="Logout" onClick={handleLogout} />
        </aside>

        {/* Main Content Area */}
        <main
          style={{
            // The grid layout takes care of the width and height
            padding: "40px 0",
            overflowY: "auto",
            backgroundColor: "#f5f5f5", // Redundant but good practice for clarity
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
              <StatCard label="Total Students" value={stats.total} icon="👨‍🎓" />
              <StatCard label="Unique Villages" value={stats.uniqueVillages} icon="🏡" />
              <StatCard label="Total Plants Planted" value={stats.totalPlantsPlanted} icon="🌳" />
              <StatCard label="Total Photos Uploaded" value={stats.totalPhotosUploaded} icon="📷" />
            </div>

            {/* Search Bar */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24, marginBottom: 32 }}>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <svg width="24" height="24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or mobile number"
                  style={{ padding: 12, borderRadius: 8, border: "1px solid #ccc", fontSize: 16, flex: 1 }}
                  aria-label="Search students"
                />
                <button
                  type="submit"
                  style={{ padding: "12px 28px", borderRadius: 8, background: "#4CAF50", color: "#fff", border: "none", fontSize: 16 }}
                >
                  Search
                </button>
              </form>
            </div>

            {/* Registered Students Section */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24 }}>
              <h2 style={{ marginBottom: 24 }}>Registered Students</h2>
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>Loading student data...</div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>No matching student data found.</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    justifyContent: "flex-start",
                  }}
                >
                  {filteredStudents.map((s, i) => (
                    <StudentCard key={s.id || s.childName + s.mobileNumber + i} student={s} onClick={setSelectedStudent} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Modals */}
        <RegisterModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
        <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </div>
    )
  );
};

export default Dashboard;