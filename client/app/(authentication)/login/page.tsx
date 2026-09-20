'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { login as loginAPI, loginWithGoogle } from "@/services/authService";
import { LoginRequest, AuthResponse } from "@/types/authTypes";
import { ApiError } from "@/types/apiTypes";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import Image from 'next/image';

export default function LoginPage() {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const { mutate, isPending } = useMutation<
    AuthResponse,
    AxiosError<ApiError>,
    LoginRequest
  >({
    mutationFn: loginAPI,

    onSuccess: () => {
      toast.success("Login successful!");
      window.location.href = "/";
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Login failed");
    }
  });

  const onSubmit = (data: LoginRequest) => mutate(data);

  const forgetgetHandler =()=>{
    router.push("/Forgot-Password")
    // alert("clicked on forget ")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors">

  <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-md border border-border">

    <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
      Login to your account
    </h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground/70">Email</label>

        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full bg-background text-foreground p-2 border border-border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        {errors.email?.message && (
          <p className="text-red-500 text-xs mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-foreground/70">Password</label>

        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full bg-background text-foreground p-2 border border-border rounded focus:ring-2 focus:ring-emerald-500 outline-none"
        />

        {errors.password?.message && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password.message}
          </p>
        )}

        {/* Forgot Password */}
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={forgetgetHandler }
            className="text-sm text-emerald-500 hover:underline"
          >
            Forgot password?
          </button>
        </div>

      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-2 rounded text-white font-semibold transition ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 shadow-md shadow-emerald-500/20"
        }`}
      >
        {isPending ? "Logging in..." : "Login"}
      </button>

    </form>

    {/* Divider */}
    <div className="flex items-center my-6">
      <div className="grow border-t"></div>
      <span className="mx-3 text-gray-400 text-sm">OR</span>
      <div className="grow border-t"></div>
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

    {/* Signup Link */}
    <p className="text-center text-sm mt-6 text-gray-500">
      Do not have an account?{" "}
      <span
        className="text-emerald-500 cursor-pointer hover:underline"
        onClick={() => router.push('/register')}
      >
        Sign up
      </span>
    </p>

  </div>

</div>
  );
}