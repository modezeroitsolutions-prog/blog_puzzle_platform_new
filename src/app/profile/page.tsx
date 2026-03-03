"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  Mail,
  Coins,
  Trophy,
  BookOpen,
  Wallet,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { firebaseUser, firestoreUser, loading } = useAuth();
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!firebaseUser || !firestoreUser) {
    router.replace("/login");
    return null;
  }

  const copyReferralCode = () => {
    if (!firestoreUser.referralCode) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${firestoreUser.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="mb-6 -ml-2 text-white/90 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
              <p className="text-blue-100 mt-0.5">{firestoreUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-slate-500">Email</span>
                <p className="font-medium">{firestoreUser.email}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500">Member since</span>
                <p className="font-medium">
                  {firestoreUser.createdAt
                    ? new Date(firestoreUser.createdAt.toMillis()).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )
                    : "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Rewards
              </CardTitle>
              <CardDescription>Coins and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Coins</span>
                <span className="text-xl font-bold text-green-600">
                  {firestoreUser.coins}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">XP</span>
                <span className="text-xl font-bold text-blue-600">
                  {firestoreUser.xp}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Level</span>
                <span className="text-xl font-bold text-purple-600">
                  {firestoreUser.level}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href="/wallet">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Referral
              </CardTitle>
              <CardDescription>
                Share your referral link to invite friends and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              {firestoreUser.referralCode ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    readOnly
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/signup?ref=${firestoreUser.referralCode}`
                        : ""
                    }
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-muted/50"
                  />
                  <Button
                    variant="outline"
                    onClick={copyReferralCode}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "Copied!" : "Copy link"}
                  </Button>
                </div>
              ) : (
                <p className="text-slate-600 text-sm">No referral code</p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                My content
              </CardTitle>
              <CardDescription>Blogs you’ve written</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/user/${firebaseUser.uid}`}>View my blogs</Link>
              </Button>
              <Button asChild>
                <Link href="/create-blog">Create blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
