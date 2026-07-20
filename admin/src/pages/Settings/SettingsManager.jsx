import React, { useState } from "react";
import { SectionHeader, PasswordInputGroup } from "../../components/AdminUI";

export default function SettingsManager({ token }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Clear old messages
    setMsg("");
    setError("");

    // Check if new passwords match
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Try Again — New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:5000") +
          "/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        // SUCCESS MESSAGE
        setMsg("Password Updated Successfully");

        // Clear password fields
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Automatically hide success message after 4 seconds
        setTimeout(() => {
          setMsg("");
        }, 4000);
      } else {
        // ERROR MESSAGE
        setError(
          data.message
            ? `Try Again — ${data.message}`
            : "Try Again — Password Update Failed",
        );
      }
    } catch (err) {
      console.error("Password update error:", err);

      setError("Try Again — Password Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 text-slate-100 max-w-xl">
      <SectionHeader
        title="Settings"
        desc="Update admin configuration and change security credentials."
      />

      <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-slate-800 pb-2 mb-6">
          Security Credentials
        </h3>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <PasswordInputGroup
            label="Current Password"
            placeholder="••••••••"
            val={passwords.currentPassword}
            setVal={(v) =>
              setPasswords({
                ...passwords,
                currentPassword: v,
              })
            }
          />

          <PasswordInputGroup
            label="New Password"
            placeholder="••••••••"
            val={passwords.newPassword}
            setVal={(v) =>
              setPasswords({
                ...passwords,
                newPassword: v,
              })
            }
          />

          <PasswordInputGroup
            label="Confirm New Password"
            placeholder="••••••••"
            val={passwords.confirmPassword}
            setVal={(v) =>
              setPasswords({
                ...passwords,
                confirmPassword: v,
              })
            }
          />

          {/* SUCCESS TAG */}
          {msg && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                border
                border-emerald-500/30
                bg-emerald-500/10
                text-emerald-400
                text-sm
                font-bold
              "
            >
              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-6
                  h-6
                  rounded-full
                  bg-emerald-500
                  text-white
                  text-sm
                "
              >
                ✓
              </span>

              <span>{msg}</span>
            </div>
          )}

          {/* ERROR TAG */}
          {error && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                border
                border-rose-500/30
                bg-rose-500/10
                text-rose-400
                text-sm
                font-bold
              "
            >
              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-6
                  h-6
                  rounded-full
                  bg-rose-500
                  text-white
                  text-sm
                "
              >
                ✕
              </span>

              <span>{error}</span>
            </div>
          )}

          {/* UPDATE PASSWORD BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-4
              w-full
              h-[46px]
              bg-cyan-600
              hover:bg-cyan-500
              disabled:opacity-60
              disabled:cursor-not-allowed
              text-white
              rounded-xl
              font-bold
              uppercase
              tracking-wider
              transition-all
              shadow-md
            "
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
