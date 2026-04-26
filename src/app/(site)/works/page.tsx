import { listPublishedWorks } from "@/shared/server/public-projects";
import { WorksListClient } from "./WorksListClient";

export const dynamic = "force-dynamic";

export default function WorkPage() {
  return <WorksListClient works={listPublishedWorks()} />;
}
