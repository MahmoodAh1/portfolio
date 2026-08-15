/** Capability groups — drives the "Utility Belt" skills section. */
export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "ai-agents",
    label: "AI & Agents",
    items: [
      "LLM orchestration",
      "RAG (when it earns it)",
      "Evals & guardrails",
      "Structured outputs",
      "Tool use",
    ],
  },
  {
    id: "full-stack",
    label: "Full-stack",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "MERN"],
  },
  {
    id: "backend-data",
    label: "Backend & Data",
    items: [
      "FastAPI",
      "Python",
      "Data & content pipelines",
      "n8n",
      "Automation",
      "Postgres / Mongo",
    ],
  },
  {
    id: "ship-infra",
    label: "Ship & Infra",
    items: [
      "DevOps",
      "Kubernetes",
      "CI/CD",
      "GitHub Actions",
      "Vercel",
      "Railway / Render",
      "Observability",
    ],
  },
];
