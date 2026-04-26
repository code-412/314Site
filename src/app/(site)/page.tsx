import { Hero }     from "@/widgets/hero";
import { Method }   from "@/widgets/method";
import { Services } from "@/widgets/services";
import { Quote }    from "@/widgets/quote";
import { Process }  from "@/widgets/process";
import { Works }    from "@/widgets/works";
import { listFeaturedPublishedWorks } from "@/shared/server/public-projects";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const works = listFeaturedPublishedWorks();

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
