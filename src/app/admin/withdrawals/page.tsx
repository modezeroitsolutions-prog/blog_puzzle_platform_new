"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function WithdrawAdmin() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "withdrawals"));
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "withdrawals", id), { status });
    setList(prev =>
      prev.map(w => (w.id === id ? { ...w, status } : w))
    );
  };

  return (
    <div>
      <h2>Withdraw Requests</h2>
      {list.map(w => (
        <div key={w.id}>
          {w.uid} | ₹{w.amount} | {w.status}
          <button onClick={() => updateStatus(w.id, "approved")}>Approve</button>
          <button onClick={() => updateStatus(w.id, "rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
