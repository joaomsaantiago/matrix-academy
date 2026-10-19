import Link from "next/link";

export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="mb-12 w-fit font-[family-name:var(--font-brand)] text-xl font-black uppercase tracking-[0.06em] text-ink"
      >
        Matrix Academy
      </Link>
      <h1 className="text-4xl font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      {intro ? <p className="mt-3 text-ink-soft">{intro}</p> : null}
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-8 text-sm text-ink-soft">{footer}</div> : null}
    </main>
  );
}
