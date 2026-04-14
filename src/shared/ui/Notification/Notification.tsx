"use client";

import { useEffect, useRef, useState } from "react";
import { type Notification, useNotification } from "@/shared/lib/notification-context";
import s from "./Notification.module.scss";

const LABELS: Record<Notification["type"], string> = {
  success: "SUCCESS",
  error: "ERROR",
  warning: "WARNING",
  info: "INFORMATION",
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { dismiss } = useNotification();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(true), 10);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => dismiss(notification.id), 350);
  };

  return (
    <div
      className={`${s.item} ${s[notification.type]} ${visible ? s.visible : ""}`}
      role="alert"
    >
      <div className={s.body}>
        <p className={s.title}>{LABELS[notification.type]}</p>
        <p className={s.message}>{notification.message}</p>
      </div>
      <button className={s.close} onClick={handleDismiss} aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

export function NotificationContainer() {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className={s.container} aria-live="polite">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
