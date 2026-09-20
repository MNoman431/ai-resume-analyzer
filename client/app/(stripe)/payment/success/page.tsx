"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { verifyPaymentSession } from "@/services/stripeService";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/pricing");
    } else {
      verifyPaymentSession(sessionId).catch((err) => {
        console.error("Payment verification sync error:", err);
      });
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
  {/* Background Decor */}
  <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-emerald-600/10 blur-[100px] rounded-full" />
  <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-emerald-400/10 blur-[100px] rounded-full" />

  <motion.div 
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    // Fixed height hata di taake content ke mutabiq adjust ho, max-w-md se box thora chota kiya
    className="relative z-10 bg-card border border-border p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center max-w-md w-full"
  >
    {/* Animated Check Icon - Size thora optimized kiya */}
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      className="flex justify-center mb-6"
    >
      <div className="bg-emerald-600 p-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] relative">
        <Check size={36} className="text-white stroke-[4px]" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1 -right-1 text-emerald-400"
        >
          <Sparkles size={20} />
        </motion.div>
      </div>
    </motion.div>

    {/* Success Typography - Balanced spacing */}
    <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter italic leading-none">
      Payment <span className="text-emerald-600">Success!</span>
    </h1>

    <p className="text-base text-slate-500 dark:text-slate-400 mb-8 font-medium px-2">
      Your account has been upgraded. Start using your premium features right now.
    </p>

    {/* Action Buttons - Py-4 se height control ki */}
    <div className="space-y-3">
      <button
        onClick={() => router.push("/subscription")}
        className="group w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
      >
        Visit your subscription
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <button
        onClick={() => router.push("/")}
        className="w-full bg-transparent text-slate-400 hover:text-foreground py-1 text-sm font-bold transition-colors"
      >
        Back to Home
      </button>
    </div>
  </motion.div>
</div>
  );
}