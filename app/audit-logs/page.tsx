"use client";

import { useState, useEffect } from "react";

interface LogEntry {
  id: number;
  userId: string;
  action: string;
  timestamp: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/audit-logs"); // Call the API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-xl font-semibold mb-4">Audit Logs</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">User ID</th>
            <th className="py-2">Action</th>
            <th className="py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td className="border px-4 py-2">{log.userId}</td>
                <td className="border px-4 py-2">{log.action}</td>
                <td className="border px-4 py-2">
                  {new Date(log.timestamp || new Date()).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2" colSpan={3} style={{ textAlign: "center" }}>
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
