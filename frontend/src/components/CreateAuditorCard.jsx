import { useState } from "react";
import axios from "axios";

export default function CreateAuditorCard({ onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/api/auditor/create/",
        { name }
      );

      const key = res.data?.data?.private_key;

      setPrivateKey(key);
      setName("");

    } catch (err) {
      console.error(err);
      alert("Failed to create auditor");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(privateKey);
    setCopied(true);
  };

  const handleClose = () => {
    setPrivateKey(null);
    setCopied(false);

    // refresh metrics page
    if (onCreated) onCreated();
  };

  return (
    <>
      {/* CREATE CARD */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Create New Auditor</h3>

        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter auditor name (e.g. RBI)"
            className="flex-1 border rounded px-4 py-2"
          />

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-black text-white px-5 py-2 rounded"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* PRIVATE KEY MODAL */}
      {privateKey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl">

            <h2 className="text-xl font-semibold mb-3 text-red-600">
              ⚠️ Save This Private Key
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              This private key will be shown only once.
              Store it securely. It cannot be recovered later.
            </p>

            <textarea
              readOnly
              value={privateKey}
              className="w-full h-48 border rounded p-3 text-xs font-mono bg-gray-50 mb-4"
            />

            <div className="flex justify-between items-center">

              <button
                onClick={handleCopy}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                {copied ? "Copied ✔" : "Copy to Clipboard"}
              </button>

              <button
                onClick={handleClose}
                className="bg-black text-white px-5 py-2 rounded"
              >
                I Have Stored This Securely
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}