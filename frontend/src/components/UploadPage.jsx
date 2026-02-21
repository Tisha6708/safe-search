import { useState } from "react";
import { uploadDocument } from "../services/uploadService";

export default function UploadPage() {
  const [mode, setMode] = useState("form");
  const [logs, setLogs] = useState(["Awaiting document submission..."]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    name: "",
    pan: "",
    aadhaar: "",
    compliance_flag: "",
  });

  const [jsonInput, setJsonInput] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadSample = () => {
    const sample = {
      customer_id: "CUST1001",
      name: "Ravi Kumar",
      pan: "ABCDE1234F",
      aadhaar: "123412341234",
      compliance_flag: "high_risk",
    };

    setFormData(sample);
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setLogs(["Preparing document..."]);

      let payload;

      if (mode === "json") {
        payload = JSON.parse(jsonInput);
      } else {
        payload = formData;
      }

      setLogs((prev) => [...prev, "Sending document to server..."]);

      const res = await uploadDocument(payload);

      setLogs((prev) => [
        ...prev,
        "Encrypting document using AES-256-GCM...",
        "Generating HMAC trapdoor tokens...",
        "Updating encrypted inverted index...",
        "Stored securely ✔",
      ]);

      console.log("UPLOAD RESPONSE:", res);

      // reset form
      setFormData({
        customer_id: "",
        name: "",
        pan: "",
        aadhaar: "",
        compliance_flag: "",
      });

      setJsonInput("");

    } catch (err) {
      console.error(err);

      setLogs((prev) => [
        ...prev,
        `Error: ${err.message}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-2">Document Upload</h1>
      <p className="text-gray-500 mb-6">
        Submit financial records for AES-256 encryption and HMAC-based indexing
      </p>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Secure Record Input</h2>
            <button
              onClick={loadSample}
              className="text-sm border px-3 py-1 rounded"
            >
              Load Sample
            </button>
          </div>

          {/* TOGGLE */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode("form")}
              className={`px-3 py-1 rounded ${
                mode === "form"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Form Input
            </button>

            <button
              onClick={() => setMode("json")}
              className={`px-3 py-1 rounded ${
                mode === "json"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              JSON Input
            </button>
          </div>

          {/* FORM MODE */}
          {mode === "form" && (
            <div className="space-y-3">
              <input
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                placeholder="Customer ID"
                className="w-full border rounded px-3 py-2"
              />

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border rounded px-3 py-2"
              />

              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="PAN"
                className="w-full border rounded px-3 py-2"
              />

              <input
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="Aadhaar"
                className="w-full border rounded px-3 py-2"
              />

              <input
                name="compliance_flag"
                value={formData.compliance_flag}
                onChange={handleChange}
                placeholder="Compliance Flag"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}

          {/* JSON MODE */}
          {mode === "json" && (
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-48 border rounded p-3 font-mono text-sm"
              placeholder="Paste JSON record here..."
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Processing..." : "Encrypt & Upload"}
          </button>
        </div>

        {/* RIGHT PANEL LOGS */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Encryption Logs</h2>

          <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto text-sm font-mono">
            {logs.map((log, i) => (
              <div key={i} className="mb-2">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PIPELINE */}
      <div className="mt-6 bg-blue-50 border rounded-xl p-6">
        <h3 className="font-semibold mb-3">Encryption Pipeline</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-semibold">1. AES-256 Encryption</p>
            <p className="text-gray-600">
              Document encrypted with symmetric key (GCM mode)
            </p>
          </div>

          <div>
            <p className="font-semibold">2. HMAC Indexing</p>
            <p className="text-gray-600">
              Trapdoors generated via HMAC-SHA256
            </p>
          </div>

          <div>
            <p className="font-semibold">3. Inverted Index</p>
            <p className="text-gray-600">
              Encrypted tokens stored for search
            </p>
          </div>

          <div>
            <p className="font-semibold">4. Secure Storage</p>
            <p className="text-gray-600">
              Ciphertext saved. No plaintext on server
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}