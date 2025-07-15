import React, { useEffect, useState } from "react";

const AllStudentsTable = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          "https://grx6djfl-5000.inc1.devtunnels.ms/data"
        );
        const html = await res.text();
        // Parse HTML table
        const parser = new window.DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const table = doc.querySelector("table");
        if (!table) throw new Error("No table found");
        // Get columns
        const ths = Array.from(table.querySelectorAll("th"));
        const cols = ths.map((th) => th.textContent.trim());
        setColumns(cols);
        // Get rows
        const trs = Array.from(table.querySelectorAll("tbody tr"));
        const dataRows = trs.map((tr) => {
          const tds = Array.from(tr.querySelectorAll("td"));
          return tds.map((td) => td.textContent.trim());
        });
        setRows(dataRows);
      } catch (err) {
        setError("Failed to load data table");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading student data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!columns.length) return <div>No data found.</div>;

  return (
    <div
      style={{
        overflowX: "auto",
        background: "white",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: 24,
      }}
    >
      <h2>All Registered Students</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                style={{
                  border: "1px solid #ccc",
                  padding: 8,
                  background: "#f5f5f5",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ border: "1px solid #eee", padding: 8 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllStudentsTable;
