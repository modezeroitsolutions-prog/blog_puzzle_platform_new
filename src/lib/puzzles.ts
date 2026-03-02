import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  query,
  limit,
  Timestamp,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { rewardUser } from "./puzzle";

export interface PuzzleDoc {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  creatorId: string;
  creatorName?: string;
  question: string;
  answer: string;
  reward: number; // coins
  createdAt: { toMillis: () => number };
  solveCount: number;
  active: boolean;
}

export async function getPuzzles(activeOnly = true): Promise<PuzzleDoc[]> {
  const q = query(collection(db, "puzzles"), limit(100));
  const snap = await getDocs(q);
  let docs = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt,
    solveCount: d.data().solveCount ?? 0,
    active: d.data().active !== false,
  })) as PuzzleDoc[];
  if (activeOnly) docs = docs.filter((p) => p.active !== false);
  docs.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return docs;
}

export async function getPuzzleById(id: string): Promise<PuzzleDoc | null> {
  const snap = await getDoc(doc(db, "puzzles", id));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: snap.id,
    ...d,
    createdAt: d.createdAt,
    solveCount: d.solveCount ?? 0,
    active: d.active !== false,
  } as PuzzleDoc;
}

export async function createPuzzle(data: {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  creatorId: string;
  creatorName: string;
  question: string;
  answer: string;
  reward: number;
}) {
  const ref = await addDoc(collection(db, "puzzles"), {
    ...data,
    solveCount: 0,
    active: true,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Check if user has already solved this puzzle (client-side check; double-submit guarded by your rules if needed). */
export async function hasUserSolved(uid: string, puzzleId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "user_solves", `${uid}_${puzzleId}`));
  return snap.exists();
}

/** Record solve and grant reward. Call only once per user per puzzle. */
export async function recordSolveAndReward(
  uid: string,
  puzzleId: string,
  coins: number,
  xp: number
): Promise<void> {
  const key = `${uid}_${puzzleId}`;
  const solveRef = doc(db, "user_solves", key);
  const existing = await getDoc(solveRef);
  if (existing.exists()) return;

  await setDoc(solveRef, { uid, puzzleId, solvedAt: Timestamp.now() });
  await rewardUser(uid, coins, xp);

  const puzzleRef = doc(db, "puzzles", puzzleId);
  await updateDoc(puzzleRef, { solveCount: increment(1) });
}
