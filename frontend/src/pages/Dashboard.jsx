import { useState } from "react";
import Navbar from "../components/Navbar";
import UploadPage from "../components/UploadPage";
import SearchPage from "../components/SearchPage";

// placeholder pages for now
const StoragePage = () => <div className="p-6">Storage Page</div>;
const MetricsPage = () => <div className="p-6">Metrics Page</div>;

export default function Dashboard({ role, logout }) {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        logout={logout}
      />

      {/* CONTENT */}
      {activeTab === "upload" && role === "internal" && <UploadPage />}
      {activeTab === "search" && <SearchPage role = {role} />}
      {activeTab === "storage" && role === "internal" && <StoragePage />}
      {activeTab === "metrics" && <MetricsPage />}
    </div>
  );
}