"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

import {
  Puzzle,
  LayoutDashboard,
  BookOpen,
  LogIn,
  LogOut,
  User,
  Wallet,
  Trophy,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { signOut } from "@/lib/auth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { firebaseUser, firestoreUser, loading } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const isActive = (path: string) => pathname === path;
  const isAdmin = firestoreUser?.role === "admin";

  return (
    <nav className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Puzzle className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PuzzleHub
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 ${isActive("/") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </Link>
            <Link
              href="/puzzles"
              className={`flex items-center gap-2 ${isActive("/puzzles") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <Puzzle className="w-4 h-4" />
              Puzzles
            </Link>
            <Link
              href="/leaderboard"
              className={`flex items-center gap-2 ${isActive("/leaderboard") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
            {firestoreUser && (
              <Link
                href="/create-blog"
                className={`flex items-center gap-2 ${isActive("/create-blog") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
              >
                Create Blog
              </Link>
            )}
            {firestoreUser && (
              <Link
                href="/create-puzzle"
                className={`flex items-center gap-2 ${isActive("/create-puzzle") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
              >
                Create Puzzle
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 ${isActive("/admin") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <span className="text-sm text-slate-500">Loading...</span>
            ) : firebaseUser && firestoreUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/wallet"
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="font-medium">{firestoreUser.coins} coins</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600"
                >
                  <User className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">{firestoreUser.email}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-1" />
                    Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
