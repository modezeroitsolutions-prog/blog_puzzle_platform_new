import { doc, updateDoc, setDoc, getDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

export const rewardUser = async (uid: string, coins: number, score: number) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    coins: increment(coins),
    xp: increment(score),
  });

  const lbRef = doc(db, "leaderboard_global", uid);
  const lbSnap = await getDoc(lbRef);
  if (lbSnap.exists()) {
    await updateDoc(lbRef, { score: increment(score) });
  } else {
    await setDoc(lbRef, { score, uid });
  }
};
