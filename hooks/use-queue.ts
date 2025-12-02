"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DEFAULT_QUEUE_ID,
  QueueState,
  getInitialStudentsForQueue,
  getObserversForStudent,
  getPresenterIndex,
} from "@/lib/queue";

export type QueueView = {
  presenter: { name: string } | null;
  observers: { name: string }[];
  total: number;
  currentIndex: number;
  loading: boolean;
};

export type UseQueueOptions = {
  /**
   * Jika true, akan membuat dokumen antrian awal di Firestore
   * ketika belum ada. Sebaiknya hanya dipakai di sisi admin
   * (yang sudah login) untuk menghindari error permission
   * di halaman display publik.
   */
  initializeIfMissing?: boolean;
};

export function useQueue(
  queueId: string = DEFAULT_QUEUE_ID,
  options?: UseQueueOptions,
): QueueView {
  const [state, setState] = useState<QueueView>({
    presenter: null,
    observers: [],
    total: 0,
    currentIndex: 0,
    loading: true,
  });

  useEffect(() => {
    const queues = collection(db, "queues");
    const ref = doc(queues, queueId);

    const ensureInitial = async () => {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const initial: QueueState = {
          students: getInitialStudentsForQueue(queueId),
          currentIndex: 0,
          updatedAt: Date.now(),
        };
        await setDoc(ref, initial);
      }
    };

    if (options?.initializeIfMissing) {
      ensureInitial().catch((error) => {
        console.error("[queue] gagal init antrian", error);
      });
    }

    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as QueueState | undefined;
        if (!data || !data.students || data.students.length === 0) {
          setState((prev) => ({
            ...prev,
            presenter: null,
            observers: [],
            total: 0,
            loading: false,
          }));
          return;
        }

        const { students, currentIndex } = data;
        const presenterIndex = getPresenterIndex(currentIndex, students.length);
        const presenter =
          presenterIndex !== null ? students[presenterIndex] ?? null : null;

        const observerStudents = presenter
          ? getObserversForStudent(students, presenter)
          : [];

        const observers = observerStudents.map((s) => ({ name: s.name }));

        setState({
          presenter: presenter ? { name: presenter.name } : null,
          observers,
          total: students.length,
          currentIndex,
          loading: false,
        });
      },
      (error) => {
        console.error("[queue] gagal listen antrian", error);
        setState((prev) => ({ ...prev, loading: false }));
      },
    );

    return () => unsub();
  }, [queueId, options?.initializeIfMissing]);

  return state;
}

export async function nextQueue(queueId: string = DEFAULT_QUEUE_ID) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      const initial: QueueState = {
        students: getInitialStudentsForQueue(queueId),
        currentIndex: 0,
        updatedAt: Date.now(),
      };
      transaction.set(ref, initial);
      return;
    }

    const data = snap.data() as QueueState;
    const total = data.students.length;
    if (!total) return;

    const nextIndex = (data.currentIndex + 1) % total;

    transaction.update(ref, {
      currentIndex: nextIndex,
      updatedAt: Date.now(),
      updatedAtServer: serverTimestamp(),
    });
  });
}

export async function resetQueue(queueId: string = DEFAULT_QUEUE_ID) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  await setDoc(ref, {
    students: getInitialStudentsForQueue(queueId),
    currentIndex: 0,
    updatedAt: Date.now(),
    updatedAtServer: serverTimestamp(),
  } satisfies QueueState & { updatedAtServer: unknown });
}
