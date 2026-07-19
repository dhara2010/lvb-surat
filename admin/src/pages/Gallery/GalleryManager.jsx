import React, { useState, useEffect } from "react";

import { Trash2, Upload, ImageOff, CheckCircle2, XCircle } from "lucide-react";

import { SectionHeader, resolveImageUrl } from "../../components/AdminUI";

export default function GalleryManager({ token }) {
  const [data, setData] = useState([]);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);

  /* =======================================================
     API URL
  ======================================================= */

  const apiUrl = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");

  /* =======================================================
     SHOW MESSAGE
  ======================================================= */

  const showMessage = (type, text) => {
    setMessage({
      type,
      text,
    });

    setTimeout(() => {
      setMessage(null);
    }, 3500);
  };

  /* =======================================================
     LOAD GALLERY
  ======================================================= */

  const loadData = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/gallery`);

      if (!response.ok) {
        throw new Error("Failed to load gallery.");
      }

      const result = await response.json();

      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Gallery load error:", error);

      showMessage("error", "Failed to load gallery.");
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      showMessage("error", "Please select an image.");

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(`${apiUrl}/api/gallery`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Upload failed.");
      }

      console.log("Gallery upload success:", result);

      setFile(null);

      e.target.reset();

      showMessage("success", "Image uploaded successfully.");

      await loadData();
    } catch (error) {
      console.error("Gallery upload error:", error);

      showMessage("error", error.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     DELETE IMAGE
  ======================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this gallery photo?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/gallery/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Delete failed.");
      }

      showMessage("success", "Image deleted successfully.");

      await loadData();
    } catch (error) {
      console.error("Gallery delete error:", error);

      showMessage("error", error.message || "Delete failed.");
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        flex
        flex-col
        gap-6
        pb-20
        text-slate-100
      "
    >
      {/* ================= MESSAGE ================= */}

      {message && (
        <div
          className={`
            fixed
            top-5
            right-5
            z-[9999]
            flex
            items-center
            gap-3
            px-5
            py-4
            rounded-xl
            shadow-2xl
            border

            ${
              message.type === "success"
                ? `
                  bg-emerald-950
                  border-emerald-700
                  text-emerald-300
                `
                : `
                  bg-rose-950
                  border-rose-700
                  text-rose-300
                `
            }
          `}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <XCircle size={20} />
          )}

          <span
            className="
              text-sm
              font-bold
            "
          >
            {message.text}
          </span>
        </div>
      )}

      {/* ================= HEADER ================= */}

      <SectionHeader
        title="Gallery Assets"
        desc="Upload chapter photography or manage existing ones."
      />

      {/* ================= UPLOAD ================= */}

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
        <form
          onSubmit={handleUpload}
          className="
            w-full
            flex
            flex-col
            md:flex-row
            items-start
            md:items-end
            gap-4
          "
        >
          <div
            className="
              flex-1
              w-full
            "
          >
            <label
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                pl-1
                text-slate-400
                block
                mb-2
              "
            >
              Payload (Raw Image)
            </label>

            <input
              type="file"
              required
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="
                w-full
                block
                text-sm
                text-slate-300

                file:mr-4
                file:py-3
                file:px-6
                file:rounded-xl
                file:border-0
                file:text-sm
                file:font-semibold
                file:bg-slate-800
                file:text-cyan-400

                hover:file:bg-slate-700

                bg-slate-900/50
                border
                border-slate-700/50
                rounded-xl
                outline-none
                cursor-pointer
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              md:w-auto
              h-[46px]
              shrink-0
              bg-cyan-600
              hover:bg-cyan-500
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              px-8
              rounded-xl
              font-bold
              uppercase
              tracking-wider
              transition-colors
              shadow-md
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Upload size={18} />

            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>
      </div>

      {/* ================= GALLERY ================= */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          lg:grid-cols-5
          gap-6
        "
      >
        {data.map((item) => {
          const imageSrc = resolveImageUrl(item.image_url);

          return (
            <GalleryCard
              key={item.id}
              item={item}
              imageSrc={imageSrc}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      {/* ================= EMPTY ================= */}

      {data.length === 0 && (
        <p
          className="
            text-slate-500
            p-10
            text-center
            border
            border-dashed
            border-slate-800
            bg-slate-900/10
            rounded-2xl
          "
        >
          Database empty.
        </p>
      )}
    </div>
  );
}

/* =========================================================
   GALLERY CARD
========================================================= */

function GalleryCard({ item, imageSrc, onDelete }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="
        group
        relative
        rounded-2xl
        overflow-hidden
        border
        border-slate-800
        aspect-[4/3]
        bg-slate-900/20
        shadow-sm
      "
    >
      {!failed ? (
        <img
          loading="lazy"
          decoding="async"
          src={imageSrc}
          alt="gallery thumbnail"
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-105
            transition-all
            duration-500
          "
          onError={() => {
            console.warn("Gallery image unavailable:", imageSrc);

            setFailed(true);
          }}
        />
      ) : (
        <div
          className="
            w-full
            h-full
            flex
            flex-col
            items-center
            justify-center
            gap-2
            text-slate-600
          "
        >
          <ImageOff size={28} />

          <span
            className="
              text-[10px]
              uppercase
              font-bold
              tracking-wider
            "
          >
            Image unavailable
          </span>
        </div>
      )}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/80
          via-transparent
          to-transparent
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-300
          flex
          items-end
          justify-center
          pb-4
        "
      >
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="
            bg-rose-600
            text-white
            p-3
            rounded-xl
            hover:bg-rose-500
            shadow-xl
            transition-transform
            hover:scale-110
          "
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
