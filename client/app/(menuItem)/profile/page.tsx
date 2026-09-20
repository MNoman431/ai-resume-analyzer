"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/services/userService";
import {
  // User,
  Mail,
  Zap,
  Calendar,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
// import toast from "react-hot-toast";
import Image from "next/image";

export default function ProfileItem() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes tak data fresh rahega
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500">
        Failed to load profile. Please try again.
      </div>
    );
  }

  const user = data.data;

  // Percentage for progress bar
  const usagePercentage = Math.min(
    (user.analysisCount / user.maxLimit) * 100,
    100,
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Profile Card */}
      <div className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
        {/* Background Decorative Blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-4xl overflow-hidden border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <Image
                width={100}
                height={100}
                src={
                  user.avatar || "https://ui-avatars.com/api/?name=" + user.name
                }
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            {user.plan === "gold" && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white p-2 rounded-xl shadow-lg">
                <Zap size={16} fill="white" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h2 className="text-3xl font-black tracking-tight text-foreground capitalize">
                {user.name}
              </h2>
              <div className="flex items-center justify-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck size={12} /> {user.role}
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
              <Mail size={16} />
              <span className="text-sm font-medium">{user.email}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary font-bold text-sm">
              <Zap size={16} className="text-yellow-500" fill="currentColor" />
              <span className="capitalize">{user.plan} Plan</span>
            </div>
          </div>
        </div>

        {/* Usage Stats Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-3xl bg-secondary/30 border border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Analysis Usage
              </span>
              <BarChart3 size={18} className="text-emerald-500" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black">{user.analysisCount}</span>
              <span className="text-muted-foreground font-bold mb-1">
                / {user.maxLimit}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-1000"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="mt-3 text-[10px] font-bold text-muted-foreground uppercase">
              {user.maxLimit - user.analysisCount} scans remaining
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-secondary/30 border border-border flex flex-col justify-between">
  <div className="flex items-center justify-between">
    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
      Plan Expiry
    </span>
    <Calendar size={18} className="text-emerald-500" />
  </div>
  <div>
    <p className="text-xl font-bold mt-2">
      {user.plan === "free" ? (
        "Life Time" // Agar free plan hai to "Lifetime" ya "No Expiry" dikhayen
      ) : user.planExpiry ? (
        new Date(user.planExpiry).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      ) : (
        "N/A"
      )}
    </p>
    <p className="text-xs text-muted-foreground mt-1">
      {user.plan === "free" ? "Free Forever" : "Renews automatically"}
    </p>
  </div>
</div>
        </div>
      </div>

      {/* Account Details List */}
      <div className="bg-card border border-border rounded-3xl p-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <span className="text-sm font-bold opacity-60">Member Since</span>
          <span className="font-semibold">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="text-sm font-bold opacity-60">Stripe ID</span>
          <span className="font-mono text-xs bg-secondary px-2 py-1 rounded truncate max-w-37.5">
            {user.stripeCustomerId || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
