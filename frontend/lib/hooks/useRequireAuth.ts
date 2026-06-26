"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthed, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthed) {
      router.replace("/login");
    }
  }, [authLoading, isAuthed, router]);
}
