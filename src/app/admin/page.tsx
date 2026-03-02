"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getBlogs, deleteBlog, deleteBlogs } from "@/lib/blogs";
import {
  Users,
  DollarSign,
  Puzzle,
  TrendingUp,
  Search,
  ArrowLeft,
  Ban,
  UserCheck,
  Mail,
  Trash2,
} from "lucide-react";

type UserRow = {
  id: string;
  email: string;
  coins: number;
  xp: number;
  role: string;
  registeredDate?: string;
  puzzlesCreated?: number;
  puzzlesSolved?: number;
};

type WithdrawalRow = {
  id: string;
  uid: string;
  amount: number;
  upi: string;
  status: string;
};

type BlogRow = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  authorId?: string;
  createdAt?: { toMillis: () => number };
};

export default function AdminDashboardPage() {
  const { firestoreUser, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [puzzleCount, setPuzzleCount] = useState(0);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [selectedBlogIds, setSelectedBlogIds] = useState<Set<string>>(new Set());
  const [blogsDeleting, setBlogsDeleting] = useState(false);

  const isAdmin = firestoreUser?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    getDocs(collection(db, "users"))
      .then((snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserRow)));
      })
      .catch(() => setUsers([]));
    getDocs(collection(db, "withdrawals"))
      .then((snap) => {
        setWithdrawals(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WithdrawalRow)));
      })
      .catch(() => setWithdrawals([]));
    getDocs(collection(db, "puzzles"))
      .then((snap) => setPuzzleCount(snap.size))
      .catch(() => setPuzzleCount(0));
    getBlogs(100)
      .then((list) =>
        setBlogs(
          list.map((p) => ({
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            author: p.author,
            authorId: p.authorId,
            createdAt: p.createdAt,
          }))
        )
      )
      .catch(() => setBlogs([]));
  }, [isAdmin]);

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be an admin to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const totalEarnings = users.reduce((sum, u) => sum + (u.coins ?? 0), 0);
  const totalPuzzles = puzzleCount;
  const avgCoins = totalUsers ? totalEarnings / totalUsers : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl text-blue-100">
            Manage users, track earnings, and oversee platform activity
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-slate-600 mt-1">Registered members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Coins (users)
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalEarnings} coins
              </div>
              <p className="text-xs text-slate-600 mt-1">Across all users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Puzzles</CardTitle>
              <Puzzle className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPuzzles}</div>
              <p className="text-xs text-slate-600 mt-1">Created by users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Coins per user
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgCoins.toFixed(0)}
              </div>
              <p className="text-xs text-slate-600 mt-1">Per user</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <Tabs defaultValue="users" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">User Management</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="users" className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>UID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Coins</TableHead>
                        <TableHead className="text-right">XP</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-xs">{user.id.slice(0, 8)}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                            >
                              {user.role ?? "user"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {user.coins ?? 0}
                          </TableCell>
                          <TableCell className="text-right">
                            {user.xp ?? 0}
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Manage
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Manage User: {user.email}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Perform administrative actions for this user
                                    account
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-sm">
                                      User Details
                                    </h4>
                                    <div className="text-sm space-y-1">
                                      <p>
                                        <span className="text-slate-600">UID:</span>{" "}
                                        {user.id}
                                      </p>
                                      <p>
                                        <span className="text-slate-600">Email:</span>{" "}
                                        {user.email}
                                      </p>
                                      <p>
                                        <span className="text-slate-600">Role:</span>{" "}
                                        {user.role ?? "user"}
                                      </p>
                                      <p>
                                        <span className="text-slate-600">Coins:</span>{" "}
                                        {user.coins ?? 0}
                                      </p>
                                      <p>
                                        <span className="text-slate-600">XP:</span>{" "}
                                        {user.xp ?? 0}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2 pt-4 border-t border-border">
                                    <h4 className="font-medium text-sm mb-3">
                                      Actions
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                      <Button variant="outline" className="w-full justify-start">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={async () => {
                                          await updateDoc(doc(db, "users", user.id), {
                                            role: user.role === "admin" ? "user" : "admin",
                                          });
                                          setUsers((prev) =>
                                            prev.map((u) =>
                                              u.id === user.id
                                                ? { ...u, role: u.role === "admin" ? "user" : "admin" }
                                                : u
                                            )
                                          );
                                        }}
                                      >
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        {user.role === "admin"
                                          ? "Remove Admin"
                                          : "Make Admin"}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="w-full justify-start text-red-600 hover:text-red-700"
                                      >
                                        <Ban className="w-4 h-4 mr-2" />
                                        Suspend Account
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-slate-500 pt-4 border-t border-border">
                                    Note: These are demo actions and won&apos;t
                                    actually modify the user account.
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="withdrawals" className="space-y-4">
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>UID</TableHead>
                        <TableHead>Coins</TableHead>
                        <TableHead>UPI</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-mono text-xs">{w.uid?.slice(0, 8)}</TableCell>
                          <TableCell>{w.amount}</TableCell>
                          <TableCell>{w.upi}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                w.status === "paid"
                                  ? "default"
                                  : w.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {w.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {w.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={async () => {
                                    await updateDoc(doc(db, "withdrawals", w.id), {
                                      status: "approved",
                                    });
                                    setWithdrawals((prev) =>
                                      prev.map((x) =>
                                        x.id === w.id ? { ...x, status: "approved" } : x
                                      )
                                    );
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={async () => {
                                    await updateDoc(doc(db, "withdrawals", w.id), {
                                      status: "rejected",
                                    });
                                    setWithdrawals((prev) =>
                                      prev.map((x) =>
                                        x.id === w.id ? { ...x, status: "rejected" } : x
                                      )
                                    );
                                  }}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-slate-500">
                  Approving updates status only. Actual payout should be triggered by a Cloud Function (Razorpay) using the secret key.
                </p>
              </TabsContent>

              <TabsContent value="blogs" className="space-y-4">
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={blogs.length > 0 && selectedBlogIds.size === blogs.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedBlogIds(new Set(blogs.map((b) => b.id)));
                        else setSelectedBlogIds(new Set());
                      }}
                      className="rounded border-slate-300"
                    />
                    Select all
                  </label>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={selectedBlogIds.size === 0 || blogsDeleting}
                    onClick={async () => {
                      if (selectedBlogIds.size === 0) return;
                      if (!confirm(`Delete ${selectedBlogIds.size} selected blog(s)?`)) return;
                      setBlogsDeleting(true);
                      try {
                        await deleteBlogs(Array.from(selectedBlogIds));
                        setBlogs((prev) => prev.filter((b) => !selectedBlogIds.has(b.id)));
                        setSelectedBlogIds(new Set());
                      } catch {
                        alert("Failed to delete some blogs.");
                      } finally {
                        setBlogsDeleting(false);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {blogsDeleting ? "Deleting..." : `Delete selected (${selectedBlogIds.size})`}
                  </Button>
                </div>
                <div className="rounded-md border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <span className="sr-only">Select</span>
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                            No blogs yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        blogs.map((blog) => (
                          <TableRow key={blog.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedBlogIds.has(blog.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedBlogIds((s) => new Set([...s, blog.id]));
                                  else setSelectedBlogIds((s) => { const n = new Set(s); n.delete(blog.id); return n; });
                                }}
                                className="rounded border-slate-300"
                              />
                            </TableCell>
                            <TableCell>
                              <span className="font-medium line-clamp-1">{blog.title}</span>
                              {blog.excerpt && (
                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{blog.excerpt}</p>
                              )}
                            </TableCell>
                            <TableCell>{blog.author}</TableCell>
                            <TableCell>
                              {blog.createdAt
                                ? new Date(blog.createdAt.toMillis()).toLocaleDateString()
                                : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                disabled={blogsDeleting}
                                onClick={async () => {
                                  if (!confirm("Delete this blog?")) return;
                                  setBlogsDeleting(true);
                                  try {
                                    await deleteBlog(blog.id);
                                    setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
                                    setSelectedBlogIds((s) => { const n = new Set(s); n.delete(blog.id); return n; });
                                  } catch {
                                    alert("Failed to delete blog.");
                                  } finally {
                                    setBlogsDeleting(false);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">User Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Users</span>
                        <span className="font-semibold">{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Puzzles</span>
                        <span className="font-semibold">{puzzleCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Pending Withdrawals</span>
                        <span className="font-semibold">
                          {withdrawals.filter((w) => w.status === "pending").length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top by coins</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {users
                        .filter((u) => u.role !== "admin")
                        .sort((a, b) => (b.coins ?? 0) - (a.coins ?? 0))
                        .slice(0, 3)
                        .map((user, index) => (
                          <div
                            key={user.id}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{index + 1}</Badge>
                              <span className="truncate">{user.email}</span>
                            </div>
                            <span className="font-semibold text-green-600">
                              {user.coins ?? 0} coins
                            </span>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/admin/users">Manage Users</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/admin/puzzles">Manage Puzzles</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/admin/blogs">Manage Blogs</Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/admin/withdrawals">Withdrawals</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
