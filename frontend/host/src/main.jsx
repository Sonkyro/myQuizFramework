import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HostDashboard from "./pages/HostDashboard";
import SessionDetails from "./pages/SessionDetails";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HostDashboard />} />
        <Route path="/session/:sessionId" element={<SessionDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
