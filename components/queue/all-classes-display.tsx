"use client";

import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Mic2,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useQueue } from "@/hooks/use-queue";
import { useVoiceQueue } from "@/hooks/use-voice-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ALL_QUEUE_IDS,
  QUEUE_LABELS,
  QUEUE_ROOMS,
  QUEUE_THEMES,
  type QueueId,
} from "@/lib/queue";
import { cn } from "@/lib/utils";

// Add CSS animations
const animationStyles = `
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .animate-scale-in {
    animation: scaleIn 0.3s ease-out;
  }

  .animate-marquee {
    animation: marquee 20s linear infinite;
  }

  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
  }

  .marquee-content {
    display: inline-block;
    padding-left: 100%;
  }
`;

export function AllClassesDisplay() {
  const { voiceEnabled, toggleVoice, addToQueue } = useVoiceQueue();
  const [wibTime, setWibTime] = useState("");
  const [videoIndex, setVideoIndex] = useState(0);
  const [mainPresentation, setMainPresentation] = useState<{
    queueId: QueueId;
    name: string;
  } | null>(null);

  // Track presenters for all queues to detect changes and trigger announcements
  const presenterTrackingRef = useRef<Record<QueueId, string | null>>(
    Object.fromEntries(ALL_QUEUE_IDS.map((id) => [id, null])) as Record<
      QueueId,
      string | null
    >
  );

  // Get all queue data to monitor presenter changes
  const queueData = Object.fromEntries(
    ALL_QUEUE_IDS.map((id) => [id, useQueue(id, { initializeIfMissing: true })])
  ) as Record<QueueId, ReturnType<typeof useQueue>>;

  // YouTube video IDs
  const youtubeVideos = ["FSKfFteq5BQ", "j-dVc0sDRRU", "6Bxn8gBtURM"];

  // Auto-advance video every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex((prev) =>
        prev === youtubeVideos.length - 1 ? 0 : prev + 1
      );
    }, 45000); // 45 seconds for YouTube Shorts

    return () => clearInterval(interval);
  }, []);

  // Initialize presenter tracking
  useEffect(() => {
    ALL_QUEUE_IDS.forEach((id) => {
      presenterTrackingRef.current[id] = null;
    });
  }, []);

  // Monitor ALL queues for presenter changes and trigger announcements
  useEffect(() => {
    ALL_QUEUE_IDS.forEach((queueId) => {
      const qData = queueData[queueId];
      if (qData.loading) return;

      const currentPresenterName = qData.presenter?.name ?? null;
      const previousPresenterName = presenterTrackingRef.current[queueId];

      // Trigger announcement only if presenter actually changed
      if (
        previousPresenterName !== currentPresenterName &&
        currentPresenterName
      ) {
        presenterTrackingRef.current[queueId] = currentPresenterName;

        // Trigger voice announcement IMMEDIATELY
        const classLabel = QUEUE_LABELS[queueId];
        const roomName = QUEUE_ROOMS[queueId];
        const spokenClass = getSpokenClassLabel(classLabel);
        const text = `Perhatian, ${spokenClass}. Yang akan presentasi: ${currentPresenterName}. Masuk ke ${roomName}.`;

        addToQueue({
          id: `${queueId}-${currentPresenterName}`,
          text,
          priority: 0,
        });

        // Update main presentation display
        setMainPresentation({ queueId, name: currentPresenterName });
      } else if (previousPresenterName !== currentPresenterName) {
        presenterTrackingRef.current[queueId] = currentPresenterName;
        // If presenter cleared (null), check if we should clear main presentation or move to next
        if (!currentPresenterName && mainPresentation?.queueId === queueId) {
          setMainPresentation(null);
        }
      }
    });
  }, [queueData, addToQueue, mainPresentation?.queueId]);

  // Update time
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
        // ignore
      }
    };

    updateTime();
    const id = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(id);
  }, []);

  const getSpokenClassLabel = (label: string) => {
    // Handle labels like "X1", "XI 1", "X2", "XI 2", "X 3"
    const cleanLabel = label.trim();

    let levelWord = "";
    let numberPart = "";

    // Check if starts with XI (sebelas)
    if (cleanLabel.toUpperCase().startsWith("XI")) {
      levelWord = "sebelas";
      numberPart = cleanLabel.slice(2).trim();
    }
    // Check if starts with X (sepuluh)
    else if (cleanLabel.toUpperCase().startsWith("X")) {
      levelWord = "sepuluh";
      numberPart = cleanLabel.slice(1).trim();
    }
    // Fallback
    else {
      return `kelas ${cleanLabel.toLowerCase()}`;
    }

    if (numberPart) {
      return `kelas ${levelWord} ${numberPart}`;
    }
    return `kelas ${levelWord}`;
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <header className="bg-white py-4 px-6 sm:px-8">
          <div className="mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="./xpro.png" alt="Logo" className="h-15 w-auto" />
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleVoice}
                className="text-black hover:bg-gray-100"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
              {wibTime && (
                <div className="font-mono text-sm font-semibold text-black">
                  {wibTime}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Display Area */}
        <main className="flex-1 bg-white">
          <div className="w-full px-4 py-6 sm:px-6 md:py-8 md:px-8">
            {/* Main Grid Layout - Responsive */}
            <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-5">
              {/* Left Column - Responsive (Main Display + Status Kelas) */}
              <div className="lg:col-span-3 space-y-6 md:space-y-8">
                {/* Main Call Display */}
                <div className="h-72 sm:h-80 md:h-96">
                  {mainPresentation ? (
                    <Card className="h-full border-gray-200 bg-linear-to-br from-gray-50 to-white shadow-md">
                      <CardContent className="h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center space-y-3 sm:space-y-4 md:space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 sm:px-4 py-2">
                          <Mic2 className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                          <p className="text-xs font-semibold text-white uppercase tracking-widest">
                            Memanggil Sekarang
                          </p>
                        </div>

                        <div className="space-y-2 w-full">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6">
                          <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
                            {QUEUE_LABELS[mainPresentation.queueId]}
                          </p>
                          <span className="text-xl sm:text-2xl text-gray-400">
                            <ArrowRight className="h-4 sm:h-6 w-4 sm:w-6" />
                          </span>
                          <p className="text-2xl sm:text-4xl md:text-5xl font-bold text-blue-600">
                            {QUEUE_ROOMS[mainPresentation.queueId]}
                          </p>
                          </div>
                        </div>

                        <div className="w-full border-t border-gray-300 pt-3 sm:pt-4">
                          <p className="mb-2 sm:mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Nama Siswa
                          </p>
                          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-black break-words line-clamp-2">
                            {mainPresentation.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full border-dashed border-gray-300 bg-gray-50">
                      <CardContent className="h-full flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <Users className="h-12 w-12 text-gray-300 mx-auto" />
                          <p className="text-sm font-medium text-gray-400">
                            Menunggu Pemanggilan
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Kelas List */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
                    <h2 className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Status Semua Kelas
                    </h2>

                  </div>
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {ALL_QUEUE_IDS.map((queueId) => (
                      <ClassCardSmall key={queueId} queueId={queueId} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Responsive (Full Height Video Area) */}
              <div className="lg:col-span-2 relative mt-6 lg:mt-0">
                <Card className="h-72 sm:h-80 md:h-96 lg:h-full lg:min-h-96 border border-gray-300 bg-black flex flex-col overflow-hidden relative">
                  <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
                    {/* YouTube Embed - Fullscreen */}
                    <div className="w-full h-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${youtubeVideos[videoIndex]}?autoplay=1&mute=1&fs=1&controls=1&modestbranding=1`}
                        title={`YouTube Video ${videoIndex + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </CardContent>

                  {/* Video Navigation - Overlay */}
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 flex items-center gap-2 sm:gap-3 md:gap-4 justify-center px-3 sm:px-6">
                    <Button
                      onClick={() =>
                        setVideoIndex((prev) =>
                          prev === 0 ? youtubeVideos.length - 1 : prev - 1
                        )
                      }
                      variant="outline"
                      size="icon"
                      className="bg-white/80 hover:bg-white border-gray-300 h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <ChevronLeft className="h-3 sm:h-4 w-3 sm:w-4" />
                    </Button>
                    <span className="text-xs sm:text-sm font-medium text-white bg-black/50 px-2 sm:px-3 py-1 rounded">
                      {videoIndex + 1} / {youtubeVideos.length}
                    </span>
                    <Button
                      onClick={() =>
                        setVideoIndex((prev) =>
                          prev === youtubeVideos.length - 1 ? 0 : prev + 1
                        )
                      }
                      variant="outline"
                      size="icon"
                      className="bg-white/80 hover:bg-white border-gray-300 h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Running Text / Marquee */}
        <div className="border-t border-gray-200 bg-black py-3">
          <div className="marquee-container">
            <div className="animate-marquee text-sm font-semibold text-white">
              <span className="marquee-content">
                📢 Tanggal Masuk Sekolah: 12 Januari 2026 - Tanggal Masuk
                Sekolah: 12 Januari 2026 - Tanggal Masuk Sekolah: 12 Januari
                2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type ClassCardProps = {
  queueId: QueueId;
  onPresenterChange: (presenterName: string | null) => void;
};

function ClassCardSmall({ queueId }: { queueId: QueueId }) {
  const { presenter, loading } = useQueue(queueId, {
    initializeIfMissing: true,
  });

  const hasPresenter = presenter?.name;

  return (
    <Card
      className={cn(
        "border-gray-200 transition-all duration-300",
        hasPresenter &&
          "border-gray-400 bg-linear-to-br from-gray-50 to-white shadow-sm"
      )}
    >
      <CardHeader className="pb-2 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
          <CardTitle className="text-sm sm:text-base font-semibold text-gray-900">
            {QUEUE_LABELS[queueId]}
          </CardTitle>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-gray-400">
              <ArrowRight className="h-3 sm:h-4 w-3 sm:w-4" />
            </span>
            <span className="text-blue-600 font-semibold whitespace-nowrap">
              {QUEUE_ROOMS[queueId]}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 py-2 sm:py-3">
        {loading ? (
          <div className="h-6 sm:h-8 rounded bg-gray-200 animate-pulse" />
        ) : hasPresenter ? (
          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 font-medium">
            {presenter.name}
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">
            Kelola antrian presentasi kelas {QUEUE_LABELS[queueId]} (Next,
            Reset, dan ringkasan giliran).
          </p>
        )}
      </CardContent>
    </Card>
  );
}
