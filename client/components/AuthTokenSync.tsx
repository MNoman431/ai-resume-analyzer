"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthTokenSync() {
  const searchParams = useSearchParams();

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

      // Remove tokens from URL query parameters cleanly
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("accessToken");
      url.searchParams.delete("refreshToken");
      const cleanUrl = url.pathname + (url.search ? url.search : "") + url.hash;
      window.history.replaceState({}, document.title, cleanUrl);

      // Notify Navbar, UserMenu, etc. that user auth tokens are ready
      window.dispatchEvent(new Event("auth-token-synced"));
    }
  }, [searchParams]);

  return null;
}
