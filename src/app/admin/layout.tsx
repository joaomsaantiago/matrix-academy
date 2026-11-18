import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin/auth";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

/** Só admin passa daqui. Quem não é recebe 404 e não chega a ver o menu do painel. */
async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="adm">
      <AdminNav />
      <main className="adm__main">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="adm adm--loading" aria-busy="true" />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
