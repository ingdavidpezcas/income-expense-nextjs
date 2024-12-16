"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

import client from "../api/login";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await client.authenticate({
        strategy: "local",
        email,
        password,
      });

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        router.push("/dashboard");
      } else {
        setError("Token no recibido");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Usa el mensaje del error si está disponible
      } else {
        setError("Error de autenticación"); // Fallback para errores no esperados
      }
    }
  };

  // Asegúrate de que la redirección ocurra solo en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Aquí se asegura de que el código solo se ejecute en el cliente
    }
  }, []);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <button
              type="button"
              className="cursor-pointer p-1.5 rounded-md border border-zinc-600 hover:bg-gray-300"
            >
              Login with Google
            </button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
          {error && (
            <div className="flex justify-between py-4 px-8 bg-[#fad2e1]  text-[#7c193d]">
              <p className="font-sans">{error}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
