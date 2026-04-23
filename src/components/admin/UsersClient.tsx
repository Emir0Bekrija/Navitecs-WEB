"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Plus, KeyRound, Trash2, Eye, EyeOff, X, Check } from "lucide-react";

type AdminUser = {
  id: number;
  username: string;
  role: string;
  createdAt: string;
};

type Me = { id: number; username: string; role: string };

export default function UsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingPasswordFor, setChangingPasswordFor] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ username: "", password: "", role: "admin" });
  const [showAddPw, setShowAddPw] = useState(false);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [usersRes, meRes] = await Promise.all([
      fetch("/api/admin/users"),
      fetch("/api/admin/me"),
    ]);
    if (usersRes.ok) setUsers(await usersRes.json());
    if (meRes.ok) setMe(await meRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function savePassword(userId: number) {
    if (newPassword.length < 12) { setPwError("Password must be at least 12 characters."); return; }
    setSavingPw(true);
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    setSavingPw(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({})) as { error?: string };
      setPwError(j.error ?? "Failed to save.");
    } else {
      setChangingPasswordFor(null);
      setNewPassword("");
      setPwError("");
    }
  }

  async function deleteUser(id: number, username: string) {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) {
      const j = await res.json().catch(() => ({})) as { error?: string };
      alert(j.error ?? "Failed to delete.");
    } else {
      load();
    }
  }

  async function addUser() {
    setAddError("");
    if (addForm.username.length < 3) { setAddError("Username must be at least 3 characters."); return; }
    if (addForm.password.length < 12) { setAddError("Password must be at least 12 characters."); return; }
    setAdding(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    setAdding(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({})) as { error?: unknown };
      setAddError(typeof j.error === "string" ? j.error : "Failed to create user.");
    } else {
      setShowAddForm(false);
      setAddForm({ username: "", password: "", role: "admin" });
      load();
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Admin Users</h2>
          <p className="text-gray-400 text-sm mt-0.5">{users.length} user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-[#00FF9C]/10 border border-[#00FF9C]/25 text-[#00FF9C] rounded-lg hover:bg-[#00FF9C]/20 transition-all"
        >
          {showAddForm ? <X size={13} /> : <Plus size={13} />}
          {showAddForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {/* Add user form */}
      {showAddForm && (
        <div className="bg-[#0a0a0a] border border-[#00FF9C]/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#00FF9C]">New Admin User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Username</label>
              <input
                type="text"
                value={addForm.username}
                onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="e.g. john_doe"
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF9C]/50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Role</label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF9C]/50 appearance-none"
              >
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Password (min 12 chars)</label>
            <div className="relative">
              <input
                type={showAddPw ? "text" : "password"}
                value={addForm.password}
                onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Strong password…"
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF9C]/50"
              />
              <button type="button" onClick={() => setShowAddPw((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showAddPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          {addError && <p className="text-xs text-red-400">{addError}</p>}
          <button
            onClick={addUser}
            disabled={adding}
            className="flex items-center gap-2 px-4 py-2 bg-[#00FF9C]/10 border border-[#00FF9C]/25 text-[#00FF9C] rounded-lg text-sm hover:bg-[#00FF9C]/20 transition-all disabled:opacity-50"
          >
            <Check size={14} />
            {adding ? "Creating…" : "Create User"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-5">
                <div className="w-10 h-10 rounded-full bg-[#00AEEF]/15 flex items-center justify-center text-[#00AEEF] shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{user.username}</span>
                    {user.id === me?.id && (
                      <span className="text-xs text-[#00FF9C] bg-[#00FF9C]/10 border border-[#00FF9C]/20 px-1.5 py-0.5 rounded-full">You</span>
                    )}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border ${
                      user.role === "superadmin"
                        ? "bg-[#00FF9C]/10 border-[#00FF9C]/20 text-[#00FF9C]"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}>{user.role}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Created {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setChangingPasswordFor(changingPasswordFor === user.id ? null : user.id);
                      setNewPassword("");
                      setPwError("");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                  >
                    <KeyRound size={12} />
                    Change password
                  </button>
                  {user.id !== me?.id && (
                    <button
                      onClick={() => deleteUser(user.id, user.username)}
                      disabled={deletingId === user.id}
                      className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Password change form */}
              {changingPasswordFor === user.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 flex items-end gap-3 flex-wrap">
                  <div className="flex-1 min-w-48">
                    <label className="text-xs text-gray-500 block mb-1">New password (min 12 chars)</label>
                    <div className="relative">
                      <input
                        type={showPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setPwError(""); }}
                        placeholder="New password…"
                        className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00AEEF]/50"
                      />
                      <button type="button" onClick={() => setShowPw((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {pwError && <p className="text-xs text-red-400 mt-1">{pwError}</p>}
                  </div>
                  <button
                    onClick={() => savePassword(user.id)}
                    disabled={savingPw || !newPassword}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00AEEF]/10 border border-[#00AEEF]/25 text-[#00AEEF] rounded-lg text-sm hover:bg-[#00AEEF]/20 transition-all disabled:opacity-50"
                  >
                    <Check size={13} />
                    {savingPw ? "Saving…" : "Save"}
                  </button>
                  <p className="text-xs text-gray-600 w-full">All sessions for this user will be invalidated.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
