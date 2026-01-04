import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";
import { useForm } from "react-hook-form";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// type RegisterInputs = {
//   fullName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = (data : Inputs) => console.log(data);

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-slate-950 via-slate-950 to-black flex items-center justify-center px-4">
      <div className="pointer-events-none absolute -top-32 -left-32 h-130 w-130 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-130 w-130 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-cyan-400 text-slate-950 font-black">
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

          <Button type="submit">Create account</Button>

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
  );
}
