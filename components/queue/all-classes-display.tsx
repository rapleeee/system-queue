"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X, Mic2, Users, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [activePresenter, setActivePresenter] = useState<{
    queueId: QueueId;
    name: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const presentersRef = useRef<Record<string, string | null>>({});
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // YouTube video IDs
  const youtubeVideos = [
    "FSKfFteq5BQ",
    "j-dVc0sDRRU",
    "6Bxn8gBtURM",
  ];

  // Auto-advance video every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex((prev) => (prev === youtubeVideos.length - 1 ? 0 : prev + 1));
    }, 45000); // 45 seconds for YouTube Shorts

    return () => clearInterval(interval);
  }, []);

  // Initialize presenters tracking
  useEffect(() => {
    ALL_QUEUE_IDS.forEach((id) => {
      presentersRef.current[id] = null;
    });
  }, []);

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

  const handlePresenterChange = (queueId: QueueId, presenterName: string | null) => {
    const previousPresenter = presentersRef.current[queueId];

    if (previousPresenter !== presenterName && presenterName) {
      const classLabel = QUEUE_LABELS[queueId];
      const roomName = QUEUE_ROOMS[queueId];
      const spokenClass = getSpokenClassLabel(classLabel);
      const text = `Perhatian, ${spokenClass}. Yang akan presentasi: ${presenterName}. Masuk ke ${roomName}.`;

      presentersRef.current[queueId] = presenterName;
      addToQueue({
        id: `${queueId}-${presenterName}`,
        text,
        priority: 0,
      });

      // Close existing modal if any
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }

      // Show modal immediately with new presenter
      setShowModal(false);
      setTimeout(() => {
        setActivePresenter({ queueId, name: presenterName });
        setShowModal(true);
      }, 50); // Small delay to ensure state updates

      // Auto close modal after 10 seconds
      modalTimeoutRef.current = setTimeout(() => {
        setShowModal(false);
      }, 10000);
    } else {
      presentersRef.current[queueId] = presenterName;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }
  };

  // Get current presenter across all classes
  const getMainPresentation = () => {
    for (const queueId of ALL_QUEUE_IDS) {
      // We need to track presenters - for now use the stored reference
      const presenterName = presentersRef.current[queueId];
      if (presenterName) {
        return { queueId, name: presenterName };
      }
    }
    return null;
  };

  const mainPresentation = getMainPresentation();

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
          <div className="w-full px-6 py-8 sm:px-8">
            {/* Main Grid Layout - 5 columns */}
            <div className="grid gap-8 grid-cols-5">
              {/* Left Column - 3 columns (Main Display + Status Kelas) */}
              <div className="col-span-3 space-y-8">
                {/* Main Call Display */}
                <div className="h-96">
                  {mainPresentation ? (
                    <Card className="h-full border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-md">
                      <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2">
                          <Mic2 className="h-4 w-4 text-white" />
                          <p className="text-xs font-semibold text-white uppercase tracking-widest">
                            Memanggil Sekarang
                          </p>
                        </div>

                        <div className="space-y-2 w-full">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Kelas
                          </p>
                          <p className="text-5xl font-bold text-black">
                            {QUEUE_LABELS[mainPresentation.queueId]}
                          </p>
                        </div>

                        <div className="w-full border-t border-gray-300 pt-4">
                          <p className="mb-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Nama Siswa</p>
                          <p className="text-4xl font-bold text-black break-words line-clamp-2">
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
                    <Users className="h-5 w-5 text-gray-700" />
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Status Semua Kelas
                    </h2>
                  </div>
                  <div className="grid gap-4 grid-cols-3">
                    {ALL_QUEUE_IDS.map((queueId) => (
                      <ClassCardSmall
                        key={queueId}
                        queueId={queueId}
                        onPresenterChange={(presenterName) =>
                          handlePresenterChange(queueId, presenterName)
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - 2 columns (Full Height Video Area) */}
              <div className="col-span-2 relative">
                <Card className="h-full min-h-96 border border-gray-300 bg-black flex flex-col overflow-hidden relative">
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
                  <div className="absolute bottom-4 left-0 right-0 flex items-center gap-4 justify-center px-6">
                    <Button
                      onClick={() => setVideoIndex((prev) => (prev === 0 ? youtubeVideos.length - 1 : prev - 1))}
                      variant="outline"
                      size="icon"
                      className="bg-white/80 hover:bg-white border-gray-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-white bg-black/50 px-3 py-1 rounded">
                      {videoIndex + 1} / {youtubeVideos.length}
                    </span>
                    <Button
                      onClick={() => setVideoIndex((prev) => (prev === youtubeVideos.length - 1 ? 0 : prev + 1))}
                      variant="outline"
                      size="icon"
                      className="bg-white/80 hover:bg-white border-gray-300"
                    >
                      <ChevronRight className="h-4 w-4" />
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
                📢 Tanggal Masuk Sekolah: 12 Januari 2026 - Tanggal Masuk Sekolah: 12 Januari 2026 - Tanggal Masuk Sekolah: 12 Januari 2026
              </span>
            </div>
          </div>
        </div>

        {/* Modal Popup */}
        {showModal && activePresenter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" key={`modal-${activePresenter.queueId}-${activePresenter.name}`}>
            <div className="animate-scale-in w-full max-w-2xl rounded-xl bg-gray-100 p-12 shadow-2xl border border-gray-300">
              <button
                onClick={closeModal}
                className="absolute right-6 top-6 text-gray-600 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="space-y-8 text-center">
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-600">
                    {QUEUE_LABELS[activePresenter.queueId]}
                  </p>
                  <p className="text-xs text-gray-500">Presentasi dimulai</p>
                </div>

                <div className="space-y-2">
                  <p className="text-6xl font-bold text-gray-900 drop-shadow-lg" key={activePresenter.name}>
                    {activePresenter.name}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900">
                    Masuk di {QUEUE_ROOMS[activePresenter.queueId]}
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800 border border-gray-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

type ClassCardProps = {
  queueId: QueueId;
  onPresenterChange: (presenterName: string | null) => void;
};

function ClassCardSmall({ queueId, onPresenterChange }: ClassCardProps) {
  const { presenter, loading, updatedAt } = useQueue(queueId, {
    initializeIfMissing: true,
  });
  const lastPresenterRef = useRef<string | null>(null);
  const lastUpdatedAtRef = useRef<number>(0);

  useEffect(() => {
    if (loading) return;

    const currentPresenterName = presenter?.name ?? null;

    // Trigger on presenter change or when updatedAt changes (recall event)
    if (lastPresenterRef.current !== currentPresenterName || lastUpdatedAtRef.current !== updatedAt) {
      lastPresenterRef.current = currentPresenterName;
      lastUpdatedAtRef.current = updatedAt;
      onPresenterChange(currentPresenterName);
    }
  }, [presenter?.name, updatedAt, loading, onPresenterChange]);

  const hasPresenter = presenter?.name;

  return (
    <Card
      className={cn(
        "border-gray-200 transition-all duration-300",
        hasPresenter && "border-gray-400 bg-gradient-to-br from-gray-50 to-white shadow-sm"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">
          {QUEUE_LABELS[queueId]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 rounded bg-gray-200 animate-pulse" />
        ) : hasPresenter ? (
          <p className="text-sm text-gray-700 line-clamp-2 font-medium">
            {presenter.name}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Kelola antrian presentasi kelas {QUEUE_LABELS[queueId]} (Next, Reset, dan ringkasan giliran).
          </p>
        )}
      </CardContent>
    </Card>
  );
}
