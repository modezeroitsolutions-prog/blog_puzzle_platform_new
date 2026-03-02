"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "blogs"));
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const remove = async (id: string) => {
    await deleteDoc(doc(db, "blogs", id));
    setBlogs(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div>
      <h2>Manage Blogs</h2>
      {blogs.map(blog => (
        <div key={blog.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 8 }}>
          <b>{blog.title}</b>
          <br />
          <button onClick={() => remove(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
