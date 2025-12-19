import React from "react";
import { notFound } from "next/navigation";

import { QueueDisplay } from "@/components/queue/queue-display";
import {
  ALL_QUEUE_IDS,
  QUEUE_LABELS,
  QUEUE_THEMES,
  type QueueId,
} from "@/lib/queue";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ queueId: string }>;
};

export default function ClassQueuePage({ params }: Props) {
  const { queueId } = React.use(params);
  const rawId = queueId.toLowerCase();

  if (!ALL_QUEUE_IDS.includes(rawId as QueueId)) {
    notFound();
  }

  const id = rawId as QueueId;
  const theme = QUEUE_THEMES[id];

  return (
    <div
      className={cn(
        "min-h-screen bg-linear-to-b text-zinc-950 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-50",
        theme?.bg ?? "from-zinc-50 to-zinc-100",
      )}
    >
      <QueueDisplay
        queueId={id}
        title={`Antrian Presentasi ${QUEUE_LABELS[id]}`}
        classLabel={QUEUE_LABELS[id]}
        accentClass={theme?.accent}
      />
    </div>
  );
}
