"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  loginWithGoogle,
  register as registerUserAPI,
} from "@/services/authService";
import toast from "react-hot-toast";
import { AuthResponse, RegisterRequest } from "@/types/authTypes";
import { ApiError } from "@/types/apiTypes";
import { AxiosError } from "axios";
import Image from "next/image";
export default function RegisterForm() {
  const router = useRouter();

  // 1. React Query Mutation
  const { mutate, isPending } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    RegisterRequest
  >({
    mutationFn: registerUserAPI,

    onSuccess: (_, variables) => {
      toast.success("OTP sent! Please check your email.");
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  // 2. Form Setup (Native Validation)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = (data: RegisterRequest) => mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border border-border">
        <h2 className="text-2xl font-semibold text-center text-foreground mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm text-foreground/70 mb-1">
              Full Name
            </label>

            <input
              {...register("name", { required: "Name is required" })}
              className="w-full bg-background border border-border text-foreground rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="John Doe"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-foreground/70 mb-1">
              Email
            </label>

            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-background border border-border text-foreground rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="you@gmail.com"
            />

            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-foreground/70 mb-1">
              Password
            </label>

            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full bg-background border border-border text-foreground rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-md shadow-emerald-500/20"
            }`}
          >
            {isPending ? "Processing..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-500">
          Do you have an account?{" "}
          <span
            className="text-emerald-500 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            sign In
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-border"></div>
          <span className="mx-3 text-foreground/50 text-sm">OR</span>
          <div className="grow border-t border-border"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 border border-border bg-card text-foreground rounded-lg py-2.5 hover:bg-background transition"
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="google"
            width={300}
            height={100}
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
