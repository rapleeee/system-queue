"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminQueueControls } from "@/components/admin/admin-queue-controls";

type Props = {
  queueId: string;
  classLabel: string;
};

export function AdminClassQueuePageClient({ queueId, classLabel }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        Memeriksa sesi admin...
      </div>
    );
  }

  if (!user) {
    return <AdminLoginForm />;
  }

  return <AdminQueueControls queueId={queueId} classLabel={classLabel} />;
}

