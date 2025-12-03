"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Users, Volume2, VolumeX } from "lucide-react";
import { useQueue } from "@/hooks/use-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  queueId: string;
  classLabel?: string;
  accentClass?: string;
};

export function QueueDisplay({
  title = "Sistem Antrian Presentasi",
  queueId,
  classLabel,
  accentClass,
}: Props) {
  const { presenter, nextPresenter, observers, nextObservers, total, loading } =
    useQueue(queueId);
  const lastPresenterRef = useRef<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [wibTime, setWibTime] = useState("");

  const getSpokenClassLabel = (label?: string) => {
    if (!label || label.trim().length === 0) {
      return "kelas ini";
    }

    const parts = label.trim().split(/\s+/);
    if (parts.length === 0) return "kelas ini";

    const first = parts[0].toUpperCase();
    const rest = parts.slice(1).join(" ");

    let levelWord: string;
    if (first === "X") {
      levelWord = "sepuluh";
    } else if (first === "XI") {
      levelWord = "sebelas";
    } else {
      levelWord = first.toLowerCase();
    }

    if (rest) {
      return `kelas ${levelWord} ${rest}`;
    }
    return `kelas ${levelWord}`;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("queue-voice-enabled");
      if (stored !== null) {
        setVoiceEnabled(stored === "true");
      }
    } catch {
      // abaikan jika localStorage tidak tersedia
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setWibTime(formatted);
      } catch {
        // abaikan error format waktu
      }
    };

    updateTime();
    const id = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    const selectVoice = () => {
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) return;

      const idVoices = voices.filter((v) =>
        v.lang.toLowerCase().startsWith("id"),
      );

      const preferred =
        idVoices.find((v) =>
          /indonesia|indonesian|google.*id/i.test(
            `${v.name} ${v.lang}`,
          ),
        ) ||
        idVoices[0] ||
        voices.find((v) => v.default) ||
        voices[0] ||
        null;

      voiceRef.current = preferred;
    };

    selectVoice();

    const handleVoicesChanged = () => {
      selectVoice();
    };

    synth.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    if (!voiceEnabled) return;
    if (!presenter?.name) return;

    const currentName = presenter.name;
    if (lastPresenterRef.current === currentName) return;
    lastPresenterRef.current = currentName;

    const kelas = getSpokenClassLabel(classLabel);

    const observerNames = observers.map((o) => o.name).filter(Boolean);

    let text = `Perhatian, ${kelas}. Yang akan presentasi: ${currentName}.`;
    if (observerNames.length > 0) {
      const joinObservers =
        observerNames.length === 1
          ? observerNames[0]
          : observerNames.slice(0, -1).join(", ") +
            " dan " +
            observerNames[observerNames.length - 1];
      text += ` Siswa observasi: ${joinObservers}.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current.lang ?? "id-ID";
    } else {
      utterance.lang = "id-ID";
    }
    utterance.rate = 0.95;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [presenter?.name, observers, classLabel, voiceEnabled]);

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("queue-voice-enabled", String(next));
        } catch {
          // abaikan error localStorage
        }
      }
      return next;
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "hidden h-10 w-10 items-center justify-center rounded-full sm:flex",
              "bg-zinc-900 text-zinc-50",
              accentClass,
            )}
          >
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
            <div className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
            <p>Total siswa</p>
            <p className="text-base font-semibold">{total}</p>
          </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleVoice}
            className="h-8 w-8"
            aria-label={
              voiceEnabled ? "Matikan suara pemanggilan" : "Nyalakan suara pemanggilan"
            }
          >
            {voiceEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          
          {wibTime && (
            <div className="hidden text-right text-[11px] text-zinc-500 dark:text-zinc-400 sm:block">
              <p className="font-mono font-bold text-4xl">{wibTime}</p>
            </div>
          )}
          <Link href="/">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Kembali
            </Button>
          </Link>
        </div>
      </header>

      <main className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-zinc-500 dark:text-zinc-400">
              Presentasi
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-zinc-950 px-6 py-8 text-center text-zinc-50 shadow-lg dark:bg-zinc-50 dark:text-zinc-900">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                  Nama
                </p>
                <p className="mt-3 text-3xl font-bold sm:text-4xl">
                  {loading
                    ? "Mengambil data antrian..."
                    : presenter?.name ?? "Belum ada antrian"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-zinc-500 dark:text-zinc-400">
              Siswa Observasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Mengambil data antrian...
              </p>
            ) : observers.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Belum ada siswa observasi.
              </p>
            ) : (
              observers.map((observer, index) => (
                <div
                  key={`${observer.id}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <span className="font-medium">{observer.name}</span>
                  <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Observasi {index === 0 ? "1" : "2"}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-zinc-500 dark:text-zinc-400">
              Sesi Berikutnya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Presentasi berikut
              </p>
              <p className="mt-1">
                {loading
                  ? "Mengambil data antrian..."
                  : nextPresenter?.name ?? "Belum ada / sudah di akhir."}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Observasi berikut
              </p>
              {loading ? (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Mengambil data antrian...
                </p>
              ) : nextObservers.length === 0 ? (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Belum ada siswa observasi berikut.
                </p>
              ) : (
                <div className="mt-1 space-y-1">
                  {nextObservers.map((observer, index) => (
                    <div
                      key={`${observer.id}-next-${index}`}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <span>{observer.name}</span>
                      <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Observasi {index === 0 ? "1" : "2"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
