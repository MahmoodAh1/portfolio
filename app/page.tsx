import { getProjects } from "@/lib/github";
import { resolveAsset, AVATAR_URL } from "@/lib/assets";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { CursorAura } from "@/components/fx/CursorAura";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { Marquee } from "@/components/fx/Marquee";
import AtmosphereMount from "@/components/three/AtmosphereMount";

// Re-fetch live GitHub metadata at most once per hour (ISR).
export const revalidate = 3600;

const MARQUEE = [
  "Agentic AI",
  "LLM Systems",
  "FastAPI",
  "Next.js",
  "Python",
  "RAG",
  "Evals & Guardrails",
  "Data Pipelines",
  "MERN",
  "Observability",
  "TypeScript",
  "Automation",
];

export default async function Home() {
  const projects = await getProjects();
  const cowlSrc = resolveAsset("cowl");
  const portraitSrc = resolveAsset("portrait") ?? AVATAR_URL;

  return (
    <>
      <AtmosphereMount />
      <ScrollProgress />
      <CursorAura />
      <Nav />
      <main className="relative z-10 flex-1">
        <Hero cowlSrc={cowlSrc} portraitSrc={portraitSrc} />
        <Marquee items={MARQUEE} />
        <Services />
        <Work projects={projects} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
