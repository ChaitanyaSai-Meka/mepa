"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [fromStationId, setFromStationId] = useState("");
  const [toStationId, setToStationId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [stationResults, setStationResults] = useState([]);
  const [searchingFor, setSearchingFor] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

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

  const searchStations = async (query, type) => {
    if (!query || query.length < 2) {
      setStationResults([]);
      return;
    }

    try {
      const params = query ? `?query=${encodeURIComponent(query)}` : "";
      const response = await fetch(`http://localhost:5004/api/stations/search${params}`);
      const data = await response.json();
      setStationResults(data);
      setSearchingFor(type);
    } catch (err) {
      console.error("Station search error:", err);
    }
  };

  const selectStation = (station, type) => {
    if (type === "from") {
      setFromStation(station.name);
      setFromStationId(station.id);
    } else {
      setToStation(station.name);
      setToStationId(station.id);
    }
    setStationResults([]);
    setSearchingFor(null);
  };

  const swapStations = () => {
    const tempName = fromStation;
    const tempId = fromStationId;
    setFromStation(toStation);
    setFromStationId(toStationId);
    setToStation(tempName);
    setToStationId(tempId);
  };

  const calculateRoute = async () => {
    if (!fromStationId || !toStationId) {
      setError("Please select both stations");
      return;
    }

    setCalculating(true);
    setError("");
    setRouteResult(null);

    try {
      const token = localStorage.getItem("token");
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const defaultTime = departureTime ? `${departureTime}:00` : `${hours}:${minutes}:00`;
      const defaultDate = departureDate || now.toISOString().split('T')[0];

      const response = await fetch("http://localhost:5004/api/routes/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          start_station_id: fromStationId,
          end_station_id: toStationId,
          departure_time: defaultTime,
          departure_date: defaultDate,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to calculate route");
      setRouteResult(data);

      if (user) {
        await fetch("http://localhost:5004/api/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ route_id: data.id }),
        });
      }
    } catch (err) {
      setError(err.message || "Failed to calculate route");
    } finally {
      setCalculating(false);
    }
  };

  const saveRoute = async () => {
    if (!routeResult) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5004/api/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ route_id: routeResult.id }),
      });
      if (!response.ok) throw new Error("Failed to save route");
      alert("Route saved successfully!");
    } catch (err) {
      alert(err.message || "Failed to save route");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Metro</h1>
            </Link>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/profile" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-3">Find Your Route</h2>
          <p className="text-sm text-gray-500">
            {user ? `Welcome back, ${user.username}!` : "Plan your metro journey"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-8 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                value={fromStation}
                onChange={(e) => {
                  setFromStation(e.target.value);
                  searchStations(e.target.value, "from");
                }}
                placeholder="Search station..."
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-black transition-colors text-sm"
              />
              {searchingFor === "from" && stationResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {stationResults.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => selectStation(station, "from")}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{station.name}</div>
                      {station.line_name && <div className="text-xs text-gray-500">{station.line_name}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapStations}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Swap stations"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                value={toStation}
                onChange={(e) => {
                  setToStation(e.target.value);
                  searchStations(e.target.value, "to");
                }}
                placeholder="Search station..."
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-black transition-colors text-sm"
              />
              {searchingFor === "to" && stationResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {stationResults.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => selectStation(station, "to")}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-900">{station.name}</div>
                      {station.line_name && <div className="text-xs text-gray-500">{station.line_name}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Departure Time (Optional)</label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Departure Date (Optional)</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              onClick={calculateRoute}
              disabled={calculating || !fromStationId || !toStationId}
              className="w-full bg-black text-white py-3.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {calculating ? "Calculating..." : "Find Route"}
            </button>
          </div>
        </div>

        {routeResult && (
          <div className="bg-white rounded-lg shadow-card p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Your Route</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{routeResult.shortest_path.departureTime} - {routeResult.shortest_path.arrivalTime}</span>
                  <span>•</span>
                  <span>{Math.floor(routeResult.shortest_path.totalTimeSeconds / 60)} min</span>
                </div>
              </div>
              {user && (
                <button
                  onClick={saveRoute}
                  disabled={saving}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Route"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              {routeResult.shortest_path.steps.map((step, index) => {
                const isStart = step.edgeType === 'start';
                const isLast = index === routeResult.shortest_path.steps.length - 1;
                
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${isStart ? 'bg-green-500' : isLast ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      {!isLast && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{step.stopName}</div>
                          {step.departureTime && (
                            <div className="text-sm text-gray-500 mt-1">{step.departureTime}</div>
                          )}
                        </div>
                        {step.arrivalTime && (
                          <div className="text-sm text-gray-500">{step.arrivalTime}</div>
                        )}
                      </div>
                      
                      {step.edgeType === 'travel' && step.routeShortName && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: `#${step.routeColor}20`, color: `#${step.routeColor}` }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {step.routeShortName}
                          {step.travelDurationSeconds && (
                            <span className="opacity-75">• {Math.floor(step.travelDurationSeconds / 60)} min</span>
                          )}
                        </div>
                      )}
                      
                      {step.waitDurationSeconds > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Wait: {Math.floor(step.waitDurationSeconds / 60)} min
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!user && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">
                  <Link href="/login" className="font-medium underline">Login</Link> or{" "}
                  <Link href="/signup" className="font-medium underline">sign up</Link> to save this route and track your history
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
