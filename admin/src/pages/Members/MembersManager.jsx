import React, { useEffect, useState } from "react";

import {
  SectionHeader,
  InputGroup,
  FileInputGroup,
  SubmitButton,
  PremiumTable,
  DeleteBtn,
  EditBtn,
  resolveImageUrl,
} from "../../components/AdminUI";

import {
  CheckCircle2,
  XCircle,
  X,
  Image as ImageIcon,
  Building2,
} from "lucide-react";

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  name: "",
  businessName: "",
  businessCategory: "",
  photoUrl: "",
  logoUrl: "",
  memberId: "",
  chapter: "",
};



/* =========================================================
   IMAGE PREVIEW
========================================================= */

function ImagePreview({ url, type = "photo", label }) {
  const [imageError, setImageError] = useState(false);

  /*
    Whenever URL changes, allow the new image to try loading.
  */
  useEffect(() => {
    setImageError(false);
  }, [url]);

  const finalUrl = url ? resolveImageUrl(url) : "";

  const isLogo = type === "logo";

  return (
    <div className="flex flex-col gap-2">
      <span
        className="
          text-[11px]
          uppercase
          tracking-[0.16em]
          font-black
          text-slate-500
        "
      >
        {label}
      </span>

      <div
        className={`
          relative

          w-full
          h-[150px]

          rounded-2xl

          overflow-hidden

          border
          border-slate-700

          ${isLogo ? "bg-white" : "bg-slate-900"}

          flex
          items-center
          justify-center
        `}
      >
        {finalUrl && !imageError ? (
          <img
            key={finalUrl}
            src={finalUrl}
            alt={label}
            className={`
              block
              w-full
              h-full

              ${isLogo ? "object-contain p-4" : "object-cover object-top"}
            `}
            onError={() => {
              console.error(`Failed to load ${type}:`, finalUrl);

              setImageError(true);
            }}
          />
        ) : (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2
              text-slate-500
            "
          >
            {isLogo ? (
              <Building2 size={30} strokeWidth={1.4} />
            ) : (
              <ImageIcon size={30} strokeWidth={1.4} />
            )}

            <span className="text-xs font-bold">
              {url && imageError
                ? "Image could not be loaded"
                : "No image selected"}
            </span>
          </div>
        )}
      </div>

      {url && (
        <div
          className="
            text-[10px]
            text-slate-500
            truncate
            font-medium
          "
          title={url}
        >
          {url}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MEMBER ID DISPLAY
========================================================= */

function getDisplayMemberId(member) {
  if (member.memberId) {
    return member.memberId;
  }

  const rawId = String(member.id || member._id || "");

  if (!rawId) {
    return "MEMBER";
  }

  /*
    Avoid:
    d.id.substring(18)

    because it may break or return an empty string
    when ID format changes.
  */

  const shortId = rawId.slice(-6).toUpperCase();

  return `MEM-${shortId}`;
}

/* =========================================================
   MEMBERS MANAGER
========================================================= */

export default function MembersManager({ token, showToast, scrollToTop }) {
  const [data, setData] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  /* =======================================================
     API URL
  ======================================================= */

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* =======================================================
     LOAD MEMBERS
  ======================================================= */

  const loadData = async () => {
    try {
      setLoadingData(true);

      const response = await fetch(`${apiUrl}/api/members`);

      if (!response.ok) {
        throw new Error(`Failed to load members (${response.status})`);
      }

      const result = await response.json();

      /*
        Support both API formats:

        [...]
        
        OR

        {
          data: [...]
        }
      */

      if (Array.isArray(result)) {
        setData(result);
      } else if (Array.isArray(result?.data)) {
        setData(result.data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Load members error:", error);

      showToast(error.message || "Unable to load members.", "error");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  /* =======================================================
     SUBMIT MEMBER
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    /*
      Basic validation.
    */

    if (!form.name.trim()) {
      showToast("Please enter the member's full name.", "error");

      return;
    }

    if (!form.businessName.trim()) {
      showToast("Please enter the business name.", "error");

      return;
    }

    if (!form.businessCategory.trim()) {
      showToast("Please enter the business category.", "error");

      return;
    }

    try {
      setLoading(true);

      const isEditing = Boolean(editingId);

      const endpoint = isEditing
        ? `${apiUrl}/api/members/${editingId}`
        : `${apiUrl}/api/members`;

      const method = isEditing ? "PUT" : "POST";

      /*
        Trim text fields but preserve image URLs exactly
        as returned by FileInputGroup/upload API.
      */

      const payload = {
        ...form,

        name: form.name.trim(),

        businessName: form.businessName.trim(),

        businessCategory: form.businessCategory.trim(),

        memberId: form.memberId.trim(),

        chapter: form.chapter.trim(),

        photoUrl: form.photoUrl || "",

        logoUrl: form.logoUrl || "",
      };

      console.log("Saving member:", payload);

      const response = await fetch(endpoint, {
        method,

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },

        body: JSON.stringify(payload),
      });

      /*
        Read response safely whether backend returns
        JSON or plain text.
      */

      const responseText = await response.text();

      let responseData = null;

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = responseText;
      }

      if (!response.ok) {
        console.error("Member save failed:", responseData);

        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Request failed with status ${response.status}`,
        );
      }

      /*
        IMPORTANT:
        Only reset after successful API response.
      */

      resetForm();

      await loadData();

      showToast(
        isEditing
          ? "Member updated successfully."
          : "Member added successfully.",
        "success",
      );
    } catch (error) {
      console.error("Save member error:", error);

      showToast(
        error.message || "Failed to save member. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EDIT MEMBER
  ======================================================= */

  const handleEdit = (member) => {
    const id = member.id || member._id;

    setEditingId(id);

    setForm({
      name: member.name || "",

      businessName: member.businessName || "",

      businessCategory: member.businessCategory || "",

      photoUrl: member.photoUrl || "",

      logoUrl: member.logoUrl || "",

      memberId: member.memberId || "",

      chapter: member.chapter || "",
    });

    if (scrollToTop) {
      scrollToTop();
    } else {
      const formElement = document.getElementById("members-form-top");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    }
  };

  /* =======================================================
     DELETE MEMBER
  ======================================================= */

  const handleDelete = async (id) => {
    if (!id) {
      showToast("Member ID is missing.", "error");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${apiUrl}/api/members/${id}`, {
        method: "DELETE",

        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      const responseText = await response.text();

      let responseData = null;

      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = responseText;
      }

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Delete failed with status ${response.status}`,
        );
      }

      /*
        If currently editing deleted member,
        reset the form.
      */

      if (editingId === id) {
        resetForm();
      }

      await loadData();

      showToast("Member deleted successfully.", "success");
    } catch (error) {
      console.error("Delete member error:", error);

      showToast(error.message || "Failed to delete member.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex flex-col gap-6 pb-20">


      {/* ===================================================
          HEADER
      ==================================================== */}

      <SectionHeader
        title="Members Directory"
        desc="Manage general registered chapter members appearing on the main directory."
      />

      {/* ===================================================
          FORM
      ==================================================== */}

      <div id="members-form-top" className="scroll-mt-6"></div>

      <div
        className="
          bg-slate-900/30

          border
          border-slate-800

          p-6

          rounded-3xl

          shadow-sm
        "
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* ROW 1 */}

          <div
            className="
              flex
              flex-col
              md:flex-row

              gap-4

              items-end
            "
          >
            <InputGroup
              label="Member ID"
              placeholder="e.g. MEM-001"
              val={form.memberId}
              setVal={(value) =>
                setForm((prev) => ({
                  ...prev,
                  memberId: value,
                }))
              }
              w="flex-1 w-full"
              req={false}
            />

            <InputGroup
              label="Chapter"
              placeholder="e.g. Surat Platinum"
              val={form.chapter}
              setVal={(value) =>
                setForm((prev) => ({
                  ...prev,
                  chapter: value,
                }))
              }
              w="flex-1 w-full"
              req={false}
            />

            <InputGroup
              label="Full Name"
              placeholder="e.g. Amit Rajodiya"
              val={form.name}
              setVal={(value) =>
                setForm((prev) => ({
                  ...prev,
                  name: value,
                }))
              }
              w="flex-1 w-full"
            />
          </div>

          {/* ROW 2 */}

          <div
            className="
              flex
              flex-col
              md:flex-row

              gap-4

              items-end
            "
          >
            <InputGroup
              label="Business Name"
              placeholder="e.g. Om Shiv Insurance"
              val={form.businessName}
              setVal={(value) =>
                setForm((prev) => ({
                  ...prev,
                  businessName: value,
                }))
              }
              w="flex-1 w-full"
            />

            <InputGroup
              label="Category"
              placeholder="e.g. Insurance Services"
              val={form.businessCategory}
              setVal={(value) =>
                setForm((prev) => ({
                  ...prev,
                  businessCategory: value,
                }))
              }
              w="flex-1 w-full"
            />
          </div>

          {/* =================================================
              IMAGE UPLOADS
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2

              gap-5
            "
          >
            {/* MEMBER PHOTO */}

            <div
              className="
                bg-slate-950/30

                border
                border-slate-800

                rounded-2xl

                p-4

                flex
                flex-col

                gap-4
              "
            >
              <FileInputGroup
                label="Member Photo"
                placeholder="/members/amit.webp"
                val={form.photoUrl}
                setVal={(value) => {
                  console.log("Member photo uploaded:", value);

                  setForm((prev) => ({
                    ...prev,
                    photoUrl: value,
                  }));

                  if (value) {
                    showToast("Member photo uploaded successfully.", "success");
                  }
                }}
                token={token}
                w="w-full"
              />

              {/* PHOTO PREVIEW */}

              <ImagePreview
                url={form.photoUrl}
                type="photo"
                label="Member Photo Preview"
              />
            </div>

            {/* COMPANY LOGO */}

            <div
              className="
                bg-slate-950/30

                border
                border-slate-800

                rounded-2xl

                p-4

                flex
                flex-col

                gap-4
              "
            >
              <FileInputGroup
                label="Company Logo"
                placeholder="/members/OM-SHIV.png"
                val={form.logoUrl}
                setVal={(value) => {
                  console.log("Company logo uploaded:", value);

                  setForm((prev) => ({
                    ...prev,
                    logoUrl: value,
                  }));

                  if (value) {
                    showToast("Company logo uploaded successfully.", "success");
                  }
                }}
                token={token}
                w="w-full"
              />

              {/* LOGO PREVIEW */}

              <ImagePreview
                url={form.logoUrl}
                type="logo"
                label="Company Logo Preview"
              />
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row

              justify-end

              gap-3

              pt-2
            "
          >
            {editingId && (
              <button
                type="button"
                disabled={loading}
                onClick={resetForm}
                className="
                  h-[44px]

                  px-6

                  rounded-xl

                  font-bold

                  uppercase

                  tracking-wider

                  bg-slate-800

                  hover:bg-slate-700

                  text-slate-300

                  transition-all

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Cancel
              </button>
            )}

            <div className={loading ? "opacity-60 pointer-events-none" : ""}>
              <SubmitButton editing={editingId !== null} />
            </div>
          </div>

          {loading && (
            <p
              className="
                text-right

                text-xs

                font-bold

                text-slate-400
              "
            >
              {editingId ? "Updating member..." : "Saving member..."}
            </p>
          )}
        </form>
      </div>

      {/* ===================================================
          TABLE
      ==================================================== */}

      {loadingData && data.length === 0 ? (
        <div
          className="
            min-h-[220px]

            flex
            items-center
            justify-center

            border
            border-slate-800

            rounded-3xl

            bg-slate-900/20
          "
        >
          <p
            className="
              text-sm
              font-bold
              text-slate-500

              uppercase

              tracking-[0.15em]
            "
          >
            Loading Members...
          </p>
        </div>
      ) : (
        <PremiumTable
          headers={[
            "Assets",
            "Member ID",
            "Member",
            "Chapter",
            "Business / Category",
            "Action",
          ]}
          rows={data.map((member) => {
            const rowId = member.id || member._id;

            const photoSrc = member.photoUrl
              ? resolveImageUrl(member.photoUrl)
              : "";

            const logoSrc = member.logoUrl
              ? resolveImageUrl(member.logoUrl)
              : "";

            return (
              <tr
                key={rowId}
                className="
                  border-b
                  border-slate-800/50

                  hover:bg-slate-900/20

                  transition-colors
                "
              >
                {/* =========================================
                    ASSETS
                ========================================== */}

                <td className="p-4 w-36">
                  <div className="flex gap-3">
                    {/* Member Photo */}

                    <div
                      className="
                        w-12
                        h-12

                        rounded-xl

                        bg-slate-800

                        overflow-hidden

                        border
                        border-slate-700

                        flex
                        items-center
                        justify-center

                        shrink-0
                      "
                    >
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={member.name || "Member"}
                          loading="lazy"
                          decoding="async"
                          className="
                            block

                            w-full
                            h-full

                            object-cover
                            object-top
                          "
                          onError={(e) => {
                            console.error("Member photo failed:", photoSrc);

                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon size={18} className="text-slate-600" />
                      )}
                    </div>

                    {/* Company Logo */}

                    <div
                      className="
                        w-12
                        h-12

                        rounded-xl

                        bg-white

                        p-1.5

                        overflow-hidden

                        border
                        border-slate-700

                        flex
                        items-center
                        justify-center

                        shrink-0
                      "
                    >
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={`${member.businessName || "Company"} logo`}
                          loading="lazy"
                          decoding="async"
                          className="
                            block

                            w-full
                            h-full

                            object-contain

                            filter-none

                            opacity-100
                          "
                          onError={(e) => {
                            console.error("Company logo failed:", logoSrc);

                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Building2 size={18} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                </td>

                {/* Member ID */}

                <td
                  className="
                    p-4

                    font-bold

                    text-slate-300

                    text-sm
                  "
                >
                  {getDisplayMemberId(member)}
                </td>

                {/* Member Name */}

                <td
                  className="
                    p-4

                    font-extrabold

                    text-slate-100

                    max-w-[180px]
                  "
                >
                  <div className="truncate">{member.name || "-"}</div>
                </td>

                {/* Chapter */}

                <td
                  className="
                    p-4

                    text-slate-400

                    text-sm

                    font-semibold
                  "
                >
                  {member.chapter || "Surat Platinum"}
                </td>

                {/* Business */}

                <td
                  className="
                    p-4

                    text-slate-400

                    text-sm
                  "
                >
                  <div
                    className="
                      font-bold

                      text-slate-300

                      truncate

                      max-w-[230px]
                    "
                  >
                    {member.businessName || "-"}
                  </div>

                  <div
                    className="
                      text-xs

                      mt-1

                      truncate

                      max-w-[230px]
                    "
                  >
                    {member.businessCategory || "-"}
                  </div>
                </td>

                {/* Actions */}

                <td
                  className="
                    p-4

                    w-36

                    text-right
                  "
                >
                  <div
                    className={`
                      inline-flex

                      ${
                        deletingId === rowId
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    `}
                  >
                    <EditBtn onClick={() => handleEdit(member)} />

                    <DeleteBtn onClick={() => handleDelete(rowId)} />
                  </div>
                </td>
              </tr>
            );
          })}
          emptyText="No members cataloged."
        />
      )}

      {/* ===================================================
          TOAST ANIMATION CSS
      ==================================================== */}

      <style>
        {`
          @keyframes toastIn {
            from {
              opacity: 0;
              transform: translate3d(20px, -10px, 0);
            }

            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
        `}
      </style>
    </div>
  );
}
