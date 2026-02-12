import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SessionDetails() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [participants, setParticipants] = useState({ connected: [], offline: [] });

    useEffect(() => {
    async function fetchSession() {
      const res = await fetch(`http://localhost:3000/sessions/${sessionId}`);
      const data = await res.json();
      setSession(data);
    }
    async function fetchParticipants() {
        const res = await fetch(`http://localhost:3000/sessions/${sessionId}/participants`);
        const data = await res.json();

        // add expanded state
        const connected = data.connected.map(p => ({ ...p, expanded: false }));
        const offline = data.answeredButNotConnected.map(p => ({ ...p, expanded: false }));

        setParticipants({ connected, offline });
    }

    fetchSession();
    fetchParticipants();
    }, [sessionId]);

  if (!session) return <div>Lädt...</div>;

  // Status toggle
  async function toggleStatus() {
    const newStatus = session.status === "active" ? "inactive" : "active";
    await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSession({ ...session, status: newStatus });
  }

  async function changeMode(mode) {
    await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: { mode } }),
    });
    setSession({
      ...session,
      settings: { ...session.settings, mode },
    });
  }

  async function changeQuizId(e) {
    const quizId = e.target.value;
    await fetch(`http://localhost:3000/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: { quizId } }),
    });
    setSession({
      ...session,
      quizId,
    });
  }

  // Toggle participant expanded state
    function toggleParticipant(type, index) {
    const newParticipants = { ...participants };
    newParticipants[type][index].expanded = !newParticipants[type][index].expanded;
    setParticipants(newParticipants);
    }

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen p-6 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Session Details</h1>
        <Link
        to={`/`}
        className="sBtn hoverBlue"
        >
        Details
        </Link>
      </div>

      {/* Session Optionen */}
      <div className="session-card p-4 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span>Status:</span>
            <button
              onClick={toggleStatus}
              className={`px-3 py-1 rounded ${
                session.status === "active" ? "bg-success" : "bg-gray-400"
              } text-white`}
            >
              {session.status}
            </button>
          </div>

          <div className="mb-2">
            <label className="text-sm font-medium">Quiz-ID:</label>
            <input
              type="text"
              value={session.quizId}
              disabled={session.status === "active"}
              onChange={changeQuizId}
              className="w-full mt-1 px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Modus:</label>
            <select
              value="Blabla sd" // irgendwie wird Mode nicht erkannt..
              disabled={session.status === "active"}
              onChange={(e) => changeMode(e.target.value)}
              className="w-full mt-1 px-2 py-1 rounded border dark:border-gray-600 bg-white dark:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="async">Async</option>
              <option value="sync">Sync</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ergebnisse Zusammenfassung */}
      <div className="session-card p-4 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-2">Ergebnis-Zusammenfassung</h2>
        {/* Hier kannst du später ein kleines Chart oder Stats einfügen */}
        <p>Gesamt-Teilnehmer: {participants.length}</p>
        {/* Beispiel: Anzahl gelöste Aufgaben, Durchschnittspunkte etc. */}
      </div>

        {/* Teilnehmerliste */}
        <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Teilnehmer</h2>

        {/* Verbundene Teilnehmer */}
        {participants.connected.map((p, i) => (
            <div
            key={p.id}
            className="session-card p-3 bg-green-50 dark:bg-green-800 rounded-xl shadow-md mb-2"
            >
            <div className="flex justify-between items-center">
                <div>
                <span className="font-medium">{p.name || "Anonymer Teilnehmer"}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({p.id})
                </span>
                </div>
                <button
                onClick={() => toggleParticipant("connected", i)}
                className="btn btn-sm text-xs px-2 py-1"
                >
                {p.expanded ? "Antworten ausblenden" : "Antworten anzeigen"}
                </button>
            </div>
            {p.expanded && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <h3 className="font-semibold mb-1">Gegebene Antworten:</h3>
                <ul className="list-disc list-inside">
                    {p.answers?.map((a, idx) => (
                    <li key={idx}>
                        Frage {a.questionId}: {a.userAnswer} ({a.correct ? "✔️" : "❌"})
                    </li>
                    )) || <li>Keine Antworten vorhanden</li>}
                </ul>
                </div>
            )}
            </div>
        ))}

        {/* Offline Teilnehmer */}
        {participants.offline.map((p, i) => (
            <div
            key={p.id}
            className="session-card p-3 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md mb-2 opacity-70"
            >
            <div className="flex justify-between items-center">
                <div>
                <span className="font-medium">{p.name || "Anonymer Teilnehmer"}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({p.id})
                </span>
                </div>
                <button
                onClick={() => toggleParticipant("offline", i)}
                className="btn btn-sm text-xs px-2 py-1"
                >
                {p.expanded ? "Antworten ausblenden" : "Antworten anzeigen"}
                </button>
            </div>
            {p.expanded && (
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <h3 className="font-semibold mb-1">Gegebene Antworten:</h3>
                <ul className="list-disc list-inside">
                    {p.answers?.map((a, idx) => (
                    <li key={idx}>
                        Frage {a.questionId}: {a.userAnswer} ({a.correct ? "✔️" : "❌"})
                    </li>
                    )) || <li>Keine Antworten vorhanden</li>}
                </ul>
                </div>
            )}
            </div>
        ))}
        </div>
    </div>
  );
}
