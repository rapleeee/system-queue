import React from "react";
import { notFound } from "next/navigation";

import { QueueDisplay } from "@/components/queue/queue-display";
import { ALL_QUEUE_IDS, QUEUE_LABELS, type QueueId } from "@/lib/queue";

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

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100 text-zinc-950 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-50">
      <QueueDisplay
        queueId={id}
        title={`Antrian Presentasi ${QUEUE_LABELS[id]}`}
        classLabel={QUEUE_LABELS[id]}
      />
    </div>
  );
}
