import { getApps, initializeApp, getApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { cert } from "firebase-admin/app";

let app: App | null = null;

export function getAdminDb(): Firestore | null {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) return null;

    if (app) return getFirestore(app);
    const existing = getApps();
    if (existing.length > 0) {
      app = getApp() as App;
      return getFirestore(app);
    }
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return getFirestore(app);
  } catch {
    return null;
  }
}
