import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

export default function HostDashboard() {
  const [sessions, setSessions] = useState([]);
  const [newQuizId, setNewQuizId] = useState("demo-quiz");
  const [newMode, setNewMode] = useState("async");
  const [darkMode, setDarkMode] = useDarkMode(); // hook für Dark Mode

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    const res = await fetch("http://localhost:3000/sessions");
    const data = await res.json();
    setSessions(data);
  }

  async function createSession() {
    await fetch("http://localhost:3000/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: newQuizId, settings: { mode: newMode } }),
    });
    fetchSessions();
  }

  async function toggleStatus(sessionId, currentStatus) {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchSessions();
  }

  async function changeMode(sessionId, mode) {
    await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: { mode } }),
    });
    fetchSessions();
  }

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen p-6 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header mit Dark Mode Umschalter */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Host Dashboard</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Theme:</label>
          <select
            value={darkMode}
            onChange={(e) => setDarkMode(e.target.value)}
            className="px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="auto">Auto</option>
            <option value="dark">Dunkel</option>
            <option value="light">Hell</option>
          </select>
        </div>
      </div>

      {/* Neue Session */}
      <div className="mb-6 flex items-center gap-3">
        <input
          type="text"
          value={newQuizId}
          onChange={(e) => setNewQuizId(e.target.value)}
          placeholder="Quiz-ID"
          className="px-3 py-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700 flex-1"
        />
        <select
          value={newMode}
          onChange={(e) => setNewMode(e.target.value)}
          className="px-3 py-2 rounded border dark:border-gray-600 bg-white dark:bg-gray-700"
        >
          <option value="async">Async</option>
          <option value="sync">Sync</option>
        </select>
        <button
          onClick={createSession}
          className="mBtn hoverBlue"
        >
          Neue Session
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="session-card bg-white dark:bg-gray-700 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">Code: {s.joinCode}</h2>
              <div className="flex items-center justify-between mb-2">
                <span>Status:</span>
                <button
                  onClick={() => toggleStatus(s.id, s.status)}
                  className={`sBtn ${
                    s.status === "active" ? "hoverGreen" : "hoverGray"
                  }`}
                >
                  {s.status}
                </button>
              </div>
              <Link
                to={`/session/${s.id}`}
                className="sBtn hoverBlue"
                >
                Details
                </Link>
              <div className="mb-2">
                <label className="text-sm font-medium">Quiz-ID:</label>
                <input
                  type="text"
                  value={s.quizId}
                  disabled={s.status === "active"}
                  className="w-full mt-1 px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-50"
                  onChange={(e) =>
                    changeMode(s.id, { ...s.settings, quizId: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Modus:</label>
                <select
                  value={s.settings.mode}
                  disabled={s.status === "active"}
                  onChange={(e) => changeMode(s.id, e.target.value)}
                  className="w-full mt-1 px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700 disabled:opacity-50"
                >
                  <option value="async">Async</option>
                  <option value="sync">Sync</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
