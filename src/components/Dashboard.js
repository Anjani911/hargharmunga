import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useApi";
import AnganwadiAdd from "./Anganwadiadd";

const icons = {
  dashboard: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
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

// COMPONENT: Sidebar Button
const SidebarButton = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: active ? "#388e3c" : "transparent",
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

// COMPONENT: Student Card
const StudentCard = ({ student, onClick }) => (
  <div
    onClick={() => onClick(student)} // Add onClick handler
    style={{
      background: "white",
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
      cursor: "pointer", // Indicate it's clickable
      transition: "transform 0.2s ease-in-out",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={{ fontWeight: "bold", fontSize: 18, color: "#2E7D32" }}>
      {student.childName || student.name}
    </div>
    <div>
      <strong>Parent:</strong>{" "}
      {student.parentName ||
        student.guardian_name ||
        student.father_name ||
        "-"}
    </div>
    <div>
      <strong>Mobile:</strong> {student.mobileNumber || student.username || "-"}
    </div>
    <div>
      <strong>Village:</strong> {student.village || student.address || "-"}
    </div>
    <div>
      <strong>Plant Distributed:</strong>{" "}
      {student.plantDistributed ? "Yes" : "No"}
    </div>
    {student.registrationDate && (
      <div>
        <strong>Registered:</strong> {student.registrationDate}
      </div>
    )}
  </div>
);

// COMPONENT: Stat Card
const StatCard = ({ label, value, icon }) => (
  <div
    style={{
      background: "white",
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

// New Component: StudentDetailModal
const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  // Function to render a detail row, handling potentially missing data
  const renderDetailRow = (label, value) => {
    if (value === undefined || value === null || value === "") {
      return null; // Don't render the row if data is missing
    }
    return (
      <div style={{ marginBottom: '10px' }}>
        <strong>{label}:</strong> {value}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#333",
          }}
        >
          &times;
        </button>
        <h2 style={{ color: "#2E7D32", marginBottom: "20px", borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          Student Details: {student.childName || student.name}
        </h2>
        <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
          {renderDetailRow("Child Name", student.childName || student.name)}
          {renderDetailRow("Parent Name", student.parentName || student.guardian_name || student.father_name)}
          {renderDetailRow("Mobile Number", student.mobileNumber || student.username)}
          {renderDetailRow("Village/Address", student.village || student.address)}
          {renderDetailRow("Anganwadi Center", student.anganwadiCenter)}
          {renderDetailRow("Date of Birth", student.dob)}
          {renderDetailRow("Gender", student.gender)}
          {renderDetailRow("Aadhar Number", student.aadharNumber)}
          {renderDetailRow("Plant Distributed", student.plantDistributed ? "Yes" : "No")}
          {renderDetailRow("Registration Date", student.registrationDate)}
          {/* Add more fields as needed based on your data structure */}
          {Object.keys(student).map((key) => {
            // Only render if the key is not already explicitly handled above
            // and if the value is not empty/null/undefined
            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // Format key for display
            if (!['childName', 'name', 'parentName', 'guardian_name', 'father_name', 'mobileNumber', 'username', 'village', 'address', 'anganwadiCenter', 'dob', 'gender', 'aadharNumber', 'plantDistributed', 'registrationDate', 'id'].includes(key) && student[key]) {
              return renderDetailRow(displayKey, student[key]);
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};


// MAIN COMPONENT: Dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout: apiLogout } = useAuth();

  const [allStudents, setAllStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, uniqueVillages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState(null); // New state for selected student

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://grx6djfl-5001.inc1.devtunnels.ms/data"
        );
        const html = await res.text();
        const doc = new window.DOMParser().parseFromString(html, "text/html");
        const table = doc.querySelector("table");
        if (!table) throw new Error("No table found");

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

        setAllStudents(rows);
        setStats({
          total: rows.length,
          uniqueVillages: new Set(rows.map((s) => s.village || s.address || ""))
            .size,
        });
      } catch {
        setAllStudents([]);
        setStats({ total: 0, uniqueVillages: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return allStudents;
    const q = searchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        (s.childName || s.name || "").toLowerCase().includes(q) ||
        (s.mobileNumber || s.username || "").toLowerCase().includes(q)
    );
  }, [allStudents, searchQuery]);

  const handleLogout = async () => {
    await apiLogout();
    navigate("/");
  };

  const goTo = (section) => {
    setActiveSection(section);
    if (section === "register") navigate("/register");
    if (section === "logout") handleLogout();
  };

  const handleCardClick = (student) => {
    setSelectedStudent(student); // Set the clicked student to state
  };

  const handleCloseModal = () => {
    setSelectedStudent(null); // Clear the selected student to close the modal
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "linear-gradient(180deg, #2E7D32, #388e3c)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "32px 0",
          minHeight: "100vh",
          boxShadow: "2px 0 12px rgba(44, 62, 80, 0.06)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: 24,
            letterSpacing: 1,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          🌳 हर घर मुंगा
        </div>
        <SidebarButton
          icon={icons.dashboard}
          label="Dashboard"
          active={activeSection === "dashboard"}
          onClick={() => goTo("dashboard")}
        />
        <SidebarButton
          icon={icons.register}
          label="Register"
          active={activeSection === "register"}
          onClick={() => goTo("register")}
        />
        <div style={{ flex: 1 }} />
        <SidebarButton
          icon={icons.logout}
          label="Logout"
          active={false}
          onClick={() => goTo("logout")}
        />
      </aside>

      {/* Main Content */}
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

          <div
            style={{
              background: "white",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 24,
              marginBottom: 32,
            }}
          >
            <AnganwadiAdd />
          </div>

          {/* Search */}
          <div
            style={{
              background: "white",
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
                  color: "white",
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
              background: "white",
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
                  <StudentCard key={s.id || i} student={s} onClick={handleCardClick} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      <StudentDetailModal student={selectedStudent} onClose={handleCloseModal} />
    </div>
  );
};

export default Dashboard;