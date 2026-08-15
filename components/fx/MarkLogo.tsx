import { BatMark } from "./BatMark";

/**
 * Brand mark. Uses the user-supplied logo at `public/bat-logo.svg` when present
 * (passed in as `src`), otherwise the drawn original bat emblem.
 */
export function MarkLogo({
  src,
  className,
}: {
  src?: string | null;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={className} />;
  }
  return <BatMark className={className} title="Bat emblem" />;
}
