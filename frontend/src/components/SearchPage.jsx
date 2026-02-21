import { useState } from "react";
import axios from "axios";
import {
  normalizeKeyword,
  sha256Hex,
  signHashHex
} from "../utils/crypto";

export default function SearchPage({ role, auditor, privateKey }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("pan");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState(null);
  const [logs, setLogs] = useState(["Awaiting search query..."]);
  const [loading, setLoading] = useState(false);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const handleSearch = async () => {
    if (!query) return;

    try {
      setLoading(true);
      setResults([]);
      setMeta(null);
      setLogs(["Preparing search..."]);

      // =========================
      // INTERNAL SEARCH (SSE)
      // =========================
      if (role === "internal") {
        await delay(300);
        setLogs(prev => [...prev, "Generating HMAC trapdoor..."]);

        const payload = { [field]: query };

        await delay(300);
        setLogs(prev => [...prev, "Sending request to /api/search/internal/"]);

        const res = await axios.post(
          "http://127.0.0.1:8000/api/search/internal/",
          payload
        );

        setResults(res.data.data?.results || []);
        setMeta(res.data.meta);
        setLogs(prev => [...prev, "Internal search complete ✔"]);
      }

      // =========================
      // EXTERNAL SEARCH (PEKS)
      // =========================
      if (role === "external") {

        if (!privateKey) {
          setLogs(prev => [...prev, "No auditor private key found"]);
          setLoading(false);
          return;
        }

        if (!auditor) {
          setLogs(prev => [...prev, "No auditor identity found"]);
          setLoading(false);
          return;
        }

        await delay(300);
        setLogs(prev => [...prev, "Normalizing keyword..."]);

        const normalized = normalizeKeyword(query);

        await delay(300);
        setLogs(prev => [...prev, "Hashing keyword (SHA256)..."]);

        const keywordHash = await sha256Hex(normalized);

        await delay(300);
        setLogs(prev => [...prev, "Signing hash with RSA private key..."]);

        const signature = await signHashHex(keywordHash, privateKey);

        const payload = {
          auditor_id: auditor.auditor_id,
          keyword_hash: keywordHash,
          signature: signature
        };

        await delay(300);
        setLogs(prev => [...prev, "Sending request to /api/search/external/"]);

        const res = await axios.post(
          "http://127.0.0.1:8000/api/search/external/",
          payload
        );

        setResults(res.data.data?.results || []);
        setMeta(res.data.meta);
        setLogs(prev => [...prev, "Encrypted results received ✔"]);
      }

    } catch (err) {
      console.error(err);

      if (err.response?.data?.error) {
        setLogs(prev => [
          ...prev,
          `Error: ${err.response.data.error.code}`
        ]);
      } else {
        setLogs(prev => [...prev, "Unknown error occurred"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      <h1 className="text-2xl font-semibold mb-2">Encrypted Search</h1>
      <p className="text-gray-500 mb-6">
        {role === "internal"
          ? "Internal SSE Search"
          : "External Public-Key Audit Verification"}
      </p>

      {/* SEARCH INPUT */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <div className="flex gap-3">

          {role === "internal" && (
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="pan">PAN</option>
              <option value="customer_id">Customer ID</option>
              <option value="aadhaar">Aadhaar</option>
              <option value="name">Name</option>
              <option value="compliance_flag">Compliance Flag</option>
            </select>
          )}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search value..."
            className="flex-1 border rounded px-4 py-2"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* RESULTS SECTION */}
      {/* ========================= */}

      {role === "internal" && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Decrypted Results</h2>

          {results.length === 0 ? (
            <p className="text-gray-500 text-sm">No results</p>
          ) : (
            <div className="space-y-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border rounded p-3 font-mono text-sm"
                >
                  {JSON.stringify(r, null, 2)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {role === "external" && meta && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Audit Verification Result</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">Query</p>
              <p className="font-medium">{query}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Match Exists</p>
              <p className={`font-semibold ${meta.total_matches > 0 ? "text-green-600" : "text-red-600"}`}>
                {meta.total_matches > 0 ? "YES ✔" : "NO"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Result Set Size</p>
              <p>{meta.total_matches}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Response Padding</p>
              <p>Fixed-size protected response</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Execution Time</p>
              <p>{meta.execution_time_ms} ms</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Data Visibility</p>
              <p className="font-medium text-blue-600">
                Encrypted (Auditor-level access)
              </p>
            </div>

          </div>
        </div>
      )}

      {/* LOGS */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Search Logs</h2>

        <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      </div>

    </div>
  );
}