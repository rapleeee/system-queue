"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";

import { auth } from "@/lib/firebase";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ALL_QUEUE_IDS, QUEUE_LABELS } from "@/lib/queue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        Memeriksa sesi admin...
      </div>
    );
  }

  if (!user) {
    return <AdminLoginForm />;
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100 text-zinc-950 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Panel Admin – Pilih Kelas
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Anda sudah login sebagai admin. Pilih kelas yang ingin Anda atur
            gilirannya.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_QUEUE_IDS.sort((a, b) => {
            // Sort so XI comes first, then X
            const aIsXI = a.startsWith("xi-") ? 0 : 1;
            const bIsXI = b.startsWith("xi-") ? 0 : 1;
            return aIsXI - bIsXI;
          }).map((id) => (
            <Link key={id} href={`/admin/${id}`}>
              <Card className="h-full cursor-pointer border-zinc-200 bg-white transition-colors hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-100">
                <CardHeader className="pb-3">
                  <CardTitle>{QUEUE_LABELS[id]}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-zinc-600 dark:text-zinc-400">
                  Kelola antrian presentasi kelas {QUEUE_LABELS[id]} (Next,
                  Reset, dan ringkasan giliran).
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
