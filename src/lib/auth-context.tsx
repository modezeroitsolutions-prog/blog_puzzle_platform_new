"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { getFirestoreUser, type FirestoreUser } from "./auth";

type AuthState = {
  firebaseUser: FirebaseUser | null;
  firestoreUser: FirestoreUser | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  firebaseUser: null,
  firestoreUser: null,
  loading: true,
});

function firestoreDataToUser(d: Record<string, unknown>): FirestoreUser {
  return {
    uid: d.uid as string,
    email: d.email as string,
    coins: (d.coins as number) ?? 0,
    xp: (d.xp as number) ?? 0,
    level: (d.level as number) ?? 1,
    role: (d.role as FirestoreUser["role"]) ?? "user",
    referralCode: (d.referralCode as string) ?? "",
    referredBy: (d.referredBy as string | null) ?? null,
    createdAt: d.createdAt as { toMillis: () => number },
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user ?? null);
      if (!user) {
        setFirestoreUser(null);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    setLoading(true);
    const unsub = onSnapshot(
      doc(db, "users", firebaseUser.uid),
      (snap) => {
        if (snap.exists()) {
          setFirestoreUser(firestoreDataToUser(snap.data() as Record<string, unknown>));
        } else {
          setFirestoreUser(null);
        }
        setLoading(false);
      },
      () => {
        setFirestoreUser(null);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [firebaseUser?.uid]);

  return (
    <AuthContext.Provider value={{ firebaseUser, firestoreUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
