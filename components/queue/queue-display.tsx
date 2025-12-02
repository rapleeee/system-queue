"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { useQueue } from "@/hooks/use-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title?: string;
  queueId: string;
  classLabel?: string;
};

export function QueueDisplay({
  title = "Sistem Antrian Presentasi",
  queueId,
  classLabel,
}: Props) {
  const { presenter, observers, total, loading } = useQueue(queueId);
  const lastPresenterRef = useRef<string | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

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
  }, [presenter?.name, observers, classLabel]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right text-xs text-zinc-500 dark:text-zinc-400 sm:block">
            <p>Total siswa</p>
            <p className="text-base font-semibold">{total}</p>
          </div>
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
                  key={`${observer.name}-${index}`}
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
    </div>
  );
}
