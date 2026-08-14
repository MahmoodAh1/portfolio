import Link from "next/link";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ArrowLeft } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 items-center py-32">
        <Container>
          <div className="max-w-xl">
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-signal">
              404
            </span>
            <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-4 leading-relaxed text-muted">
              The page you&apos;re looking for doesn&apos;t exist or has moved.
            </p>
            <Link
              href="/"
              className="btn-signal group mt-8 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold"
            >
              <ArrowLeft
                width={16}
                height={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back home
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
