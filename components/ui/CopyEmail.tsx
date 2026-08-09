"use client";

import { useState } from "react";
import { Check, Copy } from "@/components/ui/icons";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy email address ${email}`}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 font-mono text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent"
    >
      {copied ? <Check width={16} height={16} /> : <Copy width={16} height={16} />}
      {copied ? "Copied" : email}
    </button>
  );
}
