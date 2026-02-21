import { useState } from "react";
import Navbar from "../components/Navbar";
import UploadPage from "../components/UploadPage";
import SearchPage from "../components/SearchPage";
import StoragePage from "../components/StoragePage";
import MetricsPage from "../components/MetricsPage";

export default function Dashboard({ role, auditor, privateKey, logout }) {
  const [activeTab, setActiveTab] = useState("upload");

  const isInternal = role === "internal";
  const isExternal = role === "external";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        logout={logout}
      />

      {/* CONTENT */}

      {/* Internal Upload */}
      {activeTab === "upload" && isInternal && <UploadPage />}

      {/* Search (Internal + External) */}
      {activeTab === "search" && (
        <SearchPage
          role={role}
          auditor={auditor}
          privateKey={privateKey}
        />
      )}

      {/* Internal Storage */}
      {activeTab === "storage" && isInternal && <StoragePage />}

      {/* Metrics */}
      {activeTab === "metrics" && (
        <MetricsPage role={role} />
      )}
    </div>
  );
}