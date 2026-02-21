import React from "react";

export default function Navbar({ activeTab, setActiveTab, role, logout }) {
  return (
    <div className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <div>
            <p className="font-semibold">Encrypted Search</p>
            <p className="text-xs text-gray-500">SSE/PEKS Protocol</p>
          </div>
        </div>

        {/* CENTER: tabs */}
        <div className="flex gap-4">
          {role === "internal" && (
            <>
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-3 py-1 rounded ${
                  activeTab === "upload"
                    ? "bg-gray-200"
                    : "text-gray-600"
                }`}
              >
                Upload
              </button>

              <button
                onClick={() => setActiveTab("storage")}
                className={`px-3 py-1 rounded ${
                  activeTab === "storage"
                    ? "bg-gray-200"
                    : "text-gray-600"
                }`}
              >
                Storage
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab("search")}
            className={`px-3 py-1 rounded ${
              activeTab === "search"
                ? "bg-gray-200"
                : "text-gray-600"
            }`}
          >
            Search
          </button>

          <button
            onClick={() => setActiveTab("metrics")}
            className={`px-3 py-1 rounded ${
              activeTab === "metrics"
                ? "bg-gray-200"
                : "text-gray-600"
            }`}
          >
            Metrics
          </button>
        </div>

        {/* RIGHT: role + logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm bg-gray-100 px-3 py-1 rounded">
            {role === "internal" ? "Internal Analyst" : "External Auditor"}
          </span>

          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-black"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}