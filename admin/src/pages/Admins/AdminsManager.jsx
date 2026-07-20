import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import {
  SectionHeader,
  InputGroup,
  PasswordInputGroup,
  SubmitButton,
  PremiumTable,
  DeleteBtn,
  EditBtn,
} from "../../components/AdminUI";

/* =========================================================
   PARSE JWT
========================================================= */

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

/* =========================================================
   TOAST COMPONENT
   Renders directly inside document.body
========================================================= */

function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",

        zIndex: 2147483647,

        width: "calc(100% - 48px)",
        maxWidth: "400px",

        display: "flex",
        alignItems: "center",
        gap: "12px",

        padding: "15px 16px",

        borderRadius: "14px",

        background: toast.type === "success" ? "#064e3b" : "#881337",

        border:
          toast.type === "success" ? "1px solid #10b981" : "1px solid #f43f5e",

        color: "#ffffff",

        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",

        fontFamily: "inherit",

        animation: "adminToastSlideIn 0.3s ease-out",
      }}
    >
      {/* ICON */}

      <div
        style={{
          width: "36px",
          height: "36px",

          minWidth: "36px",

          borderRadius: "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: toast.type === "success" ? "#10b981" : "#f43f5e",

          color: "#ffffff",

          fontSize: "18px",
          fontWeight: "900",
        }}
      >
        {toast.type === "success" ? "✓" : "✕"}
      </div>

      {/* MESSAGE */}

      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: "10px",

            fontWeight: "800",

            textTransform: "uppercase",

            letterSpacing: "1.5px",

            opacity: 0.8,

            marginBottom: "3px",
          }}
        >
          {toast.type === "success" ? "Success" : "Error"}
        </div>

        <div
          style={{
            fontSize: "14px",

            lineHeight: "20px",

            fontWeight: "700",
          }}
        >
          {toast.message}
        </div>
      </div>

      {/* CLOSE BUTTON */}

      <button
        type="button"
        onClick={onClose}
        style={{
          width: "30px",
          height: "30px",

          border: "none",

          background: "transparent",

          color: "#ffffff",

          fontSize: "22px",

          cursor: "pointer",

          opacity: 0.75,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>

      {/* ANIMATION */}

      <style>
        {`
          @keyframes adminToastSlideIn {

            from {
              opacity: 0;
              transform: translateX(30px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }

          }
        `}
      </style>
    </div>,

    document.body,
  );
}

/* =========================================================
   ADMIN MANAGER
========================================================= */

export default function AdminsManager({ token }) {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [currentAdminInfo, setCurrentAdminInfo] = useState({
    id: "",
    username: "",
  });

  /* =========================================================
     TOAST STATE
  ========================================================= */

  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);

  /* =========================================================
     SHOW TOAST
  ========================================================= */

  const showToast = (type, message) => {
    /*
      Clear previous timer
    */

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    /*
      Show toast
    */

    setToast({
      type,
      message,
    });

    /*
      Hide automatically after 4 seconds
    */

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /* =========================================================
     CLEAN TOAST TIMER
  ========================================================= */

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  /* =========================================================
     CURRENT LOGGED-IN ADMIN
  ========================================================= */

  useEffect(() => {
    const payload = parseJwt(token);

    if (payload) {
      setCurrentAdminInfo({
        id: payload.id,
        username: payload.username,
      });
    }
  }, [token]);

  /* =========================================================
     LOAD ADMIN DATA
  ========================================================= */

  const loadData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${apiUrl}/api/auth/admins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to load admin accounts");
      }

      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Load admins error:", err);

      showToast("error", err.message || "Failed to load admin accounts");
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  /* =========================================================
     CREATE / UPDATE ADMIN
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      /* ================================
           UPDATE ADMIN
        ================================= */

      if (editingId) {
        const res = await fetch(`${apiUrl}/api/auth/admins/${editingId}`, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        });

        const result = await res.json();

        if (!res.ok) {
          showToast(
            "error",
            result.message || "Try again — Failed to update admin account",
          );

          return;
        }

        /*
            Clear edit form
          */

        setEditingId(null);

        setForm({
          username: "",
          password: "",
        });

        /*
            SHOW GREEN TOAST
          */

        showToast("success", "Admin updated successfully");
      } else {

      /* ================================
           CREATE ADMIN
        ================================= */
        const res = await fetch(`${apiUrl}/api/auth/admins`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        });

        const result = await res.json();

        if (!res.ok) {
          showToast(
            "error",
            result.message || "Try again — Failed to create admin account",
          );

          return;
        }

        /*
            Clear form
          */

        setForm({
          username: "",
          password: "",
        });

        /*
            SHOW GREEN TOAST
          */

        showToast("success", "Admin created successfully");
      }

      /*
          Refresh admin table
        */

      await loadData();
    } catch (err) {
      console.error("Admin save error:", err);

      /*
          SHOW RED TOAST
        */

      showToast("error", "Try again — Something went wrong");
    }
  };

  /* =========================================================
     EDIT ADMIN
  ========================================================= */

  const handleEdit = (d) => {
    setEditingId(d.id);

    setForm({
      username: d.username,

      // Keep blank unless changing password
      password: "",
    });
  };

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      username: "",
      password: "",
    });
  };

  /* =========================================================
     DELETE ADMIN
  ========================================================= */

  const handleDelete = async (id) => {
    /*
        Cannot delete own logged-in account
      */

    if (id === currentAdminInfo.id) {
      showToast(
        "error",
        "You cannot delete the account you are currently logged in with!",
      );

      return;
    }

    /*
        Existing confirmation functionality
      */

    if (!window.confirm("Delete this admin account?")) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${apiUrl}/api/auth/admins/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        showToast(
          "error",
          result.message || "Try again — Failed to delete admin account",
        );

        return;
      }

      /*
          Refresh admin table
        */

      await loadData();

      /*
          SHOW GREEN TOAST
        */

      showToast("success", "Admin deleted successfully");
    } catch (err) {
      console.error("Admin delete error:", err);

      /*
          SHOW RED TOAST
        */

      showToast("error", "Try again — Failed to delete admin account");
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      {/* =====================================================
          GLOBAL TOP-RIGHT TOAST

          Portal renders this directly in document.body,
          outside Admin layout overflow/stacking contexts.
      ===================================================== */}

      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* =====================================================
          MAIN PAGE
      ===================================================== */}

      <div className="flex flex-col gap-6 pb-20 text-heading">
        {/* HEADER */}

        <SectionHeader
          title="Admin Accounts"
          desc="Manage administrator user accounts that have security access to this workspace."
        />

        {/* ===================================================
            CREATE / EDIT FORM
        =================================================== */}

        <div className="bg-bg-alt border border-border p-6 rounded-3xl shadow-sm">
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-sm border-b border-border pb-2 mb-4">
            {editingId ? "Edit Admin User" : "Register New Admin"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            {/* USERNAME */}

            <InputGroup
              label="Admin Username"
              placeholder="e.g. system_admin"
              val={form.username}
              setVal={(v) =>
                setForm({
                  ...form,
                  username: v,
                })
              }
              w="flex-1 w-full"
            />

            {/* PASSWORD */}

            <PasswordInputGroup
              label={
                editingId
                  ? "New Password (leave empty to keep current)"
                  : "Password"
              }
              placeholder="••••••••"
              val={form.password}
              setVal={(v) =>
                setForm({
                  ...form,
                  password: v,
                })
              }
              w="flex-1 w-full"
              req={!editingId}
            />

            {/* BUTTONS */}

            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
              <SubmitButton editing={editingId !== null} />

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="h-[44px] px-6 rounded-xl font-bold uppercase tracking-wider bg-bg hover:bg-bg-alt text-muted transition-all border border-border flex-1 md:flex-none"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ===================================================
            ADMIN TABLE
        =================================================== */}

        <PremiumTable
          headers={["Username", "Role Access", "Status", "Action"]}
          rows={data.map((d) => {
            const isSelf = d.id === currentAdminInfo.id;

            return (
              <tr
                key={d.id}
                className="border-b border-border/50 hover:bg-bg-alt/25 transition-colors"
              >
                {/* USERNAME */}

                <td className="p-4 font-extrabold text-heading">
                  {d.username}

                  {isSelf && (
                    <span className="text-[10px] ml-2 text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/25">
                      You
                    </span>
                  )}
                </td>

                {/* ROLE */}

                <td className="p-4 text-body text-sm font-semibold">
                  Administrator
                </td>

                {/* STATUS */}

                <td className="p-4">
                  <span
                    className={`
                        inline-flex
                        items-center
                        gap-1.5
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-black
                        uppercase
                        tracking-wider
                        border

                        ${
                          isSelf
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                        }
                      `}
                  >
                    {isSelf ? "Online Now" : "Active Account"}
                  </span>
                </td>

                {/* ACTION */}

                <td className="p-4 w-32 text-right">
                  <EditBtn onClick={() => handleEdit(d)} />

                  <DeleteBtn onClick={() => handleDelete(d.id)} />
                </td>
              </tr>
            );
          })}
          emptyText="No administrators found."
        />
      </div>
    </>
  );
}
