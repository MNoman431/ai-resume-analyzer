"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, CreditCard, Moon, Sun, LogOut, LogIn, UserPlus, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import LogoutButton from "./LogoutButton";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/services/userService";

const Navbar = ({ isLoggedIn = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // --- Dynamic Data Fetching for Mobile ---
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserProfile,
    enabled: isLoggedIn, // Sirf tab fetch kare jab logged in ho
  });

  const user = data?.data;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Solutions", href: "/solutions" },
    { name: "Technology", href: "/technology" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2 group z-[110]">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground italic">
              CVInsight<span className="text-emerald-500">.AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium text-foreground/70 text-sm">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-emerald-500 transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              <UserMenu isLoggedIn={isLoggedIn} />
            </div>

            {/* Hamburger Button */}
            <button
              className="md:hidden p-2.5 bg-secondary/50 rounded-xl text-foreground z-[110] border border-border"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU OVERLAY --- */}
        <div
          className={`fixed inset-0 w-full h-screen bg-background z-[105] md:hidden transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-28 px-6 pb-8 overflow-y-auto overflow-x-hidden">
            
            {/* Nav Links Section */}
            <div className="space-y-2 mb-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-4 mb-4">
                Navigation
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-secondary/30 hover:bg-secondary border border-transparent hover:border-border transition-all active:scale-[0.98]"
                >
                  <span className="text-xl font-bold text-foreground">{link.name}</span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* User Account Section */}
            <div className="mt-auto border-t border-border pt-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-4 mb-6">
                Account & Settings
              </p>
              
              {isLoggedIn ? (
                <div className="space-y-3">
                  {/* DYNAMIC PROFILE CARD */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 mb-6 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 overflow-hidden shrink-0">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isLoading ? (
                        <div className="space-y-2 animate-pulse">
                          <div className="h-4 w-24 bg-secondary rounded" />
                          <div className="h-3 w-32 bg-secondary rounded" />
                        </div>
                      ) : (
                        <>
                          <p className="font-bold text-foreground truncate text-lg capitalize">{user?.name}</p>
                          <p className="text-xs text-muted-foreground truncate font-medium">{user?.email}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <MobileMenuLink href="/profile" icon={<User size={20} />} label="My Profile" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileMenuLink href="/subscription" icon={<CreditCard size={20} />} label="Subscription" onClick={() => setIsMobileMenuOpen(false)} />
                    
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="flex items-center justify-between w-full p-4 rounded-2xl bg-secondary/50 text-foreground font-semibold active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-center gap-4">
                        {theme === "dark" ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-emerald-500" />}
                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                         <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
                      </div>
                    </button>

                    <div className="flex items-center gap-4 w-full p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold mt-4 active:scale-95 transition-transform">
                       <LogOut size={20} />
                       <LogoutButton />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                   <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border border-border font-bold text-lg active:scale-[0.98] transition-all hover:bg-secondary"
                  >
                    <LogIn size={20} /> Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
                  >
                    <UserPlus size={20} /> Get Started Free
                  </Link>
                  
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-center gap-2 w-full py-2 text-muted-foreground font-medium text-sm"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  </button>
                </div>
              )}
            </div>

            <div className="text-center mt-10 pb-6">
               <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-50">
                CVInsight.AI • Version 1.0.4
              </p>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
const MobileMenuLink = ({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 rounded-2xl bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-all text-foreground font-semibold active:scale-[0.98]"
  >
    <span className="text-emerald-500">{icon}</span>
    <span className="flex-1">{label}</span>
    <ChevronRight size={16} className="text-muted-foreground/40" />
  </Link>
);

export default Navbar;