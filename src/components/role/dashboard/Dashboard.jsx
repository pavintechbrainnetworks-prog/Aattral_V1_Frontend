import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import api from "../../../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Fetch all users from API ──
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to load users.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    setApiError("");
    setLoading(true);
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", phone: "", password: "" });
      await fetchUsers();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email, phone: user.phone, password: "" });
  };

  const handleUpdate = async () => {
    setApiError("");
    setLoading(true);
    try {
      const updateData = { name: form.name, phone: form.phone };
      await api.patch(`/users/${editingId}`, updateData);
      setEditingId(null);
      setForm({ name: "", email: "", phone: "", password: "" });
      await fetchUsers();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setApiError("");
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const markLogin = async (id) => {
    try {
      await api.post(`/users/${id}/login-history`, {
        entry: `Login: ${new Date().toLocaleString()}`,
      });
      await fetchUsers();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to log login.");
    }
  };

  const markLogout = async (id) => {
    try {
      await api.post(`/users/${id}/login-history`, {
        entry: `Logout: ${new Date().toLocaleString()}`,
      });
      await fetchUsers();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to log logout.");
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      await fetchUsers();
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to toggle status.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {apiError && (
        <p className="error" role="alert" style={{ color: "red", marginBottom: 12 }}>
          {apiError}
        </p>
      )}

      {/* FORM */}
      <div className="form-card">
        <h2>{editingId ? "Edit User" : "Create User"}</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="form-input"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="form-input"
          disabled={!!editingId}
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="form-input"
        />
        {!editingId && (
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="form-input"
          />
        )}

        {editingId ? (
          <button className="btn btn-update" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating…" : "Update User"}
          </button>
        ) : (
          <button className="btn btn-create" onClick={handleCreate} disabled={loading}>
            {loading ? "Creating…" : "Create User"}
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                <td>{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "-"}</td>
                <td>{u.active ? "Yes" : "No"}</td>

                <td className="action-btns">
                  <button className="btn btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="btn btn-delete" onClick={() => handleDelete(u._id)}>Delete</button>
                  <button className="btn btn-login" onClick={() => markLogin(u._id)}>Login</button>
                  <button className="btn btn-logout" onClick={() => markLogout(u._id)}>Logout</button>
                  <button className="btn btn-toggle" onClick={() => toggleActive(u._id)}>Toggle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOGIN HISTORY */}
      <div className="history-card">
        <h2 className="history-title">User Login / Logout History</h2>

        {users.map((u) => (
          <div key={u._id} className="history-item">
            <h3>{u.name}</h3>
            {(!u.loginHistory || u.loginHistory.length === 0) ? (
              <p>No history available</p>
            ) : (
              u.loginHistory.map((h, i) => <p key={i}>{h}</p>)
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
