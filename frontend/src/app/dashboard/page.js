"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-black flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Metro</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome to your metro route finder</p>
        </div>

        <div className="bg-white rounded-lg shadow-card p-12">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gray-50 mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all set</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You have successfully logged in. Metro route finder features coming soon!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-12">
            <div className="p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Find Routes</h4>
              <p className="text-xs text-gray-500">Discover the fastest path between stations</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Real-time Info</h4>
              <p className="text-xs text-gray-500">Get live updates on train schedules</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">Track Journey</h4>
              <p className="text-xs text-gray-500">Monitor your metro travel history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
