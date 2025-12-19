"use client";

import { useEffect, useRef, useState } from "react";

export type VoiceQueueItem = {
  id: string;
  text: string;
  priority?: number; // opsional, untuk sorting queue
};

export function useVoiceQueue() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const queueRef = useRef<VoiceQueueItem[]>([]);
  const isSpeakingRef = useRef(false);

  // Initialize voice on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("queue-voice-enabled");
      if (stored !== null) {
        setVoiceEnabled(stored === "true");
      }
    } catch {
      // ignore
    }
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

  const processQueue = () => {
    if (!voiceEnabled || !("speechSynthesis" in window)) {
      isSpeakingRef.current = false;
      return;
    }

    if (queueRef.current.length === 0) {
      isSpeakingRef.current = false;
      return;
    }

    const item = queueRef.current.shift();
    if (!item) {
      isSpeakingRef.current = false;
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(item.text);

    if (voiceRef.current) {
      utterance.voice = voiceRef.current;
      utterance.lang = voiceRef.current.lang ?? "id-ID";
    } else {
      utterance.lang = "id-ID";
    }

    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      // Process next item after a short delay
      setTimeout(processQueue, 500);
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      setTimeout(processQueue, 500);
    };

    isSpeakingRef.current = true;
    synth.cancel();
    synth.speak(utterance);
  };

  const addToQueue = (item: VoiceQueueItem) => {
    queueRef.current.push(item);

    // Sort by priority if specified
    queueRef.current.sort((a, b) => {
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      return priorityB - priorityA;
    });

    if (!isSpeakingRef.current) {
      processQueue();
    }
  };

  const clearQueue = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    queueRef.current = [];
    isSpeakingRef.current = false;
  };

  const toggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("queue-voice-enabled", String(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  return {
    voiceEnabled,
    toggleVoice,
    addToQueue,
    clearQueue,
    isSpeaking: isSpeakingRef.current,
  };
}
