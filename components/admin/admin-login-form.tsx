"use client";

import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail } from "lucide-react";

import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError("Gagal masuk. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl">Masuk Admin</CardTitle>
          <CardDescription>
            Hanya guru / admin yang memiliki akun yang dapat mengatur antrian.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
                <Mail className="h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sekolah.com"
                  className="border-0 px-0 focus-visible:ring-0"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700">
                <Lock className="h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="border-0 px-0 focus-visible:ring-0"
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              className="mt-2 w-full"
              disabled={loading || !email || !password}
            >
              {loading ? "Masuk..." : "Masuk Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

