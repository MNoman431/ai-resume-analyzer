// "use client";
// import React, { useState } from "react";
// import { Check, Loader2 } from "lucide-react";
// import { useMutation } from "@tanstack/react-query";
// import { createCheckoutSession } from "@/services/stripeService";
// import { toast } from "react-hot-toast";

// export default function Pricing() {
//   const plans = [
//     {
//       id: "free",
//       name: "Standard",
//       price: "0",
//       features: ["3 Scans", "Keyword Suggestions"],
//       popular: false,
//       buttonText: "Current Plan",
//     },
//     {
//       id: "silver",
//       name: "Pro (Silver)",
//       price: "20",
//       features: ["50 Scans", "ATS Score", "AI Bullet-Points", "24/7 Support"],
//       popular: true,
//       buttonText: "Upgrade to Silver",
//     },
//     {
//       id: "gold",
//       name: "Team (Gold)",
//       price: "20",
//       features: ["100 Scans", "Collaborative Editing", "Custom Branding"],
//       popular: false,
//       buttonText: "Upgrade to Gold",
//     },
//   ];

//   const [clickedPlanId, setClickedPlanId] = useState<string | null>(null);
//   // React Query Mutation
//   const { mutate, isPending } = useMutation({
//     mutationFn: createCheckoutSession,
//     onSuccess: (response) => {
//       if (response.data?.url) {
//         window.location.href = response.data.url; // Redirect to Stripe
//       }
//     },
//     onError: (error: any) => {
//       setClickedPlanId(null);
//       const errMsg = error.response?.data?.message || "Something went wrong";
//       toast.error(errMsg);
//     },
//   });

//   const handleSubscription = (planId: string) => {
//     if (planId === "free") return;
//     setClickedPlanId(planId);
//     mutate({ planType: planId as "silver" | "gold" });
//   };

//   return (
//     <div className="min-h-screen bg-background pt-5 pb-20 px-6">
//       <div className="max-w-5xl mx-auto text-center mb-16">
//         <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">
//           Simple <span className="text-blue-600">Pricing.</span>
//         </h1>
//         <p className="text-xl text-slate-500">
//           Stop paying for applications. Start paying for results.
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
//         {plans.map((plan, i) => (
//           <div
//             key={i}
//             className={`p-8 rounded-[2.5rem] border flex flex-col transition-all duration-300 ${plan.popular ? "border-blue-600 bg-card shadow-2xl scale-105" : "border-border bg-background"}`}
//           >
//             <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
//             <div className="mb-6">
//               <span className="text-5xl font-black">${plan.price}</span>
//               <span className="text-slate-500">/mo</span>
//             </div>
//             <ul className="space-y-4 mb-10 grow">
//               {plan.features.map((f, idx) => (
//                 <li
//                   key={idx}
//                   className="flex items-center gap-3 font-medium text-red-900 dark:text-slate-300 italic"
//                 >
//                   <Check size={18} className="text-blue-600" /> {f}
//                 </li>
//               ))}
//             </ul>

//             <button
//               onClick={() => handleSubscription(plan.id)}
//               disabled={isPending || plan.id === "free"}
//               className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
//                 plan.popular
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-foreground text-background hover:opacity-90"
//               }`}
//             >
//               {/* 4. SIRF us button mein loader dikhayen jiski ID match karti ho */}
//               {clickedPlanId === plan.id ? (
//                 <Loader2 className="animate-spin" size={20} />
//               ) : (
//                 plan.buttonText
//               )}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCheckoutSession } from "@/services/stripeService";
import { getCurrentUserProfile } from "@/services/userService";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios"; // Error type ke liye import

export default function Pricing() {
  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getCurrentUserProfile,
  });

  const currentActivePlan = userProfile?.data?.plan || "free";

  // Plans array with order to determine upgrade/downgrade
  const plans = [
    {
      id: "free",
      name: "Standard",
      price: "0",
      features: ["3 Scans", "Keyword Suggestions"],
      rank: 0,
    },
    {
      id: "silver",
      name: "Pro (Silver)",
      price: "20",
      features: ["50 Scans", "ATS Score", "AI Bullet-Points", "24/7 Support"],
      rank: 1,
    },
    {
      id: "gold",
      name: "Team (Gold)",
      price: "50",
      features: ["100 Scans", "Collaborative Editing", "Custom Branding"],
      rank: 2,
    },
  ];

  const [clickedPlanId, setClickedPlanId] = useState<string | null>(null);

  // TypeScript Error fix (any ki jagah AxiosError use kiya)
  const { mutate, isPending } = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (response) => {
      if (response.data?.url) window.location.href = response.data.url;
    },
    onError: (error: unknown) => {
      setClickedPlanId(null);
      let errMsg = "Something went wrong";
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || errMsg;
      }
      toast.error(errMsg);
    },
  });

  const handleSubscription = (planId: string) => {
    if (planId === "free" || planId === currentActivePlan) return;
    setClickedPlanId(planId);
    mutate({ planType: planId as "silver" | "gold" });
  };

  // Helper function to get button text dynamically
  const getButtonText = (planId: string, planRank: number) => {
    const userPlanRank =
      plans.find((p) => p.id === currentActivePlan)?.rank || 0;

    if (planId === currentActivePlan) return "Plan Active";
    if (planId === "free") return "Free Plan";
    if (planRank < userPlanRank) return `Downgrade to ${planId}`;
    return `Upgrade to ${planId}`;
  };

  return (
    <div className="min-h-screen bg-background pt-10 pb-20 px-6">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight italic">
          Simple <span className="text-emerald-500">Pricing.</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Choose the plan that fits your career goals.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-center">
        {plans.map((plan, i) => {
          const isActive = currentActivePlan === plan.id;
          const buttonLabel = getButtonText(plan.id, plan.rank);

          return (
            <div
              key={i}
              className={`relative p-8 rounded-[2.8rem] border-2 transition-all duration-500 flex flex-col h-full
                ${
                  isActive
                    ? "border-emerald-500 bg-card shadow-[0_20px_50px_rgba(16,185,129,0.15)] scale-105 z-10"
                    : "border-border bg-background hover:border-slate-300 scale-100"
                }`}
            >
              {isActive && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles size={14} /> Active Plan
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-8 mt-2">
                <span className="text-6xl font-black tracking-tighter">
                  ${plan.price}
                </span>
                <span className="text-slate-500 text-lg">/mo</span>
              </div>

              <ul className="space-y-5 mb-12 grow">
                {plan.features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 font-semibold text-slate-600 dark:text-slate-300 italic leading-tight"
                  >
                    <div
                      className={`mt-1 rounded-full p-0.5 ${isActive ? "bg-emerald-500/10" : "bg-slate-100"}`}
                    >
                      <Check size={16} className="text-emerald-500" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscription(plan.id)}
                disabled={
                  isPending || plan.id === "free" || isActive || isUserLoading
                }
                className={`w-full py-5 rounded-[1.8rem] font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isActive
                      ? "bg-slate-100 text-slate-400 border border-slate-200"
                      : plan.id === "free"
                        ? "bg-slate-200 text-slate-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:from-emerald-600 hover:to-teal-500 hover:shadow-xl shadow-emerald-500/20"
                  }`}
              >
                {isPending && clickedPlanId === plan.id ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  buttonLabel // Dynamic Upgrade/Downgrade text
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
