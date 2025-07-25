import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { getUserData } from "@/handlers/auth";
import type { User } from "@/types/user";

export function useAuthUser(options?: { redirectIfNoUser?: boolean }) {
  const [user, loading] = useAuthState(auth);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      (async () => {
        const data = await getUserData(user.uid);
        setUserProfile(data);
      })();
    }
  }, [user, loading, navigate]);

  return { user, loading, userProfile };
}

