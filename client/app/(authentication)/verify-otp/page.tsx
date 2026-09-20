'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { verifyOtp as verifyOtpAPI } from "@/services/authService";
import { VerifyOtpRequest, AuthResponse } from "@/types/authTypes";
import { ApiError } from "@/types/apiTypes";
import { AxiosError } from "axios";
import toast from 'react-hot-toast';
import OTPInput from '@/components/OTPInput';

export default function VerifyOtpPage() {

  const searchParams = useSearchParams();
  const router = useRouter();

  // URL se email nikalna
  const emailFromUrl = searchParams.get('email') || "";

  // React Hook Form (typed)
  const { register, handleSubmit,setValue, formState: { errors } } = useForm<VerifyOtpRequest>({
    defaultValues: {
      email: emailFromUrl,
      otp: ""
    }
  });

  // React Query Mutation (typed)
  const { mutate, isPending } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    VerifyOtpRequest
  >({
    mutationFn: verifyOtpAPI,

    onSuccess: () => {
      toast.success("Email verified! You can now login.");
      router.push('/login');
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    }
  });

  const onSubmit = (data: VerifyOtpRequest) => mutate(data);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-card rounded-lg shadow-lg border border-border transition-colors">

      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
        Verify Your Email
      </h2>

      <p className="text-sm text-foreground/60 mb-8 text-center">
        we send an otp on this
        <span className="font-semibold text-emerald-600">
          {" "} {emailFromUrl}
        </span>
      </p>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  {/* Hidden Email Field */}
  <input type="hidden" {...register("email")} />

  <div>
    <label className="block text-sm font-medium text-foreground/70 mb-2 text-center">
      Enter 6-Digit OTP
    </label>

    <OTPInput register={register} setValue={setValue} />

    {errors.otp?.message && (
      <p className="text-red-500 text-xs mt-2 text-center">
        {errors.otp.message}
      </p>
    )}
  </div>

  <button
    type="submit"
    disabled={isPending}
    className={`w-full py-3 rounded-lg text-white font-bold transition-all shadow-md ${
      isPending
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
    }`}
  >
    {isPending ? "Verifying..." : "Verify OTP"}
  </button>
</form>
      <div className="mt-6 text-center border-t border-border pt-4">
        <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition">
          Resend OTP?
        </button>
      </div>

    </div>
  );
}