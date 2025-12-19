"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Lock,
  LogOut,
  RotateCcw,
  SkipForward,
  StepForward,
  Unlock,
  Users,
} from "lucide-react";
import Swal from "sweetalert2";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";
import {
  useQueue,
  nextQueue,
  resetQueue,
  skipQueue,
  setQueueLocked,
  prevQueue,
  recallCurrentPresenter,
  setCurrentStudent,
} from "@/hooks/use-queue";
import { QUEUE_ROOMS, type QueueId } from "@/lib/queue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  queueId: string;
  classLabel: string;
};

export function AdminQueueControls({ queueId, classLabel }: Props) {
  const {
    presenter,
    nextPresenter,
    observers,
    total,
    loading,
    locked,
    history,
    statuses,
    students,
  } = useQueue(queueId, {
    initializeIfMissing: true,
  });

  const [busy, setBusy] = useState<"next" | "reset" | "skip" | null>(null);
  const [locking, setLocking] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "belum" | "sudah" | "tidak_hadir"
  >("all");

  const currentStatus = useMemo(() => {
    if (!presenter) return "belum";
    const found = statuses.find((s) => s.studentId === presenter.id);
    return found?.status ?? "belum";
  }, [presenter, statuses]);

  const currentStatusLabel = useMemo(() => {
    if (currentStatus === "sudah") return "Sudah presentasi";
    if (currentStatus === "tidak_hadir")
      return "Tidak hadir / dilewati";
    return "Belum presentasi";
  }, [currentStatus]);

  const handleNext = async () => {
    try {
      setBusy("next");
      await nextQueue(queueId);
    } finally {
      setBusy(null);
    }
  };

  const handlePrev = async () => {
    try {
      setBusy("next");
      await prevQueue(queueId);
    } finally {
      setBusy(null);
    }
  };

  const handleRecall = async () => {
    const result = await Swal.fire({
      title: "Panggil Ulang Siswa?",
      text: `Akan memanggil ulang siswa yang sedang presentasi untuk kesempatan presentasi berikutnya.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Panggil Ulang",
      cancelButtonText: "Batal",
      confirmButtonColor: "#3b82f6",
    });

    if (!result.isConfirmed) return;

    try {
      setBusy("next");
      await recallCurrentPresenter(queueId);
    } finally {
      setBusy(null);
    }
  };

  const handleSkip = async () => {
    try {
      setBusy("skip");
      await skipQueue(queueId);
    } finally {
      setBusy(null);
    }
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: "Mulai sesi baru?",
      text: `Riwayat sesi ini akan diakhiri dan antrian kelas ${classLabel} dikembalikan ke awal.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, mulai sesi baru",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      setBusy("reset");
      await resetQueue(queueId);
      await Swal.fire({
        title: "Berhasil",
        text: `Sesi baru untuk kelas ${classLabel} telah dimulai.`,
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

  const handleToggleLock = async () => {
    try {
      setLocking(true);
      await setQueueLocked(queueId, !locked);
    } finally {
      setLocking(false);
    }
  };

  const handleExportHistory = async () => {
    if (!history.length) {
      await Swal.fire({
        title: "Tidak ada riwayat",
        text: "Belum ada data riwayat presentasi untuk diexport.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      setExporting(true);
      const header = ["No", "NIS", "Nama", "Status", "Waktu (lokal)"];

      const rows = history.map((entry, index) => {
        const student = students.find((s) => s.id === entry.studentId);
        const nis = student?.id ?? entry.studentId;
        const name = student?.name ?? "Tidak diketahui";
        const status =
          entry.status === "sudah"
            ? "Sudah presentasi"
            : entry.status === "tidak_hadir"
              ? "Tidak hadir / dilewati"
              : "Belum";
        const time = new Date(entry.timestamp).toLocaleString("id-ID");

        return [String(index + 1), nis, name, status, time];
      });

      const csvLines = [header, ...rows]
        .map((cols) =>
          cols
            .map((value) => {
              const safe = value.replace(/"/g, '""');
              return `"${safe}"`;
            })
            .join(","),
        )
        .join("\n");

      const blob = new Blob([csvLines], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `riwayat-${queueId}-${Date.now()}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const skippedStudents = useMemo(
    () =>
      students
        .filter(
          (student) =>
            statuses.find((s) => s.studentId === student.id)?.status ===
            "tidak_hadir",
        )
        .sort((a, b) => a.order - b.order),
    [students, statuses],
  );

  const [selectedSkippedId, setSelectedSkippedId] = useState<string>("");

  const handleCallSkipped = async () => {
    if (!selectedSkippedId) return;
    try {
      setBusy("next");
      await setCurrentStudent(queueId, selectedSkippedId);
    } finally {
      setBusy(null);
    }
  };

  const filteredStudents = useMemo(() => {
    return students
      .slice()
      .sort((a, b) => a.order - b.order)
      .filter((student) => {
        if (statusFilter === "all") return true;
        const st = statuses.find((s) => s.studentId === student.id)?.status;
        return st === statusFilter;
      });
  }, [students, statuses, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 sm:flex">
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
            {locked && (
              <p className="mt-1 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                <Lock className="mr-1 h-3 w-3" />
                Mode kunci aktif
              </p>
            )}
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
                Status
              </p>
              <p className="mt-1 text-sm">{currentStatusLabel}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Ruangan
              </p>
              <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                {QUEUE_ROOMS[queueId as QueueId]}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Berikutnya
              </p>
              <p className="mt-1 text-sm">
                {nextPresenter?.name ?? "Belum ada / sudah di akhir"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start text-xs text-zinc-500 dark:text-zinc-400">
            <span className="text-left mb-2">Total siswa: <span className="font-black">{total}</span></span>
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
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={loading || busy !== null || locked}
                  className="h-11 gap-2 text-sm sm:flex-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {busy === "next" ? "Memproses..." : "Sebelumnya"}
                </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading || busy !== null || locked}
                className="h-11 gap-2 text-base sm:flex-1"
              >
                <StepForward className="h-4 w-4" />
                {busy === "next" ? "Memproses..." : "Next Giliran"}
              </Button>
              </div>
              <Button
                type="button"
                variant="default"
                onClick={handleRecall}
                disabled={loading || busy !== null || locked}
                className="h-11 gap-2 text-sm bg-blue-600 hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                {busy === "next" ? "Memproses..." : "Panggil Ulang"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={loading || busy !== null || locked}
                className="h-11 gap-2 text-sm"
              >
                <SkipForward className="h-4 w-4" />
                {busy === "skip" ? "Memproses..." : "Skip (Tidak Hadir)"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={busy !== null || locked}
                className="h-11 gap-2 text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                {busy === "reset"
                  ? "Memproses..."
                  : "Reset Antrian ke Awal"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={locked ? "outline" : "ghost"}
                size="sm"
                onClick={handleToggleLock}
                disabled={locking}
                className="gap-1 text-[11px]"
              >
                {locked ? (
                  <>
                    <Unlock className="h-3 w-3" />
                    Buka Mode Kunci
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3" />
                    Aktifkan Mode Kunci
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportHistory}
                disabled={exporting || history.length === 0}
                className="gap-1 text-[11px]"
              >
                <Download className="h-3 w-3" />
                {exporting ? "Export..." : "Export Riwayat (CSV)"}
              </Button>
            </div>
            <div className="mt-1 w-full space-y-1">
              <p className="text-[11px] font-medium">
                Panggil ulang siswa tidak hadir
              </p>
              {skippedStudents.length === 0 ? (
                <p className="text-[11px] text-zinc-500">
                  Tidak ada siswa dengan status "Tidak hadir / dilewati".
                </p>
              ) : (
                <div className="flex flex-col gap-1 sm:flex-row">
                  <select
                    className="h-8 flex-1 rounded-md border border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                    value={selectedSkippedId}
                    onChange={(e) => setSelectedSkippedId(e.target.value)}
                  >
                    <option value="">Pilih siswa...</option>
                    {skippedStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.order}. {s.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!selectedSkippedId || locked || busy !== null}
                    onClick={handleCallSkipped}
                    className="mt-1 gap-1 text-[11px] sm:mt-0"
                  >
                    <SkipForward className="h-3 w-3" />
                    Panggil
                  </Button>
                </div>
              )}
            </div>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daftar Siswa & Status</CardTitle>
            <CardDescription>
              Ringkasan seluruh siswa di kelas {classLabel} beserta status
              presentasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
              <span>Filter status:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-2 py-1",
                    statusFilter === "all"
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
                  )}
                  onClick={() => setStatusFilter("all")}
                >
                  Semua
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-2 py-1",
                    statusFilter === "belum"
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
                  )}
                  onClick={() => setStatusFilter("belum")}
                >
                  Belum
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-2 py-1",
                    statusFilter === "sudah"
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
                  )}
                  onClick={() => setStatusFilter("sudah")}
                >
                  Sudah
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-2 py-1",
                    statusFilter === "tidak_hadir"
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
                  )}
                  onClick={() => setStatusFilter("tidak_hadir")}
                >
                  Tidak hadir
                </button>
              </div>
            </div>
            {students.length === 0 ? (
              <p className="text-xs text-zinc-500">
                Belum ada data siswa untuk kelas ini.
              </p>
            ) : (
              <div className="max-h-64 overflow-auto rounded-md border border-zinc-200 text-xs dark:border-zinc-800">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                    <tr>
                      <th className="px-3 py-2">No</th>
                      <th className="px-3 py-2">NIS</th>
                      <th className="px-3 py-2">Nama</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => {
                        const st = statuses.find(
                          (s) => s.studentId === student.id,
                        )?.status;

                        let label = "Belum";
                        let badgeClass =
                          "inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200";

                        if (st === "sudah") {
                          label = "Sudah presentasi";
                          badgeClass =
                            "inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
                        } else if (st === "tidak_hadir") {
                          label = "Tidak hadir / dilewati";
                          badgeClass =
                            "inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
                        }

                        return (
                          <tr
                            key={student.id}
                            className={
                              index % 2 === 0
                                ? "border-t border-zinc-100 dark:border-zinc-800"
                                : "border-t border-zinc-100 bg-zinc-50/40 dark:border-zinc-800 dark:bg-zinc-900/40"
                            }
                          >
                            <td className="px-3 py-1.5 align-top">
                              {student.order}
                            </td>
                            <td className="px-3 py-1.5 align-top">
                              {student.id}
                            </td>
                            <td className="px-3 py-1.5 align-top">
                              {student.name}
                            </td>
                            <td className="px-3 py-1.5 align-top">
                              <span className={badgeClass}>{label}</span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
