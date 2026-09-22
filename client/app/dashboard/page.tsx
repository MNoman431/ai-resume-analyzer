"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyPaymentSession } from "@/services/stripeService";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentStatus = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (paymentStatus === "success" && sessionId) {
      verifyPaymentSession(sessionId)
        .then(() => {
          router.push("/payment/success?session_id=" + sessionId);
        })
        .catch((err) => {
          console.error("Error verifying payment session:", err);
          router.push("/payment/success?session_id=" + sessionId);
        });
    }
  }, [paymentStatus, sessionId, router]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pt-28 space-y-8 animate-in fade-in duration-500">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-8 md:p-12 text-white shadow-xl shadow-emerald-500/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
            User Dashboard
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Welcome to CVInsight<span className="text-emerald-200">.AI</span>
          </h1>
          <p className="text-emerald-100 text-sm md:text-base font-medium">
            Optimize your resume, beat the ATS filters, and land more interview calls with precision AI insights.
          </p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => router.push("/")}
          className="group p-6 bg-card border border-border hover:border-emerald-500 rounded-3xl cursor-pointer transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-2xl mb-4 group-hover:scale-110 transition-transform">
            📄
          </div>
          <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Scan New Resume
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Upload your resume PDF to perform an instant AI-powered ATS audit.
          </p>
        </div>

        <div
          onClick={() => router.push("/analysisHistory")}
          className="group p-6 bg-card border border-border hover:border-emerald-500 rounded-3xl cursor-pointer transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-2xl mb-4 group-hover:scale-110 transition-transform">
            📊
          </div>
          <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Analysis History
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Review your past resume scores, match breakdowns, and improvement tips.
          </p>
        </div>

        <div
          onClick={() => router.push("/subscription")}
          className="group p-6 bg-card border border-border hover:border-emerald-500 rounded-3xl cursor-pointer transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 active:scale-[0.99]"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-2xl mb-4 group-hover:scale-110 transition-transform">
            💳
          </div>
          <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Manage Subscription
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Upgrade your plan, review payment transactions, or increase scan limits.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
