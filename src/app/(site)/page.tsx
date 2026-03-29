import { Hero }     from "@/widgets/hero";
import { Method }   from "@/widgets/method";
import { Services } from "@/widgets/services";
import { Quote }    from "@/widgets/quote";
import { Process }  from "@/widgets/process";
import { Works }    from "@/widgets/works";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Method />
      <Services />
      <Quote />
      <Process />
      <Works />
    </>
  );
}
