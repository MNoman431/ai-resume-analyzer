"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, CreditCard, Moon, Sun, LogOut, ChevronDown, LogIn, UserPlus, Loader2, History, Lock } from "lucide-react";
import { useTheme } from "next-themes";
import LogoutButton from "./LogoutButton";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/services/userService";

interface UserMenuProps {
  isLoggedIn?: boolean;
}

const UserMenu = ({ isLoggedIn = false }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // --- Dynamic Data Fetching ---
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserProfile,
    enabled: isLoggedIn, // Sirf tab fetch kare jab user logged in ho
  });

  const user = data?.data;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-secondary transition-all border border-border bg-background"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-inner">
          {isLoggedIn ? (
            user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              // Name initials (e.g., Mujtaba Abid -> MA)
              user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"
            )
          ) : (
            <User size={16} />
          )}
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl py-2 z-[150] animate-in fade-in zoom-in duration-200">
          {isLoggedIn ? (
            <>
              {/* --- Dynamic Header --- */}
              <div className="px-4 py-3 border-b border-border mb-2">
                {isLoading ? (
                  <div className="flex items-center gap-2 animate-pulse">
                    <div className="h-4 w-24 bg-secondary rounded" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-bold truncate text-foreground capitalize">{user?.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate font-medium">{user?.email}</p>
                  </>
                )}
              </div>

              <div className="px-2 space-y-1">
                <MenuLink
                  href="/profile"
                  icon={<User size={16} />}
                  label="My Profile"
                  onClick={() => setIsOpen(false)}
                />
                <MenuLink
                  href="/subscription"
                  icon={<CreditCard size={16} />}
                  label="Subscription"
                  onClick={() => setIsOpen(false)}
                />
                <MenuLink
                  href="/analysisHistory"
                  icon={<History size={16} />}
                  label="Analysis History"
                  onClick={() => setIsOpen(false)}
                />
                <MenuLink
                  href="/changeCurrentPassword"
                  icon={<Lock size={16} />}
                  label="Change Password"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <div className="border-t border-border mt-2 pt-2 px-2">
                <ThemeToggle theme={theme} setTheme={setTheme} />
                <div className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm font-bold rounded-xl hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer group">
                  <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                  <LogoutButton />
                </div>
              </div>
            </>
          ) : (
            <div className="px-2 py-2 space-y-1">
               <MenuLink href="/login" icon={<LogIn size={16} />} label="Sign In" onClick={() => setIsOpen(false)} />
               <MenuLink href="/register" icon={<UserPlus size={16} />} label="Create Account" onClick={() => setIsOpen(false)} />
               <div className="border-t border-border mt-2 pt-2">
                  <ThemeToggle theme={theme} setTheme={setTheme} />
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable Theme Toggle
const ThemeToggle = ({ theme, setTheme }: { theme: string | undefined; setTheme: (theme: string) => void }) => (
  <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-secondary transition-colors text-foreground/80"
  >
    {theme === "dark" ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-emerald-500" />}
    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
  </button>
);

// MenuLink with fixed Icon type
const MenuLink = ({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all text-foreground/80"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default UserMenu;