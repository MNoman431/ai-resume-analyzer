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
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-slate-500 mt-2">Welcome to AI Resume Analyzer Dashboard.</p>
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
