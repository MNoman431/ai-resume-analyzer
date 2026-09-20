'use client';

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/authService";
import { ForgotPasswordRequest, AuthResponse } from "@/types/authTypes";
import { ApiError } from "@/types/apiTypes";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {

  const { register, handleSubmit, formState: { errors } } =
    useForm<ForgotPasswordRequest>();

  const { mutate, isPending } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    ForgotPasswordRequest
  >({
    mutationFn: forgotPassword,

    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  });

  const onSubmit = (data: ForgotPasswordRequest) => mutate(data);

  return (
    <div className="h-[70vh] flex items-center justify-center bg-background transition-colors">

      <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md border border-border">

        <h2 className="text-2xl font-semibold text-center mb-4 text-foreground">
          Forgot Password
        </h2>

        <p className="text-sm text-foreground/60 text-center mb-6">
          Enter your email to receive password reset link
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full bg-background text-foreground border border-border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {errors.email?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-teal-500 transition shadow-md shadow-emerald-500/20"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

      </div>

    </div>
  );
}