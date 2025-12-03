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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  DEFAULT_QUEUE_ID,
  QueueState,
  getInitialStudentsForQueue,
  getObserversForStudent,
  getPresenterIndex,
  type HistoryEntry,
  type PresentationStatus,
  type StudentStatus,
} from "@/lib/queue";

export type QueueView = {
  presenter: { id: string; name: string } | null;
  nextPresenter: { id: string; name: string } | null;
  observers: { id: string; name: string }[];
  nextObservers: { id: string; name: string }[];
  total: number;
  currentIndex: number;
  loading: boolean;
  locked: boolean;
  history: HistoryEntry[];
  statuses: StudentStatus[];
  students: { id: string; name: string; order: number }[];
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
    nextPresenter: null,
    observers: [],
    nextObservers: [],
    total: 0,
    currentIndex: 0,
    loading: true,
    locked: false,
    history: [],
    statuses: [],
    students: [],
  });

  useEffect(() => {
    const queues = collection(db, "queues");
    const ref = doc(queues, queueId);

    const ensureInitial = async () => {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        const students = getInitialStudentsForQueue(queueId);
        const initial: QueueState = {
          students,
          currentIndex: 0,
          updatedAt: Date.now(),
          statuses: students.map((s) => ({
            studentId: s.id,
            status: "belum",
          })),
          history: [],
          locked: false,
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

        const observers = observerStudents.map((s) => ({
          id: s.id,
          name: s.name,
        }));

        const nextIndex =
          students.length > 0
            ? (currentIndex + 1) % students.length
            : null;
        const nextPresenter =
          nextIndex !== null ? students[nextIndex] ?? null : null;

        const nextObserverStudents = nextPresenter
          ? getObserversForStudent(students, nextPresenter)
          : [];

        const nextObservers = nextObserverStudents.map((s) => ({
          id: s.id,
          name: s.name,
        }));

        const simpleStudents = students.map((s) => ({
          id: s.id,
          name: s.name,
          order: s.order,
        }));

        setState({
          presenter: presenter
            ? { id: presenter.id, name: presenter.name }
            : null,
          nextPresenter: nextPresenter
            ? { id: nextPresenter.id, name: nextPresenter.name }
            : null,
          observers,
          nextObservers,
          total: students.length,
          currentIndex,
          loading: false,
          locked: Boolean(data.locked),
          history: data.history ?? [],
          statuses: data.statuses ?? [],
          students: simpleStudents,
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

async function advanceQueue(
  queueId: string,
  status: PresentationStatus,
) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      const students = getInitialStudentsForQueue(queueId);
      const total = students.length;
      const now = Date.now();

      if (!total) {
        const initial: QueueState = {
          students,
          currentIndex: 0,
          updatedAt: now,
          statuses: [],
          history: [],
          locked: false,
        };
        transaction.set(ref, initial);
        return;
      }

      const presenterIndex = 0;
      const presenter = students[presenterIndex];

      const statuses: StudentStatus[] = students.map((s) => ({
        studentId: s.id,
        status: s.id === presenter.id ? status : ("belum" as PresentationStatus),
      }));

      const history: HistoryEntry[] = [
        {
          studentId: presenter.id,
          status,
          timestamp: now,
        },
      ];

      const nextIndex = (presenterIndex + 1) % total;

      const initial: QueueState = {
        students,
        currentIndex: nextIndex,
        updatedAt: now,
        statuses,
        history,
        locked: false,
      };
      transaction.set(ref, initial);
      return;
    }

    const data = snap.data() as QueueState;
    const students = data.students ?? [];
    const total = students.length;
    if (!total) return;

    if (data.locked) {
      return;
    }

    const presenterIndex = getPresenterIndex(
      data.currentIndex,
      students.length,
    );
    if (presenterIndex === null) return;

    const presenter = students[presenterIndex];
    if (!presenter) return;

    const now = Date.now();

    const existingStatuses: StudentStatus[] =
      data.statuses ??
      students.map((s) => ({
        studentId: s.id,
        status: "belum" as PresentationStatus,
      }));

    const statuses: StudentStatus[] = existingStatuses.map((entry) =>
      entry.studentId === presenter.id ? { ...entry, status } : entry,
    );

    const history: HistoryEntry[] = [
      ...(data.history ?? []),
      {
        studentId: presenter.id,
        status,
        timestamp: now,
      },
    ];

    // Cari index berikutnya yang statusnya masih "belum".
    const findNextIndex = () => {
      const baseIndex = presenterIndex;
      for (let step = 1; step <= total; step++) {
        const candidate = (baseIndex + step) % total;
        const student = students[candidate];
        if (!student) continue;
        const st =
          statuses.find((s) => s.studentId === student.id)?.status ??
          ("belum" as PresentationStatus);
        if (st === "belum") {
          return candidate;
        }
      }
      // Jika semua sudah tidak "belum", tetap di presenter sekarang.
      return presenterIndex;
    };

    const nextIndex = findNextIndex();

    transaction.update(ref, {
      currentIndex: nextIndex,
      updatedAt: now,
      updatedAtServer: serverTimestamp(),
      statuses,
      history,
    });
  });
}

export async function nextQueue(queueId: string = DEFAULT_QUEUE_ID) {
  await advanceQueue(queueId, "sudah");
}

export async function skipQueue(queueId: string = DEFAULT_QUEUE_ID) {
  await advanceQueue(queueId, "tidak_hadir");
}

export async function resetQueue(queueId: string = DEFAULT_QUEUE_ID) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  const students = getInitialStudentsForQueue(queueId);

  await setDoc(ref, {
    students,
    currentIndex: 0,
    updatedAt: Date.now(),
    updatedAtServer: serverTimestamp(),
    statuses: students.map((s) => ({
      studentId: s.id,
      status: "belum",
    })),
    history: [],
    locked: false,
  } satisfies QueueState & { updatedAtServer: unknown });
}

export async function setQueueLocked(
  queueId: string = DEFAULT_QUEUE_ID,
  locked: boolean,
) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  await updateDoc(ref, {
    locked,
    updatedAt: Date.now(),
    updatedAtServer: serverTimestamp(),
  });
}

export async function setCurrentStudent(
  queueId: string = DEFAULT_QUEUE_ID,
  studentId: string,
) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return;

    const data = snap.data() as QueueState;
    if (data.locked) return;

    const students = data.students ?? [];
    const index = students.findIndex((s) => s.id === studentId);
    if (index === -1) return;

    transaction.update(ref, {
      currentIndex: index,
      updatedAt: Date.now(),
      updatedAtServer: serverTimestamp(),
    });
  });
}

export async function prevQueue(queueId: string = DEFAULT_QUEUE_ID) {
  const queues = collection(db, "queues");
  const ref = doc(queues, queueId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return;

    const data = snap.data() as QueueState;
    const students = data.students ?? [];
    const total = students.length;
    if (!total) return;
    if (data.locked) return;

    const currentIndex = data.currentIndex ?? 0;
    const prevIndex = ((currentIndex - 1) % total + total) % total;

    transaction.update(ref, {
      currentIndex: prevIndex,
      updatedAt: Date.now(),
      updatedAtServer: serverTimestamp(),
    });
  });
}
