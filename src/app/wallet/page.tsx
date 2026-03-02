"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  Timestamp,
} from "firebase/firestore";

const COINS_PER_RUPEE = 10; // 10 coins = ₹1 for display
const MIN_WITHDRAW_COINS = 100;

export default function WalletPage() {
  const { firebaseUser, firestoreUser, loading: authLoading } = useAuth();
  const [withdrawals, setWithdrawals] = useState<{ id: string; amount: number; upi: string; status: string; createdAt: unknown }[]>([]);
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const q = query(
      collection(db, "withdrawals"),
      where("uid", "==", firebaseUser.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    getDocs(q)
      .then((snap) => {
        setWithdrawals(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt,
          })) as { id: string; amount: number; upi: string; status: string; createdAt: unknown }[]
        );
      })
      .catch(() => setLoadErr("Failed to load withdrawals"));
  }, [firebaseUser?.uid]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser?.uid || !firestoreUser) return;
    const coins = Math.floor(Number(amount));
    if (coins < MIN_WITHDRAW_COINS) {
      setLoadErr(`Minimum withdrawal is ${MIN_WITHDRAW_COINS} coins`);
      return;
    }
    if (coins > firestoreUser.coins) {
      setLoadErr("Insufficient balance");
      return;
    }
    if (!upi.trim()) {
      setLoadErr("Enter UPI ID");
      return;
    }
    setLoadErr("");
    setSubmitting(true);
    try {
      await addDoc(collection(db, "withdrawals"), {
        uid: firebaseUser.uid,
        amount: coins,
        upi: upi.trim(),
        status: "pending",
        createdAt: Timestamp.now(),
      });
      setAmount("");
      setUpi("");
      setWithdrawals((prev) => [
        {
          id: "new",
          amount: coins,
          upi: upi.trim(),
          status: "pending",
          createdAt: new Date(),
        },
        ...prev,
      ]);
    } catch {
      setLoadErr("Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !firebaseUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>
              {firebaseUser ? "Loading..." : "Please log in to view your wallet."}
            </CardDescription>
          </CardHeader>
          {!firebaseUser && (
            <CardContent>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  const coins = firestoreUser?.coins ?? 0;
  const approxRupee = (coins / COINS_PER_RUPEE).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Wallet</h1>
          <p className="text-xl text-blue-100">
            Your balance and withdrawal requests
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Coins earned from puzzles and referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{coins} coins</p>
            <p className="text-slate-600 mt-1">≈ ₹{approxRupee} (for withdrawal)</p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Withdraw</CardTitle>
            <CardDescription>
              Minimum {MIN_WITHDRAW_COINS} coins. Payout via UPI (processed by admin).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (coins)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={MIN_WITHDRAW_COINS}
                  max={coins}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`e.g. ${MIN_WITHDRAW_COINS}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upi">UPI ID</Label>
                <Input
                  id="upi"
                  type="text"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  placeholder="yourname@upi"
                />
              </div>
              {loadErr && (
                <p className="text-sm text-red-600">{loadErr}</p>
              )}
              <Button type="submit" disabled={submitting || coins < MIN_WITHDRAW_COINS}>
                {submitting ? "Submitting..." : "Request Withdrawal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Recent requests</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-slate-600">No withdrawals yet.</p>
            ) : (
              <ul className="space-y-2">
                {withdrawals.map((w) => (
                  <li
                    key={w.id}
                    className="flex justify-between items-center py-2 border-b border-border last:border-0"
                  >
                    <span>{w.amount} coins → {w.upi}</span>
                    <span
                      className={
                        w.status === "paid"
                          ? "text-green-600"
                          : w.status === "rejected"
                            ? "text-red-600"
                            : "text-amber-600"
                      }
                    >
                      {w.status}
                    </span>
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
