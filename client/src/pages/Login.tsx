import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router";
import type { LoginPayload } from "../types/auth";
import { useForm } from "react-hook-form";
import { authServices } from "../api/auth.services";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>();
  const router = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: any) => state.userData?.user ?? null);

  useEffect(() => {
    if (user) router("/", { replace: true });
  }, [router, user]);

  const onSubmit = async (data: LoginPayload) => {
    try {
      setIsSubmitting(true);
      const res = await authServices.login(data);
      if (res.message) {
        toast.success(res?.message);
      }
      setTimeout(() => {
        router("/", { replace: true });
      }, 1000);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign in</title>
        <meta name="description" content="Sign in to access your notes." />
      </Helmet>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-950/60 text-white font-black">
              N
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white">
                NoteStack
              </h1>
              <p className="text-sm text-white/70">Sign in to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input
              {...register("email", { required: "Email is required" })}
              label="Email"
              placeholder="you@email.com"
              autoComplete="email"
              error={errors?.email?.message}
            />
            <Input
              {...register("password", { required: "Password is required" })}
              label="Password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              error={errors?.password?.message}
            />

            <Button type="submit" isLoading={isSubmitting}>
              Sign in
            </Button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/50">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <p className="pt-1 text-center text-sm text-white/60">
              Don’t have an account?{" "}
              <Link
                to={"/register"}
                className="text-white font-semibold hover:underline cursor-pointer"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
