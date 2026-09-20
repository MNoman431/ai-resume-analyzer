"use client";

import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPaymentHistory, createCustomerPortal } from "@/services/stripeService";
import { CreditCard, ExternalLink, CheckCircle2, Clock, ArrowLeftRight, ReceiptText } from "lucide-react";
import toast from "react-hot-toast";

// --- Types Definition (Best Practice: Avoid 'any') ---
interface PaymentRecord {
  _id: string;
  planType: string;
  amount: number;
  currency: string;
  createdAt: string;
  status: string;
}

interface StripeError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const SubscriptionItem = () => {
  // 1. Fetch Payment History
  const { data: payments, isLoading } = useQuery<PaymentRecord[]>({
    queryKey: ["paymentHistory"],
    queryFn: getPaymentHistory,
  });

  // 2. Mutation for Stripe Portal
  const { mutate: openPortal, isPending: isPortalLoading } = useMutation({
    mutationFn: createCustomerPortal,
    onSuccess: (res) => {
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    },
    onError: (error: StripeError) => {
      const msg = error.response?.data?.message || "Could not open billing portal";
      toast.error(msg);
    },
  });

  if (isLoading) return <div className="h-64 flex items-center justify-center animate-pulse bg-secondary/20 rounded-[2.5rem]" />;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* --- MANAGE SUBSCRIPTION CARD --- */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-6 md:p-8 text-white shadow-2xl shadow-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-2xl font-black flex items-center justify-center md:justify-start gap-3">
              <CreditCard size={28} /> Billing Dashboard
            </h2>
            <p className="text-emerald-100 text-sm max-w-xs leading-relaxed opacity-90">
              Manage your subscription, update payment methods, and download past invoices securely.
            </p>
          </div>
          
          <button
            onClick={() => openPortal()}
            disabled={isPortalLoading}
            className="w-full md:w-auto group flex items-center justify-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all active:scale-95 disabled:opacity-70"
          >
            {isPortalLoading ? (
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Billing Portal
                <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      {/* --- PAYMENT HISTORY SECTION --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ReceiptText size={20} className="text-emerald-500" /> Transaction History
          </h3>
          <span className="text-[10px] font-bold px-3 py-1 bg-secondary rounded-full border border-border uppercase tracking-widest">
            {payments?.length || 0} Records
          </span>
        </div>

        {/* --- MOBILE: CARD VIEW (Visible on Small Screens) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment._id} className="bg-card border border-border p-5 rounded-3xl space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner
                      ${payment.planType === 'gold' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {payment.planType[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold capitalize text-foreground">{payment.planType} Plan</p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 size={10} /> {payment.status}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Total Paid</span>
                  <span className="font-mono font-black text-lg">
                    {payment.amount.toLocaleString('en-US', { style: 'currency', currency: payment.currency || 'USD' })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* --- DESKTOP: TABLE VIEW (Hidden on Mobile) --- */}
        <div className="hidden md:block bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-secondary/30 border-b border-border text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              <tr>
                <th className="px-6 py-5">Plan</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {payments && payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] uppercase 
                          ${payment.planType === 'gold' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          {payment.planType[0]}
                        </div>
                        <span className="font-bold capitalize">{payment.planType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">
                      {payment.amount.toLocaleString('en-US', { style: 'currency', currency: payment.currency || 'USD' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                        <CheckCircle2 size={12} /> {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}><EmptyState /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-50 pt-4">
        Enterprise-grade security by Stripe 💳
      </p>
    </div>
  );
};

// --- Reusable Empty State Component ---
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
    <ArrowLeftRight size={48} strokeWidth={1.5} />
    <div>
      <p className="font-black text-lg uppercase tracking-widest">No History</p>
      <p className="text-sm font-medium">Your transactions will appear here.</p>
    </div>
  </div>
);

export default SubscriptionItem;