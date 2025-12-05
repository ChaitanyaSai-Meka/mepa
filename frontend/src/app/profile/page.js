"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadProfile();
  }, [router]);

  useEffect(() => {
    if (activeTab === "saved" && savedRoutes.length === 0) {
      loadSavedRoutes();
    } else if (activeTab === "history" && history.length === 0) {
      loadHistory();
    }
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5004/api/profiles/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
      setUsername(data.username);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedRoutes = async () => {
    setLoadingRoutes(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5004/api/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setSavedRoutes(data);
    } catch (err) {
      console.error("Failed to load saved routes:", err);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5004/api/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5004/api/profiles/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update profile");
      setUser(data.profile);
      setUsername(data.profile.username);
      localStorage.setItem("user", JSON.stringify(data.profile));
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const unsaveRoute = async (routeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5004/api/saved/${routeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to unsave route");
      setSavedRoutes(savedRoutes.filter((item) => item.route.id !== routeId));
    } catch (err) {
      alert(err.message || "Failed to unsave route");
    }
  };

  const clearHistory = async () => {
    if (!confirm("Are you sure you want to clear all history?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5004/api/history", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to clear history");
      setHistory([]);
    } catch (err) {
      alert(err.message || "Failed to clear history");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:5004/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Metro</h1>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Profile</h2>
          <p className="text-sm text-gray-500">Manage your account and routes</p>
        </div>

        <div className="bg-white rounded-lg shadow-card mb-6">
          <div className="border-b border-gray-100">
            <div className="flex gap-8 px-8">
              <button
                onClick={() => setActiveTab("account")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "account"
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Account
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "saved"
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Saved Routes
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "history"
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                History
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "account" && (
              <>
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-black focus:ring-0 transition-colors text-sm"
                        placeholder="Enter username"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 py-2.5">{user?.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-sm text-gray-500 py-2.5">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Member since</label>
                    <p className="text-sm text-gray-500 py-2.5">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setUsername(user?.username || "");
                          setError("");
                          setSuccess("");
                        }}
                        disabled={saving}
                        className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Edit profile
                    </button>
                  )}
                </div>
              </>
            )}

            {activeTab === "saved" && (
              <div>
                {loadingRoutes ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : savedRoutes.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <p className="text-sm text-gray-500">No saved routes yet</p>
                    <Link href="/dashboard" className="inline-block mt-4 text-sm text-black hover:underline">
                      Find a route
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedRoutes.map((item) => (
                      <div key={item.route.id} className="border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                              <span>{item.route.start_station.name}</span>
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <span>{item.route.end_station.name}</span>
                            </div>
                            {item.route.route_name && (
                              <p className="text-xs text-gray-500 mt-1">{item.route.route_name}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Saved {new Date(item.saved_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => unsaveRoute(item.route.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                {loadingHistory ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-500">No history yet</p>
                    <Link href="/dashboard" className="inline-block mt-4 text-sm text-black hover:underline">
                      Calculate a route
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-500">{history.length} routes calculated</p>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-3">
                      {history.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-1">
                            <span>{item.route.start_station.name}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span>{item.route.end_station.name}</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Viewed {new Date(item.viewed_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
