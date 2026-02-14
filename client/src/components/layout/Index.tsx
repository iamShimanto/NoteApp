import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { authServices } from "../../api/auth.services";
import { useDispatch, useSelector } from "react-redux";
import { loggedUser, logoutUser } from "../../store/slices/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const user = useSelector((state: any) => state.userData?.user ?? null);

  const userInitials = useMemo(() => {
    const fullName: string | undefined = user?.fullName;
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/g);
    const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
    return (initials || parts[0]?.[0] || "U").toUpperCase();
  }, [user?.fullName]);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const res = await authServices.profile();
        if (!isActive) return;
        dispatch(loggedUser(res.user));
      } catch (error) {
        if (!isActive) return;

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const message = String(error.response?.data?.message ?? "");

          const looksLikeAuthFailure =
            status === 401 ||
            status === 403 ||
            message.toLowerCase().includes("unauthorized") ||
            message.toLowerCase().includes("jwt") ||
            message.toLowerCase().includes("token");

          if (looksLikeAuthFailure) {
            navigate("/login", { replace: true });
          } else {
            toast.error(message || "Failed to load profile");
          }
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        if (isActive) setIsBootstrapping(false);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [dispatch, navigate]);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center text-white/70">
          Loading…
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await authServices.logout();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status && status >= 500) {
          toast.error("Logout failed");
          return;
        }
      }
      // If logout fails due to auth state, still clear locally.
    }

    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-slate-950/60 text-white font-black">
              N
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-white">
                NoteStack
              </p>
              <p className="text-xs text-white/60">Your notes, synced</p>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-2">
            <Link
              to="/"
              className={[
                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                location.pathname === "/"
                  ? "border-white/15 bg-slate-950/70 text-white"
                  : "border-white/10 bg-slate-950/40 text-white/70 hover:bg-slate-950/60",
              ].join(" ")}
            >
              Create
            </Link>
            <Link
              to="/dashboard"
              className={[
                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                location.pathname.startsWith("/dashboard")
                  ? "border-white/15 bg-slate-950/70 text-white"
                  : "border-white/10 bg-slate-950/40 text-white/70 hover:bg-slate-950/60",
              ].join(" ")}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={[
                "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                location.pathname.startsWith("/profile")
                  ? "border-white/15 bg-slate-950/70 text-white"
                  : "border-white/10 bg-slate-950/40 text-white/70 hover:bg-slate-950/60",
              ].join(" ")}
            >
              Profile
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-slate-950/40 text-white/80 text-sm font-bold">
                  {userInitials}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white/90">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-white/50">{user.email}</p>
                </div>

                <Button
                  variant="secondary"
                  className="w-auto"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" className="w-auto">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-auto">Create account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
