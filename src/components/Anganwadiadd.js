import React, { useState } from "react";

const formStyle = {
  maxWidth: 400,
  margin: "40px auto",
  padding: "24px",
  border: "1px solid #b2dfdb",
  borderRadius: "8px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(76,175,80,0.08)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#388e3c",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "16px",
  border: "1px solid #a5d6a7",
  borderRadius: "4px",
  fontSize: "1rem",
  boxSizing: "border-box",
  background: "#f1f8e9",
  color: "#2e7d32",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#43a047",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background 0.2s",
};

const AnganwadiAdd = () => {
  const [form, setForm] = useState({
    name: "",
    centerLocation: "",
    block: "",
    village: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      console.log("Submitted:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2
        style={{ textAlign: "center", marginBottom: "24px", color: "#388e3c" }}
      >
        Add Anganwadi Details
      </h2>
      <div>
        <label style={labelStyle}>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>
      <div>
        <label style={labelStyle}>
          Center Location:
          <input
            type="text"
            name="centerLocation"
            value={form.centerLocation}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>
      <div>
        <label style={labelStyle}>
          Block:
          <input
            type="text"
            name="block"
            value={form.block}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>
      <div>
        <label style={labelStyle}>
          Village Name:
          <input
            type="text"
            name="village"
            value={form.village}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>
      </div>
      <button type="submit" style={buttonStyle}>
        Add Anganwadi
      </button>
    </form>
  );
};

export default AnganwadiAdd;
