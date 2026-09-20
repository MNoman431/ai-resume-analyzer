'use client';

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/authService";
import { ResetPasswordRequest, AuthResponse } from "@/types/authTypes";
import { ApiError } from "@/types/apiTypes";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {

  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const { register, handleSubmit, formState: { errors } } =
    useForm<ResetPasswordRequest>();

  const { mutate, isPending } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    ResetPasswordRequest
  >({
    mutationFn: (data) => resetPassword(token, data),

    onSuccess: () => {
      toast.success("Password reset successful");
      router.push("/login");
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  });

  const onSubmit = (data: ResetPasswordRequest) => mutate(data);

  return (
    <div className="h-[70vh] flex items-center justify-center bg-background transition-colors">

      <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md border border-border">

        <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              type="password"
              placeholder="New password"
              {...register("password", { required: "Password required" })}
              className="w-full bg-background text-foreground border border-border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            {errors.password?.message && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            disabled={isPending}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700"
          >
            {isPending ? "Updating..." : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}