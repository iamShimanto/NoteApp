import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Link } from "react-router";

export default function Login() {
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
            <h1 className="text-lg font-extrabold tracking-tight text-white">
              NoteStack
            </h1>
            <p className="text-sm text-white/70">Sign in to continue</p>
          </div>
        </div>

        <form className="mt-5 space-y-4">
          <Input
            label="Email"
            placeholder="you@email.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />

          <Button type="button">Sign in</Button>

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
  );
}
