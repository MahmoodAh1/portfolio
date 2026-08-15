/**
 * Global site configuration — the single place to edit identity, contact, and
 * social links. Values marked TODO are safe placeholders; fill them in when ready.
 */

export interface SocialLink {
  label: string;
  url: string; // empty string => hidden (no broken links at launch)
  handle?: string;
}

export const site = {
  name: "Mahmood Ahmad Sajjad",
  role: "AI Engineer",
  // Short, sharp value proposition (used in hero + metadata).
  description:
    "I build production AI systems that actually ship. Agents, data pipelines, and the full software around them.",
  // Deployment URL (update to a custom domain when connected).
  url: "https://portfolio-eight-tawny-94.vercel.app",

  // Contact
  email: "mahmoodahmad996@gmail.com",
  // TODO: paste your Cal.com / Calendly link to enable the "Book a call" CTA.
  bookingUrl: "",

  socials: [
    { label: "GitHub", url: "https://github.com/MahmoodAh1", handle: "MahmoodAh1" },
    { label: "Hugging Face", url: "https://huggingface.co/MahmoodAh1", handle: "MahmoodAh1" },
    { label: "X", url: "https://x.com/Ahmadtechai", handle: "Ahmadtechai" },
  ] satisfies SocialLink[],

  nav: [
    { label: "Skills", href: "#skills" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const activeSocials = site.socials.filter((s) => s.url.length > 0);
export const hasBooking = site.bookingUrl.length > 0;
