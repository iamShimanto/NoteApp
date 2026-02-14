import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { authServices } from "../api/auth.services";
import toast from "react-hot-toast";
import axios from "axios";
import type { RegisterPayload } from "../types/auth";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();
  const router = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: any) => state.userData?.user ?? null);

  useEffect(() => {
    if (user) router("/", { replace: true });
  }, [router, user]);

  const onSubmit = async (data: RegisterPayload) => {
    try {
      setIsSubmitting(true);
      const res = await authServices.register(data);
      console.log(res);
      if (res.message) {
        toast.success(res?.message);
      }
      setTimeout(() => {
        router("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create account</title>
        <meta name="description" content="Create a new NoteStack account." />
      </Helmet>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-950/60 text-white font-black">
              N
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-white">
                NoteStack
              </h3>
              <p className="text-sm text-white/70">Create your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input
              {...register("fullName", { required: "FullName is required" })}
              label="First name"
              placeholder="Shimanto"
              error={errors.fullName?.message}
            />

            <Input
              label="Email"
              placeholder="you@email.com"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              helperText="At least 6 characters"
              autoComplete="new-password"
              {...register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />

            <Button type="submit" isLoading={isSubmitting}>
              Create account
            </Button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-white/50">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <p className="pt-1 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-white font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
