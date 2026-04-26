import { listRequests } from "@/shared/server/database";
import s from "../AdminPages.module.scss";
import { RequestsBoard } from "./RequestsBoard";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const requests = await listRequests();

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <div className={s.titleGroup}>
          <span className={s.eyebrow}>Contact form</span>
          <h1 className={s.title}>Requests</h1>
          <p className={s.subtitle}>
            Inbox for messages from the contact page and drawer. Requests are stored in
            the configured database and can be moved through simple statuses.
          </p>
        </div>
        <div className={s.buttonRow}>
          <button className={s.buttonMuted}>Export CSV</button>
          <button className={s.buttonDark}>Mark reviewed</button>
        </div>
      </div>

      <RequestsBoard initialRequests={requests} />
    </div>
  );
}
