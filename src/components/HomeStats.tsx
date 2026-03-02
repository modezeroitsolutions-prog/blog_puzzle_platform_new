"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Stats = {
  puzzleCount: number;
  userCount: number;
  totalCoins: number;
};

export function HomeStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/stats");
        const data = (await res.json()) as Stats;
        if (!cancelled) setStats(data);

        if (!cancelled && data.puzzleCount === 0) {
          const snap = await getDocs(collection(db, "puzzles"));
          setStats((prev) => (prev ? { ...prev, puzzleCount: snap.size } : { puzzleCount: snap.size, userCount: 0, totalCoins: 0 }));
        }
      } catch {
        try {
          const snap = await getDocs(collection(db, "puzzles"));
          if (!cancelled) setStats({ puzzleCount: snap.size, userCount: 0, totalCoins: 0 });
        } catch {
          if (!cancelled) setStats({ puzzleCount: 0, userCount: 0, totalCoins: 0 });
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const puzzleCount = stats?.puzzleCount ?? 0;
  const userCount = stats?.userCount ?? 0;
  const totalCoins = stats?.totalCoins ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-blue-600">
            {stats === null ? "…" : puzzleCount.toLocaleString()}
          </CardTitle>
          <CardDescription>Active Puzzles</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-purple-600">
            {stats === null ? "…" : `${totalCoins.toLocaleString()} coins`}
          </CardTitle>
          <CardDescription>Paid to Creators & Solvers</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-green-600">
            {stats === null ? "…" : userCount.toLocaleString()}
          </CardTitle>
          <CardDescription>Community Members</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
