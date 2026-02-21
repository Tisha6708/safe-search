import { useState } from "react";
import axios from "axios";

export default function CreateAuditorCard({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [error, setError] = useState(null);

  const createAuditor = async () => {
    if (!name.trim()) {
      setError("Auditor name required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/auditor/create/",
        { name }
      );

      // 🔥 ONLY set modal — do NOT refresh here
      setModalData(res.data?.data);
      setName("");

    } catch (err) {
      console.error(err);
      setError("Failed to create auditor");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalData(null);

    // 🔁 Refresh metrics AFTER closing modal
    if (onCreated) {
      onCreated();
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(modalData.private_key);
    alert("Private key copied. Store it securely.");
  };

  return (
    <>
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Create Auditor</h3>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Auditor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 flex-1"
          />
          <button
            onClick={createAuditor}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
      </div>

      {/* 🔐 PRIVATE KEY MODAL */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">
              Auditor Created Successfully
            </h3>

            <p className="text-sm text-red-600 mb-3">
              This private key will NOT be shown again. Save it now.
            </p>

            <textarea
              value={modalData.private_key}
              readOnly
              className="w-full border rounded p-2 text-xs h-40 mb-3"
            />

            <div className="flex justify-between">
              <button
                onClick={copyKey}
                className="text-sm text-blue-600"
              >
                Copy Private Key
              </button>

              <button
                onClick={closeModal}
                className="bg-black text-white px-4 py-2 rounded"
              >
                I Have Saved It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}