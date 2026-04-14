"use client";

import { useNotification } from "@/shared/lib/notification-context";
import s from "./DebugNotifications.module.scss";

export function DebugNotifications() {
  const { notify } = useNotification();

  return (
    <div className={s.panel}>
      <button onClick={() => notify("success", "Success", "Your action was completed successfully. Everything is now updated and working properly.")}>Success</button>
      <button onClick={() => notify("error", "Error", "Something went wrong while processing your request. Please try again or refresh the page.")}>Error</button>
      <button onClick={() => notify("warning", "Warning", "Please review this action carefully before continuing. Some changes may affect the system.")}>Warning</button>
      <button onClick={() => notify("info", "Information", "This message contains helpful information about your current action or system status.")}>Info</button>
    </div>
  );
}
