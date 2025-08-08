import React, { useState } from "react";

const formStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "24px",
  border: "1px solid #b2dfdb",
  borderRadius: "8px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(76,175,80,0.08)",
};

const labelStyle = {
  display: "block",
  marginBottom: "20px",
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
    aanganwadi_id: "",
    name: "",
    role: "aanganwadi_worker", // Fixed role - no dropdown needed
    contact_number: "",
    password_hash: "",
    zila: "",
    tehsil: "",
    block: "",
    gram: "",
    supervisor_name: "",
    block_name: "",
    pariyojna_name: "",
    sector_name: "",
    village_name: "",
    aanganwadi_kendra_name: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/registerAng`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("Submitted:", data);
      
      if (data.success) {
        alert("Anganwadi worker added successfully!");
        setForm({
          aanganwadi_id: "",
          name: "",
          role: "",
          contact_number: "",
          password_hash: "",
          zila: "",
          tehsil: "",
          block: "",
          gram: "",
          supervisor_name: "",
          block_name: "",
          pariyojna_name: "",
          sector_name: "",
          village_name: "",
          aanganwadi_kendra_name: "",
        });
      } else {
        alert(`Error: ${data.message || 'Failed to add worker'}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2
        style={{ textAlign: "center", marginBottom: "24px", color: "#388e3c" }}
      >
        Add Anganwadi Details
      </h2>

      <label style={labelStyle}>
        Anganwadi ID:
        <input
          type="text"
          name="aanganwadi_id"
          value={form.aanganwadi_id}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>

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

      <label style={labelStyle}>
        Contact Number:
        <input
          type="text"
          name="contact_number"
          value={form.contact_number}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Password:
        <input
          type="password"
          name="password_hash"
          value={form.password_hash}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Zila:
        <input
          type="text"
          name="zila"
          value={form.zila}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Tehsil:
        <input
          type="text"
          name="tehsil"
          value={form.tehsil}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </label>

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

      <label style={labelStyle}>
        Gram (Village):
        <input
          type="text"
          name="gram"
          value={form.gram}
          onChange={(e) => {
            // Update both gram and village_name with the same value
            setForm({ 
              ...form, 
              gram: e.target.value,
              village_name: e.target.value 
            });
          }}
          required
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Supervisor Name:
        <input
          type="text"
          name="supervisor_name"
          value={form.supervisor_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Block Name:
        <input
          type="text"
          name="block_name"
          value={form.block_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Project Name:
        <input
          type="text"
          name="pariyojna_name"
          value={form.pariyojna_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Sector Name:
        <input
          type="text"
          name="sector_name"
          value={form.sector_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <label style={labelStyle}>
        Anganwadi Center Name:
        <input
          type="text"
          name="aanganwadi_kendra_name"
          value={form.aanganwadi_kendra_name}
          onChange={handleChange}
          style={inputStyle}
        />
      </label>

      <button type="submit" style={buttonStyle}>
        Add Anganwadi Worker
      </button>
    </form>
  );
};

export default AnganwadiAdd;
