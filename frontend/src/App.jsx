import { useState } from "react";
import axios from "axios";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [role, setRole] = useState(null);
  const [externalAuditors, setExternalAuditors] = useState([]);
  const [selectedAuditor, setSelectedAuditor] = useState(null);
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [loadingAuditors, setLoadingAuditors] = useState(false);

  const logout = () => {
    setRole(null);
    setSelectedAuditor(null);
    setPrivateKeyInput("");
  };

  const fetchAuditors = async () => {
    try {
      setLoadingAuditors(true);
      const res = await axios.get(
        "http://127.0.0.1:8000/api/metrics/internal/"
      );
      const data = res.data?.data || {};
      setExternalAuditors(data.auditors || []);
    } catch (err) {
      console.error("Failed to fetch auditors", err);
    } finally {
      setLoadingAuditors(false);
    }
  };

  // ===============================
  // ENTRY SCREEN
  // ===============================
  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-xl mx-auto mb-4"></div>
          <h1 className="text-3xl font-semibold mb-2">
            Secure Encrypted Search System
          </h1>
          <p className="text-gray-500">
            AES-256 Encryption • HMAC Trapdoors • SSE/PEKS Protocol
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

          {/* INTERNAL */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">
              Internal Analyst
            </h2>

            <p className="text-gray-500 text-sm mb-4">
              Full system access with decryption privileges
            </p>

            <ul className="text-sm space-y-2 mb-6">
              <li>• Upload encrypted documents</li>
              <li>• View encrypted storage</li>
              <li>• Search with decryption (SSE)</li>
              <li>• Access system metrics</li>
            </ul>

            <button
              onClick={() => setRole({ type: "internal" })}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900"
            >
              Continue as Internal
            </button>
          </div>

          {/* EXTERNAL */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">
              External Auditor
            </h2>

            <p className="text-gray-500 text-sm mb-4">
              Limited access with search-only capabilities
            </p>

            <ul className="text-sm space-y-2 mb-6">
              <li className="text-gray-400">• Upload encrypted documents</li>
              <li className="text-gray-400">• View encrypted storage</li>
              <li>• Search without decryption (PEKS)</li>
              <li>• Access limited metrics</li>
            </ul>

            <button
              onClick={async () => {
                await fetchAuditors();
                setRole({ type: "external_select" });
              }}
              className="w-full border py-2 rounded-lg hover:bg-gray-100"
            >
              Continue as External
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-10 text-center max-w-xl">
          Role-Based Access Control • SSE • PEKS
        </p>
      </div>
    );
  }

  // ===============================
  // EXTERNAL AUDITOR SELECTION
  // ===============================
  if (role.type === "external_select") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="bg-white border rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            Select Auditor Identity
          </h2>

          {loadingAuditors ? (
            <p>Loading auditors...</p>
          ) : externalAuditors.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No auditors available.
            </p>
          ) : (
            <div className="space-y-3">
              {externalAuditors.map((auditor) => (
                <button
                  key={auditor.auditor_id}
                  onClick={() => setSelectedAuditor(auditor)}
                  className={`w-full border rounded-lg py-2 ${
                    selectedAuditor?.auditor_id === auditor.auditor_id
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {auditor.name} (v{auditor.active_key_version})
                </button>
              ))}
            </div>
          )}

          {selectedAuditor && (
            <>
              <div className="mt-4">
                <p className="text-sm mb-1">
                  Paste Auditor Private Key
                </p>
                <textarea
                  value={privateKeyInput}
                  onChange={(e) => setPrivateKeyInput(e.target.value)}
                  className="w-full border rounded p-2 text-xs h-32"
                />
              </div>

              <button
                onClick={() => {
                  if (!privateKeyInput.trim()) {
                    alert("Private key required");
                    return;
                  }

                  setRole({
                    type: "external",
                    auditor: selectedAuditor,
                    privateKey: privateKeyInput
                  });
                }}
                className="w-full mt-4 bg-black text-white py-2 rounded-lg"
              >
                Continue
              </button>
            </>
          )}

          <button
            onClick={() => {
              setSelectedAuditor(null);
              setPrivateKeyInput("");
              setRole(null);
            }}
            className="mt-6 text-sm text-gray-500"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // DASHBOARD
  // ===============================
  return (
    <Dashboard
      role={role.type}
      auditor={role.auditor}
      privateKey={role.privateKey}
      logout={logout}
    />
  );
}