"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function ManagePuzzles() {
  const [puzzles, setPuzzles] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "puzzles"));
      setPuzzles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const toggle = async (id: string, active: boolean) => {
    await updateDoc(doc(db, "puzzles", id), { active: !active });
    setPuzzles(prev =>
      prev.map(p => (p.id === id ? { ...p, active: !active } : p))
    );
  };

  return (
    <div>
      <h2>Manage Puzzles</h2>
      {puzzles.map(p => (
        <div key={p.id}>
          {p.question}
          <button onClick={() => toggle(p.id, p.active)}>
            {p.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      ))}
    </div>
  );
}
