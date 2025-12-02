"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogOut, RotateCcw, StepForward, Users } from "lucide-react";
import Swal from "sweetalert2";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useQueue, nextQueue, resetQueue } from "@/hooks/use-queue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  queueId: string;
  classLabel: string;
};

export function AdminQueueControls({ queueId, classLabel }: Props) {
  const { presenter, observers, total, loading } = useQueue(queueId, {
    initializeIfMissing: true,
  });
  const [busy, setBusy] = useState<"next" | "reset" | null>(null);

  const handleNext = async () => {
    try {
      setBusy("next");
      await nextQueue(queueId);
    } finally {
      setBusy(null);
    }
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Reset antrian?",
      text: `Antrian kelas ${classLabel} akan dikembalikan ke awal.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, reset",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      setBusy("reset");
      await resetQueue(queueId);
      await Swal.fire({
        title: "Berhasil",
        text: `Antrian kelas ${classLabel} telah direset.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("[admin] gagal reset antrian", error);
      await Swal.fire({
        title: "Gagal reset",
        text: "Terjadi kesalahan saat mereset antrian. Coba periksa koneksi atau izin Firebase.",
        icon: "error",
        confirmButtonText: "Tutup",
      });
    } finally {
      setBusy(null);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Panel Admin Antrian – {classLabel}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Tekan tombol{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                Next
              </span>{" "}
              setiap kali giliran presentasi diganti.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="gap-1 text-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleLogout}
            className="gap-2 text-xs"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </header>

      <main className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Antrian</CardTitle>
            <CardDescription>
              Informasi siswa yang sedang presentasi dan observasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Sedang Presentasi
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {loading
                  ? "Memuat..."
                  : presenter?.name ?? "Belum ada antrian / data kosong"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Observasi
              </p>
              {loading ? (
                <p className="mt-1 text-sm text-zinc-500">Memuat...</p>
              ) : observers.length === 0 ? (
                <p className="mt-1 text-sm text-zinc-500">
                  Belum ada siswa observasi.
                </p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm">
                  {observers.map((observer, index) => (
                    <li key={`${observer.name}-${index}`}>
                      • {observer.name}{" "}
                      <span className="text-xs text-zinc-500">
                        (Observasi {index === 0 ? "1" : "2"})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Total siswa: {total}</span>
            <span>
              Antrian berputar otomatis kembali ke siswa pertama setelah siswa
              terakhir.
            </span>
          </CardFooter>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Kontrol Antrian</CardTitle>
            <CardDescription>
              Gunakan tombol di bawah untuk mengatur giliran presentasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading || busy !== null}
                className="h-11 gap-2 text-base"
              >
                <StepForward className="h-4 w-4" />
                Next Giliran
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={busy !== null}
                className="h-11 gap-2 text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Antrian ke Awal
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            <p>
              Pastikan halaman display antrian (halaman utama) dibuka di
              perangkat lain untuk menampilkan giliran ke siswa.
            </p>
            <p>
              Setiap kali tombol Next ditekan, halaman display akan ter-update
              secara realtime melalui Firebase.
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
