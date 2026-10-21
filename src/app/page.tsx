import "./landing.css";
import { Component as CursorFollower } from "@/components/ui/cursor-follower";
import { CourseConsole } from "@/components/landing/course-console";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { Instructor } from "@/components/landing/instructor";
import { PassoAPasso } from "@/components/landing/passo-a-passo";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { Reveal } from "@/components/landing/reveal";
import { WatchSection } from "@/components/landing/watch-section";

// A landing está sendo refeita seção por seção. Por ora, só a capa.
// Os componentes das outras seções continuam em src/components/landing/ para reaproveitar.
export default function Home() {
  return (
    <>
      <CursorFollower />
      <SiteNav />
      <Hero />
      <CourseConsole />
      <PassoAPasso />
      <Reveal>
        <WatchSection />
      </Reveal>
      <Reveal>
        <Instructor />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
      <SiteFooter />
    </>
  );
}
