import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  limit,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId?: string;
  imageUrl: string;
  createdAt: { toMillis: () => number };
}

export async function getBlogs(limitCount = 20): Promise<BlogPost[]> {
  const q = query(
    collection(db, "blogs"),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt,
  })) as BlogPost[];
  list.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return list;
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, "blogs", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data(), createdAt: snap.data().createdAt } as BlogPost;
}

export async function getBlogsByAuthorId(authorId: string): Promise<BlogPost[]> {
  const q = query(
    collection(db, "blogs"),
    where("authorId", "==", authorId),
    limit(50)
  );
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt,
  })) as BlogPost[];
  list.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return list;
}

export async function getBlogsByAuthorName(authorName: string): Promise<BlogPost[]> {
  const q = query(collection(db, "blogs"), limit(100));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt,
  })) as BlogPost[];
  const filtered = list.filter((p) => p.author === authorName);
  filtered.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return filtered;
}

export async function createBlog(data: {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorId?: string;
  imageUrl?: string;
}) {
  const ref = await addDoc(collection(db, "blogs"), {
    ...data,
    imageUrl: data.imageUrl ?? "",
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function uploadBlogImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, "blogs", id));
}

export async function deleteBlogs(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteDoc(doc(db, "blogs", id))));
}
