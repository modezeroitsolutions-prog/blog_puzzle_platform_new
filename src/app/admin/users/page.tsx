"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const makeAdmin = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), { role: "admin" });
  };

  return (
    <div>
      <h2>Users</h2>
      {users.map(u => (
        <div key={u.id}>
          {u.email} | Coins: {u.coins}
          <button onClick={() => makeAdmin(u.id)}>Make Admin</button>
        </div>
      ))}
    </div>
  );
}
