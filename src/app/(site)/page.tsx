import { Hero }     from "@/widgets/hero";
import { Method }   from "@/widgets/method";
import { Services } from "@/widgets/services";
import { Quote }    from "@/widgets/quote";
import { Process }  from "@/widgets/process";
import { Works }    from "@/widgets/works";
import { listFeaturedPublishedWorks } from "@/shared/server/public-projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const works = await listFeaturedPublishedWorks();

  return (
    <>
      <Hero />
      <Method />
      <Services />
      <Quote />
      <Process />
      <Works works={works} />
    </>
  );
}
