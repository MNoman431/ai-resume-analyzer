'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { changeCurrentPassword as changePasswordAPI } from "@/services/authService";
import { AuthResponse } from "@/types/authTypes";
import { ApiError } from "@/types/apiTypes";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

// Local type for form inputs
type ChangePasswordInputs = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordPage() {
  const router = useRouter();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ChangePasswordInputs>();

  const { mutate, isPending } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: changePasswordAPI,

    onSuccess: (res) => {
      toast.success(res.message || "Password updated successfully!");
      reset(); // Form clear kar dein
      // router.push("/profile"); // Ya dashboard par redirect karein
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  });

  const onSubmit = (data: ChangePasswordInputs) => {
    // Password match check
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    
    // API call
    mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    });
  };

  return (
    <div className="h-[85vh] flex items-center justify-center bg-background transition-colors">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-md border border-border">
        
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          Update Security Credentials
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/70">Current Password</label>
            <input
              type="password"
              {...register("oldPassword", { required: "Current password is required" })}
              className="w-full bg-background text-foreground p-2 border border-border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
            />
            {errors.oldPassword?.message && (
              <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/70">New Password</label>
            <input
              type="password"
              {...register("newPassword", { 
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
              className="w-full bg-background text-foreground p-2 border border-border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
            />
            {errors.newPassword?.message && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/70">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword", { required: "Please confirm your password" })}
              className="w-full bg-background text-foreground p-2 border border-border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="••••••••"
            />
            {errors.confirmPassword?.message && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
            }`}
          >
            {isPending ? "Updating..." : "Change Password"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-2 bg-transparent border border-border text-foreground/70 rounded hover:bg-gray-50 dark:hover:bg-slate-800 transition text-sm"
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}