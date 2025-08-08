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
  upload: (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  ),
  analytics: (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
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

const SidebarButton = ({ icon, label, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
      border: "none",
      color: "#fff",
      padding: "16px 24px",
      width: "100%",
      fontSize: 15,
      fontWeight: isActive ? 600 : 500,
      cursor: "pointer",
      borderRadius: 12,
      marginBottom: 4,
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
      textAlign: "left",
      ":hover": {
        background: "rgba(255, 255, 255, 0.15)",
      }
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.target.style.background = "rgba(255, 255, 255, 0.15)";
        e.target.style.transform = "translateX(4px)";
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.target.style.background = "transparent";
        e.target.style.transform = "translateX(0px)";
      }
    }}
  >
    <span 
      style={{ 
        width: 24, 
        height: 24,
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontSize: 18,
        filter: isActive ? "brightness(1.2)" : "brightness(1)"
      }}
    >
      {icon}
    </span>
    <span style={{ flex: 1 }}>{label}</span>
    {isActive && (
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: "#fff",
          borderRadius: "2px 0 0 2px"
        }}
      />
    )}
  </button>
);

const StudentRow = ({ student, onClick, index }) => (
  <tr
    onClick={() => onClick(student)}
    style={{
      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
      cursor: "pointer",
      transition: "background-color 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e3f2fd")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff")}
  >
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
      {index + 1}
    </td>
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", fontWeight: "600", color: "#2E7D32" }}>
      {student.childName || student.name || "N/A"}
    </td>
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
      {student.parentName || student.guardian_name || student.father_name || "-"}
    </td>
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
      {student.mobileNumber || student.username || student.mobile || "-"}
    </td>
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
      {student.village || student.address || "-"}
    </td>
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", textAlign: "center" }}>
      <span 
        style={{
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "500",
          backgroundColor: student.plantDistributed ? "#4caf50" : "#f44336",
          color: "white"
        }}
      >
        {student.plantDistributed ? "Yes" : "No"}
      </span>
    </td>
    <td style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
      {student.registrationDate || "-"}
    </td>
  </tr>
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
      <span role="img" aria-label="Warning">!</span> Optimized for Larger Screens
    </h2>
    <p style={{ fontSize: "18px", lineHeight: "1.6", maxWidth: "500px" }}>
      This dashboard provides a richer experience on desktop or larger tablet devices.
      Please access it from a personal computer for full functionality.
    </p>
  </div>
);

// =========================================================================
// Upload Logs Modal Component
// =========================================================================

const UploadLogsModal = ({ open, onClose }) => {
  const [studentId, setStudentId] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [description, setDescription] = useState('');
  const [uploadLogs, setUploadLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'view'

  useEffect(() => {
    if (open && activeTab === 'view') {
      fetchUploadLogs();
    }
  }, [open, activeTab]);

  const fetchUploadLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload-logs`);
      const result = await response.json();
      if (result.success) {
        setUploadLogs(result.data);
      } else {
        alert('Failed to fetch upload logs');
      }
    } catch (error) {
      console.error('Error fetching upload logs:', error);
      alert('Error fetching upload logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !uploadType) {
      alert('Please fill in Student ID and Upload Type');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          uploadType,
          description,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Upload logged successfully!');
        setStudentId('');
        setUploadType('');
        setDescription('');
        if (activeTab === 'view') {
          fetchUploadLogs(); // Refresh the logs
        }
      } else {
        alert(`Failed to log upload: ${result.message}`);
      }
    } catch (error) {
      console.error('Error logging upload:', error);
      alert('Error logging upload');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 32,
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 5px 20px rgba(0,0,0,0.25)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'transparent',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        <h2 style={{ marginBottom: 20, color: '#2E7D32' }}>Student Upload Management</h2>

        {/* Tab Navigation */}
        <div style={{ marginBottom: 20, borderBottom: '1px solid #e0e0e0' }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === 'create' ? '#2E7D32' : 'transparent',
              color: activeTab === 'create' ? '#fff' : '#666',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
              marginRight: 8,
            }}
          >
            Log Upload
          </button>
          <button
            onClick={() => setActiveTab('view')}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: activeTab === 'view' ? '#2E7D32' : 'transparent',
              color: activeTab === 'view' ? '#fff' : '#666',
              cursor: 'pointer',
              borderRadius: '8px 8px 0 0',
            }}
          >
            View Logs
          </button>
        </div>

        {/* Create Upload Tab */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Student ID *</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID/username"
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                }}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Upload Type *</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                }}
                required
              >
                <option value="">Select upload type</option>
                <option value="plant_photo">Plant Photo</option>
                <option value="pledge_photo">Pledge Photo</option>
                <option value="document">Document</option>
                <option value="progress_update">Progress Update</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Logging...' : 'Log Upload'}
            </button>
          </form>
        )}

        {/* View Logs Tab */}
        {activeTab === 'view' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 20 }}>Loading logs...</div>
            ) : uploadLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>No upload logs found</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Student ID</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Student Name</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Upload Type</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Description</th>
                      <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Upload Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadLogs.map((log, index) => (
                      <tr key={log.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                        <td style={{ padding: 12, borderBottom: '1px solid #e0e0e0' }}>{log.student_id}</td>
                        <td style={{ padding: 12, borderBottom: '1px solid #e0e0e0' }}>{log.student_name || 'N/A'}</td>
                        <td style={{ padding: 12, borderBottom: '1px solid #e0e0e0' }}>{log.upload_type}</td>
                        <td style={{ padding: 12, borderBottom: '1px solid #e0e0e0' }}>{log.description || '-'}</td>
                        <td style={{ padding: 12, borderBottom: '1px solid #e0e0e0' }}>
                          {new Date(log.upload_time).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Analytics Table Modal Component
const AnalyticsTableModal = ({ open, onClose, data, loading }) => {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 0,
        width: '98%',
        maxWidth: '1600px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
            आंगनवाड़ी केंद्र - 12 सप्ताह अपलोड रिपोर्ट
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 6,
              color: '#6b7280',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          padding: 24, 
          overflow: 'auto',
          flex: 1 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div>डेटा लोड हो रहा है...</div>
            </div>
          ) : data.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
              कोई डेटा उपलब्ध नहीं है
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                minWidth: '1650px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left', 
                      borderBottom: '2px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minWidth: '200px',
                      position: 'sticky',
                      left: 0,
                      backgroundColor: '#f8fafc',
                      zIndex: 10
                    }}>
                      आंगनवाड़ी केंद्र
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'center', 
                      borderBottom: '2px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minWidth: '100px',
                      position: 'sticky',
                      left: '200px',
                      backgroundColor: '#f8fafc',
                      zIndex: 10
                    }}>
                      कुल बच्चे
                    </th>
                    <th style={{ 
                      padding: '12px 8px', 
                      textAlign: 'center', 
                      borderBottom: '2px solid #e2e8f0',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minWidth: '120px',
                      position: 'sticky',
                      left: '300px',
                      backgroundColor: '#f8fafc',
                      zIndex: 10
                    }}>
                      कुल फोटो अपलोड
                    </th>
                    {/* Week columns for 12 weeks - each week has 2 columns (first 15 days, next 15 days) */}
                    {data[0]?.weekly_uploads?.map((week, index) => (
                      <React.Fragment key={index}>
                        <th style={{ 
                          padding: '8px 6px', 
                          textAlign: 'center', 
                          borderBottom: '2px solid #e2e8f0',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          minWidth: '80px',
                          backgroundColor: '#e8f5e8'
                        }}>
                          सप्ताह {week.week_number}
                          <br />
                          <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>
                            पहले 15 दिन
                          </span>
                        </th>
                        <th style={{ 
                          padding: '8px 6px', 
                          textAlign: 'center', 
                          borderBottom: '2px solid #e2e8f0',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          minWidth: '80px',
                          backgroundColor: '#fef3e8'
                        }}>
                          सप्ताह {week.week_number}
                          <br />
                          <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>
                            अगले 15 दिन
                          </span>
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((center, centerIndex) => (
                    <tr key={centerIndex} style={{ 
                      backgroundColor: centerIndex % 2 === 0 ? '#fff' : '#f8fafc'
                    }}>
                      <td style={{ 
                        padding: '12px 8px', 
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: 500,
                        maxWidth: '200px',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: centerIndex % 2 === 0 ? '#fff' : '#f8fafc',
                        zIndex: 5
                      }}>
                        {center.center_name}
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        textAlign: 'center', 
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: 600,
                        color: '#2563eb',
                        position: 'sticky',
                        left: '200px',
                        backgroundColor: centerIndex % 2 === 0 ? '#fff' : '#f8fafc',
                        zIndex: 5
                      }}>
                        {center.total_students}
                      </td>
                      <td style={{ 
                        padding: '12px 8px', 
                        textAlign: 'center', 
                        borderBottom: '1px solid #e2e8f0',
                        fontWeight: 600,
                        color: '#059669',
                        position: 'sticky',
                        left: '300px',
                        backgroundColor: centerIndex % 2 === 0 ? '#fff' : '#f8fafc',
                        zIndex: 5
                      }}>
                        {center.total_photos_uploaded}
                      </td>
                      {center.weekly_uploads.map((week, weekIndex) => (
                        <React.Fragment key={weekIndex}>
                          <td style={{ 
                            padding: '8px 6px', 
                            textAlign: 'center', 
                            borderBottom: '1px solid #e2e8f0',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#059669',
                            backgroundColor: week.first_15_days > 0 ? '#f0fdf4' : 'transparent'
                          }}>
                            {week.first_15_days}
                          </td>
                          <td style={{ 
                            padding: '8px 6px', 
                            textAlign: 'center', 
                            borderBottom: '1px solid #e2e8f0',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#dc2626',
                            backgroundColor: week.next_15_days > 0 ? '#fef2f2' : 'transparent'
                          }}>
                            {week.next_15_days}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
  
  // Hierarchical Filters State
  const [pariyojnaList, setPariyojnaList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [villageList, setVillageList] = useState([]);
  const [aanganwadiList, setAanganwadiList] = useState([]);
  
  const [selectedPariyojna, setSelectedPariyojna] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [selectedAanganwadi, setSelectedAanganwadi] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAnalyticsTable, setShowAnalyticsTable] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const SMALL_SCREEN_BREAKPOINT = 768;

  // Hierarchical Filter Functions
  const fetchPariyojnaList = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get-pariyojna-list`);
      const data = await response.json();
      if (data.success) {
        setPariyojnaList(data.data);
      }
    } catch (error) {
      console.error('Error fetching pariyojna list:', error);
    }
  };

  const fetchSectorList = async (pariyojnaName = '', searchTerm = '') => {
    try {
      const params = new URLSearchParams();
      if (pariyojnaName) params.append('pariyojna_name', pariyojnaName);
      if (searchTerm) params.append('search', searchTerm);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get-sector-list${queryString}`);
      const data = await response.json();
      if (data.success) {
        setSectorList(data.data);
      }
    } catch (error) {
      console.error('Error fetching sector list:', error);
    }
  };

  const fetchVillageList = async (pariyojnaName = '', sectorName = '', searchTerm = '') => {
    try {
      const params = new URLSearchParams();
      if (pariyojnaName) params.append('pariyojna_name', pariyojnaName);
      if (sectorName) params.append('sector_name', sectorName);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get-village-list?${params}`);
      const data = await response.json();
      if (data.success) {
        setVillageList(data.data);
      }
    } catch (error) {
      console.error('Error fetching village list:', error);
    }
  };

  const fetchAanganwadiList = async (pariyojnaName = '', sectorName = '', villageName = '', searchTerm = '') => {
    try {
      const params = new URLSearchParams();
      if (pariyojnaName) params.append('pariyojna_name', pariyojnaName);
      if (sectorName) params.append('sector_name', sectorName);
      if (villageName) params.append('village_name', villageName);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get-aanganwadi-list?${params}`);
      const data = await response.json();
      if (data.success) {
        setAanganwadiList(data.data);
      }
    } catch (error) {
      console.error('Error fetching aanganwadi list:', error);
    }
  };

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

  // Analytics Table fetch function
  const fetchAnalyticsTableData = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/anganwadi-weekly-uploads`);
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data || []);
      } else {
        console.error('Analytics API error:', data.message);
        setAnalyticsData([]);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData([]);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Fetch analytics data when modal opens
  useEffect(() => {
    if (showAnalyticsTable) {
      fetchAnalyticsTableData();
    }
  }, [showAnalyticsTable, fetchAnalyticsTableData]);

  useEffect(() => {
    fetchAllStudents();
    fetchPariyojnaList(); // Load initial filter data
  }, []);

  // Separate useEffect to handle filter changes
  useEffect(() => {
    fetchAllStudents();
  }, [selectedPariyojna, selectedSector, selectedVillage, selectedAanganwadi, searchQuery]);

  // Filter Change Handlers - Updated for JOIN-based server-side filtering
  const handlePariyojnaChange = (pariyojnaName) => {
    console.log('Pariyojna Search:', pariyojnaName);
    setSelectedPariyojna(pariyojnaName);
    setSelectedSector('');
    setSelectedVillage('');
    setSelectedAanganwadi('');
    setSectorList([]);
    setVillageList([]);
    setAanganwadiList([]);
    
    // Fetch sectors matching the typed text (with debounce for performance)
    if (pariyojnaName.trim()) {
      clearTimeout(window.pariyojnaTimeout);
      window.pariyojnaTimeout = setTimeout(() => {
        console.log('🚀 Fetching sectors for:', pariyojnaName);
        fetchSectorList('', pariyojnaName); // Pass as search term
      }, 300); // 300ms delay
    }
    // Note: fetchAllStudents will be called automatically due to useEffect dependency
  };

  const handleSectorChange = (sectorName) => {
    setSelectedSector(sectorName);
    setSelectedVillage('');
    setSelectedAanganwadi('');
    setVillageList([]);
    setAanganwadiList([]);
    
    // Fetch villages matching the typed text
    if (sectorName.trim()) {
      clearTimeout(window.sectorTimeout);
      window.sectorTimeout = setTimeout(() => {
        fetchVillageList(selectedPariyojna, '', sectorName); // Pass as search term
      }, 300);
    }
    // Note: fetchAllStudents will be called automatically due to useEffect dependency
  };

  const handleVillageChange = (villageName) => {
    setSelectedVillage(villageName);
    setSelectedAanganwadi('');
    setAanganwadiList([]);
    
    // Fetch aanganwadis matching the typed text
    if (villageName.trim()) {
      clearTimeout(window.villageTimeout);
      window.villageTimeout = setTimeout(() => {
        fetchAanganwadiList(selectedPariyojna, selectedSector, '', villageName); // Pass as search term
      }, 300);
    }
    // Note: fetchAllStudents will be called automatically due to useEffect dependency
  };

  const handleAanganwadiChange = (aanganwadiName) => {
    setSelectedAanganwadi(aanganwadiName);
    // Note: fetchAllStudents will be called automatically due to useEffect dependency
  };

  const fetchAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      // Build query parameters for filtering
      const params = new URLSearchParams();
      if (selectedPariyojna) params.append('pariyojna_name', selectedPariyojna);
      if (selectedSector) params.append('sector_name', selectedSector);
      if (selectedVillage) params.append('village_name', selectedVillage);
      if (selectedAanganwadi) params.append('aanganwadi_kendra_name', selectedAanganwadi);
      if (searchQuery) params.append('search', searchQuery);
      
      // Use filtered endpoint if we have filters, otherwise use regular endpoint
      const endpoint = params.toString() ? 
        `/students-filtered?${params.toString()}` : 
        '/students-json';
      
      const res = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const response = await res.json();

      if (response.success && response.data) {
        const students = response.data;
        
        const cleanedRows = students.filter((student) => {
          const hasName = student.name?.trim() || student.childName?.trim();
          const hasContact = student.mobileNumber?.trim() || student.username?.trim() || student.mobile?.trim();
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

        console.log('Students loaded with JOIN-based filtering:', cleanedRows.length);
        if (response.filters_applied) {
          console.log('🔧 Filters applied:', response.filters_applied);
        }
      } else {
        console.warn("No students data found in response.");
        setAllStudents([]);
        setStats({ total: 0, uniqueVillages: 0, totalPlantsPlanted: 0, totalPhotosUploaded: 0 });
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setAllStudents([]);
      setStats({ total: 0, uniqueVillages: 0, totalPlantsPlanted: 0, totalPhotosUploaded: 0 });
    } finally {
      setLoading(false);
    }
  }, [selectedPariyojna, selectedSector, selectedVillage, selectedAanganwadi, searchQuery]);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  // Simplified client-side filtering - server now handles all filtering via JOIN
  const filteredStudents = useMemo(() => {
    // Server already handles all filtering including search, hierarchical filters via JOIN
    console.log('� Total Students (Server-side filtered via JOIN):', allStudents.length);
    return allStudents;
  }, [allStudents]);

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
          gridTemplateColumns: "280px 1fr", // Increased sidebar width for better design
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Enhanced Sidebar */}
        <aside
          style={{
            background: "linear-gradient(180deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: 0,
            overflowY: "auto",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* Header Section */}
          <div 
            style={{ 
              padding: "32px 24px 24px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(0, 0, 0, 0.1)"
            }}
          >
            <div 
              style={{ 
                fontWeight: "bold", 
                fontSize: 26, 
                textAlign: "center", 
                marginBottom: 8,
                background: "linear-gradient(45deg, #fff, #e8f5e8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              हर घर मुंगा
            </div>
            <div 
              style={{ 
                fontSize: 13, 
                textAlign: "center", 
                color: "rgba(255, 255, 255, 0.8)",
                fontWeight: 400
              }}
            >
              Admin Dashboard
            </div>
          </div>

          {/* Dashboard Selector */}
          <div style={{ padding: "24px 24px 16px" }}>
            <label 
              htmlFor="dashboard-select" 
              style={{ 
                color: "rgba(255, 255, 255, 0.9)", 
                fontSize: 13, 
                marginBottom: 8, 
                display: "block",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5
              }}
            >
              Choose Dashboard
            </label>
            <select
              id="dashboard-select"
              onChange={handleDashboardSelect}
              defaultValue="student"
              style={{ 
                width: "100%", 
                padding: "12px 16px", 
                borderRadius: 10,
                border: "2px solid rgba(255, 255, 255, 0.2)",
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <option value="student" style={{ color: "#333", background: "#fff" }}>Student Dashboard</option>
              <option value="anganvadi" style={{ color: "#333", background: "#fff" }}>Anganvadi Dashboard</option>
            </select>
          </div>

          {/* Navigation Section */}
          <nav style={{ padding: "0 24px", flex: 1 }}>
            <div 
              style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5
              }}
            >
              Quick Actions
            </div>
            <SidebarButton 
              icon={icons.register}
              label="Register Student" 
              onClick={() => setShowRegisterModal(true)}
              isActive={showRegisterModal}
            />
            <SidebarButton 
              icon={icons.analytics}
              label="Analytics Table" 
              onClick={() => setShowAnalyticsTable(true)}
              isActive={showAnalyticsTable}
            />
          </nav>

          {/* Footer Section */}
          <div 
            style={{ 
              padding: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(0, 0, 0, 0.1)"
            }}
          >
            <div 
              style={{ 
                fontSize: 12, 
                color: "rgba(255, 255, 255, 0.6)", 
                textAlign: "center",
                lineHeight: 1.4
              }}
            >
              Powered by<br/>
              <span style={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.9)" }}>SSIPMT</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          style={{
            // The grid layout takes care of the width and height
            padding: "40px 0",
            overflowY: "auto",
            backgroundColor: "#f5f5f5", // Redundant but good practice for clarity
            position: "relative", // Add relative positioning for the logout button
          }}
        >
          {/* Logout Button - Top Right Corner */}
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              zIndex: 1001,
              boxShadow: "0 2px 8px rgba(244, 67, 54, 0.3)",
              transition: "all 0.2s ease",
              minWidth: "90px",
              height: "36px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#d32f2f";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(244, 67, 54, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f44336";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(244, 67, 54, 0.3)";
            }}
          >
            {icons.logout}
            Logout
          </button>
          
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 32px 32px" }}>
            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
              <StatCard label="Total Students" value={stats.total} icon="" />
              <StatCard label="Unique Villages" value={stats.uniqueVillages} icon="" />
              <StatCard label="Total Plants Planted" value={stats.totalPlantsPlanted} icon="" />
              <StatCard label="Total Photos Uploaded" value={stats.totalPhotosUploaded} icon="" />
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
                  style={{
                    background: "#2E7D32",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 8,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                  aria-label="Search button"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Hierarchical Filters */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24, marginBottom: 32 }}>
              <h3 style={{ marginBottom: 16, color: "#333" }}>फिल्टर करें / Filter</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                
                {/* Pariyojna Filter */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "600", color: "#555" }}>
                    परियोजना नाम / Project Name
                  </label>
                  <input
                    type="text"
                    value={selectedPariyojna}
                    onChange={(e) => handlePariyojnaChange(e.target.value)}
                    placeholder="Type project name..."
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  />
                </div>

                {/* Sector Filter */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "600", color: "#555" }}>
                    सेक्टर नाम / Sector Name
                  </label>
                  <input
                    type="text"
                    value={selectedSector}
                    onChange={(e) => handleSectorChange(e.target.value)}
                    placeholder="Type sector name..."
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  />
                </div>

                {/* Village Filter */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "600", color: "#555" }}>
                    ग्राम नाम / Village Name
                  </label>
                  <input
                    type="text"
                    value={selectedVillage}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    placeholder="Type village name..."
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  />
                </div>

                {/* Aanganwadi Filter */}
                <div>
                  <label style={{ display: "block", marginBottom: 8, fontWeight: "600", color: "#555" }}>
                    आंगनवाड़ी केंद्र / Anganwadi Center
                  </label>
                  <input
                    type="text"
                    value={selectedAanganwadi}
                    onChange={(e) => handleAanganwadiChange(e.target.value)}
                    placeholder="Type aanganwadi name..."
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                  />
                </div>
              </div>
            </div>

            {/* Registered Students Section */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24 }}>
              <h2 style={{ marginBottom: 24 }}>Registered Students</h2>
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>Loading student data...</div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>No matching student data found.</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: "#2E7D32", color: "white" }}>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Sr.</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Student Name</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Parent Name</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Mobile</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Village</th>
                        <th style={{ padding: "16px", textAlign: "center", fontWeight: "600" }}>Plant Status</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600" }}>Registration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s, i) => (
                        <StudentRow 
                          key={s.id || s.childName + s.mobileNumber + i} 
                          student={s} 
                          onClick={setSelectedStudent}
                          index={i}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Modals */}
        <RegisterModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
        <UploadLogsModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
        <AnalyticsTableModal 
          open={showAnalyticsTable} 
          onClose={() => setShowAnalyticsTable(false)}
          data={analyticsData}
          loading={analyticsLoading}
        />
        <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      </div>
    )
  );
};

export default Dashboard;