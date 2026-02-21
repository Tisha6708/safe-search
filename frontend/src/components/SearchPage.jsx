import { useState } from "react";

export default function SearchPage({ role }) {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      
      {/* HEADER */}
      <h1 className="text-2xl font-semibold mb-2">
        Encrypted Search
      </h1>
      <p className="text-gray-500 mb-6">
        {role === "internal"
          ? "SSE Protocol - Search with decryption privileges"
          : "Public-Key Search - Restricted decryption access"}
      </p>

      {/* ROLE ACCESS BANNER */}
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-blue-700">
          {role === "internal"
            ? "Internal Access: Full decryption privileges enabled."
            : "External Access: Decryption restricted. Encrypted results only."}
        </p>
      </div>

      {/* QUERY INPUT CARD */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-lg mb-2">
          Query Input
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Enter search terms to generate encrypted trapdoor
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-black">
            Search
          </button>
        </div>
      </div>

      {/* SSE PROTOCOL EXPLANATION */}
      <div className="bg-gray-50 border rounded-xl p-6">
        <h3 className="font-semibold mb-4">
          SSE Protocol (Searchable Symmetric Encryption)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="font-semibold mb-1">
              1. Trapdoor Generation
            </p>
            <p className="text-gray-600">
              Query converted to HMAC-based trapdoor
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">
              2. Index Matching
            </p>
            <p className="text-gray-600">
              Trapdoor matched against encrypted inverted index
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">
              3. Decryption
            </p>
            <p className="text-gray-600">
              {role === "internal"
                ? "Encrypted documents decrypted with symmetric key"
                : "Decryption restricted for external users"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}