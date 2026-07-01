"use client";

import React, { useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import { formatDateHuman, formatTime } from "@/lib/utils";

const ADMIN_PASSPHRASE = "silve"; // Simple portfolio gate — obvious for demo purposes

export default function AdminReservations() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reservations");
      const json = await res.json();
      if (json.success) {
        // Sort by most recent first
        const sorted = [...json.reservations].sort(
          (a: Reservation, b: Reservation) => 
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setReservations(sorted);
      } else {
        setError("Failed to load reservations.");
      }
    } catch (e) {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.trim().toLowerCase() === ADMIN_PASSPHRASE) {
      setIsAuthenticated(true);
      loadReservations();
    } else {
      setError("Not quite. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5ed] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center gap-x-3">
          <div className="font-serif text-4xl tracking-tight text-[#2c2522]">da Silve</div>
          <div className="text-xs font-mono tracking-[4px] mt-2 text-[#c46b4e]">ADMIN</div>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-sm">
            <h1 className="font-serif text-5xl tracking-[-1px]">Reservations</h1>
            <p className="mt-2 text-[#5c524b]">Please enter the passphrase to view the book.</p>

            <form onSubmit={handleLogin} className="mt-8">
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="passphrase"
                className="input w-full rounded-2xl px-6 py-4 text-lg"
                autoFocus
              />
              <button type="submit" className="mt-4 w-full btn-primary rounded-2xl py-4 text-base">
                Enter
              </button>
              {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
            </form>
            <p className="text-[10px] text-[#81746a] mt-5">Portfolio demo • passphrase is “silve”</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-serif text-5xl tracking-[-1.2px]">The Book</h1>
                <p className="text-[#5c524b]">All reservations saved to <span className="font-mono text-xs">data/reservations.json</span></p>
              </div>
              <button 
                onClick={loadReservations} 
                className="text-xs border border-[#d9d0c2] hover:bg-white px-5 py-2 rounded-full transition"
              >
                REFRESH
              </button>
            </div>

            {loading && <div className="text-[#81746a]">Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && reservations.length === 0 && (
              <div className="text-[#81746a] py-8">No reservations yet. The table awaits its first guests.</div>
            )}

            {reservations.length > 0 && (
              <div className="bg-white border border-[#d9d0c2] rounded-2xl overflow-hidden">
                <table className="admin-table w-full text-sm">
                  <thead>
                    <tr className="bg-[#f4efe6]">
                      <th>DATE &amp; TIME</th>
                      <th>NAME</th>
                      <th>GUESTS</th>
                      <th>CONTACT</th>
                      <th>NOTES</th>
                      <th>SUBMITTED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id} className="hover:bg-[#faf6f0]">
                        <td className="font-medium whitespace-nowrap">
                          {formatDateHuman(r.date)} <br />
                          <span className="font-mono text-xs text-[#81746a]">{formatTime(r.time)}</span>
                        </td>
                        <td>
                          <div className="font-medium">{r.fullName}</div>
                          <div className="text-xs text-[#81746a]">{r.dietary}</div>
                        </td>
                        <td className="font-mono text-base">{r.guests}</td>
                        <td className="text-xs">
                          {r.email}<br />{r.phone}
                        </td>
                        <td className="text-xs max-w-[260px] text-[#5c524b] leading-snug pr-4">
                          {r.message || "—"}
                        </td>
                        <td className="font-mono text-[10px] text-[#81746a]">
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 text-[10px] text-[#81746a]">
              This view is read from the live JSON file. In production you would protect this page properly.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
