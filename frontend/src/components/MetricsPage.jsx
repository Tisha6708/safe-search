import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CreateAuditorCard from "./CreateAuditorCard";

export default function MetricsPage({ role }) {

  const resolvedRole = role?.toLowerCase() || "internal";
  const isInternal = resolvedRole === "internal";

  const [systemMetrics, setSystemMetrics] = useState({});
  const [auditors, setAuditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Fetch metrics (reusable)
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const endpoint =
        resolvedRole === "internal"
          ? "http://127.0.0.1:8000/api/metrics/internal/"
          : "http://127.0.0.1:8000/api/metrics/external/";

      const res = await axios.get(endpoint);
      const data = res.data?.data || {};

      setSystemMetrics(data.system_metrics || {});
      setAuditors(data.auditors || []);

    } catch (err) {
      console.error(err);
      setError("Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }, [resolvedRole]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) return <div className="p-6">Loading metrics...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const safe = (val, fallback = 0) =>
    val !== undefined && val !== null ? val : fallback;

  const safeDate = (date) =>
    date ? new Date(date).toLocaleString() : "No data";

  const deleteAuditor = async (auditorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this auditor?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/auditor/${auditorId}/delete/`
      );

      // Refresh metrics after deletion
      fetchMetrics();

    } catch (err) {
      console.error("Failed to delete auditor", err);
      alert("Failed to delete auditor");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      <h1 className="text-2xl font-semibold mb-1">System Metrics</h1>
      <p className="text-gray-500 mb-6">
        Real-time performance and security analytics
      </p>

      {/* 🔥 CREATE AUDITOR UI */}
      {isInternal && (
        <CreateAuditorCard onCreated={fetchMetrics} />
      )}

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <StatCard
          label="Total Documents"
          value={safe(systemMetrics.total_documents)}
        />

        <StatCard
          label="Total Tokens"
          value={safe(systemMetrics.total_tokens)}
        />

        {isInternal && (
          <StatCard
            label="Avg External Search"
            value={`${safe(systemMetrics.avg_external_search_ms)} ms`}
          />
        )}

        <StatCard
          label="External Searches (24h)"
          value={safe(systemMetrics.external_searches_last_24h)}
        />
      </div>

      {/* 🔐 AUDITOR KEY OVERVIEW */}
      {isInternal && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Auditor Key Overview</h3>

          {auditors.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No auditors registered.
            </p>
          ) : (
            <div className="space-y-3">
              {auditors.map((auditor) => (
                <div
                  key={auditor.auditor_id}
                  className="flex justify-between items-center border-b py-2 text-sm"
                >
                  <span className="text-gray-600">
                    {auditor.name} (ID: {auditor.auditor_id})
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="font-medium">
                      Active Key v{safe(auditor.active_key_version, 1)}
                    </span>

                    <button
                      onClick={() => deleteAuditor(auditor.auditor_id)}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECURITY SECTION */}
      {isInternal && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Security Overview</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

            <MetricBox
              label="Failed Signature Verifications (24h)"
              value={safe(systemMetrics.failed_external_searches_last_24h)}
              danger={safe(systemMetrics.failed_external_searches_last_24h) > 0}
            />

            <MetricBox
              label="External Token Entries"
              value={safe(systemMetrics.external_tokens)}
            />

            <MetricBox
              label="Avg External Search Time"
              value={`${safe(systemMetrics.avg_external_search_ms)} ms`}
            />
          </div>
        </div>
      )}

      {/* INDEX HEALTH */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Index Health</h3>

        <div className="space-y-3 text-sm">
          <Row
            label="Last Index Update"
            value={safeDate(systemMetrics.last_index_update)}
          />
          <Row
            label="Total Token Entries"
            value={safe(systemMetrics.total_tokens)}
          />
          <Row
            label="External Token Entries"
            value={safe(systemMetrics.external_tokens)}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MetricBox({ label, value, danger }) {
  return (
    <div>
      <p
        className={`text-2xl font-semibold ${
          danger ? "text-red-600" : "text-blue-600"
        }`}
      >
        {value}
      </p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}