import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { generateReferralCode } from "./referral";

export type UserRole = "user" | "admin";

export interface FirestoreUser {
  uid: string;
  email: string;
  coins: number;
  xp: number;
  level: number;
  role: UserRole;
  referralCode: string;
  referredBy: string | null;
  createdAt: { toMillis: () => number };
}

export const signupUser = async (
  email: string,
  password: string,
  ref?: string
) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    coins: 0,
    xp: 0,
    level: 1,
    role: "user",
    referralCode: generateReferralCode(uid),
    referredBy: ref || null,
    createdAt: Timestamp.now(),
  });
};

export const loginUser = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = () => firebaseSignOut(auth);

export async function getFirestoreUser(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid: d.uid,
    email: d.email,
    coins: d.coins ?? 0,
    xp: d.xp ?? 0,
    level: d.level ?? 1,
    role: (d.role as UserRole) ?? "user",
    referralCode: d.referralCode ?? "",
    referredBy: d.referredBy ?? null,
    createdAt: d.createdAt,
  };
}
