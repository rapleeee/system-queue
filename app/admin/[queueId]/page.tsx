import React from "react";
import { notFound } from "next/navigation";

import { ALL_QUEUE_IDS, QUEUE_LABELS, type QueueId } from "@/lib/queue";
import { AdminClassQueuePageClient } from "@/components/admin/admin-class-queue-page-client";

type Props = {
  params: Promise<{ queueId: string }>;
};

export default function AdminClassQueuePage({ params }: Props) {
  const { queueId } = React.use(params);
  const rawId = queueId.toLowerCase();

  if (!ALL_QUEUE_IDS.includes(rawId as QueueId)) {
    notFound();
  }

  const id = rawId as QueueId;
  const classLabel = QUEUE_LABELS[id];

  return (
    <AdminClassQueuePageClient queueId={id} classLabel={classLabel} />
  );
}
