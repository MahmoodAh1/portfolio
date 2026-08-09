/** Services offered — drives the Services section. */

export interface Service {
  id: string;
  title: string;
  summary: string;
  points: string[];
}

export const services: Service[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI Systems",
    summary:
      "Multi-step agents and tool-use that ship — not demos. Deliberate model selection, structured outputs, guardrails, and observability from day one.",
    points: ["Tool use & orchestration", "Structured, schema-valid outputs", "Evals & guardrails", "Cost/latency budgets"],
  },
  {
    id: "ai-pipelines",
    title: "AI Pipelines & Automation",
    summary:
      "Data and content pipelines that ingest, extract, validate, and act — with human-in-the-loop review where correctness matters.",
    points: ["Ingestion & extraction", "Validation & dedup", "Human review gates", "Monitoring & alerting"],
  },
  {
    id: "custom-software",
    title: "Custom Software",
    summary:
      "Full-stack products end to end — Next.js / MERN front ends over Python or Node services, built to a senior engineering bar.",
    points: ["Next.js / MERN", "FastAPI / Node services", "Tested & type-safe", "Secure by default"],
  },
  {
    id: "content-automation",
    title: "AI Content Automation",
    summary:
      "Brand-consistent content pipelines for X and beyond — generation, scheduling, approval gates, and de-duplication baked in.",
    points: ["Brand-voice as input", "Approval before posting", "Scheduling & rate limits", "No repeats"],
  },
];
