import { useState } from "react";
import Dashboard from "./pages/Dashboard";

export default function App() {
  // role can be: null | "internal" | "external"
  const [role, setRole] = useState(null);

  const logout = () => {
    setRole(null);
  };

  // ROLE SELECTION SCREEN
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border rounded-xl p-8 w-96 shadow-sm">
          <h1 className="text-xl font-semibold mb-2 text-center">
            Select Role
          </h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Secure Searchable Encryption Demo
          </p>

          <button
            onClick={() => setRole("internal")}
            className="w-full mb-3 bg-black text-white py-2 rounded"
          >
            Internal Analyst
          </button>

          <button
            onClick={() => setRole("external")}
            className="w-full border py-2 rounded"
          >
            External Auditor
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return <Dashboard role={role} logout={logout} />;
}