import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import axios from "axios";
import { authServices } from "../api/auth.services";
import { loggedUser } from "../store/slices/authSlice";

export default function PublicOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.userData?.user ?? null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (user) {
      setIsChecking(false);
      return;
    }

    (async () => {
      try {
        const res = await authServices.profile();
        if (!isActive) return;
        dispatch(loggedUser(res.user));
        navigate("/", { replace: true });
      } catch (error) {
        if (!isActive) return;
        if (axios.isAxiosError(error)) {
          // Not logged in -> allow public page
        }
      } finally {
        if (isActive) setIsChecking(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [dispatch, navigate, user]);

  if (user) return <Navigate to="/" replace />;

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-center text-white/70">
          Loading…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
