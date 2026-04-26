import { listPublishedWorks } from "@/shared/server/public-projects";
import { WorksListClient } from "./WorksListClient";

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  return <WorksListClient works={await listPublishedWorks()} />;
}
