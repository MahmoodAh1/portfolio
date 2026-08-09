import { getProjects } from "@/lib/github";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

// Re-fetch live GitHub metadata at most once per hour (ISR).
export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Services />
        <Work projects={projects} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
