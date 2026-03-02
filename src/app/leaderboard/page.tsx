"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

type LeaderboardEntry = {
  uid: string;
  score: number;
  email?: string;
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "leaderboard_global"),
      orderBy("score", "desc"),
      limit(50)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(
          snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
            uid: d.id,
            score: d.data().score ?? 0,
            email: d.data().email,
          }))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-xl text-blue-100">
            Top solvers by XP (updates in real time)
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Rankings</CardTitle>
            <CardDescription>Earn XP by solving puzzles correctly</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-slate-600">Loading...</p>
            ) : entries.length === 0 ? (
              <p className="text-slate-600">No scores yet. Solve puzzles to appear here!</p>
            ) : (
              <ul className="space-y-3">
                {entries.map((e, i) => (
                  <li
                    key={e.uid}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={i < 3 ? "default" : "secondary"}>
                        #{i + 1}
                      </Badge>
                      <span className="font-medium">
                        {e.email ?? `User ${e.uid.slice(0, 8)}`}
                      </span>
                    </div>
                    <span className="text-green-600 font-semibold">{e.score} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
