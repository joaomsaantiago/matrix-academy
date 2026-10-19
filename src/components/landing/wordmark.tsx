import Link from "next/link";

/** O nome da escola usa uma fonte mais tecnológica que o resto do site. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`wordmark ${className}`} aria-label="Matrix Academy, página inicial">
      <span>Matrix</span> <span>Academy</span>
    </Link>
  );
}
