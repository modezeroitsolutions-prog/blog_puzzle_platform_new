import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({
        puzzleCount: 0,
        userCount: 0,
        totalCoins: 0,
      });
    }

    const [puzzlesSnap, usersSnap] = await Promise.all([
      db.collection("puzzles").get(),
      db.collection("users").get(),
    ]);

    const puzzleCount = puzzlesSnap.size;
    const userCount = usersSnap.size;
    let totalCoins = 0;
    usersSnap.docs.forEach((d) => {
      const data = d.data();
      totalCoins += Number(data?.coins ?? 0);
    });

    return NextResponse.json({
      puzzleCount,
      userCount,
      totalCoins,
    });
  } catch {
    return NextResponse.json(
      { puzzleCount: 0, userCount: 0, totalCoins: 0 },
      { status: 200 }
    );
  }
}
