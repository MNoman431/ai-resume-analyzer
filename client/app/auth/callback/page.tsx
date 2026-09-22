"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);
      document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
      }

      window.dispatchEvent(new Event("auth-token-synced"));
      window.location.href = "/";
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-foreground/70 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
