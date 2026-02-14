import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

import { authServices } from "../api/auth.services";
import { loggedUser } from "../store/slices/authSlice";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector(
    (state: {
      userData?: {
        user?: { id: string; fullName: string; email: string } | null;
      };
    }) => state.userData?.user ?? null,
  );

  const initialName = useMemo(() => String(user?.fullName ?? ""), [user]);
  const email = useMemo(() => String(user?.email ?? ""), [user]);

  const [fullName, setFullName] = useState(initialName);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await authServices.updateProfile({
        fullName: fullName.trim(),
      });
      if (res.user) dispatch(loggedUser(res.user));
      toast.success(res.message || "Profile updated");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update profile",
        );
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const savePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await authServices.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(res.message || "Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update password",
        );
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
        <meta name="description" content="Update your profile and password." />
      </Helmet>

      <div className="grid gap-6">
        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Profile
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Manage your account details.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-base font-bold text-white">Your details</h2>
          <form onSubmit={saveProfile} className="mt-4 grid gap-4">
            <Input
              label="Email"
              value={email}
              disabled
              helperText="Email can’t be changed."
            />
            <Input
              label="Full name"
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
            />
            <div className="flex justify-end">
              <Button className="w-auto" isLoading={isSavingProfile}>
                Save changes
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <h2 className="text-base font-bold text-white">Password</h2>
          <form onSubmit={savePassword} className="mt-4 grid gap-4">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCurrentPassword(e.target.value)
              }
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
            <div className="flex justify-end">
              <Button className="w-auto" isLoading={isSavingPassword}>
                Update password
              </Button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
