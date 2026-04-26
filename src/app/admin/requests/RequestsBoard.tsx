"use client";

import { useState } from "react";
import { type AdminRequest, type AdminRequestStatus } from "@/shared/admin/mock-data";
import s from "../AdminPages.module.scss";

function statusClass(status: AdminRequestStatus) {
  if (status === "new") return s.statusNew;
  if (status === "inProgress") return s.statusInProgress;
  return s.statusClosed;
}

export function RequestsBoard({ initialRequests }: { initialRequests: AdminRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [busyId, setBusyId] = useState("");

  const updateStatus = async (id: string, status: AdminRequestStatus) => {
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update request");
      const data = await response.json() as { request: AdminRequest };

      setRequests((current) =>
        current.map((request) => request.id === id ? data.request : request)
      );
    } finally {
      setBusyId("");
    }
  };

  const deleteRequest = async (id: string) => {
    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/requests/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete request");
      setRequests((current) => current.filter((request) => request.id !== id));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className={s.requestsGrid}>
      {requests.map((request) => (
        <article key={request.id} className={s.requestCard}>
          <div className={s.requestMeta}>
            <span className={statusClass(request.status)}>
              {request.status === "inProgress" ? "In progress" : request.status}
            </span>
            <span className={s.muted}>{request.createdAt}</span>
          </div>
          <div>
            <h2 className={s.requestName}>{request.name}</h2>
            <p className={s.muted}>{request.source}</p>
          </div>
          <p className={s.requestMessage}>{request.message}</p>
          <div className={s.contactList}>
            <a href={`mailto:${request.email}`}>{request.email}</a>
            <a href={`tel:${request.phone.replaceAll(" ", "")}`}>{request.phone}</a>
            <span>Consent: {request.consent ? "yes" : "no"}</span>
          </div>
          <div className={s.buttonRow}>
            <button
              className={s.button}
              disabled={busyId === request.id}
              onClick={() => updateStatus(request.id, "inProgress")}
            >
              In progress
            </button>
            <button
              className={s.buttonMuted}
              disabled={busyId === request.id}
              onClick={() => updateStatus(request.id, "closed")}
            >
              Close
            </button>
            <button
              className={s.buttonMuted}
              disabled={busyId === request.id}
              onClick={() => updateStatus(request.id, "new")}
            >
              New
            </button>
            <button
              className={s.buttonMuted}
              disabled={busyId === request.id}
              onClick={() => deleteRequest(request.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
