import { Hero } from "@/components/home/Hero";
import { Protocol } from "@/components/home/Protocol";
import { TemplatesStrip } from "@/components/home/Templates";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Legs } from "@/components/home/Legs";
import { Backstop } from "@/components/home/Backstop";
import { TokenFlow } from "@/components/home/TokenFlow";
import { Tape } from "@/components/home/Tape";
import { BuiltOn } from "@/components/home/BuiltOn";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Protocol />
      <TemplatesStrip />
      <HowItWorks />
      <Legs />
      <Backstop />
      <TokenFlow />
      <Tape />
      <BuiltOn />
    </>
  );
}
